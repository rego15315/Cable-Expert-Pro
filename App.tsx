
import React, { useState, createContext, useContext } from 'react';
import { Layout } from './components/Layout';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { CableCalculator } from './components/CableCalculator';
import { AntiFakeCheck } from './components/AntiFakeCheck';
import { MarketBoard } from './components/MarketBoard';
import { Toolbox } from './components/Toolbox';
import { BillCalculator } from './components/BillCalculator';
import { AIAdvisor } from './components/AIAdvisor';
import { translations, Language } from './translations';
// Fix: Import Bot icon from lucide-react to resolve the missing reference on line 59
import { Bot } from 'lucide-react';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: typeof translations.en;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('cn');
  const [activeTab, setActiveTab] = useState<'home' | 'tools' | 'profile'>('home');
  const [currentTool, setCurrentTool] = useState<'none' | 'calc' | 'antifake' | 'market' | 'bill' | 'advisor'>('none');

  const t = translations[lang];

  const handleNavigate = (view: 'calc' | 'antifake' | 'market' | 'bill' | 'advisor') => {
    setCurrentTool(view);
  };

  const renderContent = () => {
    if (currentTool !== 'none') {
      switch (currentTool) {
        case 'calc': return <CableCalculator onBack={() => setCurrentTool('none')} />;
        case 'antifake': return <AntiFakeCheck onBack={() => setCurrentTool('none')} />;
        case 'market': return <MarketBoard onBack={() => setCurrentTool('none')} />;
        case 'bill': return <BillCalculator onBack={() => setCurrentTool('none')} />;
        case 'advisor': return <AIAdvisor onBack={() => setCurrentTool('none')} />;
      }
    }

    switch (activeTab) {
      case 'home':
        return <AnalysisDashboard onNavigate={handleNavigate} />;
      case 'tools':
        return <Toolbox onNavigate={handleNavigate} />;
      case 'profile':
        return (
          <div className="pt-10 text-center space-y-6 px-6 animate-in slide-in-from-bottom duration-500">
             <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 bg-blue-50 rounded-[40px] flex items-center justify-center border-4 border-white shadow-xl shadow-blue-100/50">
                  <Bot size={48} className="text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900">{t.appName}</h2>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Official Pro Edition</p>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6 text-left">
                <div className="space-y-2">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{lang === 'cn' ? '关于系统' : 'System Info'}</h3>
                   <p className="text-sm font-medium text-slate-600 leading-relaxed">
                     {lang === 'cn' 
                       ? 'WireExpert Pro 是一款为电缆工程、电气设计量身定制的专业工具。它遵循国际 IEC 标准，并提供实时市场行情。' 
                       : 'WireExpert Pro is a professional tool tailored for cable engineering and electrical design, following international IEC standards and providing real-time market trends.'}
                   </p>
                </div>
                
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-slate-400">
                   <span className="text-[10px] font-bold uppercase">Version</span>
                   <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">v3.0.0-Official</span>
                </div>
             </div>

             <div className="pt-10 opacity-30">
                <p className="text-[9px] font-black uppercase tracking-[0.4em]">Designed for Performance</p>
             </div>
          </div>
        );
      default:
        return <AnalysisDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <Layout activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab);
        setCurrentTool('none');
      }}>
        {renderContent()}
      </Layout>
    </LanguageContext.Provider>
  );
};

export default App;
