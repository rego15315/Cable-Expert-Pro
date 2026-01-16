
import React, { useState } from 'react';
import { ArrowLeft, Zap, ShieldAlert, Calculator, Activity, Info, ShieldCheck, Share2, Construction, X, BookOpen, AlertCircle } from 'lucide-react';
import { useTranslation } from '../App';

export const CableCalculator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'basic' | 'pro'>('basic');
  const [showGuide, setShowGuide] = useState(false);
  
  const [power, setPower] = useState('15');
  const [voltage, setVoltage] = useState('380');
  const [distance, setDistance] = useState('50');
  const [scenario, setScenario] = useState('general');
  const [mountType, setMountType] = useState<'surface' | 'concealed'>('concealed');

  const [material, setMaterial] = useState('CU');
  const [ambientTemp, setAmbientTemp] = useState('30');
  const [result, setResult] = useState<any>(null);

  const calculate = async () => {
    setLoading(true);
    if ((window as any).Telegram?.WebApp?.HapticFeedback) {
      (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          power, voltage, distance, scenario, mount_type: mountType, material, temp: ambientTemp
        })
      });
      const data = await response.json();
      setResult(data);
      
      if ((window as any).Telegram?.WebApp?.HapticFeedback) {
        (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pt-4 pb-24 px-1 relative">
      {/* 头部与文档按钮逻辑保持一致 ... */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 bg-white shadow-sm border border-slate-100 rounded-full active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{t.calcTitle}</h2>
        </div>
        <button onClick={() => setShowGuide(true)} className="p-2 bg-blue-50 text-blue-600 rounded-full active:scale-90 border border-blue-100"><BookOpen size={20} /></button>
      </div>

      {/* 指南面板逻辑保持一致 ... */}
      {showGuide && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm p-4 flex items-end">
           <div className="bg-white w-full max-h-[85vh] rounded-[48px] shadow-2xl overflow-y-auto pb-10">
              <div className="sticky top-0 bg-white/80 backdrop-blur-md p-6 flex justify-between items-center border-b border-slate-50 z-10">
                 <h3 className="font-black text-slate-900">{t.guideTitle}</h3>
                 <button onClick={() => setShowGuide(false)} className="p-2 bg-slate-100 rounded-full"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-8">
                 <section className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{t.strategyTable}</h4>
                    <div className="overflow-hidden border border-slate-100 rounded-3xl">
                       <table className="w-full text-left text-[11px]">
                          <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-tighter">
                             <tr><th className="p-4">{t.scenario}</th><th className="p-4">{t.startCurrent}</th><th className="p-4">{t.contRunning}</th><th className="p-4">{t.sizingPolicy}</th></tr>
                          </thead>
                          <tbody className="font-bold text-slate-700">
                             <tr className="border-t border-slate-50"><td className="p-4">{t.lighting}</td><td className="p-4 text-emerald-600">{t.low}</td><td className="p-4 text-slate-400">{t.no}</td><td className="p-4">{t.policyStd}</td></tr>
                             <tr className="border-t border-slate-50 bg-blue-50/20"><td className="p-4">{t.homeAC}</td><td className="p-4 text-red-500">{t.high}</td><td className="p-4 text-emerald-600">{t.yes}</td><td className="p-4 text-blue-600">{t.policyPlus1}</td></tr>
                             <tr className="border-t border-slate-50"><td className="p-4">{t.general}</td><td className="p-4 text-amber-500">{t.high}</td><td className="p-4 text-emerald-600">{t.yes}</td><td className="p-4 text-blue-600">{t.policy13x}</td></tr>
                             <tr className="border-t border-slate-50 bg-blue-50/20"><td className="p-4">{t.industrial}</td><td className="p-4 text-red-700">{t.vHigh}</td><td className="p-4 text-emerald-600">{t.yes}</td><td className="p-4 text-blue-600 font-black">{t.policyPlus2}</td></tr>
                          </tbody>
                       </table>
                    </div>
                 </section>
              </div>
           </div>
        </div>
      )}

      {/* 输入表单逻辑保持一致 ... */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">{t.loadPower}</label>
            <div className="relative">
              <input type="number" value={power} onChange={e => setPower(e.target.value)} className="w-full text-4xl font-black bg-slate-50 rounded-2xl p-5 outline-none" />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-sm">KW</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">{t.voltage}</label>
              <select value={voltage} onChange={e => setVoltage(e.target.value)} className="w-full bg-transparent font-bold text-slate-800 outline-none">
                <option value="220">220V</option><option value="380">380V</option>
              </select>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">{t.distance}</label>
              <input type="number" value={distance} onChange={e => setDistance(e.target.value)} className="w-full bg-transparent font-bold text-slate-800 outline-none" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">{t.mountType}</label>
            <div className="flex bg-slate-50 p-1 rounded-xl">
               <button onClick={() => setMountType('surface')} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase transition-all ${mountType === 'surface' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{t.surface}</button>
               <button onClick={() => setMountType('concealed')} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase transition-all ${mountType === 'concealed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{t.concealed}</button>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">{t.scenario}</label>
            <div className="grid grid-cols-2 gap-3">
              {['lighting', 'homeAC', 'general', 'industrial'].map(s => (
                <button key={s} onClick={() => setScenario(s)} className={`py-3 px-4 rounded-xl text-[10px] font-black border-2 transition-all ${scenario === s ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 border-transparent text-slate-500'}`}>{t[s]}</button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={calculate} disabled={loading} className="w-full py-5 bg-blue-600 text-white font-black rounded-[32px] shadow-xl transition-all flex items-center justify-center space-x-2">
          {loading ? <Activity className="animate-spin" /> : <Calculator size={20} />}<span>{t.calculate}</span>
        </button>
      </div>

      {/* 结果显示 ... */}
      {result && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
          <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl text-center relative overflow-hidden">
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">{t.resultArea}</p>
             <h3 className="text-7xl font-black mt-3">{result.recommended_cable_mm2}<span className="text-xl font-bold ml-2 text-blue-500">mm²</span></h3>
             <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={120} /></div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border-2 border-emerald-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg"><ShieldAlert size={24} /></div>
              <div><p className="text-[10px] font-black text-slate-400 uppercase">{t.breakerSize}</p><p className="text-2xl font-black">{result.recommended_breaker_a} A</p></div>
            </div>
            <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase">{t.loadCurrent}</p><p className="text-lg font-bold text-slate-600">{result.load_current_a} A</p></div>
          </div>
        </div>
      )}
    </div>
  );
};
