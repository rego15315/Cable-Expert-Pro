
import React from 'react';
import { Home, Settings, Sparkles, Briefcase } from 'lucide-react';
import { useTranslation } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'tools' | 'profile';
  onTabChange: (tab: 'home' | 'tools' | 'profile') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-slate-50 relative pb-24 selection:bg-blue-100">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
      
      <main className="px-5 relative z-10">
        {children}
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto px-6 pb-6 pointer-events-none z-50">
        <nav className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-[32px] px-8 py-4 flex justify-between items-center pointer-events-auto">
          <button 
            onClick={() => onTabChange('home')} 
            className={`flex flex-col items-center space-y-1.5 transition-all duration-300 ${activeTab === 'home' ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className="text-[10px] font-black uppercase tracking-tighter">{t.home}</span>
          </button>
          
          <button 
            onClick={() => onTabChange('tools')} 
            className={`flex flex-col items-center space-y-1.5 transition-all duration-300 ${activeTab === 'tools' ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Briefcase size={22} strokeWidth={activeTab === 'tools' ? 2.5 : 2} />
            <span className="text-[10px] font-black uppercase tracking-tighter">{t.toolbox}</span>
          </button>
          
          <button 
            onClick={() => onTabChange('profile')} 
            className={`flex flex-col items-center space-y-1.5 transition-all duration-300 ${activeTab === 'profile' ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Settings size={22} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <span className="text-[10px] font-black uppercase tracking-tighter">{t.profile}</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
