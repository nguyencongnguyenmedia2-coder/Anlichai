import React, { useState } from 'react';
import { X, Sparkles, Clock, ShieldCheck, Minimize2, ExternalLink, Bot } from 'lucide-react';
import { DayDetail, EventItem, PersonalEvent } from '../types';

interface DesktopWidgetProps {
  dayDetail: DayDetail;
  events: EventItem[];
  personalEvents: PersonalEvent[];
  onOpenMainApp: (tab?: 'calendar' | 'events' | 'personal' | 'ai') => void;
  onCloseWidget: () => void;
}

export const DesktopWidget: React.FC<DesktopWidgetProps> = ({
  dayDetail,
  events,
  personalEvents,
  onOpenMainApp,
  onCloseWidget,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  // Weekday Name
  const weekdaysFull = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const weekdayName = weekdaysFull[dayDetail.solarDate.getDay()];

  // Today Festivals & Personal Events
  const todayFestivals = events.filter((ev) =>
    ev.isLunar
      ? ev.lunarDay === dayDetail.lunarDay && ev.lunarMonth === dayDetail.lunarMonth
      : ev.solarDay === dayDetail.solarDay && ev.solarMonth === dayDetail.solarMonth
  );

  const todayPersonalEvents = personalEvents.filter((pe) =>
    pe.isLunar
      ? pe.day === dayDetail.lunarDay && pe.month === dayDetail.lunarMonth
      : pe.day === dayDetail.solarDay && pe.month === dayDetail.solarMonth
  );

  const primaryEvent = todayFestivals[0]?.name || todayPersonalEvents[0]?.title || 'Không có lễ lớn';
  const bestHour = dayDetail.hoangDaoHours[0] ? `${dayDetail.hoangDaoHours[0].name} (${dayDetail.hoangDaoHours[0].timeRange})` : '15:00 - 17:00 (Giờ Thân)';

  // Calculate day score e.g. 78/100
  const dayScore = dayDetail.isHoangDaoDay ? 88 : dayDetail.isTamNuong || dayDetail.isNguyetKy ? 45 : 78;

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="hidden md:flex fixed bottom-4 right-4 z-50 bg-oriental-red-900 text-oriental-gold-300 p-2.5 rounded-full shadow-2xl border-2 border-oriental-gold-400 cursor-pointer items-center gap-2 hover:scale-105 transition-all select-none"
        title="Bấm để mở rộng Widget An Lịch AI"
      >
        <span className="text-lg">☯</span>
        <span className="font-serif font-black text-xs pr-1">AN LỊCH AI</span>
      </div>
    );
  }

  return (
    <div className="hidden md:block fixed bottom-4 right-4 z-50 w-72 sm:w-80 bg-gradient-to-b from-amber-50/95 via-white/95 to-amber-100/90 dark:from-oriental-dark-card/95 dark:to-oriental-dark-bg/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-amber-300/90 dark:border-oriental-dark-border p-3.5 select-none transition-all">
      
      {/* Widget Header Bar (-webkit-app-region drag for Electron) */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200/80 dark:border-oriental-dark-border cursor-move">
        <div className="flex items-center space-x-1.5">
          <img 
            src="./logo.png" 
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.tried) {
                target.dataset.tried = 'true';
                target.src = 'logo.png';
              }
            }}
            alt="Logo" 
            className="w-6 h-6 rounded-full border border-oriental-gold-400 shadow-2xs object-cover" 
          />
          <span className="font-serif font-black text-xs text-oriental-red-900 dark:text-oriental-gold-400 tracking-wider">
            AN LỊCH AI WIDGET
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-amber-200 hover:bg-amber-200/50"
            title="Thu nhỏ Widget"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onCloseWidget}
            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            title="Tắt Widget"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Dates Card */}
      <div className="bg-gradient-to-r from-oriental-red-900 via-oriental-red-950 to-oriental-red-900 text-oriental-gold-300 p-3 rounded-xl border border-oriental-gold-400/40 shadow-oriental text-center mb-2.5">
        <h4 className="font-serif font-extrabold text-sm sm:text-base text-white">
          {weekdayName}, {dayDetail.solarDay}/{dayDetail.solarMonth}/{dayDetail.solarYear}
        </h4>
        <p className="text-xs font-semibold text-oriental-gold-200 mt-0.5">
          Âm lịch: Mùng {dayDetail.lunarDay}/{dayDetail.lunarMonthName} ({dayDetail.canChiDay})
        </p>
      </div>

      {/* Day Rating Score */}
      <div className="bg-emerald-50/80 dark:bg-emerald-950/30 p-2 rounded-xl border border-emerald-200 dark:border-emerald-900/40 text-xs flex items-center justify-between mb-2">
        <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          {dayDetail.isHoangDaoDay ? '🟢 Ngày Tốt (Hoàng Đạo)' : dayDetail.isTamNuong ? '🔴 Ngày Xấu (Tam Nương)' : '🟡 Ngày Khá Tốt'}
        </span>
        <span className="font-mono font-black text-xs px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300">
          {dayScore}/100
        </span>
      </div>

      {/* Details List */}
      <div className="space-y-1 text-[11px] mb-3">
        <div className="flex items-center justify-between bg-amber-50/60 dark:bg-oriental-dark-bg/60 p-2 rounded-lg border border-amber-200/50">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Giờ Đẹp:
          </span>
          <span className="font-bold text-amber-950 dark:text-amber-100 truncate max-w-[170px] text-right">
            {bestHour}
          </span>
        </div>

        <div className="flex items-center justify-between bg-amber-50/60 dark:bg-oriental-dark-bg/60 p-2 rounded-lg border border-amber-200/50">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-oriental-gold-500" /> Lễ Hôm Nay:
          </span>
          <span className="font-bold text-oriental-red-900 dark:text-oriental-gold-300 truncate max-w-[170px] text-right">
            {primaryEvent}
          </span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-amber-200/60 dark:border-oriental-dark-border">
        <button
          type="button"
          onClick={() => onOpenMainApp('calendar')}
          className="py-1.5 px-2 bg-amber-200/70 dark:bg-amber-900/50 hover:bg-amber-300 text-oriental-red-900 dark:text-oriental-gold-300 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 border border-amber-300/60 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Mở Ứng Dụng</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenMainApp('ai')}
          className="py-1.5 px-2 bg-oriental-red-800 hover:bg-oriental-red-900 text-oriental-gold-300 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 shadow-oriental transition-colors border border-oriental-gold-500/30"
        >
          <Bot className="w-3.5 h-3.5 text-oriental-gold-400" />
          <span>Hỏi AI Luận</span>
        </button>
      </div>

    </div>
  );
};
