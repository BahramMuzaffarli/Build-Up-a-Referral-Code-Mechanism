import React from 'react';

export default function DatabaseSchema() {
  return (
    <div className="bg-slate-950 text-slate-100 p-6 rounded-2xl shadow-md border border-slate-800">
      <h3 className="text-base font-bold mb-4 text-emerald-400 flex items-center gap-2">
        🗄️ Universal Database Architecture & ERD Modeli
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Users Table */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <h4 className="font-bold text-xs text-amber-400 border-b border-slate-800 pb-1.5 mb-2 uppercase tracking-wider">1. Users Table</h4>
          <ul className="space-y-1 text-[11px] font-mono text-slate-300">
            <li><span className="text-purple-400">user_id:</span> UUID [PK]</li>
            <li><span className="text-purple-400">full_name:</span> VARCHAR</li>
            <li><span className="text-purple-400">referral_code:</span> VARCHAR [UQ]</li>
            <li><span className="text-purple-400">is_active:</span> BOOLEAN</li>
          </ul>
        </div>

        {/* Referral Rules Configuration Table */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <h4 className="font-bold text-xs text-amber-400 border-b border-slate-800 pb-1.5 mb-2 uppercase tracking-wider">2. Product Rules (Config)</h4>
          <ul className="space-y-1 text-[11px] font-mono text-slate-300">
            <li><span className="text-purple-400">product_type:</span> VARCHAR [PK]</li>
            <li><span className="text-purple-400">referrer_amount:</span> DECIMAL</li>
            <li><span className="text-purple-400">referee_amount:</span> DECIMAL</li>
            <li><span className="text-purple-400">currency:</span> VARCHAR</li>
          </ul>
        </div>

        {/* Referrals Transactions Table */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <h4 className="font-bold text-xs text-amber-400 border-b border-slate-800 pb-1.5 mb-2 uppercase tracking-wider">3. Referral Ledger</h4>
          <ul className="space-y-1 text-[11px] font-mono text-slate-300">
            <li><span className="text-purple-400">ledger_id:</span> UUID [PK]</li>
            <li><span className="text-purple-400">referrer_id:</span> UUID {"[FK]"}</li>
            <li><span className="text-purple-400">product_id:</span> VARCHAR {"[FK]"}</li>
            <li><span className="text-purple-400">status:</span> ENUM ('COMPLETED')</li>
          </ul>
        </div>

      </div>
    </div>
  );
}