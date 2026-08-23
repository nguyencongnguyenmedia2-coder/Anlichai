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
    const text = `📜 AN LỊCH AI (Xem ngày • Hiểu mình • Sống an)
🗓 Dương Lịch: ${dayDetail.solarDay}/${dayDetail.solarMonth}/${dayDetail.solarYear}
🌙 Âm Lịch: Mùng ${dayDetail.lunarDay} Tháng ${dayDetail.lunarMonthName} (Can Chi: ${dayDetail.canChiDay})
☯️ Đánh Giá: ${dayDetail.dayRating}
✨ Nạp Âm: ${dayDetail.napAm} • Trực ${dayDetail.truc}
⏰ 6 Giờ Hoàng Đạo: ${dayDetail.hoangDaoHours.map(h => h.name.replace('Giờ ', '')).join(', ')}
👉 Hướng Xuất Hành: ${dayDetail.xuatHanhDirections.taiThan}, ${dayDetail.xuatHanhDirections.hyThan}
Trải nghiệm ứng dụng tại An Lịch AI!`;

    if (navigator.share) {
      navigator.share({
        title: `Lịch Âm Dương Ngày ${dayDetail.solarDay}/${dayDetail.solarMonth}`,
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Đã sao chép thông tin ngày vào bộ nhớ tạm! Bạn có thể dán chia sẻ qua Facebook hoặc Zalo.');
    }
  };

  return (
    <div className="bg-white/90 dark:bg-oriental-dark-card/95 rounded-3xl shadow-xl sm:shadow-2xl border border-amber-200/90 dark:border-oriental-dark-border p-4 sm:p-5 backdrop-blur-md transition-all space-y-4 relative">
      
      {/* Mobile Close Button */}
      {onCloseMobilePanel && (
        <button
          onClick={onCloseMobilePanel}
          className="md:hidden absolute top-4 right-4 p-1.5 rounded-full bg-amber-100/80 dark:bg-oriental-dark-bg text-slate-500 hover:text-slate-700"
          title="Đóng bảng chi tiết"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Top Header & Day Rating Badge */}
      <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-oriental-dark-border pb-3 pr-8 md:pr-0">
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
            className="p-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/40 text-slate-600 dark:text-amber-300 transition-colors"
            title="Chia sẻ thông tin ngày"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Royal Hero Dual Date Banner */}
      <div className="bg-gradient-to-br from-oriental-red-900 via-oriental-red-950 to-oriental-red-900 text-oriental-gold-300 p-4 rounded-2xl border border-oriental-gold-400/50 shadow-oriental relative overflow-hidden">
        
        <div className="absolute right-[-10px] bottom-[-10px] text-oriental-gold-500/10 font-serif font-black text-8xl select-none pointer-events-none">
          ☯
        </div>

        <div className="grid grid-cols-2 gap-3 text-center divide-x divide-oriental-gold-500/30 relative z-10">
          
          {/* Solar Date Side */}
          <div className="pr-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-oriental-gold-400/80 block mb-0.5">
              DƯƠNG LỊCH
            </span>
            <span className="text-4xl sm:text-5xl font-serif font-black text-white block leading-none my-1">
              {dayDetail.solarDay}
            </span>
            <span className="text-xs font-semibold text-oriental-gold-200">
              Tháng {dayDetail.solarMonth} / {dayDetail.solarYear}
            </span>
          </div>

          {/* Lunar Date Side */}
          <div className="pl-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-oriental-gold-400/80 block mb-0.5">
              ÂM LỊCH
            </span>
            <span className="text-4xl sm:text-5xl font-serif font-black text-oriental-gold-300 block leading-none my-1">
              {dayDetail.lunarDay}
            </span>
            <span className="text-xs font-semibold text-oriental-gold-200 truncate block">
              Tháng {dayDetail.lunarMonthName}
            </span>
          </div>

        </div>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        
        <div className="bg-amber-50/60 dark:bg-oriental-dark-bg/70 p-2.5 rounded-xl border border-amber-200/70 dark:border-oriental-dark-border">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">Can Chi Ngày</span>
          <span className="font-serif font-bold text-oriental-red-900 dark:text-oriental-gold-300 text-sm">
            {dayDetail.canChiDay}
          </span>
        </div>

        <div className="bg-amber-50/60 dark:bg-oriental-dark-bg/70 p-2.5 rounded-xl border border-amber-200/70 dark:border-oriental-dark-border">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">Can Chi Tháng</span>
          <span className="font-serif font-bold text-oriental-red-900 dark:text-oriental-gold-300 text-sm">
            {dayDetail.canChiMonth}
          </span>
        </div>

        <div className="bg-amber-50/60 dark:bg-oriental-dark-bg/70 p-2.5 rounded-xl border border-amber-200/70 dark:border-oriental-dark-border">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">Ngũ Hành Nạp Âm</span>
          <span className="font-bold text-slate-800 dark:text-amber-100 text-[11px]">
            {dayDetail.napAm}
          </span>
        </div>

        <div className="bg-amber-50/60 dark:bg-oriental-dark-bg/70 p-2.5 rounded-xl border border-amber-200/70 dark:border-oriental-dark-border">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">Tiết Khí & Trực</span>
          <span className="font-bold text-slate-800 dark:text-amber-100 text-[11px]">
            Trực {dayDetail.truc}
          </span>
        </div>

      </div>

      {/* Events & Personal Events List */}
      {(dayFestivals.length > 0 || dayPersonalEvents.length > 0) && (
        <div className="space-y-1.5 pt-1">
          {dayFestivals.map((ev) => (
            <div
              key={ev.id}
              className="p-2 rounded-xl text-xs font-bold text-white shadow-2xs flex items-center justify-between"
              style={{ backgroundColor: ev.color || '#D97706' }}
            >
              <div className="flex items-center space-x-1.5 truncate">
                <span>🏮</span>
                <span className="truncate">{ev.name}</span>
              </div>
              <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-md font-normal shrink-0">
                Sự kiện
              </span>
            </div>
          ))}

          {dayPersonalEvents.map((pe) => (
            <div
              key={pe.id}
              className="p-2 rounded-xl text-xs font-bold text-white shadow-2xs flex items-center justify-between"
              style={{ backgroundColor: pe.color || '#991B1B' }}
            >
              <div className="flex items-center space-x-1.5 truncate">
                <span>📌</span>
                <span className="truncate">{pe.title}</span>
              </div>
              <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-md font-normal shrink-0">
                Lịch cá nhân
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 6 Giờ Hoàng Đạo & 6 Giờ Hắc Đạo */}
      <div className="space-y-2 pt-1">
        <h4 className="font-serif font-bold text-xs text-oriental-red-900 dark:text-oriental-gold-400 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          Khung Giờ Hoàng Đạo & Hắc Đạo
        </h4>

        {/* 6 Giờ Hoàng Đạo */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/20 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 text-xs">
          <span className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1 mb-1.5 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> 6 Giờ Hoàng Đạo (Giờ Tốt):
          </span>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {dayDetail.hoangDaoHours.map((h, i) => (
              <div key={i} className="flex items-center justify-between bg-white/80 dark:bg-oriental-dark-card px-2 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-900/30">
                <span className="font-bold text-emerald-900 dark:text-emerald-300">{h.name}</span>
                <span className="font-mono text-slate-600 dark:text-slate-400 text-[10px]">{h.timeRange}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6 Giờ Hắc Đạo */}
        <div className="bg-rose-50/70 dark:bg-rose-950/20 p-3 rounded-2xl border border-rose-200 dark:border-rose-900/40 text-xs">
          <span className="font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1 mb-1.5 text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5" /> 6 Giờ Hắc Đạo (Giờ Xấu):
          </span>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {dayDetail.hacDaoHours.map((h, i) => (
              <div key={i} className="flex items-center justify-between bg-white/80 dark:bg-oriental-dark-card px-2 py-1 rounded-lg border border-rose-200/60 dark:border-rose-900/30">
                <span className="font-bold text-rose-900 dark:text-rose-300">{h.name}</span>
                <span className="font-mono text-slate-600 dark:text-slate-400 text-[10px]">{h.timeRange}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Lý Thuần Phong Xuất Hành Hours */}
      <div className="bg-amber-50/60 dark:bg-oriental-dark-bg/60 rounded-2xl border border-amber-200/70 dark:border-oriental-dark-border overflow-hidden">
        <button
          onClick={() => setShowXuatHanhHours(!showXuatHanhHours)}
          className="w-full p-3 text-left font-bold text-xs text-oriental-red-900 dark:text-oriental-gold-400 flex items-center justify-between"
        >
          <span className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-500" />
            Giờ Xuất Hành Lý Thuần Phong
          </span>
          {showXuatHanhHours ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showXuatHanhHours && (
          <div className="p-3 pt-0 space-y-1.5 border-t border-amber-200/40 dark:border-amber-900/30 text-xs">
            {xuatHanhHours.map((xh, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl bg-white dark:bg-oriental-dark-card border border-amber-200/50 text-[11px] leading-relaxed"
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
          className="w-full py-2.5 px-4 bg-oriental-red-800 hover:bg-oriental-red-900 text-oriental-gold-300 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-oriental transition-all border border-oriental-gold-500/40"
        >
          <Bot className="w-4 h-4 text-oriental-gold-400 animate-bounce" />
          <span>🔮 Hỏi Trợ Lý AI Luận Ngày {dayDetail.solarDay}/{dayDetail.solarMonth}</span>
        </button>
      )}

    </div>
  );
};
