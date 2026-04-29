"use client";
import React from 'react';
import { CurioStyles } from './page';

export default function CurioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CurioStyles />
      {children}
    </>
  );
}
