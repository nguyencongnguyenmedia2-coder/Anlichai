import React from 'react';
import { HouseCusp } from '../../types/astrology';

interface HouseTableProps {
  houses: HouseCusp[];
  houseSystem: string;
}

export const HouseTable: React.FC<HouseTableProps> = ({ houses, houseSystem }) => {
  const houseDomains: Record<number, string> = {
    1: 'Bản thân, diện mạo & cách tiếp cận cuộc sống',
    2: 'Tài chính, tài sản & giá trị cá nhân',
    3: 'Giao tiếp, học tập ngắn hạn & anh chị em',
    4: 'Gia đình, cội nguồn & chốn đi về',
    5: 'Tình yêu, sự sáng tạo & niềm vui giải trí',
    6: 'Sức khỏe, thói quen & công việc hàng ngày',
    7: 'Hôn nhân, đối tác & các mối quan hệ 1-1',
    8: 'Tài chính chung, tái sinh & chuyển hóa nội tâm',
    9: 'Triết lý sống, du học & học vấn cao',
    10: 'Sự nghiệp, danh tiếng & địa vị xã hội',
    11: 'Bạn bè, cộng đồng & mục tiêu tương lai',
    12: 'Tâm linh, bí mật & tiềm thức vô thức'
  };

  return (
    <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-3xl p-4 sm:p-6 border-2 border-amber-200/90 dark:border-oriental-dark-border shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif font-black text-base sm:text-lg text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide">
            🏠 Hệ Thống 12 Nhà (House Cusps)
          </h3>
          <p className="text-[11px] text-amber-900/75 dark:text-amber-200/70">
            Lĩnh vực đời sống do từng Nhà quản chiếu
          </p>
        </div>
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 dark:bg-amber-900/60 text-oriental-red-900 dark:text-oriental-gold-300 border border-oriental-gold-500/40 shrink-0">
          Hệ: {houseSystem}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {houses.map((h) => (
          <div key={h.houseNumber} className="bg-amber-50/70 dark:bg-oriental-dark-bg p-3 rounded-2xl border border-amber-200/80 dark:border-oriental-dark-border hover:border-oriental-gold-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-oriental-dark-border pb-1.5 mb-1.5">
                <span className="font-serif font-black text-sm text-oriental-red-900 dark:text-oriental-gold-400">
                  Nhà {h.houseNumber}
                </span>
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  {h.signSymbol} {h.sign} ({h.degree}°{h.minute}')
                </span>
              </div>

              <p className="text-[11px] text-amber-900/80 dark:text-amber-200/70 italic mb-2">
                📌 {houseDomains[h.houseNumber]}
              </p>

              <div className="text-xs text-slate-700 dark:text-amber-200/80 space-y-1">
                <div>
                  <span className="font-semibold text-amber-900/70 dark:text-amber-300/70">Chủ tinh:</span>{' '}
                  <span className="font-bold text-oriental-red-900 dark:text-oriental-gold-300">{h.ruler}</span>
                </div>

                <div>
                  <span className="font-semibold text-amber-900/70 dark:text-amber-300/70">Hành tinh trú ngụ:</span>{' '}
                  {h.planetsInside.length > 0 ? (
                    <span className="font-bold text-amber-900 dark:text-amber-100">
                      {h.planetsInside.join(', ')}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">Trống</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
