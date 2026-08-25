import React, { useState } from 'react';
import { X, Sparkles, Star, Heart, Briefcase, Coins, Bot, Activity, ShieldCheck, Clock } from 'lucide-react';
import { DayDetail } from '../types';
import { lunarService, ZODIAC_ANIMALS } from '../services/lunarService';

interface HoroscopeModalProps {
  dayDetail: DayDetail;
  onAskAIAboutZodiac: (zodiacName: string) => void;
  onClose: () => void;
}

export const HoroscopeModal: React.FC<HoroscopeModalProps> = ({
  dayDetail,
  onAskAIAboutZodiac,
  onClose,
}) => {
  const [selectedZodiacIdx, setSelectedZodiacIdx] = useState<number>(0);

  const currentZodiacConfig = ZODIAC_ANIMALS[selectedZodiacIdx % 12];
  const horoscope = lunarService.getZodiacHoroscope(selectedZodiacIdx, dayDetail.solarDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs">
      <div className="bg-white dark:bg-oriental-dark-card rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-amber-200/90 dark:border-oriental-dark-border relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/40 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center space-x-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-oriental-red-800 to-oriental-red-950 text-oriental-gold-300 flex items-center justify-center shadow-oriental text-xl shrink-0 border border-oriental-gold-400">
            🔮
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-black text-oriental-red-900 dark:text-oriental-gold-400 leading-tight">
              Tử Vi 12 Con Giáp Hàng Ngày
            </h3>
            <p className="text-[11px] sm:text-xs text-amber-900/70 dark:text-amber-200/60 font-sans">
              Ngày {dayDetail.solarDay}/{dayDetail.solarMonth}/{dayDetail.solarYear} (Âm {dayDetail.lunarDay}/{dayDetail.lunarMonth} - {dayDetail.canChiDay})
            </p>
          </div>
        </div>

        {/* 12 Zodiac Animals Responsive Grid Layout (4 cols on Mobile, 6 cols on PC) */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 mb-4 border-b border-amber-200/60 dark:border-oriental-dark-border pb-3">
          {ZODIAC_ANIMALS.map((z, idx) => (
            <button
              key={z.branch}
              type="button"
              onClick={() => setSelectedZodiacIdx(idx)}
              className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                selectedZodiacIdx === idx
                  ? 'bg-gradient-to-r from-oriental-red-800 to-oriental-red-900 text-oriental-gold-300 shadow-oriental border border-oriental-gold-500/40 scale-[1.02]'
                  : 'bg-amber-100/60 dark:bg-oriental-dark-bg text-slate-700 dark:text-amber-200/80 hover:bg-amber-200 border border-amber-200/40'
              }`}
            >
              <span className="text-sm">{z.icon}</span>
              <span className="truncate">{z.branch}</span>
            </button>
          ))}
        </div>

        {/* Selected Zodiac Details Content */}
        <div className="space-y-3.5 text-xs sm:text-sm">
          
          {/* Header Summary Pill */}
          <div className="bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/70 dark:from-oriental-dark-bg dark:to-oriental-dark-card p-3.5 rounded-2xl border border-amber-300/70 dark:border-amber-800 flex items-center justify-between shadow-2xs">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{currentZodiacConfig.icon}</span>
              <div>
                <h4 className="font-serif font-extrabold text-base sm:text-lg text-oriental-red-900 dark:text-oriental-gold-400">
                  {horoscope.zodiacName}
                </h4>
                <p className="text-[11px] text-amber-900/80 dark:text-amber-200/70 font-medium">
                  Ngũ Hành: <strong>{horoscope.element}</strong> • Địa Chi: <strong>{horoscope.earthlyBranch}</strong>
                </p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center space-x-1 text-oriental-gold-500 bg-white/70 dark:bg-oriental-dark-card px-2.5 py-1 rounded-xl border border-amber-300/50">
              {Array.from({ length: horoscope.ratingScore }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
          </div>

          {/* Overview */}
          <div className="bg-amber-50/70 dark:bg-oriental-dark-bg/70 p-3 rounded-xl border border-amber-200/60 leading-relaxed">
            <span className="font-serif font-bold text-xs text-oriental-red-900 dark:text-oriental-gold-400 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              🔮 Vận Trình Tổng Quan
            </span>
            <p className="text-xs text-slate-700 dark:text-amber-200/90 leading-relaxed">
              {horoscope.overview}
            </p>
          </div>

          {/* 4 Aspect Cards Grid (Career, Wealth, Love, Health) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            
            {/* Career */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
              <span className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
                <Briefcase className="w-4 h-4 text-emerald-600" /> Công Danh & Sự Nghiệp
              </span>
              <p className="text-[11px] text-slate-700 dark:text-amber-200/80 leading-relaxed">
                {horoscope.career}
              </p>
            </div>

            {/* Wealth */}
            <div className="bg-amber-50/70 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200 dark:border-amber-900/40">
              <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5 mb-1">
                <Coins className="w-4 h-4 text-amber-600" /> Tài Lộc & Tiền Bạc
              </span>
              <p className="text-[11px] text-slate-700 dark:text-amber-200/80 leading-relaxed">
                {horoscope.wealth}
              </p>
            </div>

            {/* Love */}
            <div className="bg-rose-50/70 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-200 dark:border-rose-900/40">
              <span className="font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1.5 mb-1">
                <Heart className="w-4 h-4 text-rose-600" /> Tình Duyên & Gia Đạo
              </span>
              <p className="text-[11px] text-slate-700 dark:text-amber-200/80 leading-relaxed">
                {horoscope.love}
              </p>
            </div>

            {/* Health */}
            <div className="bg-sky-50/70 dark:bg-sky-950/20 p-3 rounded-xl border border-sky-200 dark:border-sky-900/40">
              <span className="font-bold text-sky-800 dark:text-sky-400 flex items-center gap-1.5 mb-1">
                <Activity className="w-4 h-4 text-sky-600" /> Sức Khỏe & Tĩnh Tâm
              </span>
              <p className="text-[11px] text-slate-700 dark:text-amber-200/80 leading-relaxed">
                {horoscope.health}
              </p>
            </div>

          </div>

          {/* Supporting Zodiac & Auspicious Hours */}
          <div className="bg-amber-50/60 dark:bg-oriental-dark-bg/60 p-3 rounded-xl border border-amber-200/60 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[10px] mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Quý Nhân Phù Trợ
              </span>
              <span className="font-bold text-amber-950 dark:text-amber-100 text-[11px]">
                {horoscope.supportingZodiac}
              </span>
            </div>

            <div>
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[10px] mb-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Giờ Cát Tường
              </span>
              <span className="font-bold text-amber-950 dark:text-amber-100 text-[11px]">
                {horoscope.auspiciousHour}
              </span>
            </div>
          </div>

          {/* Lucky Numbers & Colors Bar */}
          <div className="flex items-center justify-between bg-white dark:bg-oriental-dark-card p-3 rounded-xl border border-amber-200/70 dark:border-oriental-dark-border text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Con Số May Mắn</span>
              <span className="font-bold text-oriental-red-800 dark:text-oriental-gold-300 font-mono text-sm">
                {horoscope.luckyNumbers.join(' • ')}
              </span>
            </div>

            <div className="text-right">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Màu Sắc May Mắn</span>
              <span className="font-bold text-slate-800 dark:text-amber-200">
                {horoscope.luckyColors.join(', ')}
              </span>
            </div>
          </div>

        </div>

        {/* Ask AI Action Button */}
        <div className="mt-5 pt-3 border-t border-amber-200/60 dark:border-oriental-dark-border">
          <button
            type="button"
            onClick={() => onAskAIAboutZodiac(horoscope.zodiacName)}
            className="w-full py-2.5 px-4 bg-oriental-red-800 hover:bg-oriental-red-900 text-oriental-gold-300 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-oriental transition-all border border-oriental-gold-500/40"
          >
            <Bot className="w-4 h-4 text-oriental-gold-400 animate-bounce" />
            <span>🔮 Hỏi Trợ Lý AI Luận Tử Vi Chuyên Sâu Tuổi {currentZodiacConfig.branch}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
