import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayDetail, EventItem, PersonalEvent } from '../types';
import { lunarService } from '../services/lunarService';

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onChangeMonth: (delta: number) => void;
  onSetMonthYear: (month: number, year: number) => void;
  events?: EventItem[];
  personalEvents?: PersonalEvent[];
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  selectedDate,
  onSelectDate,
  onChangeMonth,
  onSetMonthYear,
  events = [],
  personalEvents = [],
}) => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Generate days array for the month view
  const monthDates = lunarService.getMonthDays(currentYear, currentMonth);

  const monthCanChi = lunarService.getDayDetail(new Date(currentYear, currentMonth, 15)).canChiMonth;
  const tietKhi = lunarService.getDayDetail(new Date(currentYear, currentMonth, 15)).tietKhi;

  // Weekday names for Desktop & Mobile
  const weekdaysDesktop = ['CHỦ NHẬT', 'THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY'];
  const weekdaysMobile = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const yearsOptions = Array.from({ length: 201 }, (_, i) => 1900 + i);
  const monthsOptions = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border-2 border-amber-200/90 dark:border-oriental-dark-border p-2.5 sm:p-6 backdrop-blur-md transition-all">
      
      {/* Month & Year Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3.5 sm:mb-6 pb-3 sm:pb-4 border-b border-amber-200/80 dark:border-oriental-dark-border">
        
        {/* Month Navigation Arrows & Main Title */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center space-x-1 bg-amber-100/70 dark:bg-oriental-dark-bg p-1 rounded-2xl border border-oriental-gold-500/40 shadow-2xs">
            <button
              onClick={() => onChangeMonth(-1)}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-oriental-red-800 hover:text-oriental-gold-300 text-amber-950 dark:text-amber-200 transition-all font-bold cursor-pointer active:scale-95"
              title="Tháng trước"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => onChangeMonth(1)}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-oriental-red-800 hover:text-oriental-gold-300 text-amber-950 dark:text-amber-200 transition-all font-bold cursor-pointer active:scale-95"
              title="Tháng sau"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-3xl font-serif font-black text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide flex items-center gap-1.5 sm:gap-2">
              Tháng {currentMonth + 1} <span className="text-amber-600/50 dark:text-amber-400/40 font-normal">/</span> {currentYear}
            </h2>
            <p className="text-[11px] sm:text-xs text-amber-900/80 dark:text-amber-200/70 font-sans mt-0.5 flex items-center gap-1">
              <span>Tháng Âm: <strong>{monthCanChi}</strong></span>
              {tietKhi !== 'Không có' && (
                <span className="bg-amber-200/70 dark:bg-amber-900/60 px-1.5 py-0.2 rounded-md font-medium text-[10px] text-amber-950 dark:text-amber-200 ml-1">
                  Tiết: {tietKhi}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Quick Dropdown Selectors */}
        <div className="flex items-center space-x-2 bg-amber-50 dark:bg-oriental-dark-bg p-1.5 rounded-2xl border border-amber-300/70 dark:border-oriental-dark-border shadow-2xs w-full sm:w-auto justify-center">
          <select
            value={currentMonth}
            onChange={(e) => onSetMonthYear(Number(e.target.value), currentYear)}
            className="flex-1 sm:flex-initial px-3 py-1.5 bg-white dark:bg-oriental-dark-card border border-amber-300 dark:border-amber-800 rounded-xl font-serif font-bold text-xs sm:text-sm text-oriental-red-900 dark:text-oriental-gold-300 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500 cursor-pointer shadow-2xs"
          >
            {monthsOptions.map((m) => (
              <option key={m} value={m}>
                Tháng {m + 1}
              </option>
            ))}
          </select>

          <select
            value={currentYear}
            onChange={(e) => onSetMonthYear(currentMonth, Number(e.target.value))}
            className="flex-1 sm:flex-initial px-3 py-1.5 bg-white dark:bg-oriental-dark-card border border-amber-300 dark:border-amber-800 rounded-xl font-mono font-extrabold text-xs sm:text-sm text-oriental-red-900 dark:text-oriental-gold-300 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500 cursor-pointer shadow-2xs"
          >
            {yearsOptions.map((y) => (
              <option key={y} value={y}>
                Năm {y}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Weekday Header Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
        {weekdaysDesktop.map((dayFull, idx) => {
          const dayShort = weekdaysMobile[idx];
          const isWeekend = idx === 0 || idx === 6;
          return (
            <div
              key={dayFull}
              className={`py-1.5 sm:py-2 px-0.5 rounded-xl text-[11px] sm:text-xs font-serif font-black tracking-wider shadow-2xs transition-colors ${
                isWeekend
                  ? 'bg-rose-100/90 dark:bg-rose-950/70 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60'
                  : 'bg-amber-100/70 dark:bg-oriental-dark-bg text-amber-950 dark:text-amber-200 border border-amber-200/60 dark:border-amber-900/50'
              }`}
            >
              <span className="hidden sm:inline">{dayFull}</span>
              <span className="sm:hidden">{dayShort}</span>
            </div>
          );
        })}
      </div>

      {/* 7x6 Clean Minimalist Date Cells Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {monthDates.map((dateItem: Date, index: number) => {
          const dayDetail: DayDetail = lunarService.getDayDetail(dateItem);
          const isCurrentMonthDay = dayDetail.solarMonth === currentMonth + 1;
          
          const isToday =
            dayDetail.solarDay === new Date().getDate() &&
            dayDetail.solarMonth === new Date().getMonth() + 1 &&
            dayDetail.solarYear === new Date().getFullYear();

          const isSelected =
            selectedDate.getDate() === dayDetail.solarDay &&
            selectedDate.getMonth() + 1 === dayDetail.solarMonth &&
            selectedDate.getFullYear() === dayDetail.solarYear;

          const dayFestival = events.find((ev) =>
            ev.isLunar
              ? ev.lunarDay === dayDetail.lunarDay && ev.lunarMonth === dayDetail.lunarMonth
              : ev.solarDay === dayDetail.solarDay && ev.solarMonth === dayDetail.solarMonth
          );

          const dayPersonalEvents = personalEvents.filter((pe) =>
            pe.isLunar
              ? pe.day === dayDetail.lunarDay && pe.month === dayDetail.lunarMonth
              : pe.day === dayDetail.solarDay && pe.month === dayDetail.solarMonth
          );

          const hasEvents = dayFestival || dayPersonalEvents.length > 0;

          return (
            <div
              key={index}
              onClick={() => onSelectDate(dayDetail.solarDate)}
              className={`relative min-h-[58px] sm:min-h-[96px] p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between select-none group border overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-oriental-red-800 via-oriental-red-900 to-oriental-red-950 text-white border-2 border-oriental-gold-400 shadow-oriental-lg scale-[1.03] z-20 ring-2 sm:ring-4 ring-oriental-gold-400/40'
                  : isToday
                  ? 'bg-amber-100/90 dark:bg-oriental-dark-card border-2 border-oriental-gold-500 shadow-md ring-2 ring-oriental-gold-400/50'
                  : !isCurrentMonthDay
                  ? 'bg-slate-50/40 dark:bg-oriental-dark-bg/20 border-transparent text-slate-300 dark:text-slate-600'
                  : 'bg-white dark:bg-oriental-dark-card border-amber-100 dark:border-oriental-dark-border hover:border-oriental-gold-400 hover:shadow-sm'
              }`}
            >
              
              {/* Top Row: Solar Date & Badges */}
              <div className="flex items-start justify-between w-full">
                
                {/* Solar Date Number - Clean & Large */}
                <div className="flex items-center space-x-1">
                  <span
                    className={`font-serif font-black text-base sm:text-2xl leading-none tracking-tight ${
                      isSelected
                        ? 'text-oriental-gold-300'
                        : !isCurrentMonthDay
                        ? 'text-slate-300 dark:text-slate-600'
                        : isToday
                        ? 'text-oriental-red-900 dark:text-oriental-gold-400'
                        : index % 7 === 0 || index % 7 === 6
                        ? 'text-oriental-red-800 dark:text-rose-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {dayDetail.solarDay}
                  </span>

                  {/* Today Badge Pill (Desktop text badge, Mobile clean star dot) */}
                  {isToday && (
                    <>
                      <span className="hidden sm:inline-block text-[9px] font-extrabold px-1 rounded bg-oriental-red-800 text-oriental-gold-300 border border-oriental-gold-400/50">
                        HÔM NAY
                      </span>
                      <span className="sm:hidden text-[10px] font-black text-oriental-red-700 dark:text-oriental-gold-400 shrink-0">
                        ✦
                      </span>
                    </>
                  )}
                </div>

                {/* Badges: Green Dot for Hoàng Đạo, TN/NK on Desktop only */}
                <div className="flex items-center space-x-0.5 shrink-0">
                  {dayDetail.isHoangDaoDay && (
                    <span
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isSelected ? 'bg-oriental-gold-300' : 'bg-emerald-500'}`}
                      title="Ngày Hoàng Đạo"
                    />
                  )}

                  {/* Desktop Only Badges (Hidden on Mobile to keep grid spacious) */}
                  <div className="hidden sm:flex items-center space-x-0.5">
                    {dayDetail.isTamNuong && (
                      <span
                        className={`px-1 text-[9px] font-black rounded ${
                          isSelected ? 'bg-amber-300 text-oriental-red-950' : 'bg-rose-700 text-white'
                        }`}
                        title="Ngày Tam Nương"
                      >
                        TN
                      </span>
                    )}

                    {dayDetail.isNguyetKy && (
                      <span
                        className={`px-1 text-[9px] font-black rounded ${
                          isSelected ? 'bg-amber-300 text-oriental-red-950' : 'bg-amber-600 text-white'
                        }`}
                        title="Ngày Nguyệt Kỵ"
                      >
                        NK
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Desktop Event Pills / Mobile Event Dots */}
              <div className="my-0.5 space-y-0.5 overflow-hidden">
                {/* Desktop Event Pills */}
                <div className="hidden sm:block space-y-0.5">
                  {dayFestival && (
                    <div
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate text-white shadow-2xs flex items-center gap-1"
                      style={{ backgroundColor: dayFestival.color || '#D97706' }}
                      title={dayFestival.name}
                    >
                      <span>🏮</span>
                      <span className="truncate">{dayFestival.name}</span>
                    </div>
                  )}

                  {dayPersonalEvents.slice(0, 1).map((pe) => (
                    <div
                      key={pe.id}
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate text-white shadow-2xs flex items-center gap-1"
                      style={{ backgroundColor: pe.color || '#991B1B' }}
                      title={pe.title}
                    >
                      <span>📌</span>
                      <span className="truncate">{pe.title}</span>
                    </div>
                  ))}
                </div>

                {/* Mobile Event Dot Indicator */}
                {hasEvents && (
                  <div className="sm:hidden flex items-center justify-center space-x-1">
                    {dayFestival && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                    {dayPersonalEvents.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-oriental-red-600" />}
                  </div>
                )}
              </div>

              {/* Bottom Row: Lunar Date Number */}
              <div className="flex items-center justify-between w-full text-[10px] sm:text-xs">
                <span
                  className={`font-extrabold ${
                    isSelected
                      ? 'text-oriental-gold-300'
                      : dayDetail.lunarDay === 1 || dayDetail.lunarDay === 15
                      ? 'text-oriental-red-900 dark:text-oriental-gold-400 bg-amber-200/90 dark:bg-oriental-gold-900/80 px-1 rounded-xs font-serif font-black'
                      : !isCurrentMonthDay
                      ? 'text-slate-300 dark:text-slate-600'
                      : 'text-slate-600 dark:text-amber-200/80'
                  }`}
                >
                  {dayDetail.lunarDay === 1
                    ? `${dayDetail.lunarDay}/${dayDetail.lunarMonth}`
                    : dayDetail.lunarDay === 15
                    ? `15/${dayDetail.lunarMonth}`
                    : dayDetail.lunarDay}
                </span>

                {/* Can Chi Branch name (Desktop only) */}
                <span
                  className={`hidden sm:inline font-sans text-[10px] font-bold truncate max-w-[55px] text-right ${
                    isSelected ? 'text-amber-200' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {dayDetail.canChiDay.split(' ')[1] || ''}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
