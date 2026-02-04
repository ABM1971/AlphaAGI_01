import React, { useState } from 'react';
import { FileText, Settings, Github, Menu, X, Database, Activity, Sun, Moon } from 'lucide-react';
import { Language } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: any;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

// Custom Icons for Socials
const DiscordIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="transform transition-transform hover:scale-110">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/>
  </svg>
);

const WeChatIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="transform transition-transform hover:scale-110">
    <path d="M8 15.5c4.418 0 8-2.91 8-6.5S12.418 2.5 8 2.5 0 5.41 0 9c0 1.983 1.09 3.754 2.806 4.957.142.098.318.293.24.575l-.545 2.18c-.04.16.14.267.262.155l2.422-2.222c.164-.15.42-.196.634-.13C6.516 15.08 7.234 15.5 8 15.5z"/>
    <path d="M16.5 14.5c0-2.822-2.735-5.143-6.195-5.45C10.635 12.023 13.926 14.28 17.5 14.28c.602 0 1.185-.058 1.745-.164.195-.037.423.01.554.128l1.928 1.747c.1.09.24.004.21-.124l-.434-1.713c-.06-.242.096-.454.237-.563C23.235 12.636 24 11.238 24 9.714c0-2.643-2.686-4.786-6-4.786-.297 0-.588.017-.874.05C16.8 5.79 16.5 7.02 16.5 8.357v6.143z"/>
  </svg>
);

const HuggingFaceIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="transform transition-transform hover:scale-110">
    <path d="M2.8 19.35c.95 1.55 2.52 2.76 4.3 3.32 2.37.74 4.95.2 6.94-1.46.2-.17.37-.35.53-.54.67.76 1.5 1.34 2.44 1.66 1.7.58 3.56.32 5.06-.7 1.5-.98 2.5-2.58 2.75-4.37.12-.88.02-1.78-.28-2.6-.07-.2-.16-.4-.27-.58-.1-.17-.23-.32-.36-.47.6-1.5.7-3.15.28-4.73-.55-2.08-2.22-3.7-4.28-4.14-1.2-.26-2.45-.1-3.56.45-.3.14-.57.32-.82.52-.45-.48-.96-.9-1.5-1.22-1.63-.94-3.6-1.02-5.3-.2-1.7.8-2.9 2.4-3.2 4.26-.05.35-.06.7-.03 1.06-.32.4-.6.85-.82 1.33-.6 1.3-.7 2.76-.28 4.12.3 1 .86 1.9 1.6 2.6.26.25.55.46.86.63-.3.42-.56.88-.74 1.36-.18.48-.28.98-.3 1.5-.02.5.06 1 .23 1.48zm12.3-5.3c.7.25 1.5.06 2-.47.5-.53.53-1.34.08-1.9-.46-.57-1.3-.7-1.9-.3-.6.4-.73 1.22-.38 1.83.06.1.13.2.2.27v.57zm-9.1-3.2c-.37.6-.26 1.4.26 1.9.52.5 1.33.52 1.87.05.54-.47.6-1.28.14-1.85-.46-.56-1.28-.6-1.83-.24-.16.1-.3.24-.43.4zm1.9 8.2c.45.47 1.18.5 1.66.07.5-.44.52-1.2.06-1.67-.47-.48-1.2-.5-1.68-.05-.48.44-.5 1.2-.04 1.66zM7.5 7.4c.55.3 1.2.14 1.56-.37.36-.5.2-1.2-.32-1.53-.53-.33-1.2-.17-1.55.33-.35.5-.18 1.18.3 1.57zm8.9-1.57c-.34-.5-.98-.66-1.52-.36-.54.3-.72.97-.4 1.5.32.53.97.7 1.5.4.55-.3.73-.97.4-1.52zM5.1 13.9c.27.56.9.83 1.5.6.6-.23.87-.85.66-1.44-.22-.6-.85-.88-1.45-.66-.6.22-.88.85-.66 1.44H5.1zm12.9-1.5c-.6-.2-1.23.1-1.44.67-.2.58.07 1.2.65 1.43.58.22 1.2-.06 1.42-.64.22-.57-.06-1.2-.64-1.42zM7.7 16c.48.43 1.2.4 1.65-.05.44-.45.42-1.16-.02-1.6-.45-.43-1.17-.4-1.62.05-.44.45-.4 1.16.05 1.6zm8.65-.1c-.46.4-1.2.37-1.6-.1-.4-.46-.35-1.17.1-1.57.45-.4 1.17-.37 1.57.1.4.45.36 1.17-.1 1.57z"/>
  </svg>
);

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, lang, setLang, t, theme, onThemeToggle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWechatQR, setShowWechatQR] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: Activity },
    { id: 'results', label: t.nav.results, icon: FileText },
    { id: 'kg', label: t.nav.kg, icon: Database },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans selection:bg-violet-100 selection:text-violet-900 transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* WeChat QR Modal */}
      {showWechatQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowWechatQR(false)}>
           <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl max-w-sm w-full text-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t.social.wechat_group}</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">{t.social.scan_qr}</p>
              <div className="bg-slate-100 dark:bg-slate-700 w-48 h-48 mx-auto rounded-xl flex items-center justify-center mb-4 border-2 border-dashed border-slate-300 dark:border-slate-600">
                 {/* Placeholder for QR Code */}
                 <span className="text-slate-400 dark:text-slate-500 text-xs">QR Code Placeholder</span>
              </div>
              <button onClick={() => setShowWechatQR(false)} className="px-6 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-slate-600 dark:text-slate-300 font-medium transition-colors">
                {t.common.close}
              </button>
           </div>
        </div>
      )}

      {/* Modern Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-800/60 transform transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] lg:translate-x-0 lg:static lg:inset-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Logo Area */}
          <div className="mb-10 relative">
             {/* Mobile Close Button - Absolute to avoid layout shifting */}
             <button 
               onClick={() => setIsSidebarOpen(false)} 
               className="lg:hidden absolute top-0 right-0 p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
             >
               <X size={20} />
             </button>

            <div className="flex flex-col gap-0.5">
               {/* Organization Logo - Width 100% */}
               <div className="w-full">
                 <img 
                   src="https://agentalpha.top/logo-light.png" 
                   alt="Agent Alpha" 
                   className="w-full h-auto object-contain dark:hidden"
                 />
                 {/* Dark mode logo - reusing same image but inverted for better visibility on dark backgrounds if needed */}
                  <img 
                   src="https://agentalpha.top/logo-light.png" 
                   alt="Agent Alpha" 
                   className="w-full h-auto object-contain hidden dark:block brightness-0 invert"
                 />
               </div>
               
               {/* Product Title Group */}
               <div className="space-y-1 text-center">
                   <h1 className="font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight leading-none">Idea2Paper</h1>
                   <div className="flex items-center justify-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-violet-500"></div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Research Agent
                      </span>
                   </div>
               </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`group flex items-center w-full gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm
                  ${activeTab === item.id 
                    ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 shadow-sm ring-1 ring-violet-100 dark:ring-violet-900' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
              >
                <item.icon size={20} className={`transition-colors ${activeTab === item.id ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                <span>{item.label}</span>
                {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400"></div>}
              </button>
            ))}
          </nav>

          {/* Footer Area */}
          <div className="mt-auto space-y-6">
            
            {/* Language Switcher */}
            <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl flex items-center relative border border-slate-100 dark:border-slate-700">
               <div className={`absolute inset-y-1.5 w-1/2 bg-white dark:bg-slate-600 rounded-lg shadow-sm border border-slate-200 dark:border-slate-500 transition-transform duration-300 ease-out ${lang === 'zh' ? 'translate-x-full' : 'translate-x-0'}`}></div>
               <button onClick={() => setLang('en')} className={`relative z-10 w-1/2 py-1.5 text-xs font-bold text-center transition-colors ${lang === 'en' ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                 English
               </button>
               <button onClick={() => setLang('zh')} className={`relative z-10 w-1/2 py-1.5 text-xs font-bold text-center transition-colors ${lang === 'zh' ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                 中文
               </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-between px-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex gap-4">
                 <button 
                  onClick={() => setShowWechatQR(true)}
                  className="text-slate-400 dark:text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  title="WeChat Group"
                 >
                    <WeChatIcon size={22} />
                 </button>
                 <a 
                  href="https://discord.gg" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                  title="Join Discord"
                 >
                    <DiscordIcon size={22} />
                 </a>
                 <a 
                  href="https://github.com/AgentAlphaAGI/Idea2Paper" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                  title="GitHub Repository"
                 >
                    <Github size={22} />
                 </a>
                 <a 
                  href="https://huggingface.co/datasets/AgentAlphaAGI/Paper-Review-Dataset" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-slate-400 dark:text-slate-500 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                  title="Hugging Face Dataset"
                 >
                    <HuggingFaceIcon size={22} />
                 </a>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center font-medium">
              v0.1.0-alpha • Built with ❤️
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-300 relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 transition-colors duration-300">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 dark:text-slate-300">
            <Menu size={24} />
          </button>
          <span className="font-bold text-slate-800 dark:text-slate-100">Idea2Paper</span>
          <button onClick={onThemeToggle} className="text-slate-600 dark:text-slate-300 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>

        {/* Desktop Theme Toggle - Absolute Top Right */}
        <div className="hidden lg:block absolute top-6 right-8 z-20">
             <button 
                onClick={onThemeToggle} 
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-3 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all hover:scale-110"
                title="Toggle Theme"
             >
                {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
             </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};