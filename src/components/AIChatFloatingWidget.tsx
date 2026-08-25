import React from 'react';
import { X } from 'lucide-react';
import { AppSettings, DayDetail } from '../types';
import { AIChatView } from './AIChatView';
import aiLogoImg from '../assets/ai-logo.jpg';

interface AIChatFloatingWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  settings: AppSettings;
  onOpenSettings: () => void;
  selectedDayContext: DayDetail | null;
  onClearContext: () => void;
}

export const AIChatFloatingWidget: React.FC<AIChatFloatingWidgetProps> = ({
  isOpen,
  onToggle,
  onClose,
  settings,
  onOpenSettings,
  selectedDayContext,
  onClearContext,
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay when AI Chat Window is Open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Floating Action Button (FAB) at Bottom-Right */}
      <div className="fixed bottom-28 right-4 sm:bottom-20 sm:right-8 z-50 flex items-center group">
        
        {/* Floating Tooltip / Badge */}
        {!isOpen && (
          <div 
            onClick={onToggle}
            className="mr-3 hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-900/90 dark:bg-oriental-dark-card/95 text-oriental-gold-300 text-xs font-bold shadow-lg border border-oriental-gold-400/50 cursor-pointer hover:scale-105 transition-all animate-bounce"
          >
            <img src={aiLogoImg} alt="Trợ Lý AI Logo" className="w-4 h-4 object-contain rounded-full" />
            <span>Hỏi Trợ Lý AI</span>
          </div>
        )}

        {/* Main Floating Round Button */}
        <button
          onClick={onToggle}
          aria-label="Mở Trợ Lý AI Phong Thủy"
          title={isOpen ? "Đóng Trợ Lý AI" : "Mở Trợ Lý AI Phong Thủy & Tử Vi"}
          className={`relative w-13 h-13 sm:w-15 sm:h-15 rounded-full flex items-center justify-center shadow-2xl border-2 border-oriental-gold-400 transition-all duration-300 active:scale-95 cursor-pointer overflow-hidden ${
            isOpen
              ? 'bg-gradient-to-br from-rose-700 to-rose-900 text-white shadow-rose-900/50 rotate-90'
              : 'bg-gradient-to-br from-oriental-red-800 via-oriental-red-900 to-oriental-red-950 text-oriental-gold-300 shadow-oriental hover:scale-108 p-1'
          }`}
        >
          {/* Animated Gold Ring Pulsing Effect */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full border-2 border-oriental-gold-400/60 animate-ping pointer-events-none" />
          )}

          {isOpen ? (
            <X className="w-6 h-6 sm:w-7 sm:h-7" />
          ) : (
            <div className="relative flex items-center justify-center w-full h-full">
              <img 
                src={aiLogoImg} 
                alt="Trợ Lý AI Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-md rounded-full" 
              />
              <span className="absolute top-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-oriental-gold-500 border border-oriental-red-900"></span>
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Floating AI Chat Window / Popover Dialog */}
      {isOpen && (
        <div className="fixed inset-x-2 bottom-20 top-14 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[450px] sm:h-[640px] sm:max-h-[82vh] z-50 transition-all duration-300 ease-out">
          <AIChatView
            settings={settings}
            onOpenSettings={onOpenSettings}
            selectedDayContext={selectedDayContext}
            onClearContext={onClearContext}
            onClose={onClose}
            isFloating={true}
          />
        </div>
      )}
    </>
  );
};
