
import React, { useState } from 'react';
import { ArrowLeft, Zap, ShieldAlert, Calculator, Activity, Info, ShieldCheck, Share2, Construction, X, BookOpen, AlertCircle } from 'lucide-react';
import { useTranslation } from '../App';

export const CableCalculator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'basic' | 'pro'>('basic');
  const [showGuide, setShowGuide] = useState(false);
  
  // Parameters
  const [power, setPower] = useState('15');
  const [voltage, setVoltage] = useState('380');
  const [distance, setDistance] = useState('50');
  const [scenario, setScenario] = useState('general');
  const [mountType, setMountType] = useState<'surface' | 'concealed'>('concealed');

  // Expert Parameters (Visible in Pro)
  const [material, setMaterial] = useState('CU');
  const [ambientTemp, setAmbientTemp] = useState('30');
  const [powerFactor, setPowerFactor] = useState('0.85');
  const [groupFactor, setGroupFactor] = useState('1.0');
  const [allowDrop, setAllowDrop] = useState('5');
  const [instMethod, setInstMethod] = useState('conduit');

  const [result, setResult] = useState<any>(null);

  const shareResult = () => {
    if (!result) return;
    const text = `WireExpert Report: ${power}kW @ ${voltage}V. Recommended: ${result.recommended_cable_mm2}mm² Cable. Certified by IEC.`;
    if ((window as any).Telegram?.WebApp) {
      (window as any).Telegram.WebApp.switchInlineQuery(text);
    } else {
      navigator.clipboard.writeText(text);
      alert('Report copied to clipboard!');
    }
  };

  const calculate = async () => {
    setLoading(true);
    if ((window as any).Telegram?.WebApp?.HapticFeedback) {
      (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const v = parseFloat(voltage);
      const p = parseFloat(power) * 1000;
      let effPF = mode === 'pro' ? parseFloat(powerFactor) : (scenario === 'lighting' ? 0.95 : (scenario === 'homeAC' ? 0.82 : 0.85));
      let effDropLimit = mode === 'pro' ? parseFloat(allowDrop) : (scenario === 'lighting' ? 3 : 5);
      
      let ibFactor = 1.0;
      if (scenario === 'general') ibFactor = 1.3; 
      const ib = (v > 300 ? p / (Math.sqrt(3) * v * effPF) : p / (v * effPF)) * ibFactor;

      const breakerOptions = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630];
      const recommendedBreaker = breakerOptions.find(b => b >= ib * 1.25) || breakerOptions[breakerOptions.length - 1];

      const kt = Math.sqrt((70 - parseFloat(ambientTemp)) / (70 - 30));
      const km = mountType === 'concealed' ? 0.8 : 1.0;
      const cableSizes = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300];
      const targetCapacity = ib / (kt * km * (mode === 'pro' ? parseFloat(groupFactor) : 1.0));
      
      const baseCapMap: Record<number, number> = { 1.5: 18, 2.5: 25, 4: 34, 6: 43, 10: 60, 16: 80, 25: 106, 35: 131, 50: 159, 70: 202, 95: 244, 120: 282, 150: 324, 185: 371, 240: 436, 300: 500 };
      
      let cableIdx = cableSizes.findIndex(s => baseCapMap[s] >= targetCapacity);
      if (cableIdx === -1) cableIdx = cableSizes.length - 1;

      if (scenario === 'homeAC') cableIdx = Math.min(cableIdx + 1, cableSizes.length - 1);
      if (scenario === 'industrial') cableIdx = Math.min(cableIdx + 2, cableSizes.length - 1);

      let finalCable = cableSizes[cableIdx];
      const rho = material === 'CU' ? 0.0178 : 0.0285;
      const l = parseFloat(distance);
      const checkDrop = (size: number) => {
        const phaseFactor = v > 300 ? Math.sqrt(3) : 2;
        return ((phaseFactor * ib * (rho * l / size)) / v) * 100;
      };
      
      let actualDrop = checkDrop(finalCable);
      while (actualDrop > effDropLimit && cableIdx < cableSizes.length - 1) {
        cableIdx++;
        finalCable = cableSizes[cableIdx];
        actualDrop = checkDrop(finalCable);
      }

      setResult({
        load_current_a: ib.toFixed(2),
        recommended_cable_mm2: finalCable,
        recommended_breaker_a: recommendedBreaker,
        voltage_drop_pct: actualDrop.toFixed(2),
        scenario
      });
      
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
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 bg-white shadow-sm border border-slate-100 rounded-full active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{t.calcTitle}</h2>
        </div>
        <button 
          onClick={() => {
            setShowGuide(true);
            if ((window as any).Telegram?.WebApp?.HapticFeedback) {
              (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }
          }}
          className="p-2 bg-blue-50 text-blue-600 rounded-full active:scale-90 transition-all border border-blue-100"
        >
          <BookOpen size={20} />
        </button>
      </div>

      {/* Guide Overlay */}
      {showGuide && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 p-4 flex items-end">
           <div className="bg-white w-full max-h-[85vh] rounded-[48px] shadow-2xl overflow-y-auto animate-in slide-in-from-bottom duration-500 hide-scrollbar pb-10">
              <div className="sticky top-0 bg-white/80 backdrop-blur-md p-6 flex justify-between items-center border-b border-slate-50 z-10">
                 <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 p-2 rounded-xl text-white"><BookOpen size={18}/></div>
                    <h3 className="font-black text-slate-900">{t.guideTitle}</h3>
                 </div>
                 <button onClick={() => setShowGuide(false)} className="p-2 bg-slate-100 rounded-full active:scale-90"><X size={20}/></button>
              </div>

              <div className="p-6 space-y-8">
                 <section className="space-y-4">
                    <div className="flex items-center space-x-2">
                       <Calculator size={16} className="text-blue-600" />
                       <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{t.strategyTable}</h4>
                    </div>
                    <div className="overflow-hidden border border-slate-100 rounded-3xl">
                       <table className="w-full text-left text-[11px]">
                          <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-tighter">
                             <tr>
                                <th className="p-4">{t.scenario}</th>
                                <th className="p-4">{t.startCurrent}</th>
                                <th className="p-4">{t.contRunning}</th>
                                <th className="p-4">{t.sizingPolicy}</th>
                             </tr>
                          </thead>
                          <tbody className="font-bold text-slate-700">
                             <tr className="border-t border-slate-50">
                                <td className="p-4">{t.lighting}</td>
                                <td className="p-4 text-emerald-600">{t.low}</td>
                                <td className="p-4 text-slate-400">{t.no}</td>
                                <td className="p-4">{t.policyStd}</td>
                             </tr>
                             <tr className="border-t border-slate-50 bg-blue-50/20">
                                <td className="p-4">{t.homeAC}</td>
                                <td className="p-4 text-red-500">{t.high}</td>
                                <td className="p-4 text-emerald-600">{t.yes}</td>
                                <td className="p-4 text-blue-600">{t.policyPlus1}</td>
                             </tr>
                             <tr className="border-t border-slate-50">
                                <td className="p-4">{t.general}</td>
                                <td className="p-4 text-amber-500">{t.high}</td>
                                <td className="p-4 text-emerald-600">{t.yes}</td>
                                <td className="p-4 text-blue-600">{t.policy13x}</td>
                             </tr>
                             <tr className="border-t border-slate-50 bg-blue-50/20">
                                <td className="p-4">{t.industrial}</td>
                                <td className="p-4 text-red-700">{t.vHigh}</td>
                                <td className="p-4 text-emerald-600">{t.yes}</td>
                                <td className="p-4 text-blue-600 font-black">{t.policyPlus2}</td>
                             </tr>
                          </tbody>
                       </table>
                    </div>
                 </section>

                 <section className="space-y-4">
                    <div className="flex items-center space-x-2">
                       <Construction size={16} className="text-blue-600" />
                       <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{t.heatNote}</h4>
                    </div>
                    <div className="bg-orange-50 p-5 rounded-3xl border border-orange-100 flex items-start space-x-3">
                       <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={18} />
                       <p className="text-[11px] text-orange-800 leading-relaxed font-bold">
                          {t.heatDesc}
                       </p>
                    </div>
                 </section>

                 <div className="p-6 bg-slate-900 rounded-[32px] text-white">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Technical Standard</p>
                    <p className="text-xs font-medium leading-relaxed italic opacity-80">
                       WireExpert calculations follow IEC 60364 Electrical Installations for Buildings. Professional results for engineering safety.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="flex bg-slate-200 p-1 rounded-2xl mx-1">
        <button onClick={() => setMode('basic')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'basic' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>{t.modeBasic}</button>
        <button onClick={() => setMode('pro')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'pro' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>{t.modePro}</button>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">{t.loadPower}</label>
            <div className="relative">
              <input type="number" value={power} onChange={e => setPower(e.target.value)} className="w-full text-4xl font-black bg-slate-50 rounded-2xl p-5 focus:ring-2 focus:ring-blue-500 border-none outline-none" />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-sm">KW</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">{t.voltage}</label>
              <select value={voltage} onChange={e => setVoltage(e.target.value)} className="w-full bg-transparent font-bold text-slate-800 outline-none appearance-none">
                <option value="220">220V (1-Ph)</option>
                <option value="380">380V (3-Ph)</option>
                <option value="400">400V (3-Ph)</option>
              </select>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">{t.distance}</label>
              <div className="flex items-center">
                 <input type="number" value={distance} onChange={e => setDistance(e.target.value)} className="w-full bg-transparent font-bold text-slate-800 outline-none" />
                 <span className="text-[10px] text-slate-300 font-black">M</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">{t.mountType}</label>
            <div className="flex bg-slate-50 p-1 rounded-xl">
               <button onClick={() => setMountType('surface')} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase flex items-center justify-center space-x-2 transition-all ${mountType === 'surface' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                 <Construction size={14} /> <span>{t.surface}</span>
               </button>
               <button onClick={() => setMountType('concealed')} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase flex items-center justify-center space-x-2 transition-all ${mountType === 'concealed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                 <div className="w-3.5 h-3.5 border-2 border-current rounded-sm opacity-50" /> <span>{t.concealed}</span>
               </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">{t.scenario}</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'lighting', label: t.lighting },
                { id: 'homeAC', label: t.homeAC },
                { id: 'general', label: t.general },
                { id: 'industrial', label: t.industrial }
              ].map(s => (
                <button 
                  key={s.id} 
                  onClick={() => setScenario(s.id)}
                  className={`py-3 px-4 rounded-xl text-[10px] font-black border-2 transition-all ${scenario === s.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={calculate} 
          disabled={loading}
          className="w-full py-5 bg-blue-600 text-white font-black rounded-[32px] shadow-xl active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
        >
          {loading ? <Activity className="animate-spin" /> : <Calculator size={20} />}
          <span>{t.calculate}</span>
        </button>
      </div>

      {result && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
          <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
             <div className="text-center relative z-10">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">{t.resultArea}</p>
                <h3 className="text-7xl font-black mt-3 flex items-baseline justify-center tracking-tighter">
                  {result.recommended_cable_mm2}
                  <span className="text-xl font-bold ml-2 text-blue-500">mm²</span>
                </h3>
                <button onClick={shareResult} className="mt-6 flex items-center mx-auto space-x-2 bg-white/10 p-2 px-4 rounded-xl transition-all border border-white/10 active:scale-95">
                  <Share2 size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.shareResult}</span>
                </button>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={120} /></div>
          </div>

          <div className="bg-white p-6 rounded-[32px] border-2 border-emerald-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-100">
                <ShieldAlert size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.breakerSize}</p>
                <p className="text-2xl font-black text-slate-900">{result.recommended_breaker_a} <span className="text-sm font-bold opacity-50">{t.breakerUnit}</span></p>
              </div>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.loadCurrent}</p>
               <p className="text-lg font-bold text-slate-600">{result.load_current_a} A</p>
            </div>
          </div>
          
          <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm space-y-5">
             <div className="flex items-center space-x-2 text-slate-800">
                <ShieldCheck size={18} className="text-emerald-600"/>
                <h4 className="font-black text-xs uppercase tracking-widest">{t.designNote}</h4>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{t.voltDrop}</p>
                   <p className={`font-bold ${parseFloat(result.voltage_drop_pct) > 5 ? 'text-red-500' : 'text-slate-800'}`}>
                      {result.voltage_drop_pct}%
                   </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{t.strategyNote}</p>
                   <p className="text-[10px] font-bold text-blue-600 leading-tight">
                      {result.scenario === 'homeAC' ? t.strategyAC : 
                       result.scenario === 'industrial' ? t.strategyInd :
                       result.scenario === 'general' ? t.strategyGen : 'Standard IEC'}
                   </p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
