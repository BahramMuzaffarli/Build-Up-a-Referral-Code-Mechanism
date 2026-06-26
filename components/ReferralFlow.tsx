import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, FileText, Gift } from 'lucide-react';

interface ReferralFlowProps {
  currentStep: number;
}

export default function ReferralFlow({ currentStep }: ReferralFlowProps) {
  const steps = [
    { id: 1, title: 'Kodun Paylaşılması', desc: 'Müştəri unikal və aktiv kodunu paylaşır.', icon: FileText },
    { id: 2, title: 'Kodun Validasiyası', desc: 'Sistem mövcudluğu və mülkiyyəti yoxlayır (Tələb 7, 9).', icon: ShieldCheck },
    { id: 3, title: 'Məhsul Rəsmiləşməsi', desc: 'Sifariş universal məhsul üzrə tamamlanır.', icon: ArrowRight },
    { id: 4, title: 'Yekun Hesablaşma', desc: 'Konfiqurasiyaya uyğun təkfəzli bonus paylanılır (Tələb 5, 6, 8).', icon: Gift },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
      <h3 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
        🔄 BPMN Biznes Prosesinin İnteqrasiya Axışı
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep >= step.id;
          return (
            <div key={step.id} className={`p-3.5 rounded-xl border transition-all duration-300 ${isActive ? 'bg-indigo-50/60 border-indigo-500 shadow-sm' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-700'}`}>Addım {step.id}</span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              </div>
              <h4 className="font-bold text-slate-900 text-xs mb-0.5">{step.title}</h4>
              <p className="text-[10px] text-slate-500 leading-normal">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}