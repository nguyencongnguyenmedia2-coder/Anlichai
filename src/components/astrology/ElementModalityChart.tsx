import React from 'react';
import { ElementDistribution, ModalityDistribution } from '../../types/astrology';

interface ElementModalityChartProps {
  elements: ElementDistribution;
  modalities: ModalityDistribution;
}

export const ElementModalityChart: React.FC<ElementModalityChartProps> = ({ elements, modalities }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* ELEMENTS CHART */}
      <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-3xl p-5 border-2 border-amber-200/90 dark:border-oriental-dark-border shadow-xl">
        <h4 className="font-serif font-black text-base text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide mb-3">
          🔥 🌍 🌬 💧 Phân Bổ Nguyên Tố (Elements)
        </h4>

        <div className="space-y-3 text-xs">
          {/* FIRE */}
          <div>
            <div className="flex justify-between font-bold text-rose-700 dark:text-rose-400 mb-1">
              <span>🔥 Lửa (Fire) - Năng động, nhiệt huyết</span>
              <span>{elements.fire.count} ({elements.fire.percentage}%)</span>
            </div>
            <div className="w-full bg-rose-100 dark:bg-rose-950/60 rounded-full h-2.5 overflow-hidden">
              <div className="bg-rose-500 h-2.5 rounded-full transition-all" style={{ width: `${elements.fire.percentage}%` }} />
            </div>
          </div>

          {/* EARTH */}
          <div>
            <div className="flex justify-between font-bold text-amber-800 dark:text-amber-300 mb-1">
              <span>🌍 Đất (Earth) - Thực tế, ổn định</span>
              <span>{elements.earth.count} ({elements.earth.percentage}%)</span>
            </div>
            <div className="w-full bg-amber-100 dark:bg-amber-950/60 rounded-full h-2.5 overflow-hidden">
              <div className="bg-amber-600 h-2.5 rounded-full transition-all" style={{ width: `${elements.earth.percentage}%` }} />
            </div>
          </div>

          {/* AIR */}
          <div>
            <div className="flex justify-between font-bold text-sky-700 dark:text-sky-300 mb-1">
              <span>🌬 Khí (Air) - Tư duy, giao tiếp</span>
              <span>{elements.air.count} ({elements.air.percentage}%)</span>
            </div>
            <div className="w-full bg-sky-100 dark:bg-sky-950/60 rounded-full h-2.5 overflow-hidden">
              <div className="bg-sky-500 h-2.5 rounded-full transition-all" style={{ width: `${elements.air.percentage}%` }} />
            </div>
          </div>

          {/* WATER */}
          <div>
            <div className="flex justify-between font-bold text-blue-700 dark:text-blue-400 mb-1">
              <span>💧 Nước (Water) - Cảm xúc, trực giác</span>
              <span>{elements.water.count} ({elements.water.percentage}%)</span>
            </div>
            <div className="w-full bg-blue-100 dark:bg-blue-950/60 rounded-full h-2.5 overflow-hidden">
              <div className="bg-blue-500 h-2.5 rounded-full transition-all" style={{ width: `${elements.water.percentage}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* MODALITIES CHART */}
      <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-3xl p-5 border-2 border-amber-200/90 dark:border-oriental-dark-border shadow-xl">
        <h4 className="font-serif font-black text-base text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide mb-3">
          ⚡ Phân Bổ Tính Chất (Modalities)
        </h4>

        <div className="space-y-3 text-xs">
          {/* CARDINAL */}
          <div>
            <div className="flex justify-between font-bold text-oriental-red-900 dark:text-oriental-gold-300 mb-1">
              <span>👑 Thống Lĩnh (Cardinal) - Khởi xướng, quyết đoán</span>
              <span>{modalities.cardinal.count} ({modalities.cardinal.percentage}%)</span>
            </div>
            <div className="w-full bg-oriental-red-100 dark:bg-oriental-red-950/60 rounded-full h-2.5 overflow-hidden">
              <div className="bg-oriental-red-800 h-2.5 rounded-full transition-all" style={{ width: `${modalities.cardinal.percentage}%` }} />
            </div>
          </div>

          {/* FIXED */}
          <div>
            <div className="flex justify-between font-bold text-indigo-700 dark:text-indigo-300 mb-1">
              <span>🏛 Tiên Phong (Fixed) - Kiên định, tập trung</span>
              <span>{modalities.fixed.count} ({modalities.fixed.percentage}%)</span>
            </div>
            <div className="w-full bg-indigo-100 dark:bg-indigo-950/60 rounded-full h-2.5 overflow-hidden">
              <div className="bg-indigo-600 h-2.5 rounded-full transition-all" style={{ width: `${modalities.fixed.percentage}%` }} />
            </div>
          </div>

          {/* MUTABLE */}
          <div>
            <div className="flex justify-between font-bold text-teal-700 dark:text-teal-300 mb-1">
              <span>🌊 Biến Đổi (Mutable) - Linh hoạt, thích nghi</span>
              <span>{modalities.mutable.count} ({modalities.mutable.percentage}%)</span>
            </div>
            <div className="w-full bg-teal-100 dark:bg-teal-950/60 rounded-full h-2.5 overflow-hidden">
              <div className="bg-teal-500 h-2.5 rounded-full transition-all" style={{ width: `${modalities.mutable.percentage}%` }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
