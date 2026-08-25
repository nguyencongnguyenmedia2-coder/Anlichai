import React, { useState } from 'react';
import { Calendar, Compass, Share2, Clock, AlertTriangle, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp, Bot, X } from 'lucide-react';
import { DayDetail, EventItem, PersonalEvent } from '../types';
import { lunarService } from '../services/lunarService';

interface DayDetailPanelProps {
  dayDetail: DayDetail;
  events?: EventItem[];
  personalEvents?: PersonalEvent[];
  onAskAIAboutDate?: (dayDetail: DayDetail) => void;
  onCloseMobilePanel?: () => void;
}

export const DayDetailPanel: React.FC<DayDetailPanelProps> = ({
  dayDetail,
  events = [],
  personalEvents = [],
  onAskAIAboutDate,
  onCloseMobilePanel,
}) => {
  const [showXuatHanhHours, setShowXuatHanhHours] = useState(false);

  const xuatHanhHours = lunarService.getLyThuanPhongXuatHanhHours(dayDetail.solarDate);

  // Weekday Name Full (Thứ Hai, Thứ Ba, ..., Chủ Nhật)
  const weekdaysFull = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const weekdayName = weekdaysFull[dayDetail.solarDate.getDay()];

  // Festivals on this date
  const dayFestivals = events.filter((ev) =>
    ev.isLunar
      ? ev.lunarDay === dayDetail.lunarDay && ev.lunarMonth === dayDetail.lunarMonth
      : ev.solarDay === dayDetail.solarDay && ev.solarMonth === dayDetail.solarMonth
  );

  // Personal Events on this date
  const dayPersonalEvents = personalEvents.filter((pe) =>
    pe.isLunar
      ? pe.day === dayDetail.lunarDay && pe.month === dayDetail.lunarMonth
      : pe.day === dayDetail.solarDay && pe.month === dayDetail.solarMonth
  );

  const handleShare = () => {
    const currentUrl = window.location.href;
    const text = `📜 AN LỊCH AI (${weekdayName}, Ngày ${dayDetail.solarDay}/${dayDetail.solarMonth}/${dayDetail.solarYear})
🗓 Dương Lịch: ${weekdayName}, ${dayDetail.solarDay}/${dayDetail.solarMonth}/${dayDetail.solarYear}
🌙 Âm Lịch: Mùng ${dayDetail.lunarDay} Tháng ${dayDetail.lunarMonthName} (Can Chi: ${dayDetail.canChiDay})
Đánh Giá: ${dayDetail.dayRating}
✨ Nạp Âm: ${dayDetail.napAm} • Trực ${dayDetail.truc}
⏰ 6 Giờ Hoàng Đạo: ${dayDetail.hoangDaoHours.map(h => h.name.replace('Giờ ', '')).join(', ')}
👉 Hướng Xuất Hành: ${dayDetail.xuatHanhDirections.taiThan}, ${dayDetail.xuatHanhDirections.hyThan}
🔗 Xem chi tiết tại: ${currentUrl}`;

    if (navigator.share) {
      navigator.share({
        title: `Lịch Âm Dương ${weekdayName} Ngày ${dayDetail.solarDay}/${dayDetail.solarMonth}`,
        text: text,
        url: currentUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Đã sao chép thông tin kèm đường dẫn chia sẻ vào bộ nhớ tạm! Bạn có thể dán gửi qua Facebook hoặc Zalo.');
    }
  };

  return (
    <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border-2 border-amber-200/90 dark:border-oriental-dark-border p-4 sm:p-5 backdrop-blur-md transition-all space-y-4 relative">
      
      {/* Mobile Close Button */}
      {onCloseMobilePanel && (
        <button
          onClick={onCloseMobilePanel}
          className="md:hidden absolute top-4 right-4 p-2 rounded-full bg-amber-100/90 dark:bg-oriental-dark-bg text-amber-950 dark:text-amber-200 hover:bg-amber-200 cursor-pointer shadow-2xs"
          title="Đóng bảng chi tiết"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Top Header & Day Rating Badge */}
      <div className="flex items-center justify-between border-b border-amber-200/80 dark:border-oriental-dark-border pb-3 pr-8 md:pr-0">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-oriental-red-800 dark:text-oriental-gold-400" />
          <h3 className="text-lg font-serif font-black text-oriental-red-900 dark:text-oriental-gold-400">
            Chi Tiết Ngày
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-2xs border ${
              dayDetail.isHoangDaoDay
                ? 'bg-emerald-600 text-white border-emerald-400'
                : dayDetail.isTamNuong || dayDetail.isNguyetKy
                ? 'bg-rose-700 text-white border-rose-500'
                : 'bg-amber-600 text-white border-amber-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{dayDetail.dayRating}</span>
          </span>

          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/50 text-slate-600 dark:text-amber-300 transition-colors cursor-pointer"
            title="Chia sẻ thông tin ngày"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Royal Hero Dual Date Banner (No Purple Emoji Background) */}
      <div className="bg-gradient-to-br from-oriental-red-800 via-oriental-red-900 to-oriental-red-950 text-oriental-gold-300 p-4 sm:p-5 rounded-2xl border-2 border-oriental-gold-400/60 shadow-oriental relative overflow-hidden">
        
        {/* Top Weekday Pill Badge Header */}
        <div className="text-center mb-3 pb-2 border-b border-oriental-gold-500/30">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-oriental-gold-400/20 text-oriental-gold-300 text-xs sm:text-sm font-serif font-black tracking-widest border border-oriental-gold-400/50 uppercase shadow-2xs">
            ✦ {weekdayName} ✦
          </span>
        </div>

        {/* Dual Date Side-by-Side Grid */}
        <div className="grid grid-cols-2 gap-3 text-center divide-x-2 divide-oriental-gold-500/30 relative z-10">
          
          {/* Solar Date Side */}
          <div className="pr-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-oriental-gold-400/90 block mb-0.5">
              DƯƠNG LỊCH
            </span>
            <span className="text-4xl sm:text-5xl font-serif font-black text-amber-50 block leading-none my-1">
              {dayDetail.solarDay}
            </span>
            <span className="text-xs font-bold text-oriental-gold-200">
              Tháng {dayDetail.solarMonth} / {dayDetail.solarYear}
            </span>
          </div>

          {/* Lunar Date Side */}
          <div className="pl-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-oriental-gold-400/90 block mb-0.5">
              ÂM LỊCH
            </span>
            <span className="text-4xl sm:text-5xl font-serif font-black text-oriental-gold-300 block leading-none my-1">
              {dayDetail.lunarDay}
            </span>
            <span className="text-xs font-bold text-oriental-gold-200 truncate block">
              Tháng {dayDetail.lunarMonthName}
            </span>
          </div>

        </div>

        {/* Full Text Date Sub-Banner */}
        <div className="mt-3 pt-2.5 border-t border-oriental-gold-500/30 text-center">
          <p className="text-[11px] sm:text-xs font-bold text-amber-100/90 tracking-wide">
            {weekdayName}, ngày {dayDetail.solarDay} tháng {dayDetail.solarMonth} năm {dayDetail.solarYear}
          </p>
          <p className="text-[10px] sm:text-[11px] text-oriental-gold-300/80 font-medium">
            (Âm lịch Mùng {dayDetail.lunarDay} tháng {dayDetail.lunarMonthName} • {dayDetail.canChiDay})
          </p>
        </div>

      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/80 dark:from-oriental-dark-bg dark:to-oriental-dark-card p-3 rounded-2xl border border-amber-300/70 dark:border-oriental-dark-border shadow-2xs">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Can Chi Ngày</span>
          <span className="font-serif font-black text-oriental-red-900 dark:text-oriental-gold-300 text-sm">
            {dayDetail.canChiDay}
          </span>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100/80 dark:from-oriental-dark-bg dark:to-oriental-dark-card p-3 rounded-2xl border border-amber-300/70 dark:border-oriental-dark-border shadow-2xs">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Can Chi Tháng</span>
          <span className="font-serif font-black text-oriental-red-900 dark:text-oriental-gold-300 text-sm">
            {dayDetail.canChiMonth}
          </span>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100/80 dark:from-oriental-dark-bg dark:to-oriental-dark-card p-3 rounded-2xl border border-amber-300/70 dark:border-oriental-dark-border shadow-2xs">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Ngũ Hành Nạp Âm</span>
          <span className="font-extrabold text-slate-800 dark:text-amber-100 text-[11px]">
            {dayDetail.napAm}
          </span>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100/80 dark:from-oriental-dark-bg dark:to-oriental-dark-card p-3 rounded-2xl border border-amber-300/70 dark:border-oriental-dark-border shadow-2xs">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Tiết Khí & Trực</span>
          <span className="font-extrabold text-slate-800 dark:text-amber-100 text-[11px]">
            Trực {dayDetail.truc}
          </span>
        </div>

      </div>

      {/* Events & Personal Events List */}
      {(dayFestivals.length > 0 || dayPersonalEvents.length > 0) && (
        <div className="space-y-2 pt-1">
          {dayFestivals.map((ev) => (
            <div
              key={ev.id}
              className="p-2.5 rounded-2xl text-xs font-bold text-white shadow-sm flex items-center justify-between"
              style={{ backgroundColor: ev.color || '#D97706' }}
            >
              <div className="flex items-center space-x-2 truncate">
                <span>🏮</span>
                <span className="truncate">{ev.name}</span>
              </div>
              <span className="text-[10px] bg-black/25 px-2 py-0.5 rounded-lg font-bold shrink-0">
                Lễ Hội
              </span>
            </div>
          ))}

          {dayPersonalEvents.map((pe) => (
            <div
              key={pe.id}
              className="p-2.5 rounded-2xl text-xs font-bold text-white shadow-sm flex items-center justify-between"
              style={{ backgroundColor: pe.color || '#991B1B' }}
            >
              <div className="flex items-center space-x-2 truncate">
                <span>📌</span>
                <span className="truncate">{pe.title}</span>
              </div>
              <span className="text-[10px] bg-black/25 px-2 py-0.5 rounded-lg font-bold shrink-0">
                Lịch Cá Nhân
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 6 Giờ Hoàng Đạo & 6 Giờ Hắc Đạo */}
      <div className="space-y-2.5 pt-1">
        <h4 className="font-serif font-bold text-xs text-oriental-red-900 dark:text-oriental-gold-400 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-500" />
          Khung Giờ Hoàng Đạo & Hắc Đạo
        </h4>

        {/* 6 Giờ Hoàng Đạo */}
        <div className="bg-emerald-50/80 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 text-xs shadow-2xs">
          <span className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 mb-2 text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 6 Giờ Hoàng Đạo (Giờ Tốt):
          </span>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {dayDetail.hoangDaoHours.map((h, i) => (
              <div key={i} className="flex items-center justify-between bg-white/90 dark:bg-oriental-dark-card px-2.5 py-1.5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/40">
                <span className="font-bold text-emerald-900 dark:text-emerald-300">{h.name}</span>
                <span className="font-mono text-slate-600 dark:text-slate-400 text-[10px]">{h.timeRange}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6 Giờ Hắc Đạo */}
        <div className="bg-rose-50/80 dark:bg-rose-950/30 p-3 rounded-2xl border border-rose-200 dark:border-rose-900/50 text-xs shadow-2xs">
          <span className="font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1.5 mb-2 text-[11px]">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> 6 Giờ Hắc Đạo (Giờ Xấu):
          </span>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {dayDetail.hacDaoHours.map((h, i) => (
              <div key={i} className="flex items-center justify-between bg-white/90 dark:bg-oriental-dark-card px-2.5 py-1.5 rounded-xl border border-rose-200/80 dark:border-rose-900/40">
                <span className="font-bold text-rose-900 dark:text-rose-300">{h.name}</span>
                <span className="font-mono text-slate-600 dark:text-slate-400 text-[10px]">{h.timeRange}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Lý Thuần Phong Xuất Hành Hours */}
      <div className="bg-amber-50/80 dark:bg-oriental-dark-bg/80 rounded-2xl border border-amber-300/70 dark:border-oriental-dark-border overflow-hidden shadow-2xs">
        <button
          onClick={() => setShowXuatHanhHours(!showXuatHanhHours)}
          className="w-full p-3 text-left font-bold text-xs text-oriental-red-900 dark:text-oriental-gold-400 flex items-center justify-between cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-500" />
            Giờ Xuất Hành Lý Thuần Phong
          </span>
          {showXuatHanhHours ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showXuatHanhHours && (
          <div className="p-3 pt-0 space-y-2 border-t border-amber-200/60 dark:border-amber-900/40 text-xs">
            {xuatHanhHours.map((xh, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white dark:bg-oriental-dark-card border border-amber-200/70 text-[11px] leading-relaxed shadow-2xs"
              >
                <div className="flex items-center justify-between font-bold text-oriental-red-900 dark:text-oriental-gold-300 mb-0.5">
                  <span>{xh.hourName} ({xh.typeName})</span>
                  <span className="font-mono text-[10px] text-slate-500">{xh.timeRange}</span>
                </div>
                <p className="text-slate-600 dark:text-amber-200/80 text-[10px]">{xh.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ask AI Trigger Button */}
      {onAskAIAboutDate && (
        <button
          type="button"
          onClick={() => onAskAIAboutDate(dayDetail)}
          className="w-full py-3 px-4 bg-gradient-to-br from-oriental-red-800 to-oriental-red-950 hover:from-oriental-red-700 hover:to-oriental-red-900 text-oriental-gold-300 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-oriental transition-all border border-oriental-gold-500/40 cursor-pointer active:scale-98"
        >
          <Bot className="w-4.5 h-4.5 text-oriental-gold-300 animate-bounce" />
          <span>🔮 Hỏi Trợ Lý AI Luận {weekdayName} ({dayDetail.solarDay}/{dayDetail.solarMonth})</span>
        </button>
      )}

    </div>
  );
};
