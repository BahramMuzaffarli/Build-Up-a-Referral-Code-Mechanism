'use client';

import React from 'react';
import MobileAppMockup from '../components/MobileAppMockup';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 selection:bg-red-500 selection:text-white">
      <div className="w-full max-w-md text-center mb-2">
        <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
          Referral Mechanism Visualizer
        </h1>
        <p className="text-slate-500 text-[11px] font-medium">
          BPMN Flow və Core Bank Validasiya Qaydalarının İnteraktiv Tətbiqi
        </p>
      </div>

      {/* Mobil Telefon Prototipi */}
      <MobileAppMockup />
    </main>
  );
}