import React, { useState } from 'react';
import { Plus, Search, Calendar as CalendarIcon, Bell, Trash2, Edit3 } from 'lucide-react';
import { PersonalEvent, PersonalEventType } from '../types';
import { storageService } from '../services/storageService';
import { CATEGORY_CONFIG, PersonalEventModal } from './PersonalEventModal';

export const PersonalCalendarView: React.FC = () => {
  const [personalEvents, setPersonalEvents] = useState<PersonalEvent[]>(() =>
    storageService.getPersonalEvents()
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<PersonalEvent | null>(null);

  const reloadEvents = () => {
    setPersonalEvents(storageService.getPersonalEvents());
  };

  const handleSaveEvent = (
    eventData: Omit<PersonalEvent, 'id' | 'createdAt'> | PersonalEvent
  ) => {
    if ('id' in eventData) {
      storageService.updatePersonalEvent(eventData as PersonalEvent);
    } else {
      storageService.addPersonalEvent(eventData);
    }
    reloadEvents();
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa lịch "${title}" không?`)) {
      storageService.deletePersonalEvent(id);
      reloadEvents();
    }
  };

  const filteredEvents = personalEvents.filter((e) => {
    const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.note && e.note.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white/90 dark:bg-oriental-dark-card/95 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-amber-200/90 dark:border-oriental-dark-border p-4 sm:p-6 backdrop-blur-md transition-all">
      
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-200/70 dark:border-oriental-dark-border">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-oriental-red-800 to-oriental-red-900 text-oriental-gold-300 flex items-center justify-center font-bold text-xl shadow-oriental shrink-0">
            🗓️
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide flex items-center gap-2">
              Lịch Cá Nhân & Nhắc Nhở
            </h2>
            <p className="text-xs text-amber-900/75 dark:text-amber-200/70 mt-0.5">
              Quản lý ngày giỗ, sinh nhật, khai trương, lịch đi chùa, deadline và nhận chuông nhắc tự động
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingEvent(null);
            setIsModalOpen(true);
          }}
          className="w-full md:w-auto px-4 py-2.5 bg-oriental-red-800 hover:bg-oriental-red-900 text-oriental-gold-300 font-bold rounded-xl shadow-oriental transition-all flex items-center justify-center space-x-2 border border-oriental-gold-500/40 text-xs sm:text-sm shrink-0"
        >
          <Plus className="w-4 h-4 text-oriental-gold-400" />
          <span>+ Thêm Lịch Cá Nhân Mới</span>
        </button>
      </div>

      {/* Search Bar & Category Filter Pills */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm ngày giỗ, sinh nhật, công việc..."
            className="w-full pl-10 pr-4 py-2.5 bg-amber-50/60 dark:bg-oriental-dark-bg border border-amber-200/80 dark:border-amber-900 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500 shadow-2xs"
          />
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-oriental-red-800 text-oriental-gold-300 shadow-sm border border-oriental-gold-500/40'
                : 'bg-amber-100/60 dark:bg-oriental-dark-bg text-slate-700 dark:text-amber-200/80 hover:bg-amber-200 border border-amber-200/40'
            }`}
          >
            Tất Cả ({personalEvents.length})
          </button>

          {(Object.keys(CATEGORY_CONFIG) as PersonalEventType[]).map((catKey) => {
            const cfg = CATEGORY_CONFIG[catKey];
            const count = personalEvents.filter((e) => e.category === catKey).length;
            if (count === 0 && selectedCategory !== catKey) return null;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === catKey
                    ? 'bg-oriental-red-800 text-oriental-gold-300 shadow-sm border border-oriental-gold-500/40'
                    : 'bg-amber-100/60 dark:bg-oriental-dark-bg text-slate-700 dark:text-amber-200/80 hover:bg-amber-200 border border-amber-200/40'
                }`}
              >
                <span>{cfg.icon}</span>
                <span>{cfg.label} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Personal Events List Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-amber-50/40 dark:bg-oriental-dark-bg/40 rounded-2xl border border-dashed border-amber-300 dark:border-amber-900">
          <CalendarIcon className="w-12 h-12 text-amber-400 mx-auto mb-3 opacity-60" />
          <h4 className="font-serif font-bold text-slate-700 dark:text-amber-200 text-sm sm:text-base">
            Chưa Có Lịch Cá Nhân Nào
          </h4>
          <p className="text-xs text-amber-900/60 dark:text-amber-200/50 mt-1 max-w-sm mx-auto">
            Bấm nút "+ Thêm Lịch Cá Nhân Mới" để lên lịch ngày giỗ, sinh nhật, khai trương, công việc và cài đặt chuông nhắc nhở.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((pe) => {
            const cfg = CATEGORY_CONFIG[pe.category] || CATEGORY_CONFIG['quan-trong'];
            return (
              <div
                key={pe.id}
                className="bg-amber-50/40 dark:bg-oriental-dark-bg/60 rounded-2xl p-4 border border-amber-200/80 dark:border-oriental-dark-border shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Category Pill & Date Tag */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-extrabold text-white shadow-2xs flex items-center gap-1.5"
                      style={{ backgroundColor: pe.color || cfg.color }}
                    >
                      <span>{cfg.icon}</span>
                      <span>{cfg.label}</span>
                    </span>

                    {/* Lunar / Solar Date Badge */}
                    <span className="font-serif font-bold text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-oriental-red-900 dark:text-oriental-gold-300 border border-amber-300/50">
                      {pe.isLunar ? `🌙 Mùng ${pe.day}/${pe.month} Âm` : `☀️ Ngày ${pe.day}/${pe.month} Dương`}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif font-extrabold text-base text-amber-950 dark:text-amber-100 mb-1.5 leading-snug">
                    {pe.title}
                  </h3>

                  {/* Note Box */}
                  {pe.note && (
                    <div className="bg-white/80 dark:bg-oriental-dark-card p-2.5 rounded-xl border border-amber-200/50 dark:border-amber-900/30 text-xs text-slate-700 dark:text-amber-200/80 mb-3 leading-relaxed">
                      {pe.note}
                    </div>
                  )}
                </div>

                {/* Footer Info & Action Controls */}
                <div className="pt-2.5 border-t border-amber-200/50 dark:border-amber-900/40 flex items-center justify-between text-xs">
                  {/* Reminder Info */}
                  <div className="flex items-center gap-1.5 text-amber-900/80 dark:text-amber-300/80 text-[11px] font-medium">
                    <Bell className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      {pe.remindBeforeDays === 0
                        ? 'Nhắc đúng ngày'
                        : `Nhắc trước ${pe.remindBeforeDays} ngày`}
                    </span>
                    {pe.time && <span className="font-mono text-slate-500 dark:text-slate-400">({pe.time})</span>}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setEditingEvent(pe);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-amber-200/60 dark:hover:bg-amber-900/40 transition-colors"
                      title="Sửa lịch cá nhân"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteEvent(pe.id, pe.title)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors"
                      title="Xóa lịch cá nhân"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Personal Event Modal (Create / Edit) */}
      {isModalOpen && (
        <PersonalEventModal
          initialEvent={editingEvent}
          onSave={handleSaveEvent}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
        />
      )}

    </div>
  );
};
