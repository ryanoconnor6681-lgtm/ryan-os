// ─────────────────────────────────────────────────────────────────────
// curio-chat.js
// Talks to the portfolio's /api/chat endpoint with project: "curio".
// Powers two surfaces:
//   1. Inline ask-strip on the landing (#askForm + #askInput)
//   2. Floating chat bug (#curio-chatbug) on every page
// Voice = RyanOS as-is. Persona (self|team) is passed as context hint.
//
// Streams token-by-token (the route's { stream: true } path) and renders the
// small subset of markdown the model actually uses. Before this the widget sat
// on a silent "…" for the whole round trip and then printed literal ** markers.
// ─────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  // Endpoint resolution. On the deployed portfolio (ryanoconnor.design) and on
  // curio.help, the static site shares an origin with the Next.js /api/chat
  // route. For local file:// or other dev contexts, allow an override via
  // window.CURIO_CHAT_ENDPOINT.
  const ENDPOINT =
    (typeof window !== 'undefined' && window.CURIO_CHAT_ENDPOINT) ||
    '/api/chat';

  // Openers for the empty state. "Ask anything" is the highest-friction
  // greeting there is — these give the visitor a door to walk through.
  const STARTERS = {
    self: [
      "where do I even start?",
      "I've plateaued — what now?",
      "what should I ignore?",
    ],
    team: [
      "how do I get my team using this?",
      "what did the agency rollout look like?",
      "what do I do about the holdouts?",
    ],
  };

  // Single shared history per surface. Floating bug + inline landing each
  // keep their own thread — different conversations, both project: curio.
  function createSession() {
    return { history: [] };
  }

  function getPersona() {
    try {
      const p = localStorage.getItem('curio-persona');
      if (p === 'self' || p === 'team') return p;
    } catch (e) {}
    return null;
  }

  // ─── Markdown (the narrow subset the model actually emits) ────────────
  // Escape first, always. The response is model output, so it is untrusted
  // input as far as innerHTML is concerned.
  function escapeHtml(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderMarkdown(raw) {
    const lines = escapeHtml(raw).split('\n');
    let html = '';
    let inList = false;

    const inline = (s) =>
      s
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
        .replace(/(^|[\s(])_([^_\n]+)_/g, '$1<em>$2</em>')
        // Bare URLs and markdown links both land as real anchors.
        .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener">$1</a>')
        .replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g,
          '$1<a href="$2" target="_blank" rel="noopener">$2</a>');

    for (const line of lines) {
      const bullet = line.match(/^\s*[-*+]\s+(.*)$/);
      const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
      const item = bullet || numbered;

      if (item) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += '<li>' + inline(item[1]) + '</li>';
        continue;
      }
      if (inList) { html += '</ul>'; inList = false; }
      if (!line.trim()) continue;
      html += '<p>' + inline(line) + '</p>';
    }
    if (inList) html += '</ul>';
    return html;
  }

  // ─── Transport ───────────────────────────────────────────────────────
  // Streams if the browser and the response support it; falls back to the
  // JSON shape otherwise so an old browser or a proxy that strips
  // text/event-stream still gets an answer.
  // One attempt. Returns the full reply text, or '' if the stream opened but
  // produced nothing (which the caller retries without streaming).
  async function attempt(session, message, onDelta, wantStream) {
    const persona = getPersona();
    // Persona context is appended to the first user message of a new thread
    // so RyanOS knows whether they're addressing self or team — no API change.
    let outgoing = message;
    if (persona && session.history.length === 0) {
      outgoing =
        `[context: visitor is reading Curio for ` +
        (persona === 'team' ? 'their team' : 'themselves') +
        `]\n\n` +
        message;
    }

    const canStream =
      wantStream &&
      typeof ReadableStream !== 'undefined' &&
      typeof TextDecoder !== 'undefined';

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: outgoing,
        history: session.history,
        project: 'curio',
        stream: canStream,
      }),
    });

    if (!res.ok) throw new Error('chat request failed: ' + res.status);

    const isStream =
      canStream &&
      res.body &&
      (res.headers.get('content-type') || '').includes('text/event-stream');

    let full = '';

    if (isStream) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let streamError = null;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE frames are separated by a blank line.
        const frames = buffer.split('\n\n');
        buffer = frames.pop() || '';
        for (const frame of frames) {
          const line = frame.split('\n').find((l) => l.startsWith('data: '));
          if (!line) continue;
          let payload;
          try {
            payload = JSON.parse(line.slice(6));
          } catch (e) {
            continue;
          }
          if (payload.type === 'delta') {
            full += payload.text;
            if (onDelta) onDelta(full);
          } else if (payload.type === 'error') {
            streamError = payload.message;
          }
        }
      }
      if (!full && streamError) throw new Error(streamError);
      // Opened but delivered nothing — let the caller fall back rather than
      // showing an empty bubble.
      if (!full) return '';
    } else {
      const data = await res.json();
      full = data.response;
      if (onDelta) onDelta(full);
    }

    // Use the canonical user-visible message in our history (not the
    // outgoing one with the persona prefix) so the transcript reads clean.
    session.history = [
      ...session.history,
      { role: 'user', content: message },
      { role: 'assistant', content: full },
    ];
    return full;
  }

  // Try streaming, then fall back to the plain JSON response. SSE can be
  // defeated by things we can't see from here — a proxy that buffers or strips
  // text/event-stream, a corporate middlebox, a runtime that doesn't flush.
  // The JSON path is the same one the portfolio chat has always used, so the
  // worst case is a reply that arrives all at once instead of token by token.
  async function send(session, message, onDelta) {
    try {
      const streamed = await attempt(session, message, onDelta, true);
      if (streamed) return streamed;
    } catch {
      // Stream threw; the non-streaming attempt below is the real answer.
    }
    return attempt(session, message, onDelta, false);
  }

  // ─── Rendering helpers ───────────────────────────────────────────────
  function appendMessage(thread, role, text, opts) {
    opts = opts || {};
    const row = document.createElement('div');
    row.className = 'cb-msg cb-msg-' + role + (opts.loading ? ' is-loading' : '');
    const bubble = document.createElement('div');
    bubble.className = 'cb-bubble';
    bubble.textContent = text;
    row.appendChild(bubble);
    thread.appendChild(row);
    thread.scrollTop = thread.scrollHeight;
    return row;
  }

  // Called on every delta, so keep it cheap: swap innerHTML and stick to the
  // bottom only while the reader hasn't scrolled up to read back.
  function streamInto(thread, row) {
    const bubble = row.querySelector('.cb-bubble');
    return function (soFar) {
      row.classList.remove('is-loading');
      if (!bubble) return;
      const pinned =
        thread.scrollHeight - thread.scrollTop - thread.clientHeight < 40;
      bubble.innerHTML = renderMarkdown(soFar);
      if (pinned) thread.scrollTop = thread.scrollHeight;
    };
  }

  function setError(row, text) {
    row.classList.remove('is-loading');
    const bubble = row.querySelector('.cb-bubble');
    if (bubble) bubble.textContent = text;
  }

  // ─── Inline landing ask-strip ────────────────────────────────────────
  function wireInlineAsk() {
    const form = document.getElementById('askForm');
    const input = document.getElementById('askInput');
    if (!form || !input) return;

    // Inject a thread element directly above the form if not already present.
    let thread = document.getElementById('askThread');
    if (!thread) {
      thread = document.createElement('div');
      thread.id = 'askThread';
      thread.className = 'ask-thread';
      thread.hidden = true;
      form.parentNode.insertBefore(thread, form);
    }

    const session = createSession();

    function readInput() {
      // The landing input is a contenteditable span.
      return (input.textContent || '').trim();
    }
    function clearInput() {
      input.textContent = '';
      input.dataset.userTyped = 'false';
    }

    async function submit(preset) {
      const msg = preset || readInput();
      if (!msg) return;
      clearInput();
      thread.hidden = false;
      appendMessage(thread, 'user', msg);
      const row = appendMessage(thread, 'bot', '…', { loading: true });
      try {
        await send(session, msg, streamInto(thread, row));
      } catch (err) {
        setError(row, "couldn't reach Curio just now — try again in a sec.");
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submit();
    });
    // Submit on Enter (without Shift) for the contenteditable
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    });

    // Starter chips under the strip. They disappear once the thread opens.
    const chipRow = document.createElement('div');
    chipRow.className = 'ask-starters';
    function paintChips() {
      const persona = getPersona() || 'self';
      chipRow.innerHTML = '';
      STARTERS[persona].forEach(function (q) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'ask-starter';
        b.textContent = q;
        b.addEventListener('click', function () {
          chipRow.remove();
          submit(q);
        });
        chipRow.appendChild(b);
      });
    }
    paintChips();
    // Drop the chips *after* the .ask-row wrapper, not inside it — .ask-row is
    // a flex row, so a sibling of the form lands beside the input instead of
    // beneath it.
    const askRow = form.closest('.ask-row');
    if (askRow && askRow.parentNode) {
      askRow.parentNode.insertBefore(chipRow, askRow.nextSibling);
    } else {
      form.parentNode.insertBefore(chipRow, form.nextSibling);
    }
    // The landing's persona cards rewrite body[data-persona]; follow it.
    if (typeof MutationObserver !== 'undefined') {
      new MutationObserver(function () {
        if (chipRow.isConnected) paintChips();
      }).observe(document.body, { attributes: true, attributeFilter: ['data-persona'] });
    }
  }

  // ─── Floating chat bug ───────────────────────────────────────────────
  function injectChatBug() {
    if (document.getElementById('curio-chatbug')) return; // idempotent

    const bug = document.createElement('div');
    bug.id = 'curio-chatbug';
    bug.className = 'curio-chatbug';
    bug.innerHTML = [
      '<button class="cb-toggle" aria-label="Ask Curio" aria-expanded="false">',
      '  <span class="cb-toggle-icon">✦</span>',
      '  <span class="cb-toggle-label">Ask</span>',
      '</button>',
      '<div class="cb-panel" role="dialog" aria-label="Curio chat">',
      '  <div class="cb-head">',
      '    <span class="cb-title">Ask Curio</span>',
      '    <button class="cb-close" aria-label="Close chat">✕</button>',
      '  </div>',
      '  <div class="cb-thread" id="cb-thread">',
      '    <div class="cb-greeting">Curio is Ryan’s free guide for the AI uncertain. Ask anything &mdash; which focus fits you, what’s blocking you, or what to try first.</div>',
      '    <div class="cb-starters"></div>',
      '  </div>',
      '  <form class="cb-form">',
      '    <input type="text" class="cb-input" placeholder="type your question…" autocomplete="off" />',
      '    <button class="cb-send" type="submit" aria-label="Send">→</button>',
      '  </form>',
      '</div>',
    ].join('');
    document.body.appendChild(bug);

    const toggle = bug.querySelector('.cb-toggle');
    const closeBtn = bug.querySelector('.cb-close');
    const thread = bug.querySelector('.cb-thread');
    const form = bug.querySelector('.cb-form');
    const input = bug.querySelector('.cb-input');
    const starters = bug.querySelector('.cb-starters');

    // Buttons inside the bug are NOT submit buttons — be explicit so they
    // don't accidentally trigger form submission in any browser.
    toggle.setAttribute('type', 'button');
    closeBtn.setAttribute('type', 'button');

    const session = createSession();

    function open() {
      bug.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      setTimeout(function () { input.focus(); }, 50);
    }
    function close() {
      bug.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      if (bug.classList.contains('is-open')) close(); else open();
    });
    closeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && bug.classList.contains('is-open')) close();
    });

    async function ask(msg) {
      if (!msg) return;
      // Clear the empty state once a real conversation starts.
      const greeting = thread.querySelector('.cb-greeting');
      if (greeting) greeting.remove();
      if (starters) starters.remove();

      appendMessage(thread, 'user', msg);
      const row = appendMessage(thread, 'bot', '…', { loading: true });
      try {
        await send(session, msg, streamInto(thread, row));
      } catch (err) {
        setError(row, "couldn't reach Curio just now — try again in a sec.");
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const msg = (input.value || '').trim();
      input.value = '';
      ask(msg);
    });

    (STARTERS[getPersona() || 'self'] || []).forEach(function (q) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cb-starter';
      b.textContent = q;
      b.addEventListener('click', function () { ask(q); });
      starters.appendChild(b);
    });
  }

  // ─── Boot ────────────────────────────────────────────────────────────
  function boot() {
    wireInlineAsk();
    injectChatBug();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
