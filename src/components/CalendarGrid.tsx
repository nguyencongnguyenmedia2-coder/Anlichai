import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
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
    <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border-2 border-amber-200/90 dark:border-oriental-dark-border p-3 sm:p-6 backdrop-blur-md transition-all">
      
      {/* Month & Year Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 sm:mb-6 pb-3.5 sm:pb-4 border-b border-amber-200/80 dark:border-oriental-dark-border">
        
        {/* Month Navigation Arrows & Main Title */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-100/90 to-amber-200/80 dark:from-oriental-dark-bg dark:to-amber-950/60 p-1 sm:p-1.5 rounded-2xl border border-oriental-gold-500/40 shadow-2xs">
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
        <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-amber-100/90 dark:from-oriental-dark-bg dark:to-oriental-dark-card p-1.5 sm:p-2 rounded-2xl border border-amber-300/80 dark:border-oriental-dark-border shadow-2xs w-full sm:w-auto justify-center">
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

      {/* Weekday Banner Header Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2.5 text-center">
        {weekdaysDesktop.map((dayFull, idx) => {
          const dayShort = weekdaysMobile[idx];
          const isWeekend = idx === 0 || idx === 6;
          return (
            <div
              key={dayFull}
              className={`py-2 px-0.5 rounded-xl text-[11px] sm:text-xs font-serif font-black tracking-wider shadow-2xs transition-colors ${
                isWeekend
                  ? 'bg-gradient-to-br from-rose-100 via-rose-50 to-rose-100 dark:from-rose-950/70 dark:to-rose-900/50 text-rose-900 dark:text-rose-300 border border-rose-300/80 dark:border-rose-900/60'
                  : 'bg-gradient-to-br from-amber-100/90 via-amber-50 to-amber-100/70 dark:from-oriental-dark-bg dark:to-oriental-dark-card text-amber-950 dark:text-amber-200 border border-amber-200/80 dark:border-amber-900/50'
              }`}
            >
              <span className="hidden sm:inline">{dayFull}</span>
              <span className="sm:hidden">{dayShort}</span>
            </div>
          );
        })}
      </div>

      {/* 7x6 Date Cells Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2.5">
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
              className={`relative min-h-[62px] sm:min-h-[105px] p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between select-none group border ${
                isSelected
                  ? 'bg-gradient-to-br from-oriental-red-800 via-oriental-red-900 to-oriental-red-950 text-white border-2 border-oriental-gold-400 shadow-oriental-lg scale-[1.04] z-20 ring-2 sm:ring-4 ring-oriental-gold-400/40'
                  : isToday
                  ? 'bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 dark:from-oriental-dark-card dark:to-oriental-dark-bg border-2 border-oriental-red-700 dark:border-oriental-gold-500 shadow-md ring-2 ring-amber-400/40'
                  : !isCurrentMonthDay
                  ? 'bg-amber-50/20 dark:bg-oriental-dark-bg/30 border-amber-200/30 dark:border-amber-900/20 hover:bg-amber-100/50 text-opacity-50'
                  : 'bg-white dark:bg-oriental-dark-card border-amber-200/90 dark:border-oriental-dark-border hover:border-oriental-red-600 dark:hover:border-oriental-gold-500 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              
              {/* Today Badge Flag */}
              {isToday && (
                <div className="absolute top-0 right-0 bg-oriental-red-800 text-oriental-gold-300 text-[8px] font-black px-1.5 py-0.2 rounded-bl-lg rounded-tr-xl border-l border-b border-oriental-gold-400/50 z-10 shadow-2xs">
                  HÔM NAY
                </div>
              )}

              {/* Top Row: Solar Date & Astrological Badges */}
              <div className="flex items-start justify-between w-full">
                
                {/* Solar Date Number */}
                <span
                  className={`font-serif font-black text-base sm:text-2xl leading-none tracking-tight ${
                    isSelected
                      ? 'text-oriental-gold-300'
                      : !isCurrentMonthDay
                      ? 'text-slate-400 dark:text-amber-200/40 font-bold'
                      : index % 7 === 0 || index % 7 === 6
                      ? 'text-oriental-red-800 dark:text-rose-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {dayDetail.solarDay}
                </span>

                {/* Astrological Tags (TN, NK, Hoàng Đạo Dot) */}
                <div className="flex items-center space-x-0.5 sm:space-x-1 shrink-0 mt-0.5">
                  {dayDetail.isHoangDaoDay && (
                    <span
                      className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full ${isSelected ? 'bg-oriental-gold-300' : 'bg-emerald-500 animate-pulse'}`}
                      title="Ngày Hoàng Đạo (Tốt)"
                    />
                  )}

                  {dayDetail.isTamNuong && (
                    <span
                      className={`px-0.5 sm:px-1 text-[8px] sm:text-[9px] font-black rounded ${
                        isSelected ? 'bg-amber-300 text-oriental-red-950' : 'bg-rose-700 text-white'
                      }`}
                      title="Ngày Tam Nương"
                    >
                      TN
                    </span>
                  )}

                  {dayDetail.isNguyetKy && (
                    <span
                      className={`px-0.5 sm:px-1 text-[8px] sm:text-[9px] font-black rounded ${
                        isSelected ? 'bg-amber-300 text-oriental-red-950' : 'bg-amber-600 text-white'
                      }`}
                      title="Ngày Nguyệt Kỵ"
                    >
                      NK
                    </span>
                  )}
                </div>

              </div>

              {/* Event Indicators (Pills on Desktop, Dots on Mobile) */}
              <div className="my-1 space-y-0.5 overflow-hidden">
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

                {/* Mobile Event Dots Indicator */}
                {hasEvents && (
                  <div className="sm:hidden flex items-center justify-center space-x-1 my-0.5">
                    {dayFestival && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-2xs" />
                    )}
                    {dayPersonalEvents.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-oriental-red-600 shadow-2xs" />
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Row: Lunar Date & Can Chi Branch */}
              <div
                className={`flex items-center justify-between w-full pt-0.5 border-t text-[10px] sm:text-xs ${
                  isSelected
                    ? 'border-oriental-gold-400/40 text-amber-100'
                    : 'border-amber-200/60 dark:border-amber-900/30 text-slate-800 dark:text-amber-200'
                }`}
              >
                <span
                  className={`font-black ${
                    isSelected
                      ? 'text-oriental-gold-300'
                      : dayDetail.lunarDay === 1 || dayDetail.lunarDay === 15
                      ? 'text-oriental-red-900 dark:text-oriental-gold-400 bg-amber-200/90 dark:bg-oriental-gold-900/70 px-1 rounded-xs font-serif'
                      : !isCurrentMonthDay
                      ? 'text-slate-400 dark:text-amber-200/40 font-bold'
                      : 'text-slate-800 dark:text-amber-100'
                  }`}
                >
                  {dayDetail.lunarDay === 1
                    ? `1/${dayDetail.lunarMonth}`
                    : dayDetail.lunarDay === 15
                    ? `15/${dayDetail.lunarMonth}`
                    : dayDetail.lunarDay}
                </span>

                {/* Can Chi Branch name (Desktop only) */}
                <span
                  className={`hidden sm:inline font-sans text-[10px] font-bold truncate max-w-[55px] text-right ${
                    isSelected ? 'text-amber-200' : 'text-slate-500 dark:text-slate-400'
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
