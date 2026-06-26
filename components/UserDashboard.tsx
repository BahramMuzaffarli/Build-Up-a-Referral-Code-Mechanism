'use client';

import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Smartphone, CreditCard, Landmark, Coins, AlertCircle, ArrowRight } from 'lucide-react';

interface UserDashboardProps {
  onAction: (log: string, step: number) => void;
}

// Biznes Tələbi 3, 4, 5: Universal Məhsullar və Konfiqurasiya edilə bilən Qaydalar
const PRODUCT_CONFIGS = [
  { id: 'debit_card', name: 'Debet Kart', icon: CreditCard, referrerReward: 10, refereeReward: 5 },
  { id: 'credit', name: 'Kredit Məhsulu', icon: Coins, referrerReward: 25, refereeReward: 15 },
  { id: 'credit_line', name: 'Kredit Xətti', icon: CreditCard, referrerReward: 30, refereeReward: 20 },
  { id: 'deposit', name: 'Əmanət Məhsulu', icon: Landmark, referrerReward: 20, refereeReward: 10 },
];

export default function UserDashboard({ onAction }: UserDashboardProps) {
  // Sistemdəki mövcud olan aktiv unikal kodlar (Biznes Tələbi 1, 9, 10, 18)
  const VALID_SYSTEM_CODES = ['NEO-BAHRAM-2026', 'NEO-USER-999'];
  
  const myReferralCode = 'NEO-BAHRAM-2026'; // İstifadəçinin öz kodu
  const [copied, setCopied] = useState(false);
  
  // Sifariş Formu State-ləri
  const [selectedProduct, setSelectedProduct] = useState(PRODUCT_CONFIGS[0]);
  const [inputCode, setInputCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simStep, setSimStep] = useState(1); // 1: Məhsul seçimi, 2: Kod daxil etmə, 3: Rəsmiləşmə/Uğur

  const copyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onAction(`Müştəri öz unikal referral kodunu (${myReferralCode}) kopyaladı və dostu ilə paylaşdı.`, 1);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const trimmedCode = inputCode.trim().toUpperCase();

      // Biznes Tələbi 2 & 11: Əgər kod yazılıbsa və boş deyilsə yoxla
      if (trimmedCode !== '') {
        // Biznes Tələbi 7 & 16: Müştəri öz referral kodundan istifadə edə bilməz
        if (trimmedCode === myReferralCode) {
          setErrorMessage('Xəta: Öz referral kodunuzu daxil edə bilməzsiniz!');
          onAction(`Sistem imtina etdi: Müştəri öz kodunu (${trimmedCode}) daxil etməyə çalışdı.`, 2);
          setIsSubmitting(false);
          return;
        }

        // Biznes Tələbi 9 & 18: Referral kod sistemdə mövcud deyilsə rədd et
        if (!VALID_SYSTEM_CODES.includes(trimmedCode)) {
          setErrorMessage('Xəta: Daxil edilən referral kod etibarsızdır və ya aktiv deyil!');
          onAction(`Sistem imtina etdi: Mövcud olmayan/deaktiv kod daxil edildi (${trimmedCode}).`, 2);
          setIsSubmitting(false);
          return;
        }
        
        onAction(`Referral kod təsdiqləndi: ${trimmedCode}. Məhsul: ${selectedProduct.name}. Status: PENDING`, 2);
      } else {
        onAction(`Məhsul sifarişi referral kodsuz davam etdirilir. Məhsul: ${selectedProduct.name}`, 2);
      }

      // Biznes Tələbi 6 & 15: Bonus yalnız məhsul UĞURLA RƏSMİLƏŞDİRİLDİKDƏN sonra hesablanır
      setSimStep(3);
      setIsSubmitting(false);
      
      if (trimmedCode && VALID_SYSTEM_CODES.includes(trimmedCode) && trimmedCode !== myReferralCode) {
        // Biznes Tələbi 5 & 14: Referrer və referee üçün fərqli bonus məbləğləri (Konfiqurasiyadan gələn)
        // Biznes Tələbi 8 & 17: Bonus yalnız bir dəfə hesablanır (Single transaction logic)
        setSuccessMessage(
          `🎉 Məhsul uğurla rəsmiləşdirildi! Referrer hesabına ${selectedProduct.referrerReward} AZN, sizin (Referee) hesabınıza isə ${selectedProduct.refereeReward} AZN bonus köçürüldü!`
        );
        onAction(`Məhsul rəsmiləşdirildi (COMPLETED). Bonuslar paylandı: Referrer +${selectedProduct.referrerReward} AZN / Referee +${selectedProduct.refereeReward} AZN.`, 4);
      } else {
        setSuccessMessage(`🎉 Məhsul uğurla rəsmiləşdirildi! (Referral kod istifadə olunmadı)`);
        onAction(`Məhsul referral kodsuz uğurla rəsmiləşdirildi.`, 4);
      }
    }, 1200);
  };

  const resetAll = () => {
    setSimStep(1);
    setInputCode('');
    setErrorMessage('');
    setSuccessMessage('');
    setSelectedProduct(PRODUCT_CONFIGS[0]);
    onAction('Simulyator ilkin vəziyyətə gətirildi. Yeni sifariş axışı gözlənilir.', 1);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 flex flex-col lg:flex-row gap-8 items-center justify-center">
      
      {/* Realist Smartfon Görünüşü (Mockup) */}
      <div className="relative mx-auto w-[340px] h-[680px] bg-slate-900 rounded-[50px] shadow-2xl border-[12px] border-slate-800 p-3 flex flex-col justify-between overflow-hidden">
        
        {/* Telefonun Üst Dinamikası / Kamerası */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-slate-900 rounded-full z-50 flex items-center justify-center">
          <div className="w-3 h-3 bg-slate-800 rounded-full mr-2"></div>
          <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
        </div>

        {/* Ekran Daxili */}
        <div className="bg-slate-50 w-full h-full rounded-[38px] overflow-y-auto pt-6 pb-4 px-4 flex flex-col justify-between text-slate-800 font-sans">
          
          {/* Status Bar */}
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 px-2 mb-4">
            <span>09:41</span>
            <div className="flex gap-1 items-center">
              <span>📶</span>
              <span>🪫 100%</span>
            </div>
          </div>

          {/* Tətbiq Başlığı */}
          <div className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white rounded-2xl p-4 shadow-sm text-center mb-4">
            <h3 className="font-bold text-sm tracking-wide">2Bank Mobile</h3>
            <p className="text-[10px] text-indigo-100 opacity-90">Rəqəmsal Məhsul Platforması</p>
          </div>

          {/* Dinamik Ekran Məzmunu */}
          <div className="flex-1 flex flex-col justify-start">
            {simStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-center">
                  <p className="text-[11px] text-slate-500">Sizin Referral Kodunuz (Biznes Tələbi 1)</p>
                  <div className="flex items-center justify-between bg-white border border-indigo-200 rounded-lg p-2 mt-1 font-mono text-xs font-bold text-indigo-700">
                    <span>{myReferralCode}</span>
                    <button onClick={copyCode} className="p-1 hover:bg-slate-100 rounded transition-colors">
                      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Məhsul Seçin (Biznes Tələbi 3 - Universal)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRODUCT_CONFIGS.map((prod) => {
                      const Icon = prod.icon;
                      const isSel = selectedProduct.id === prod.id;
                      return (
                        <button
                          key={prod.id}
                          onClick={() => setSelectedProduct(prod)}
                          className={`p-2.5 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${isSel ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-500' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                        >
                          <Icon className={`w-4 h-4 ${isSel ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <div>
                            <p className="text-[11px] font-bold text-slate-900">{prod.name}</p>
                            <p className="text-[9px] text-slate-500">Kampaniya: +{prod.referrerReward} AZN</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => { setSimStep(2); onAction(`Məhsul seçildi: ${selectedProduct.name}. Sifariş mərhələsinə keçilir.`, 2); }}
                  className="w-full bg-slate-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 mt-2"
                >
                  Sifariş Səhifəsinə Keç <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {simStep === 2 && (
              <form onSubmit={handleOrderSubmit} className="space-y-4 animate-fadeIn">
                <div className="bg-slate-100 rounded-xl p-3 border border-slate-200">
                  <p className="text-[11px] text-slate-500">Seçilmiş Məhsul:</p>
                  <p className="font-bold text-xs text-slate-800 flex items-center gap-1.5 mt-0.5">
                    {React.createElement(selectedProduct.icon, { className: 'w-4 h-4 text-indigo-600' })}
                    {selectedProduct.name}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-slate-600">Referral Kod (Könüllü)</label>
                    <span className="text-[9px] text-slate-400">Biznes Tələbi 2, 11</span>
                  </div>
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Məs: NEO-USER-999"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-mono uppercase focus:outline-none focus:border-indigo-500 bg-white"
                    disabled={isSubmitting}
                  />
                  <p className="text-[9px] text-slate-400 mt-1">İpucu: Test üçün <strong>NEO-USER-999</strong> yaza və ya öz kodunuzu yazıb yoxlaya bilərsiniz.</p>
                </div>

                {errorMessage && (
                  <div className="bg-red-50 border border-red-100 text-red-700 p-2.5 rounded-xl text-[11px] flex items-start gap-1.5 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setSimStep(1); setErrorMessage(''); }}
                    className="w-1/3 bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl hover:bg-slate-300 transition-colors"
                    disabled={isSubmitting}
                  >
                    Geri
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-xl shadow hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Rəsmiləşdirilir...' : 'Məhsulu Sifariş Et'}
                  </button>
                </div>
              </form>
            )}

            {simStep === 3 && (
              <div className="space-y-4 text-center py-6 animate-fadeIn">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 text-xl font-bold">
                  ✓
                </div>
                <div className="text-slate-700 text-xs px-1 leading-relaxed">
                  {successMessage}
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-left text-[10px] space-y-1 text-slate-500">
                  <p className="font-bold text-slate-700 border-b pb-1 mb-1">Arxa Plan Hesabatı:</p>
                  <p>• Məhsul ID: {selectedProduct.id}</p>
                  <p>• Status: <span className="text-green-600 font-bold">COMPLETED</span></p>
                  <p>• Tranzaksiya Limiti: 1 Dəfəlik (Tələb 8)</p>
                </div>
                <button
                  onClick={resetAll}
                  className="w-full bg-slate-900 text-white text-xs font-bold py-2 px-4 rounded-xl shadow hover:bg-slate-800 transition-colors"
                >
                  Yeni Sifariş Simulyasiyası
                </button>
              </div>
            )}
          </div>

          {/* App Footer Navigation / Home Indicator */}
          <div className="border-t border-slate-200 pt-2 mt-2 flex flex-col items-center">
            <span className="text-[8px] text-slate-400 font-mono tracking-tighter">Secure Core Banking API v2.0</span>
            <div className="w-24 h-1 bg-slate-300 rounded-full mt-2"></div>
          </div>

        </div>
      </div>

      {/* Sağ tərəf: Biznes Qaydalarının Canlı İzlənməsi */}
      <div className="flex-1 max-w-lg space-y-4 self-start">
        <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800">
          <h4 className="text-md font-bold text-amber-400 mb-2 flex items-center gap-2">
            ⚙️ Aktiv Kampaniya Qaydaları (Konfiqurasiya paneli)
          </h4>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Biznes tələblərinə (Tələb 4, 5, 13, 14) əsasən, sistem tamamilə konfiqurasiya yönümlüdür. Seçilmiş məhsula görə mükafatlar dinamik dəyişir:
          </p>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700 flex justify-between">
              <span className="text-slate-300">Seçilən Məhsul:</span>
              <span className="text-indigo-400 font-bold">{selectedProduct.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700 text-center">
                <p className="text-[10px] text-slate-400">Referrer Bonusu</p>
                <p className="text-base font-bold text-emerald-400 mt-0.5">{selectedProduct.referrerReward} AZN</p>
              </div>
              <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700 text-center">
                <p className="text-[10px] text-slate-400">Referee Bonusu</p>
                <p className="text-base font-bold text-emerald-400 mt-0.5">{selectedProduct.refereeReward} AZN</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            📋 Core Banking Real-Time Logları:
          </h4>
          <div className="bg-white border border-slate-200 rounded-xl p-3 h-36 overflow-y-auto font-mono text-[11px] text-slate-600 shadow-inner space-y-1.5" id="log-container">
            <p className="text-slate-400">// Sistem aktivdir. Sifariş gözlənilir...</p>
          </div>
        </div>
      </div>

    </div>
  );
}