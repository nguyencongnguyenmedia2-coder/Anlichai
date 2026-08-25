import React from 'react';
import { Sun, Moon, ArrowUpCircle } from 'lucide-react';
import { NatalChartData } from '../../types/astrology';
import { ZODIAC_SIGNS } from '../../services/astrologyEngine';

interface BigThreeCardProps {
  chartData: NatalChartData;
}

export const BigThreeCard: React.FC<BigThreeCardProps> = ({ chartData }) => {
  const { sun, moon, ascendant, profile } = chartData;

  const getSignDetail = (signName: string) => {
    return ZODIAC_SIGNS.find(z => z.sign === signName) || { symbol: '✨', element: 'Fire', modality: 'Cardinal' };
  };

  const sunMeta = getSignDetail(sun.sign);
  const moonMeta = getSignDetail(moon.sign);
  const ascMeta = getSignDetail(ascendant.sign);

  return (
    <div className="bg-gradient-to-br from-oriental-red-900 via-oriental-red-950 to-amber-950 text-oriental-gold-100 rounded-3xl p-5 sm:p-7 shadow-2xl border-2 border-oriental-gold-500/50 relative overflow-hidden">
      
      {/* Background Subtle Shimmer */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-oriental-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-oriental-gold-500/30 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-oriental-gold-400">
            HỒ SƠ BẢN ĐỒ SAO CÁ NHÂN
          </span>
          <h2 className="text-xl sm:text-3xl font-serif font-black text-oriental-gold-300 tracking-wide mt-1">
            {profile.fullName}
          </h2>
          <p className="text-xs text-amber-200/70 mt-1">
            Sinh ngày {profile.birthDate} {profile.unknownTime ? '(Chưa rõ giờ sinh)' : `lúc ${profile.birthTime}`} tại {profile.locationName}, {profile.country}
          </p>
        </div>

        {profile.unknownTime && (
          <div className="mt-3 md:mt-0 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
            ⚠️ <span>Chưa có giờ sinh (Cung Mọc & Nhà mang tính tham khảo)</span>
          </div>
        )}
      </div>

      {/* BIG 3 GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* SUN SIGN */}
        <div className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-oriental-gold-400/30 flex items-center space-x-4 hover:border-oriental-gold-400 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-oriental-red-950 flex items-center justify-center font-extrabold text-2xl shadow-gold-glow shrink-0 group-hover:scale-105 transition-transform">
            ☉
          </div>
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-oriental-gold-400 font-bold uppercase tracking-wider">
              <Sun className="w-3.5 h-3.5" />
              <span>Mặt Trời (Sun)</span>
            </div>
            <div className="text-lg font-serif font-extrabold text-amber-100 flex items-center space-x-2 mt-0.5">
              <span>{sun.sign}</span>
              <span className="text-oriental-gold-400 text-xl">{sunMeta.symbol}</span>
            </div>
            <p className="text-[11px] text-amber-200/80 mt-0.5">
              {sun.degree}°{sun.minute}' • Nhà {sun.house} • {sunMeta.element}
            </p>
          </div>
        </div>

        {/* MOON SIGN */}
        <div className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-oriental-gold-400/30 flex items-center space-x-4 hover:border-oriental-gold-400 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-300 to-indigo-500 text-oriental-red-950 flex items-center justify-center font-extrabold text-2xl shadow-md shrink-0 group-hover:scale-105 transition-transform">
            ☽
          </div>
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-oriental-gold-400 font-bold uppercase tracking-wider">
              <Moon className="w-3.5 h-3.5" />
              <span>Mặt Trăng (Moon)</span>
            </div>
            <div className="text-lg font-serif font-extrabold text-amber-100 flex items-center space-x-2 mt-0.5">
              <span>{moon.sign}</span>
              <span className="text-oriental-gold-400 text-xl">{moonMeta.symbol}</span>
            </div>
            <p className="text-[11px] text-amber-200/80 mt-0.5">
              {moon.degree}°{moon.minute}' • Nhà {moon.house} • {moonMeta.element}
            </p>
          </div>
        </div>

        {/* ASCENDANT SIGN */}
        <div className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-oriental-gold-400/30 flex items-center space-x-4 hover:border-oriental-gold-400 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-oriental-red-950 flex items-center justify-center font-extrabold text-xl shadow-md shrink-0 group-hover:scale-105 transition-transform">
            ASC
          </div>
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-oriental-gold-400 font-bold uppercase tracking-wider">
              <ArrowUpCircle className="w-3.5 h-3.5" />
              <span>Cung Mọc (Ascendant)</span>
            </div>
            <div className="text-lg font-serif font-extrabold text-amber-100 flex items-center space-x-2 mt-0.5">
              <span>{ascendant.sign}</span>
              <span className="text-oriental-gold-400 text-xl">{ascMeta.symbol}</span>
            </div>
            <p className="text-[11px] text-amber-200/80 mt-0.5">
              {ascendant.degree}°{ascendant.minute}' • {ascMeta.element}
            </p>
          </div>
        </div>

      </div>

      {/* RULING PLANET & STELLIUM EXTRA HIGHLIGHTS */}
      <div className="mt-5 pt-4 border-t border-oriental-gold-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Ruling Planet */}
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-oriental-gold-400/50 text-amber-200 flex items-center gap-1.5 font-bold">
            👑 <span>Chủ Tinh Cung Mọc: <strong className="text-oriental-gold-300">{chartData.rulingPlanet.name} ({chartData.rulingPlanet.symbol})</strong> - Nhà {chartData.rulingPlanet.house}</span>
          </div>

          {/* MC Angle */}
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 flex items-center gap-1 font-semibold">
            🎯 <span>MC (Thiên Đỉnh): <strong>{chartData.angles.midheaven.sign} {chartData.angles.midheaven.degree}°</strong></span>
          </div>

          {/* IC Angle */}
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 flex items-center gap-1 font-semibold">
            🏠 <span>IC (Thiên Đế): <strong>{chartData.angles.imumCoeli.sign} {chartData.angles.imumCoeli.degree}°</strong></span>
          </div>
        </div>

        {/* Stellium Alert */}
        {chartData.stelliums.length > 0 && (
          <div className="px-3 py-1.5 rounded-xl bg-oriental-gold-500/20 border border-oriental-gold-400 text-oriental-gold-300 font-extrabold flex items-center gap-1.5 shadow-gold-glow">
            ✨ <span>Stellium: {chartData.stelliums.map(s => `${s.name} (${s.count} hành tinh)`).join(', ')}</span>
          </div>
        )}
      </div>

    </div>
  );
};
