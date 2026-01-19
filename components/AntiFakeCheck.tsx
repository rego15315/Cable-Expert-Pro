
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Search, CheckCircle2, AlertTriangle, Coins, TrendingUp, ShieldAlert, Zap, Layers, CircleDot, Type, Ruler, Weight, Info, BarChart3, Scale, Flame, MousePointer2, Thermometer, Fingerprint, ChevronRight } from 'lucide-react';
import { useTranslation } from '../App';

type AuditMode = 'audit' | 'visual';

export const AntiFakeCheck: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<AuditMode>('audit');
  
  // 物理参数 - 移除默认值
  const [strands, setStrands] = useState('');
  const [diameter, setDiameter] = useState('');
  const [length, setLength] = useState('');
  
  // 价格参数
  const [copperPrice, setCopperPrice] = useState('9392'); 
  const [paidPrice, setPaidPrice] = useState(''); 
  
  // 结果状态
  const [result, setResult] = useState<any>(null);
  const [isLivePrice, setIsLivePrice] = useState(false);

  useEffect(() => {
    const getLivePrice = async () => {
      try {
        const res = await fetch('/api/market/price?range=1h');
        // 修复报错：严格检查响应状态和内容类型
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            if (data && data.price) {
              setCopperPrice(data.price.toString());
              setIsLivePrice(true);
            }
          }
        }
      } catch (e) {
        console.error("Failed to sync live price", e);
      }
    };
    getLivePrice();
  }, []);

  const runAudit = () => {
    const n = parseInt(strands);
    const d = parseFloat(diameter);
    const len = parseFloat(length);
    const lmePrice = parseFloat(copperPrice);
    const paid = parseFloat(paidPrice);

    if (isNaN(n) || isNaN(d) || isNaN(len) || isNaN(lmePrice) || isNaN(paid)) {
      if ((window as any).Telegram?.WebApp?.HapticFeedback) {
        (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('error');
      }
      return;
    }

    // 更新算法：丝号*丝号*根数*0.7*长度/100
    const totalCopperWeightKg = (d * d * n * 0.7 * len) / 100;
    
    // 实测截面积 (PI * r^2 * n)
    const actualArea = n * Math.PI * Math.pow(d / 2, 2);
    
    // 裸铜价值核算
    const rawCopperCost = totalCopperWeightKg * (lmePrice / 1000); 
    
    let status: 'safe' | 'suspicious' | 'danger' | 'overpriced' = 'safe';
    
    if (paid < rawCopperCost) {
      status = 'danger';
    } else if (paid < rawCopperCost * 1.15) {
      status = 'suspicious';
    } else if (paid > rawCopperCost * 2.5) {
      status = 'overpriced';
    } else {
      status = 'safe';
    }

    setResult({
      actualArea: actualArea.toFixed(3),
      copperWeight: totalCopperWeightKg.toFixed(2),
      rawCopperCost: rawCopperCost.toFixed(2),
      status,
      ratio: ((rawCopperCost / paid) * 100).toFixed(1),
      markup: (((paid - rawCopperCost) / paid) * 100).toFixed(1)
    });

    if ((window as any).Telegram?.WebApp?.HapticFeedback) {
      (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pt-4 pb-16 px-1">
      <div className="flex items-center space-x-3">
        <button onClick={onBack} className="p-2 bg-white shadow-sm border border-slate-100 rounded-full active:scale-90">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black text-slate-900">{t.verifyTitle}</h2>
      </div>

      <div className="flex bg-slate-200 p-1 rounded-2xl mx-1">
        <button onClick={() => setTab('audit')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${tab === 'audit' ? 'bg-white text-blue-600 shadow-sm scale-[1.02]' : 'text-slate-500'}`}>{t.weightCheck}</button>
        <button onClick={() => setTab('visual')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${tab === 'visual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>{t.visualCheck}</button>
      </div>

      <div className="px-1">
        {tab === 'audit' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Layers size={12} className="mr-1.5 text-blue-500"/> {t.strandCount}</label>
                  <input type="number" placeholder="输入根数" value={strands} onChange={e => setStrands(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl font-black text-slate-800 outline-none border-2 border-transparent focus:border-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Ruler size={12} className="mr-1.5 text-blue-500"/> {t.strandDia}</label>
                  <input type="number" step="0.01" placeholder="输入丝号" value={diameter} onChange={e => setDiameter(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl font-black text-slate-800 outline-none border-2 border-transparent focus:border-blue-500 transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.length}</label>
                <div className="relative">
                  <input type="number" placeholder="输入长度" value={length} onChange={e => setLength(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl font-black text-slate-800 outline-none transition-all" />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-tighter">Meters</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.marketPriceRef}</label>
                    {isLivePrice && <span className="text-[8px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full font-black uppercase">Live</span>}
                  </div>
                  <div className="relative">
                    <TrendingUp size={14} className="absolute left-3 top-4 text-emerald-500" />
                    <input type="number" value={copperPrice} onChange={e => {setCopperPrice(e.target.value); setIsLivePrice(false);}} className="w-full bg-slate-50 p-4 pl-9 rounded-2xl font-bold text-slate-800 text-sm outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.retailPrice}</label>
                  <div className="relative">
                    <Coins size={14} className="absolute left-3 top-4 text-blue-500" />
                    <input type="number" placeholder="实付价格" value={paidPrice} onChange={e => setPaidPrice(e.target.value)} className="w-full bg-slate-50 p-4 pl-9 rounded-2xl font-bold text-slate-800 text-sm outline-none border-2 border-blue-100 transition-all" />
                  </div>
                </div>
              </div>

              <button onClick={runAudit} className="w-full py-5 bg-slate-900 text-white font-black rounded-[32px] shadow-xl active:scale-95 flex items-center justify-center space-x-2">
                <ShieldCheck size={20} className="text-blue-500" /><span>{t.verifyBtn}</span>
              </button>
            </div>

            {result && (
              <div className="space-y-4 animate-in zoom-in duration-300">
                <div className={`p-8 rounded-[40px] shadow-2xl relative overflow-hidden text-white transition-all duration-500 ${
                  result.status === 'safe' ? 'bg-slate-900 border border-slate-800' : 
                  result.status === 'suspicious' ? 'bg-emerald-700' : 
                  result.status === 'overpriced' ? 'bg-indigo-700' : 'bg-red-600'
                }`}>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                       <div>
                         <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">{t.safeStatus}</p>
                         <h3 className="text-2xl font-black mt-1 uppercase tracking-tight">
                            {t[`${result.status}Status` as keyof typeof t]}
                         </h3>
                       </div>
                       <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/5">
                          {result.status === 'safe' ? <BarChart3 size={24} /> : 
                           result.status === 'suspicious' ? <Zap size={24} /> : 
                           result.status === 'overpriced' ? <Coins size={24} /> : <AlertTriangle size={24} />}
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div>
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">
                             <span>铜价值占比 (LME基准)</span>
                             <span>{result.ratio}%</span>
                          </div>
                          <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
                             <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: `${result.ratio}%` }}></div>
                             <div className="h-full bg-white/20" style={{ width: `${100 - result.ratio}%` }}></div>
                          </div>
                          <p className="text-[9px] text-white/40 mt-2 italic">{t.rangeExplain}</p>
                       </div>

                       <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                          <div className="space-y-1">
                             <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">{t.rawCopperCost}</p>
                             <p className="text-2xl font-black">${result.rawCopperCost}</p>
                          </div>
                          <div className="space-y-1 text-right">
                             <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">核算铜重</p>
                             <p className="text-2xl font-black">{result.copperWeight} <span className="text-xs">kg</span></p>
                          </div>
                       </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12"><Scale size={180} /></div>
                </div>

                {result.status === 'danger' && (
                  <div className="bg-red-50 p-6 rounded-[32px] border-2 border-red-100 flex items-start space-x-4">
                    <AlertTriangle className="text-red-600 shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-black text-red-900">{t.dangerStatus}</p>
                      <p className="text-xs text-red-700 mt-1 font-medium leading-relaxed">{t.substandardDesc}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'visual' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 顶部的专业提示卡片 */}
            <div className="bg-blue-600 text-white p-6 rounded-[32px] shadow-lg flex items-center justify-between relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-sm font-black uppercase tracking-widest mb-1">{t.inspectionTitle}</h3>
                 <p className="text-[10px] text-blue-100 font-medium tracking-tight italic">专业级物理特性审计流程</p>
               </div>
               <ShieldCheck size={40} className="relative z-10 opacity-50" />
               <div className="absolute -bottom-4 -right-4 opacity-10"><Zap size={100} /></div>
            </div>

            <div className="space-y-4">
              {[
                { 
                  title: t.copperColorTitle, 
                  desc: t.copperColorDesc, 
                  icon: Thermometer, 
                  color: 'bg-orange-50 text-orange-600',
                  tip: '核心识别点：紫铜色泽与光泽。' 
                },
                { 
                  title: t.flameTestTitle, 
                  desc: t.flameTestDesc, 
                  icon: Flame, 
                  color: 'bg-red-50 text-red-600',
                  tip: '最有效识别 CCA (铜包铝) 的手段。' 
                },
                { 
                  title: t.insulationTitle, 
                  desc: t.insulationDesc, 
                  icon: MousePointer2, 
                  color: 'bg-blue-50 text-blue-600',
                  tip: '辨别原生塑料与劣质回收料。' 
                },
                { 
                  title: t.concentricTitle, 
                  desc: t.concentricDesc, 
                  icon: CircleDot, 
                  color: 'bg-emerald-50 text-emerald-600',
                  tip: '防止薄弱处击穿的安全红线。' 
                },
                { 
                  title: t.markingVerifyTitle, 
                  desc: t.markingVerifyDesc, 
                  icon: Fingerprint, 
                  color: 'bg-indigo-50 text-indigo-600',
                  tip: '品牌溯源与合规性检查。' 
                }
              ].map((item, idx) => (
                <div key={idx} className="group bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]">
                  <div className="flex items-start space-x-4">
                    <div className={`${item.color} p-4 rounded-2xl`}>
                      <item.icon size={24} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.title}</p>
                        <span className="text-[8px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Audit Step {idx + 1}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                      <div className="pt-2 flex items-center text-[9px] font-black text-blue-500 uppercase tracking-widest">
                         <Info size={10} className="mr-1" /> {item.tip}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-100 rounded-[32px] border border-slate-200 border-dashed text-center">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                 结合“价格审计”的核算结果与“外观辨别”的物理特征，即可得出专业的产品质量评估报告。
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
