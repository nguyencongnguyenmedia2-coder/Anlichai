import React, { useState } from 'react';
import { Aspect } from '../../types/astrology';

interface AspectsListProps {
  aspects: Aspect[];
}

export const AspectsList: React.FC<AspectsListProps> = ({ aspects }) => {
  const [filter, setFilter] = useState<'all' | 'harmonious' | 'challenging' | 'conjunction'>('all');

  const aspectDescriptions: Record<string, string> = {
    Trine: 'Tam Hợp (120°) - Dòng chảy năng lượng tự nhiên & thuận lợi',
    Sextile: 'Lục Hợp (60°) - Cơ hội phát triển & sự nhịp nhàng',
    Square: 'Vuông Góc (90°) - Thách thức & động lực vượt khó',
    Opposition: 'Đối Đỉnh (180°) - Căng thẳng & bài học cân bằng 2 cực',
    Conjunction: 'Trùng Tụ (0°) - Hợp nhất & tập trung năng lượng cực đại',
    Quincunx: 'Bất Tương Hợp (150°) - Cần sự thích nghi & điều chỉnh'
  };

  const filteredAspects = aspects.filter(asp => {
    if (filter === 'harmonious') return asp.isHarmonious && asp.aspectType !== 'Conjunction';
    if (filter === 'challenging') return !asp.isHarmonious;
    if (filter === 'conjunction') return asp.aspectType === 'Conjunction';
    return true;
  });

  return (
    <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-3xl p-4 sm:p-6 border-2 border-amber-200/90 dark:border-oriental-dark-border shadow-xl">
      
      {/* Header Bar with Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-200/80 dark:border-oriental-dark-border">
        <div>
          <h3 className="font-serif font-black text-base sm:text-lg text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide flex items-center gap-2">
            ✨ Các Góc Hợp Hành Tinh (Aspects & Orbs)
          </h3>
          <p className="text-[11px] text-amber-900/75 dark:text-amber-200/70 mt-0.5">
            Tương tác năng lượng giữa các cặp thiên thể trong bản đồ sao
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-amber-100/70 dark:bg-oriental-dark-bg p-1 rounded-2xl border border-oriental-gold-500/30 self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              filter === 'all' ? 'bg-oriental-red-800 text-oriental-gold-300 shadow-sm' : 'text-slate-700 dark:text-amber-200'
            }`}
          >
            Tất cả ({aspects.length})
          </button>
          <button
            onClick={() => setFilter('harmonious')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              filter === 'harmonious' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700 dark:text-emerald-300'
            }`}
          >
            Hài hòa 🟢
          </button>
          <button
            onClick={() => setFilter('challenging')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              filter === 'challenging' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-700 dark:text-rose-300'
            }`}
          >
            Thách thức 🔴
          </button>
          <button
            onClick={() => setFilter('conjunction')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              filter === 'conjunction' ? 'bg-amber-500 text-oriental-red-950 shadow-sm' : 'text-amber-700 dark:text-amber-300'
            }`}
          >
            Trùng Tụ 🟡
          </button>
        </div>
      </div>

      {/* ASPECTS CARDS GRID (Mobile First CSS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredAspects.map((asp, idx) => {
          let cardBg = 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300/80';
          let badgeBg = 'bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-900 dark:text-amber-200';

          if (asp.aspectType === 'Conjunction') {
            cardBg = 'bg-gradient-to-r from-amber-50 to-amber-100/80 dark:from-oriental-dark-bg dark:to-amber-950/60 border-amber-400/90';
            badgeBg = 'bg-amber-500 text-oriental-red-950 font-black border-amber-300';
          } else if (asp.isHarmonious) {
            cardBg = 'bg-gradient-to-r from-emerald-50/90 to-teal-50/60 dark:from-emerald-950/40 dark:to-teal-950/30 border-emerald-300/90';
            badgeBg = 'bg-emerald-600 text-white font-bold border-emerald-400';
          } else {
            cardBg = 'bg-gradient-to-r from-rose-50/90 to-amber-50/60 dark:from-rose-950/40 dark:to-amber-950/30 border-rose-300/90';
            badgeBg = 'bg-rose-600 text-white font-bold border-rose-400';
          }

          return (
            <div 
              key={idx} 
              className={`p-3.5 rounded-2xl border ${cardBg} flex flex-col justify-between shadow-2xs hover:shadow-md transition-all space-y-2.5`}
            >
              {/* Planet Pair & Aspect Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 dark:border-white/10 pb-2">
                
                {/* Planet 1 -> Aspect -> Planet 2 */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                  {/* Planet 1 */}
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-oriental-red-800 text-oriental-gold-300 border border-oriental-gold-400 shadow-2xs">
                    <span>{asp.planet1Symbol}</span>
                    <span>{asp.planet1}</span>
                  </span>

                  {/* Aspect Symbol */}
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] border shadow-2xs font-extrabold whitespace-nowrap ${badgeBg}`}>
                    <span>{asp.aspectSymbol}</span>
                    <span>{asp.aspectType}</span>
                  </span>

                  {/* Planet 2 */}
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-oriental-red-800 text-oriental-gold-300 border border-oriental-gold-400 shadow-2xs">
                    <span>{asp.planet2Symbol}</span>
                    <span>{asp.planet2}</span>
                  </span>
                </div>

                {/* Orb Badge */}
                <span className="text-[10px] font-mono font-bold bg-white/80 dark:bg-black/50 px-2 py-0.5 rounded-lg border border-amber-300/50 shrink-0 text-slate-700 dark:text-amber-200">
                  Orb {asp.orbDegree}°{asp.orbMinute}'
                </span>

              </div>

              {/* Aspect Quick Meaning Phrase */}
              <p className="text-[11px] text-slate-700 dark:text-amber-200/90 leading-tight italic">
                💡 {aspectDescriptions[asp.aspectType] || 'Tương tác góc hợp giữa 2 hành tinh'}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
};
