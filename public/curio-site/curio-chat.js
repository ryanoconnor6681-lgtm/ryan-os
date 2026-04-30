// ─────────────────────────────────────────────────────────────────────
// curio-chat.js
// Talks to the portfolio's /api/chat endpoint with project: "curio".
// Powers two surfaces:
//   1. Inline ask-strip on the landing (#askForm + #askInput)
//   2. Floating chat bug (#curio-chatbug) on every page
// Voice = RyanOS as-is. Persona (self|team) is passed as context hint.
// ─────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  // Endpoint resolution. On the deployed portfolio (ryanoconnor.design)
  // the static site at /curio-site/ shares an origin with the Next.js
  // /api/chat route. For local file:// or other dev contexts, allow an
  // override via window.CURIO_CHAT_ENDPOINT.
  const ENDPOINT =
    (typeof window !== 'undefined' && window.CURIO_CHAT_ENDPOINT) ||
    '/api/chat';

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

  // POST to /api/chat. Returns { response, history } or throws.
  async function send(session, message) {
    const persona = getPersona();
    // We pass project: "curio" so the route stacks the curio context block.
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

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: outgoing,
        history: session.history,
        project: 'curio',
      }),
    });

    if (!res.ok) throw new Error('chat request failed: ' + res.status);
    const data = await res.json();

    // Use the canonical user-visible message in our history (not the
    // outgoing one with the persona prefix) so the transcript reads clean.
    session.history = [
      ...session.history,
      { role: 'user', content: message },
      { role: 'assistant', content: data.response },
    ];
    return data.response;
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

  function setLoading(row, text) {
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

    async function submit() {
      const msg = readInput();
      if (!msg) return;
      clearInput();
      thread.hidden = false;
      appendMessage(thread, 'user', msg);
      const loading = appendMessage(thread, 'bot', '…', { loading: true });
      try {
        const reply = await send(session, msg);
        setLoading(loading, reply);
      } catch (err) {
        setLoading(loading, "couldn't reach Curio just now — try again in a sec.");
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
      '    <div class="cb-greeting">Curio is Ryan’s thinking brand. Ask anything &mdash; about the focuses, the writing, what to do next.</div>',
      '  </div>',
      '  <form class="cb-form">',
      '    <input type="text" class="cb-input" placeholder="type your question…" autocomplete="off" />',
      '    <button class="cb-send" type="submit" aria-label="Send">→</button>',
      '  </form>',
      '</div>',
    ].join('');
    document.body.appendChild(bug);

    const toggle = bug.querySelector('.cb-toggle');
    const panel = bug.querySelector('.cb-panel');
    const closeBtn = bug.querySelector('.cb-close');
    const thread = bug.querySelector('.cb-thread');
    const form = bug.querySelector('.cb-form');
    const input = bug.querySelector('.cb-input');

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

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const msg = (input.value || '').trim();
      if (!msg) return;
      input.value = '';
      // Hide greeting once a real conversation starts
      const greeting = thread.querySelector('.cb-greeting');
      if (greeting) greeting.remove();
      appendMessage(thread, 'user', msg);
      const loading = appendMessage(thread, 'bot', '…', { loading: true });
      try {
        const reply = await send(session, msg);
        setLoading(loading, reply);
      } catch (err) {
        setLoading(loading, "couldn't reach Curio just now — try again in a sec.");
      }
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
