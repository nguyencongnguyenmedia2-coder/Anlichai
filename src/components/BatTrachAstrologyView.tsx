import React, { useState } from 'react';
import { Sparkles, Compass, Heart } from 'lucide-react';
import { AppSettings } from '../types';
import { AstrologyView } from './astrology/AstrologyView';
import { BatTrachView } from './BatTrachView';
import { LoveCompatibilityView } from './LoveCompatibilityView';

interface BatTrachAstrologyViewProps {
  settings: AppSettings;
  initialSubTab?: 'astrology' | 'battrach' | 'love';
}

export const BatTrachAstrologyView: React.FC<BatTrachAstrologyViewProps> = ({
  settings,
  initialSubTab = 'astrology',
}) => {
  const [subTab, setSubTab] = useState<'astrology' | 'battrach' | 'love'>(initialSubTab);

  return (
    <div className="space-y-6">
      
      {/* UNIFIED TOP TAB SWITCHER CAPSULE (3 COLUMNS) */}
      <div className="bg-white/95 dark:bg-oriental-dark-card/95 p-2 rounded-2xl border-2 border-amber-200/90 dark:border-oriental-dark-border shadow-md flex items-center justify-center max-w-3xl mx-auto backdrop-blur-md">
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full">
          
          <button
            onClick={() => setSubTab('astrology')}
            className={`py-2.5 px-2 sm:px-4 rounded-xl font-serif font-black text-[11px] sm:text-xs md:text-sm transition-all flex items-center justify-center space-x-1.5 ${
              subTab === 'astrology'
                ? 'bg-gradient-to-r from-oriental-red-800 to-oriental-red-950 text-oriental-gold-300 shadow-oriental border border-oriental-gold-400/50 scale-[1.02]'
                : 'text-slate-700 dark:text-amber-200 hover:bg-amber-100/60 dark:hover:bg-amber-900/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-oriental-gold-400 shrink-0" />
            <span className="truncate">Chiêm Tinh AI</span>
          </button>

          <button
            onClick={() => setSubTab('battrach')}
            className={`py-2.5 px-2 sm:px-4 rounded-xl font-serif font-black text-[11px] sm:text-xs md:text-sm transition-all flex items-center justify-center space-x-1.5 ${
              subTab === 'battrach'
                ? 'bg-gradient-to-r from-oriental-red-800 to-oriental-red-950 text-oriental-gold-300 shadow-oriental border border-oriental-gold-400/50 scale-[1.02]'
                : 'text-slate-700 dark:text-amber-200 hover:bg-amber-100/60 dark:hover:bg-amber-900/40'
            }`}
          >
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
            <span className="truncate">Phong Thủy Bát Trạch</span>
          </button>

          <button
            onClick={() => setSubTab('love')}
            className={`py-2.5 px-2 sm:px-4 rounded-xl font-serif font-black text-[11px] sm:text-xs md:text-sm transition-all flex items-center justify-center space-x-1.5 ${
              subTab === 'love'
                ? 'bg-gradient-to-r from-rose-700 to-rose-900 text-white shadow-lg border border-rose-300 scale-[1.02]'
                : 'text-slate-700 dark:text-amber-200 hover:bg-rose-100/60 dark:hover:bg-rose-950/40'
            }`}
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 fill-current shrink-0" />
            <span className="truncate">Xem Hợp Tuổi 💕</span>
          </button>

        </div>
      </div>

      {/* RENDER ACTIVE VIEW */}
      {subTab === 'astrology' ? (
        <AstrologyView settings={settings} />
      ) : subTab === 'battrach' ? (
        <BatTrachView />
      ) : (
        <LoveCompatibilityView />
      )}

    </div>
  );
};
