'use client';

import React, { useState } from 'react';
import { 
  User, 
  ShoppingBag, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle, 
  CreditCard, 
  Coins, 
  TrendingUp,
  Loader2,
  ArrowRight,
  XCircle
} from 'lucide-react';

// Biznes Tələbi: Universal Məhsul siyahısı
const BANK_PRODUCTS = [
  { id: 'credit', name: 'İstehlak Krediti', icon: Coins, type: 'Loan' },
  { id: 'credit_line', name: 'Kredit Xətti', icon: TrendingUp, type: 'CreditLine' },
  { id: 'debit_card', name: 'Debet Kart (NeoCard)', icon: CreditCard, type: 'Card' },
  { id: 'deposit', name: 'Müddətli Əmanət', icon: CreditCard, type: 'Deposit' },
];

// Sistemdə simulyasiya üçün mövcud olan kodların bazası
const SYSTEM_REFERRAL_REGISTRY = {
  'NEO-BAHRAM-2026': { exists: true, active: true, ownerId: 'user_bahram' },
  'NEO-ACTIVE-555': { exists: true, active: true, ownerId: 'user_other_1' },
  'NEO-EXPIRED-000': { exists: true, active: false, ownerId: 'user_other_2' },
};

// Profil üçün keçmiş referral tranzaksiyaların tarixçəsi
const REFERRAL_HISTORY_MOCK = [
  { id: 1, name: 'Elnur M.', product: 'Debet Kart', bonus: '10 AZN', status: 'COMPLETED', date: '14.06.2026' },
  { id: 2, name: 'Aysel K.', product: 'İstehlak Krediti', bonus: '0 AZN (Vaxtı bitib)', status: 'EXPIRED', date: '02.05.2026' },
  { id: 3, name: 'Ramil T.', product: 'Müddətli Əmanət', bonus: 'Gözlənilir', status: 'PENDING', date: '25.06.2026' },
];

export default function MobileAppMockup() {
  const currentUserId = 'user_bahram';
  const myReferralCode = 'NEO-BAHRAM-2026';
  const codeExpirationDate = '31.12.2026'; // Kodun son istifadə tarixi

  // UI State-ləri
  const [activeTab, setActiveTab] = useState<'products' | 'profile'>('products');
  const [copied, setCopied] = useState(false);
  
  // Sifariş və BPMN Flow State-ləri
  const [selectedProduct, setSelectedProduct] = useState(BANK_PRODUCTS[0]);
  const [inputCode, setInputCode] = useState('');
  const [orderStage, setOrderStage] = useState<'selection' | 'checkout' | 'processing' | 'bpmn_log' | 'result'>('selection');
  
  const [bpmnLogs, setBpmnLogs] = useState<string[]>([]);
  const [flowStatus, setFlowStatus] = useState<'SUCCESS' | 'ERROR' | 'CONTINUE_WITHOUT_BONUS'>('SUCCESS');
  const [finalMessage, setFinalMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Presentation Triggerləri
  const [simulateProductRejection, setSimulateProductRejection] = useState(false);
  const [simulateAlreadyPaid, setSimulateAlreadyPaid] = useState(false);

  const triggerCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(myReferralCode);
    setTimeout(() => setCopied(false), 2000);
  };

  // Diaqramdakı BPMN Məntiqinin tam icrası (Bütün xəta yollarından Continue Application-a keçidlə)
  const runBPMNProcess = (ignoreBonusMode: boolean = false) => {
    setOrderStage('processing');
    setBpmnLogs([]);
    setErrorMessage('');
    
    let logs: string[] = [];
    const addLog = (text: string) => logs.push(text);

    addLog('🚀 [Start] Product Application Started');

    setTimeout(() => {
      const targetCode = inputCode.trim().toUpperCase();

      // Müştəri birbaşa bonus olmadan davam etmək istədikdə (Xətadan sonra klikləyəndə)
      if (ignoreBonusMode) {
        addLog('⚠️ User chose: Continue Application without Referral Bonus');
        processProductApproval(addLog, logs, false, targetCode);
        return;
      }

      // 1. Referral Code Entered?
      if (!targetCode) {
        addLog('➖ Referral Code Entered? -> NO');
        processProductApproval(addLog, logs, false, targetCode);
        return;
      }

      addLog('➕ Referral Code Entered? -> YES');
      addLog(`🔍 Validating Code: "${targetCode}"`);

      // 2. Code Exists?
      const codeMetadata = SYSTEM_REFERRAL_REGISTRY[targetCode as keyof typeof SYSTEM_REFERRAL_REGISTRY];
      if (!codeMetadata) {
        addLog('❌ Code Exists? -> NO');
        addLog('🚫 Show Error: Invalid Referral Code');
        addLog('🔄 Flow Route -> Redirecting to Continue Application (No Bonus Eligible)');
        finalizeBPMN('CONTINUE_WITHOUT_BONUS', 'Daxil edilən referral kod sistemdə mövcud deyil!', logs);
        return;
      }
      addLog('✅ Code Exists? -> YES');

      // 3. Code Active?
      if (!codeMetadata.active) {
        addLog('❌ Code Active? -> NO');
        addLog('🚫 Show Error: Referral Code Inactive');
        addLog('🔄 Flow Route -> Redirecting to Continue Application (No Bonus Eligible)');
        finalizeBPMN('CONTINUE_WITHOUT_BONUS', 'Bu referral kodun aktivlik müddəti bitib!', logs);
        return;
      }
      addLog('✅ Code Active? -> YES');

      // 4. Own Referral Code?
      if (codeMetadata.ownerId === currentUserId) {
        addLog('❌ Own Referral Code? -> YES');
        addLog('🚫 Show Error: Self Referral Not Allowed');
        addLog('🔄 Flow Route -> Redirecting to Continue Application (No Bonus Eligible)');
        finalizeBPMN('CONTINUE_WITHOUT_BONUS', 'Müştəri öz referral kodundan istifadə edə bilməz!', logs);
        return;
      }
      addLog('✅ Own Referral Code? -> NO');
      addLog(`🔗 Assigning Referral Code (${targetCode}) to Application`);

      processProductApproval(addLog, logs, true, targetCode);

    }, 1200);
  };

  const processProductApproval = (addLog: (t: string) => void, logs: string[], hasValidCode: boolean, code: string) => {
    addLog('🔄 Moving to: Continue Application');
    
    // 6. Product Approved?
    if (simulateProductRejection) {
      addLog('❌ Product Approved? -> NO');
      addLog('🚨 Application Status: Product Cancelled');
      finalizeBPMN('ERROR', 'Təhlil (Underwriting) nəticəsində bank məhsulu müraciəti rədd edildi. Proses dayandırıldı.', logs);
      return;
    }
    addLog('✅ Product Approved? -> YES');

    if (!hasValidCode) {
      addLog('🏁 End: Process completed successfully (No Referral Rewards Applied).');
      finalizeBPMN('SUCCESS', 'Məhsulunuz uğurla rəsmiləşdirildi! (Referral bonus hesablanmadı)', logs);
      return;
    }

    // 7. Bonus Already Paid?
    if (simulateAlreadyPaid) {
      addLog('❌ Bonus Already Paid? -> YES');
      addLog('🏁 End: Process terminated because bonus was previously distributed for this record.');
      finalizeBPMN('SUCCESS', 'Məhsul rəsmiləşdirildi, lakin bu müraciət üzrə bonus artıq əvvəl ödənildiyi üçün təkrar hesablanmadı.', logs);
      return;
    }
    addLog('✅ Bonus Already Paid? -> NO');

    // 8. Load Referral Configuration & Process Bonuses
    addLog(`⚙️ Loading Referral Configuration for [${selectedProduct.type}]`);
    addLog('📊 Product Eligible for Referral Program? -> YES');
    addLog('📥 Get Bonus Rules (Referrer: 10 AZN, Referee: 5 AZN)');
    addLog('🧮 Calculating Referrer Bonus...');
    addLog('🧮 Calculating Referee Bonus...');
    addLog('💳 Creating Bonus Transactions in Core Banking Ledger');
    addLog('💰 Crediting Referrer Account (+10 AZN)');
    addLog('💰 Crediting Referee Account (+5 AZN)');
    addLog('🏁 End: Referral Process successfully integrated.');

    finalizeBPMN('SUCCESS', `🎉 Təbriklər! Məhsul rəsmiləşdi. Kod sahibinə 10 AZN, sizə isə 5 AZN bonus bal balansınıza yükləndi!`, logs);
  };

  const finalizeBPMN = (status: 'SUCCESS' | 'ERROR' | 'CONTINUE_WITHOUT_BONUS', msg: string, logs: string[]) => {
    setBpmnLogs(logs);
    setFlowStatus(status);
    if (status === 'SUCCESS') {
      setFinalMessage(msg);
    } else {
      setErrorMessage(msg);
    }
    setOrderStage('bpmn_log');
  };

  return (
    <div className="w-full flex items-center justify-center py-4 bg-slate-100">
      
      {/* REALİST SMARTFON MOCKUP-U */}
      <div className="relative w-[360px] h-[740px] bg-slate-950 rounded-[55px] shadow-2xl border-[14px] border-slate-900 p-3.5 flex flex-col justify-between overflow-hidden">
        
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-slate-950 rounded-full z-50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full mr-2"></div>
          <div className="w-10 h-1 bg-slate-900 rounded-full"></div>
        </div>

        {/* Ekran Daxili */}
        <div className="bg-slate-50 w-full h-full rounded-[40px] overflow-y-auto pt-6 pb-2 px-4 flex flex-col justify-between text-slate-800 font-sans">
          
          {/* Status Bar */}
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 px-2 mb-3">
            <span>09:41</span>
            <div className="flex gap-1 items-center">
              <span>📶 5G</span>
              <span>🔋 100%</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-start">
            
            {/* Header / Neytral 2Bank Logosu */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-3.5 shadow-sm text-center mb-4">
              <h3 className="font-black text-sm tracking-widest text-indigo-400">2BANK MOBILE</h3>
              <p className="text-[10px] text-slate-400 opacity-90">Referral Management System</p>
            </div>

            {/* Tab Naviqasiyası */}
            <div className="flex bg-slate-200 p-1 rounded-xl mb-4 text-xs font-semibold">
              <button 
                onClick={() => { setActiveTab('products'); setOrderStage('selection'); }}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${activeTab === 'products' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Məhsullar
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${activeTab === 'profile' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
              >
                <User className="w-3.5 h-3.5" /> Profilim
              </button>
            </div>

            {/* TAB 1: PROFİL SƏHİFƏSİ (KODUN STATUSU VƏ TARİXÇƏ) */}
            {activeTab === 'profile' && (
              <div className="space-y-3.5 animate-fadeIn text-left">
                <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Bəhram Müzəffərli</h4>
                    <p className="text-[10px] text-slate-400">Lead Specialist ID: #9284</p>
                  </div>
                </div>

                {/* Aktiv Referral Kod Kartı */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-3.5 shadow-sm">
                  <p className="text-[10px] text-indigo-200 font-medium">Sizin Aktiv Referral Kodunuz:</p>
                  <div className="flex items-center justify-between bg-slate-800/60 border border-indigo-500/30 rounded-lg p-2 mt-1.5 font-mono text-xs font-bold text-indigo-300">
                    <span>{myReferralCode}</span>
                    <button onClick={triggerCopy} className="p-1 hover:bg-slate-700/50 rounded transition-colors">
                      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    </button>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-300 mt-2 border-t border-slate-700/50 pt-1.5">
                    <span>Vəziyyət: <strong className="text-emerald-400">Aktiv</strong></span>
                    <span>Bitmə Tarixi: <strong>{codeExpirationDate}</strong></span>
                  </div>
                </div>

                {/* Keçmiş Bonus Status Tarixçəsi */}
                <div className="space-y-1.5">
                  <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide px-1">Dəvət Tarixçəsi & Statuslar:</h5>
                  <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
                    {REFERRAL_HISTORY_MOCK.map((history) => (
                      <div key={history.id} className="bg-white p-2.5 rounded-lg border border-slate-200 text-[10px] flex justify-between items-center shadow-2xs">
                        <div>
                          <p className="font-bold text-slate-800">{history.name} <span className="text-slate-400 font-normal">({history.product})</span></p>
                          <p className="text-[9px] text-slate-400">{history.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-slate-700">{history.bonus}</p>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm ${
                            history.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border border-green-200' :
                            history.status === 'EXPIRED' ? 'bg-red-50 text-red-700 border border-red-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {history.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MƏHSULLAR VƏ SİFARİŞ AXIŞI */}
            {activeTab === 'products' && (
              <div className="w-full text-left">
                
                {/* Ssenari 1: Məhsul Seçimi */}
                {orderStage === 'selection' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-[10px] text-slate-500 leading-normal">
                      <strong>💡 Test Ssenariləri üçün Kodlar:</strong>
                      <ul className="list-none mt-1 space-y-0.5 font-mono text-[9px]">
                        <li>• <span className="text-emerald-600 font-bold">NEO-ACTIVE-555</span> (Aktiv)</li>
                        <li>• <span className="text-amber-600 font-bold">NEO-EXPIRED-000</span> (Deaktiv/Expired)</li>
                        <li>• <span className="text-red-600 font-bold">NEO-BAHRAM-2026</span> (Öz kodunuz)</li>
                      </ul>
                    </div>

                    <label className="text-[11px] font-bold text-slate-600 block">Məhsul Seçimi:</label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {BANK_PRODUCTS.map((prod) => {
                        const Icon = prod.icon;
                        const isSelected = selectedProduct.id === prod.id;
                        return (
                          <button
                            key={prod.id}
                            onClick={() => setSelectedProduct(prod)}
                            className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${isSelected ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-500' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-900">{prod.name}</p>
                              </div>
                            </div>
                            {isSelected && <span className="text-indigo-600 text-xs font-bold">✓</span>}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setOrderStage('checkout')}
                      className="w-full bg-slate-950 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow hover:bg-slate-900 flex items-center justify-center gap-1 mt-2"
                    >
                      Sifarişi Davam Et <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Ssenari 2: Kod Daxil Etmə Formu */}
                {orderStage === 'checkout' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400">Seçilmiş Məhsul:</p>
                        <p className="font-bold text-xs text-slate-900">{selectedProduct.name}</p>
                      </div>
                      <button type="button" onClick={() => setOrderStage('selection')} className="text-[10px] text-indigo-600 underline font-semibold">Dəyiş</button>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Referral Kod</label>
                      <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="Məs: NEO-ACTIVE-555"
                        className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-mono uppercase focus:outline-none focus:border-indigo-500 bg-white"
                      />
                    </div>

                    {/* JSX string qorumalı təhlil paneli */}
                    <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 space-y-2">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">⚙️ Underwriting (Simulyasiya):</p>
                      <label className="flex items-center gap-2 text-[10px] text-slate-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={simulateProductRejection} 
                          onChange={(e) => setSimulateProductRejection(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Məhsul rədd edilsin {"(Approved -> No)"}</span>
                      </label>
                      <label className="flex items-center gap-2 text-[10px] text-slate-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={simulateAlreadyPaid} 
                          onChange={(e) => setSimulateAlreadyPaid(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Bonus əvvəl ödənilmiş olsun {"(Paid -> Yes)"}</span>
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderStage('selection')}
                        className="w-1/3 bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl hover:bg-slate-300"
                      >
                        Geri
                      </button>
                      <button
                        type="button"
                        onClick={() => runBPMNProcess(false)}
                        className="w-2/3 bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-xl shadow hover:bg-indigo-700 text-center"
                      >
                        Məhsulu Sifariş Et
                      </button>
                    </div>
                  </div>
                )}

                {/* Ssenari 3: Loading Engine */}
                {orderStage === 'processing' && (
                  <div className="py-12 flex flex-col items-center justify-center space-y-3 animate-fadeIn">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    <p className="text-xs font-bold text-slate-700">BPMN Validasiya Qaydaları Yoxlanılır...</p>
                  </div>
                )}

                {/* Ssenari 4: BPMN Log Terminalı və Validasiya Xətası Zamanı Davam Etmək Seçimi */}
                {orderStage === 'bpmn_log' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-[9px] space-y-1.5 shadow-inner max-h-[260px] overflow-y-auto">
                      <p className="text-amber-400 border-b border-slate-800 pb-1 font-bold mb-1">📋 2Bank BPMN Core Log:</p>
                      {bpmnLogs.map((log, index) => (
                        <p key={index} className="leading-relaxed border-l border-slate-700 pl-1.5 text-slate-300">
                          {log}
                        </p>
                      ))}
                    </div>

                    {/* Validasiya xətası var və axışın davam etməsinə icvazə verilir */}
                    {flowStatus === 'CONTINUE_WITHOUT_BONUS' ? (
                      <div className="space-y-2 pt-1">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[10px] text-amber-800 flex gap-1.5 items-start">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                          <span>{errorMessage} Lakin BPMN axışına əsasən sifarişə davam edə bilərsiniz.</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setOrderStage('checkout')}
                            className="w-1/2 bg-slate-200 text-slate-700 text-[11px] font-bold py-2 rounded-xl"
                          >
                            Kodu Düzəlt
                          </button>
                          <button
                            onClick={() => runBPMNProcess(true)}
                            className="w-1/2 bg-amber-600 text-white text-[11px] font-bold py-2 rounded-xl shadow hover:bg-amber-700"
                          >
                            Bonus Olmadan Davam Et
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setOrderStage('result')}
                        className="w-full bg-slate-950 text-white text-xs font-bold py-2.5 px-4 rounded-xl text-center shadow"
                      >
                        Yekun Ekranı Göstər
                      </button>
                    )}
                  </div>
                )}

                {/* Ssenari 5: Yekun Müştəri Ekranı */}
                {orderStage === 'result' && (
                  <div className="space-y-4 text-center py-6 animate-fadeIn">
                    {flowStatus === 'SUCCESS' ? (
                      <>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                          <CheckCircle className="w-7 h-7" />
                        </div>
                        <p className="text-xs font-semibold text-slate-800 px-2 leading-relaxed">
                          {finalMessage}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                          <XCircle className="w-7 h-7" />
                        </div>
                        <p className="text-xs font-bold text-red-600">Müraciət Ləğv Edildi</p>
                        <p className="text-[11px] text-slate-600 px-2 leading-relaxed">
                          {errorMessage}
                        </p>
                      </>
                    )}

                    <button
                      onClick={() => {
                        setOrderStage('selection');
                        setInputCode('');
                      }}
                      className="w-full bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl hover:bg-slate-300 transition-colors mt-4"
                    >
                      Yeni Simulyasiya Başlat
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Telefonun Alt Naviqasiya Çizgisi */}
          <div className="border-t border-slate-200 pt-1.5 flex flex-col items-center shrink-0">
            <span className="text-[8px] text-slate-400 font-mono tracking-widest">2BANK SOVEREIGN SYSTEM v2.6</span>
            <div className="w-20 h-1 bg-slate-300 rounded-full mt-1.5"></div>
          </div>

        </div>
      </div>

    </div>
  );
}