import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CalendarGrid } from './components/CalendarGrid';
import { DayDetailPanel } from './components/DayDetailPanel';
import { EventsView } from './components/EventsView';
import { PersonalCalendarView } from './components/PersonalCalendarView';
import { AIChatView } from './components/AIChatView';
import { SettingsView } from './components/SettingsView';
import { ThemeBackground } from './components/ThemeBackground';
import { AdminLoginModal } from './components/AdminLoginModal';
import { HoroscopeModal } from './components/HoroscopeModal';
import { SEOContent } from './components/SEOContent';
import { DesktopWidget } from './components/DesktopWidget';
import { AppSettings, DayDetail } from './types';
import { storageService } from './services/storageService';
import { lunarService } from './services/lunarService';
import { notificationService } from './services/notificationService';

import { BlogView } from './components/BlogView';

export const App: React.FC = () => {
  // Tab to Slug mappings
  const TAB_TO_SLUG: Record<string, string> = {
    calendar: 'lich-thang',
    personal: 'lich-ca-nhan',
    events: 'le-hoi-su-kien',
    blog: 'goc-phong-thuy',
    ai: 'tro-ly-ai',
    settings: 'cai-dat'
  };

  const SLUG_TO_TAB: Record<string, 'calendar' | 'events' | 'personal' | 'blog' | 'ai' | 'settings'> = {
    'lich-thang': 'calendar',
    'lich-ca-nhan': 'personal',
    'le-hoi-su-kien': 'events',
    'goc-phong-thuy': 'blog',
    'tro-ly-ai': 'ai',
    'cai-dat': 'settings',
    'tu-vi': 'calendar' // 'tu-vi' opens horoscope modal on calendar tab
  };

  // Helper to parse current URL state
  const parseUrlState = () => {
    const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
    const searchParams = new URLSearchParams(window.location.search);

    let matchedTab: 'calendar' | 'events' | 'personal' | 'blog' | 'ai' | 'settings' = 'calendar';
    let isHoroscope = false;

    if (SLUG_TO_TAB[pathname]) {
      matchedTab = SLUG_TO_TAB[pathname];
      if (pathname === 'tu-vi') {
        isHoroscope = true;
      }
    }

    // Check date param (YYYY-MM-DD)
    const dateParam = searchParams.get('date');
    let parsedDate: Date | null = null;
    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.exec(dateParam)) {
      const parts = dateParam.split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      if (!isNaN(d.getTime())) {
        parsedDate = d;
      }
    }

    return { matchedTab, isHoroscope, parsedDate };
  };

  const initialUrlState = parseUrlState();
  const [activeTab, setActiveTabState] = useState<'calendar' | 'events' | 'personal' | 'blog' | 'ai' | 'settings'>(initialUrlState.matchedTab);
  const [currentDate, setCurrentDate] = useState<Date>(() => initialUrlState.parsedDate || new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => initialUrlState.parsedDate || new Date());
  const [showWidget, setShowWidget] = useState<boolean>(true);
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [selectedDayContext, setSelectedDayContext] = useState<DayDetail | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [horoscopeModalOpen, setHoroscopeModalOpen] = useState<boolean>(initialUrlState.isHoroscope);

  // Sync state to URL bar (slug + query params)
  const syncTabToUrl = (tab: 'calendar' | 'events' | 'personal' | 'blog' | 'ai' | 'settings', isHoroscope = false, dateToSync?: Date) => {
    let slug = TAB_TO_SLUG[tab] || 'lich-thang';
    if (isHoroscope) {
      slug = 'tu-vi';
    }

    const currentPath = window.location.pathname.replace(/^\/+|\/+$/g, '');
    const searchParams = new URLSearchParams(window.location.search);
    
    // Add or remove date param for calendar/horoscope
    const targetDate = dateToSync || selectedDate;
    if (tab === 'calendar' || isHoroscope) {
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      searchParams.set('date', `${year}-${month}-${day}`);
    } else {
      searchParams.delete('date');
    }

    const newQuery = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const newUrl = `/${slug}${newQuery}`;

    if (currentPath !== slug || window.location.search !== newQuery) {
      window.history.pushState({ tab, isHoroscope }, '', newUrl);
    }
  };

  const setActiveTab = (tab: 'calendar' | 'events' | 'personal' | 'blog' | 'ai' | 'settings') => {
    setActiveTabState(tab);
    syncTabToUrl(tab, false);
  };

  // Listen to browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const { matchedTab, isHoroscope, parsedDate } = parseUrlState();
      setActiveTabState(matchedTab);
      setHoroscopeModalOpen(isHoroscope);
      if (parsedDate) {
        setSelectedDate(parsedDate);
        setCurrentDate(new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const events = storageService.getEvents();
  const personalEvents = storageService.getPersonalEvents();

  // Electron IPC Event Listeners (System Tray & Desktop Widget)
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onNavigateTab((tab: any) => {
        if (tab) setActiveTab(tab);
      });
      window.electronAPI.onToggleWidget(() => {
        setShowWidget((prev) => !prev);
      });
    }
  }, []);

  // Apply Dark mode class on root HTML element based on settings
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Request notifications & check events on app launch
  useEffect(() => {
    notificationService.requestPermission().then(() => {
      notificationService.checkAndNotifyTodayEvents();
    });
  }, []);

  // SEO: Update dynamic Document Title based on Active Tab & Horoscope
  useEffect(() => {
    if (horoscopeModalOpen) {
      document.title = 'Tử Vi 12 Con Giáp Hàng Ngày - An Lịch AI';
      return;
    }
    const titles: Record<string, string> = {
      calendar: 'Lịch Âm Dương Việt Nam - Xem Ngày Cát Tường & Giờ Hoàng Đạo | An Lịch AI',
      personal: 'Quản Lý Lịch Cá Nhân - Nhắc Giỗ, Sinh Nhật Âm Lịch | An Lịch AI',
      events: 'Danh Sách Lễ Hội & Ngày Lễ Quốc Gia Việt Nam | An Lịch AI',
      blog: 'Góc Phong Thủy & Cẩm Nang Xem Ngày Tốt Âm Dương | An Lịch AI',
      ai: 'Trợ Lý AI Phong Thủy & Tử Vi 12 Con Giáp | An Lịch AI',
      settings: 'Cài Đặt Ứng Dụng | An Lịch AI'
    };
    document.title = titles[activeTab] || 'An Lịch AI - Xem Ngày Cát Tường • Tử Vi 12 Con Giáp';
  }, [activeTab, horoscopeModalOpen]);



  // SECRET ENTRANCE 1: Direct URL Link check (#admin, ?admin=true, ?mode=admin)
  useEffect(() => {
    const checkAdminUrl = () => {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      if (
        hash === '#admin' ||
        searchParams.get('admin') === 'true' ||
        searchParams.get('admin') === '1' ||
        searchParams.get('mode') === 'admin'
      ) {
        setAdminModalOpen(true);
      }
    };

    checkAdminUrl();
    window.addEventListener('hashchange', checkAdminUrl);
    return () => window.removeEventListener('hashchange', checkAdminUrl);
  }, []);

  // SECRET ENTRANCE 2: Secret Keyboard Shortcut (Ctrl + Shift + A or Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setAdminModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    // Keep month view in 100% perfect sync with selected date
    if (date.getMonth() !== currentDate.getMonth() || date.getFullYear() !== currentDate.getFullYear()) {
      setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
    }
    setSelectedDayContext(lunarService.getDayDetail(date));
    setMobileDetailOpen(true);
    syncTabToUrl(activeTab, horoscopeModalOpen, date);
  };

  const handleChangeMonth = (delta: number) => {
    const newYear = currentDate.getFullYear();
    const newMonth = currentDate.getMonth() + delta;
    const newDate = new Date(newYear, newMonth, 1);
    
    // Determine valid day for the new month
    const daysInNewMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
    const targetDay = Math.min(selectedDate.getDate(), daysInNewMonth);
    const newSelected = new Date(newDate.getFullYear(), newDate.getMonth(), targetDay);

    setCurrentDate(newDate);
    setSelectedDate(newSelected);
    setSelectedDayContext(lunarService.getDayDetail(newSelected));
    syncTabToUrl(activeTab, horoscopeModalOpen, newSelected);
  };

  const handleSetMonthYear = (month: number, year: number) => {
    const newDate = new Date(year, month, 1);
    const daysInNewMonth = new Date(year, month + 1, 0).getDate();
    const targetDay = Math.min(selectedDate.getDate(), daysInNewMonth);
    const newSelected = new Date(year, month, targetDay);

    setCurrentDate(newDate);
    setSelectedDate(newSelected);
    setSelectedDayContext(lunarService.getDayDetail(newSelected));
    syncTabToUrl(activeTab, horoscopeModalOpen, newSelected);
  };

  const handleJumpToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    setSelectedDayContext(lunarService.getDayDetail(today));
    setHoroscopeModalOpen(false);
    setActiveTabState('calendar');
    syncTabToUrl('calendar', false, today);
  };

  const handleOpenHoroscope = () => {
    setHoroscopeModalOpen(true);
    syncTabToUrl('calendar', true, selectedDate);
  };

  const handleCloseHoroscope = () => {
    setHoroscopeModalOpen(false);
    syncTabToUrl(activeTab, false, selectedDate);
  };

  const handleAskAIAboutDate = (dayDetail: DayDetail) => {
    setSelectedDayContext(dayDetail);
    setMobileDetailOpen(false);
    setActiveTab('ai');
  };

  const handleAskAIAboutZodiac = (_zodiacName: string) => {
    setHoroscopeModalOpen(false);
    setSelectedDayContext(currentSelectedDayDetail);
    setActiveTab('ai');
  };

  const currentSelectedDayDetail = lunarService.getDayDetail(selectedDate);

  return (
    <div className="min-h-screen relative font-sans text-slate-800 dark:text-amber-100 selection:bg-oriental-gold-500 selection:text-oriental-red-950 pb-20 md:pb-12">
      
      {/* Background Decorator */}
      <ThemeBackground settings={settings} />

      {/* Main App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onJumpToToday={handleJumpToToday}
        onOpenHoroscope={handleOpenHoroscope}
        currentDate={currentDate}
        isAdminMode={isAdminMode}
        onOpenAdminLogin={() => setAdminModalOpen(true)}
        onExitAdminMode={() => setIsAdminMode(false)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-4 sm:pt-6 relative z-10">
        
        {/* TAB 1: CALENDAR VIEW */}
        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Calendar Month Grid */}
            <div className="lg:col-span-2">
              <CalendarGrid
                currentDate={currentDate}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                onChangeMonth={handleChangeMonth}
                onSetMonthYear={handleSetMonthYear}
              />
            </div>

            {/* Right 1 Column: Selected Day Detail Panel (Desktop) */}
            <div className="hidden lg:block">
              <DayDetailPanel
                dayDetail={currentSelectedDayDetail}
                onAskAIAboutDate={handleAskAIAboutDate}
              />
            </div>

            {/* Mobile Bottom Sheet Drawer for Selected Day Detail */}
            {mobileDetailOpen && (
              <div 
                className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-xs flex flex-col justify-end lg:hidden"
                onClick={() => setMobileDetailOpen(false)}
              >
                <div 
                  className="w-full bg-amber-50/98 dark:bg-oriental-dark-card/98 rounded-t-3xl p-4 pb-24 overflow-y-auto max-h-[88vh] shadow-2xl border-t-2 border-oriental-gold-500/60 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Sticky Top Header with Drag Handle & Close Button */}
                  <div className="sticky -top-4 -mx-4 px-4 pt-3 pb-3 bg-amber-50/95 dark:bg-oriental-dark-card/95 backdrop-blur-md border-b border-amber-200/80 dark:border-oriental-dark-border z-20 flex items-center justify-between mb-4 shadow-2xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">📜</span>
                      <span className="font-serif font-black text-sm text-oriental-red-900 dark:text-oriental-gold-400">
                        Chi Tiết Ngày {currentSelectedDayDetail.solarDay}/{currentSelectedDayDetail.solarMonth}/{currentSelectedDayDetail.solarYear}
                      </span>
                    </div>

                    {/* Big Clear Sticky Close Button */}
                    <button
                      type="button"
                      onClick={() => setMobileDetailOpen(false)}
                      className="px-3 py-1 bg-oriental-red-800 hover:bg-oriental-red-900 text-oriental-gold-300 rounded-full font-bold text-xs shadow-oriental flex items-center gap-1 border border-oriental-gold-500/40"
                    >
                      <span>Đóng</span>
                      <span className="text-sm font-black">✕</span>
                    </button>
                  </div>

                  <DayDetailPanel
                    dayDetail={currentSelectedDayDetail}
                    onAskAIAboutDate={(day) => {
                      setMobileDetailOpen(false);
                      handleAskAIAboutDate(day);
                    }}
                    onCloseMobilePanel={() => setMobileDetailOpen(false)}
                  />
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: PERSONAL CALENDAR VIEW */}
        {activeTab === 'personal' && (
          <PersonalCalendarView />
        )}

        {/* TAB 3: EVENTS FESTIVAL CATALOG VIEW */}
        {activeTab === 'events' && (
          <EventsView
            isAdminMode={isAdminMode}
            onOpenAdminLogin={() => setAdminModalOpen(true)}
          />
        )}

        {/* TAB 4: BLOG SEO ARTICLES VIEW */}
        {activeTab === 'blog' && (
          <BlogView />
        )}

        {/* TAB 4: GEMINI AI CHATBOT ASSISTANT */}
        {activeTab === 'ai' && (
          <AIChatView
            settings={settings}
            onOpenSettings={() => setActiveTab('settings')}
            selectedDayContext={selectedDayContext}
            onClearContext={() => setSelectedDayContext(null)}
          />
        )}

        {/* TAB 5: APP SETTINGS VIEW */}
        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={handleUpdateSettings}
            isAdminMode={isAdminMode}
            onOpenAdminLogin={() => setAdminModalOpen(true)}
            onExitAdminMode={() => setIsAdminMode(false)}
          />
        )}

        {/* SEO Rich Content & FAQ Accordion Section */}
        {activeTab === 'calendar' && <SEOContent />}

      </main>

      {/* Daily Zodiac Horoscope Modal */}
      {horoscopeModalOpen && (
        <HoroscopeModal
          dayDetail={currentSelectedDayDetail}
          onAskAIAboutZodiac={handleAskAIAboutZodiac}
          onClose={handleCloseHoroscope}
        />
      )}

      {/* Admin PIN Login Modal */}
      {adminModalOpen && (
        <AdminLoginModal
          correctPin={settings.adminPin || '123456'}
          onSuccess={() => {
            setIsAdminMode(true);
            setAdminModalOpen(false);
          }}
          onClose={() => setAdminModalOpen(false)}
        />
      )}

      {/* Floating Desktop Widget */}
      {showWidget && (
        <DesktopWidget
          dayDetail={currentSelectedDayDetail}
          events={events}
          personalEvents={personalEvents}
          onOpenMainApp={(tab) => {
            if (tab) setActiveTab(tab);
          }}
          onCloseWidget={() => setShowWidget(false)}
        />
      )}

      {/* Footer Branding Bar */}
      <footer className="mt-8 text-center text-[11px] sm:text-xs text-amber-900/70 dark:text-amber-200/60 py-4 border-t border-amber-200/50 dark:border-oriental-dark-border space-y-1">
        <p className="font-medium">An Lịch AI © 2026 • Xem ngày • Hiểu mình • Sống an</p>
        <p className="text-[10px] sm:text-[11px] text-oriental-red-900/80 dark:text-oriental-gold-400/90 font-semibold">
          Thiết kế & Phát triển: <span className="font-bold">Nguyễn Công Nguyên</span> • SĐT/Zalo: <a href="tel:0934811307" className="underline hover:text-oriental-gold-500">0934811307</a>
        </p>
      </footer>

    </div>
  );
};

export default App;
