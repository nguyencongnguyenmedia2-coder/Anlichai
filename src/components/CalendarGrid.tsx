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
    <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-amber-200/90 dark:border-oriental-dark-border p-2.5 sm:p-6 backdrop-blur-md transition-all">
      
      {/* Month & Year Control Header Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-amber-200/70 dark:border-oriental-dark-border">
        
        {/* Previous / Next Arrows & Month Title */}
        <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center space-x-1 bg-amber-100/70 dark:bg-oriental-dark-bg p-1 rounded-2xl border border-amber-300/60 dark:border-amber-900/40 shadow-2xs">
            <button
              onClick={() => onChangeMonth(-1)}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-oriental-red-800 hover:text-oriental-gold-300 text-amber-900 dark:text-amber-200 transition-all font-bold"
              title="Tháng trước"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => onChangeMonth(1)}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-oriental-red-800 hover:text-oriental-gold-300 text-amber-900 dark:text-amber-200 transition-all font-bold"
              title="Tháng sau"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-3xl font-serif font-black text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide flex items-center gap-1.5 sm:gap-2">
              Tháng {currentMonth + 1} <span className="text-amber-700/60 dark:text-amber-400/50 font-normal">/</span> {currentYear}
            </h2>
            <p className="text-[11px] sm:text-xs text-amber-900/75 dark:text-amber-200/70 font-sans mt-0.5">
              Tháng Âm: <strong>{monthCanChi}</strong> {tietKhi !== 'Không có' ? `• Tiết: ${tietKhi}` : ''}
            </p>
          </div>
        </div>

        {/* Fast Year & Month Dropdown Controls */}
        <div className="flex items-center space-x-2 bg-amber-50/80 dark:bg-oriental-dark-bg/80 p-1.5 rounded-2xl border border-amber-200/80 dark:border-oriental-dark-border shadow-2xs w-full sm:w-auto justify-center">
          <select
            value={currentMonth}
            onChange={(e) => onSetMonthYear(Number(e.target.value), currentYear)}
            className="flex-1 sm:flex-initial px-3 py-1.5 bg-white dark:bg-oriental-dark-card border border-amber-300/70 dark:border-amber-800 rounded-xl font-serif font-bold text-xs sm:text-sm text-oriental-red-900 dark:text-oriental-gold-300 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500 cursor-pointer shadow-2xs"
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
            className="flex-1 sm:flex-initial px-3 py-1.5 bg-white dark:bg-oriental-dark-card border border-amber-300/70 dark:border-amber-800 rounded-xl font-mono font-extrabold text-xs sm:text-sm text-oriental-red-900 dark:text-oriental-gold-300 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500 cursor-pointer shadow-2xs"
          >
            {yearsOptions.map((y) => (
              <option key={y} value={y}>
                Năm {y}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Weekday Banner Headers */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
        {weekdaysDesktop.map((dayFull, idx) => {
          const dayShort = weekdaysMobile[idx];
          const isWeekend = idx === 0 || idx === 6;
          return (
            <div
              key={dayFull}
              className={`py-1.5 sm:py-2 px-0.5 rounded-xl text-[11px] sm:text-xs font-serif font-black tracking-wider shadow-2xs transition-colors ${
                isWeekend
                  ? 'bg-rose-100/90 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-900/50'
                  : 'bg-amber-100/70 dark:bg-oriental-dark-bg text-amber-950 dark:text-amber-200/90 border border-amber-200/60 dark:border-amber-900/40'
              }`}
            >
              <span className="hidden sm:inline">{dayFull}</span>
              <span className="sm:hidden">{dayShort}</span>
            </div>
          );
        })}
      </div>

      {/* 7x6 Date Cells Grid (Compact Mobile Responsive) */}
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

          return (
            <div
              key={index}
              onClick={() => onSelectDate(dayDetail.solarDate)}
              className={`relative min-h-[58px] sm:min-h-[100px] p-1 sm:p-2 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between select-none group border ${
                isSelected
                  ? 'bg-gradient-to-br from-oriental-red-800 via-oriental-red-900 to-oriental-red-950 text-white border-2 border-oriental-gold-400 shadow-oriental scale-[1.04] z-20 ring-2 sm:ring-4 ring-amber-300/40'
                  : isToday
                  ? 'bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 dark:from-oriental-dark-card dark:to-oriental-dark-bg border-2 border-oriental-red-700 shadow-md'
                  : !isCurrentMonthDay
                  ? 'bg-amber-50/30 dark:bg-oriental-dark-bg/40 border-amber-200/40 dark:border-amber-900/20 hover:bg-amber-100/60'
                  : 'bg-white dark:bg-oriental-dark-card border-amber-200/90 dark:border-oriental-dark-border hover:border-oriental-red-600 dark:hover:border-oriental-gold-500 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              
              {/* Top Row: Solar Date & Astrological Badges */}
              <div className="flex items-start justify-between w-full">
                
                {/* Solar Date Number */}
                <span
                  className={`font-serif font-black text-sm sm:text-2xl leading-none tracking-tight ${
                    isSelected
                      ? 'text-oriental-gold-300'
                      : !isCurrentMonthDay
                      ? 'text-slate-500 dark:text-amber-200/70 font-bold'
                      : index % 7 === 0 || index % 7 === 6
                      ? 'text-oriental-red-800 dark:text-rose-400'
                      : 'text-slate-950 dark:text-white'
                  }`}
                >
                  {dayDetail.solarDay}
                </span>

                {/* Astrological Tags (TN, NK, Hoàng Đạo) */}
                <div className="flex items-center space-x-0.5 sm:space-x-1 shrink-0">
                  {dayDetail.isHoangDaoDay && (
                    <span
                      className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full ${isSelected ? 'bg-oriental-gold-300' : 'bg-amber-500 animate-pulse'}`}
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

              {/* Event Pills (Desktop Only) */}
              <div className="my-0.5 space-y-0.5 overflow-hidden hidden sm:block">
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

              {/* Bottom Row: Lunar Date (Clean, No string truncation on Mobile) */}
              <div
                className={`flex items-center justify-between w-full pt-0.5 border-t text-[9px] sm:text-xs ${
                  isSelected
                    ? 'border-oriental-gold-400/40 text-amber-100'
                    : 'border-amber-100 dark:border-amber-900/30 text-slate-800 dark:text-amber-200'
                }`}
              >
                <span
                  className={`font-extrabold ${
                    isSelected
                      ? 'text-oriental-gold-300'
                      : dayDetail.lunarDay === 1 || dayDetail.lunarDay === 15
                      ? 'text-oriental-red-800 dark:text-oriental-gold-400 bg-amber-200/90 dark:bg-oriental-gold-900/60 px-0.5 rounded-xs'
                      : !isCurrentMonthDay
                      ? 'text-slate-500 dark:text-amber-200/70 font-bold'
                      : 'text-slate-800 dark:text-amber-100'
                  }`}
                >
                  {dayDetail.lunarDay === 1
                    ? `${dayDetail.lunarDay}/${dayDetail.lunarMonth}`
                    : dayDetail.lunarDay === 15
                    ? `15/${dayDetail.lunarMonth}`
                    : dayDetail.lunarDay}
                </span>

                {/* Show Can Chi Branch ONLY on Desktop to avoid mobile truncation */}
                <span
                  className={`hidden sm:inline font-sans text-[10px] font-bold truncate max-w-[55px] text-right ${
                    isSelected ? 'text-amber-200' : 'text-slate-600 dark:text-slate-400'
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
