import React from 'react';
import { AppSettings } from '../types';

interface Props {
  settings: AppSettings;
}

export const ThemeBackground: React.FC<Props> = ({ settings }) => {
  if (settings.bgType === 'custom' && settings.customBgUrl) {
    return (
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center transition-all duration-500"
        style={{ 
          backgroundImage: `url(${settings.customBgUrl})`,
          opacity: 0.15
        }}
      />
    );
  }

  if (settings.theme === 'oriental') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20 overflow-hidden">
        {/* Oriental subtle background decoration circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-oriental-red-700/20 to-amber-500/10 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-amber-500/20 to-oriental-red-800/10 blur-3xl" />
      </div>
    );
  }

  return null;
};
