import React from 'react';
import { PlanetPosition } from '../../types/astrology';

interface PlanetTableProps {
  planets: PlanetPosition[];
}

export const PlanetTable: React.FC<PlanetTableProps> = ({ planets }) => {
  const planetMeanings: Record<string, string> = {
    Sun: 'Ý chí cốt lõi, bản dạng & năng lượng sống',
    Moon: 'Cảm xúc, nhu cầu nội tâm & trực giác',
    Mercury: 'Tư duy, giao tiếp & khả năng học hỏi',
    Venus: 'Tình yêu, gu thẩm mỹ & giá trị cá nhân',
    Mars: 'Hành động, động lực & sự quyết đoán',
    Jupiter: 'May mắn, tri thức & sự mở rộng',
    Saturn: 'Kỷ luật, trách nhiệm & bài học cuộc sống',
    Uranus: 'Đột phá, độc lập & sự đổi mới',
    Neptune: 'Trực giác, ước mơ & sự thấu cảm',
    Pluto: 'Biến đổi sâu sắc & sức mạnh tái sinh',
    NorthNode: 'Hướng đi phát triển & sứ mệnh linh hồn',
    Chiron: 'Vết thương tâm hồn & khả năng chữa lành'
  };

  return (
    <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-3xl p-4 sm:p-6 border-2 border-amber-200/90 dark:border-oriental-dark-border shadow-xl">
      
      {/* Header Bar */}
      <div className="mb-4 pb-3 border-b border-amber-200/80 dark:border-oriental-dark-border">
        <h3 className="font-serif font-black text-base sm:text-lg text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide flex items-center gap-2">
          🪐 Vị Trí Các Hành Tinh (Planetary Positions)
        </h3>
        <p className="text-[11px] text-amber-900/75 dark:text-amber-200/70 mt-0.5">
          Tọa độ chính xác từng độ/phút của các thiên thể trong bản đồ sao
        </p>
      </div>

      {/* GRID CARDS LAYOUT ONLY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {planets.map((p) => (
          <div 
            key={p.key}
            className="bg-gradient-to-br from-amber-50/90 to-amber-100/60 dark:from-oriental-dark-bg dark:to-amber-950/40 p-3.5 rounded-2xl border border-amber-200 dark:border-oriental-dark-border hover:border-oriental-gold-400 transition-all flex flex-col justify-between shadow-2xs group hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between border-b border-amber-200/70 dark:border-oriental-dark-border pb-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-xl bg-oriental-red-800 text-oriental-gold-300 flex items-center justify-center font-extrabold text-base shadow-sm shrink-0 border border-oriental-gold-400 group-hover:scale-110 transition-transform">
                    {p.symbol}
                  </span>
                  <div>
                    <div className="font-extrabold text-xs text-oriental-red-950 dark:text-oriental-gold-300">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-amber-900/70 dark:text-amber-200/70">
                      Nhà thứ {p.house}
                    </div>
                  </div>
                </div>

                {p.isRetrograde ? (
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 shrink-0">
                    ☌ Nghịch Hành
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 shrink-0">
                    ➔ Thuận Hành
                  </span>
                )}
              </div>

              <div className="text-xs font-bold text-oriental-red-900 dark:text-oriental-gold-400 mb-1">
                {p.signSymbol} Cung {p.sign} <span className="font-mono text-slate-600 dark:text-amber-200/80 font-normal">({p.degree}°{p.minute}')</span>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-amber-200/75 leading-tight">
                📌 {planetMeanings[p.key] || 'Năng lượng thiên thể'}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
