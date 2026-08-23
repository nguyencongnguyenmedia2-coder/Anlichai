import React, { useState } from 'react';
import { Calendar, Compass, Bot, Settings, Moon, Sun, Sparkles, ShieldCheck, Star, CalendarCheck } from 'lucide-react';
import { AppSettings } from '../types';
import logoImg from '../assets/logo.png';

interface HeaderProps {
  activeTab: 'calendar' | 'events' | 'personal' | 'ai' | 'settings';
  setActiveTab: (tab: 'calendar' | 'events' | 'personal' | 'ai' | 'settings') => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onJumpToToday: () => void;
  onOpenHoroscope: () => void;
  currentDate: Date;
  isAdminMode: boolean;
  onOpenAdminLogin: () => void;
  onExitAdminMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onUpdateSettings,
  onJumpToToday,
  onOpenHoroscope,
  isAdminMode,
  onOpenAdminLogin,
  onExitAdminMode,
}) => {
  const [logoClickCount, setLogoClickCount] = useState(0);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'oriental' : 'dark';
    onUpdateSettings({ ...settings, theme: nextTheme });
  };

  // Secret 5-tap on logo triggers Admin PIN prompt
  const handleLogoSecretClick = () => {
    setActiveTab('calendar');
    const newCount = logoClickCount + 1;
    if (newCount >= 5) {
      onOpenAdminLogin();
      setLogoClickCount(0);
    } else {
      setLogoClickCount(newCount);
      setTimeout(() => setLogoClickCount(0), 3000);
    }
  };

  return (
    <>
      {/* Top Glassmorphism Navbar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-amber-50/95 dark:bg-oriental-dark-card/95 border-b border-amber-200/80 dark:border-oriental-dark-border shadow-2xs transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-13 sm:h-16">
            
            {/* Logo & Brand Title */}
            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer select-none group shrink-0" 
              onClick={handleLogoSecretClick}
              title="An Lịch AI - Xem ngày • Hiểu mình • Sống an"
            >
              <img 
                src={logoImg} 
                alt="An Lịch AI Logo" 
                className="w-8 h-8 sm:w-11 sm:h-11 rounded-full object-cover shadow-md border-2 border-oriental-gold-400 group-hover:scale-105 transition-all shrink-0" 
              />
              <div className="flex flex-col">
                <h1 className="font-serif font-black text-sm sm:text-xl text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide leading-tight">
                  AN LỊCH AI
                </h1>
                <p className="hidden sm:block text-[10px] sm:text-[11px] text-amber-900/70 dark:text-amber-200/60 font-sans font-medium tracking-wide mt-0.5">
                  Xem ngày • Hiểu mình • Sống an
                </p>
              </div>
            </div>

            {/* Desktop Center Navigation Menu Capsule */}
            <nav className="hidden md:flex items-center space-x-1 bg-amber-100/60 dark:bg-oriental-dark-bg/80 p-1.5 rounded-2xl border border-amber-200/70 dark:border-oriental-dark-border shadow-2xs">
              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                  activeTab === 'calendar'
                    ? 'bg-gradient-to-r from-oriental-red-800 to-oriental-red-900 text-oriental-gold-300 shadow-oriental border border-oriental-gold-500/40 scale-[1.02]'
                    : 'text-slate-700 dark:text-amber-200/80 hover:bg-amber-200/60 dark:hover:bg-amber-900/40'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Lịch Tháng</span>
              </button>

              <button
                onClick={() => setActiveTab('personal')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                  activeTab === 'personal'
                    ? 'bg-gradient-to-r from-oriental-red-800 to-oriental-red-900 text-oriental-gold-300 shadow-oriental border border-oriental-gold-500/40 scale-[1.02]'
                    : 'text-slate-700 dark:text-amber-200/80 hover:bg-amber-200/60 dark:hover:bg-amber-900/40'
                }`}
              >
                <CalendarCheck className="w-4 h-4 text-oriental-gold-400" />
                <span>Lịch Cá Nhân</span>
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                  activeTab === 'events'
                    ? 'bg-gradient-to-r from-oriental-red-800 to-oriental-red-900 text-oriental-gold-300 shadow-oriental border border-oriental-gold-500/40 scale-[1.02]'
                    : 'text-slate-700 dark:text-amber-200/80 hover:bg-amber-200/60 dark:hover:bg-amber-900/40'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Lễ Hội & Sự Kiện</span>
              </button>

              <button
                onClick={() => setActiveTab('ai')}
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                  activeTab === 'ai'
                    ? 'bg-gradient-to-r from-oriental-red-800 to-oriental-red-900 text-oriental-gold-300 shadow-oriental border border-oriental-gold-500/40 scale-[1.02]'
                    : 'text-slate-700 dark:text-amber-200/80 hover:bg-amber-200/60 dark:hover:bg-amber-900/40'
                }`}
              >
                <Bot className="w-4 h-4 text-oriental-gold-400 animate-pulse" />
                <span>Trợ Lý AI</span>
              </button>

              {isAdminMode && (
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                    activeTab === 'settings'
                      ? 'bg-gradient-to-r from-oriental-red-800 to-oriental-red-900 text-oriental-gold-300 shadow-oriental border border-oriental-gold-500/40 scale-[1.02]'
                      : 'text-slate-700 dark:text-amber-200/80 hover:bg-amber-200/60 dark:hover:bg-amber-900/40'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Cài Đặt</span>
                </button>
              )}
            </nav>

            {/* Right Action Tools (Responsive & Clean on Mobile) */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              
              {/* Zodiac Horoscope Button */}
              <button
                onClick={onOpenHoroscope}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] sm:text-xs font-extrabold rounded-full bg-gradient-to-r from-amber-500 to-oriental-gold-500 text-oriental-red-950 hover:brightness-105 transition-all shadow-gold-glow border border-amber-300 active:scale-95 shrink-0"
                title="Xem tử vi hàng ngày 12 con giáp"
              >
                <Star className="w-3.5 h-3.5 fill-current shrink-0" />
                <span>Tử Vi</span>
              </button>

              {/* Today Jump Button */}
              <button
                onClick={onJumpToToday}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] sm:text-xs font-bold rounded-full bg-amber-200/90 dark:bg-amber-900/60 text-oriental-red-900 dark:text-oriental-gold-300 border border-oriental-gold-500/40 hover:bg-amber-300 transition-colors shadow-2xs active:scale-95 shrink-0"
                title="Về ngày hôm nay"
              >
                <Sparkles className="w-3.5 h-3.5 text-oriental-gold-600 dark:text-oriental-gold-400 shrink-0" />
                <span>Hôm Nay</span>
              </button>

              {isAdminMode && (
                <button
                  onClick={onExitAdminMode}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-amber-500 text-oriental-red-950 border border-amber-300 shadow-gold-glow"
                  title="Thoát chế độ Admin"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              )}

              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-full text-amber-800 dark:text-oriental-gold-400 hover:bg-amber-200/60 transition-colors active:scale-95 shrink-0"
                title="Chuyển chế độ sáng/tối"
              >
                {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Floating Bottom Navigation Bar for Mobile (< 768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-amber-50/98 dark:bg-oriental-dark-card/98 backdrop-blur-xl border-t border-amber-200/90 dark:border-oriental-dark-border px-2 py-1.5 shadow-2xl pb-safe">
        <div className="flex items-center justify-around max-w-md mx-auto">
          
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-95 ${
              activeTab === 'calendar'
                ? 'text-oriental-gold-300 bg-oriental-red-800 font-bold shadow-oriental scale-105 border border-oriental-gold-500/30'
                : 'text-slate-600 dark:text-amber-200/70 hover:text-oriental-red-800'
            }`}
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-none">Lịch Tháng</span>
          </button>

          <button
            onClick={() => setActiveTab('personal')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-95 ${
              activeTab === 'personal'
                ? 'text-oriental-gold-300 bg-oriental-red-800 font-bold shadow-oriental scale-105 border border-oriental-gold-500/30'
                : 'text-slate-600 dark:text-amber-200/70 hover:text-oriental-red-800'
            }`}
          >
            <CalendarCheck className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-none">Cá Nhân</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-95 ${
              activeTab === 'events'
                ? 'text-oriental-gold-300 bg-oriental-red-800 font-bold shadow-oriental scale-105 border border-oriental-gold-500/30'
                : 'text-slate-600 dark:text-amber-200/70 hover:text-oriental-red-800'
            }`}
          >
            <Compass className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-none">Lễ Hội</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative active:scale-95 ${
              activeTab === 'ai'
                ? 'text-oriental-gold-300 bg-oriental-red-800 font-bold shadow-oriental scale-105 border border-oriental-gold-500/30'
                : 'text-slate-600 dark:text-amber-200/70 hover:text-oriental-red-800'
            }`}
          >
            <Bot className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-none">Trợ Lý AI</span>
          </button>

          {isAdminMode && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-95 ${
                activeTab === 'settings'
                  ? 'text-oriental-gold-300 bg-oriental-red-800 font-bold shadow-oriental scale-105 border border-oriental-gold-500/30'
                  : 'text-slate-600 dark:text-amber-200/70 hover:text-oriental-red-800'
              }`}
            >
              <Settings className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] leading-none">Cài Đặt</span>
            </button>
          )}

        </div>
      </div>
    </>
  );
};
