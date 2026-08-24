import React, { useState } from 'react';
import { Search, Plus, Trash2, Flag, Bell, BellOff } from 'lucide-react';
import { EventItem, EventType } from '../types';
import { storageService } from '../services/storageService';
import { lunarService } from '../services/lunarService';
import { notificationService } from '../services/notificationService';

interface EventsViewProps {
  isAdminMode: boolean;
  onOpenAdminLogin?: () => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  isAdminMode,
}) => {
  const [events, setEvents] = useState<EventItem[]>(() => storageService.getEvents());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Event Form State (Admin)
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIsLunar, setNewIsLunar] = useState(true);
  const [newDay, setNewDay] = useState(1);
  const [newMonth, setNewMonth] = useState(1);
  const [newType, setNewType] = useState<EventType>('dan-gian');
  const [newColor, setNewColor] = useState('#D97706');

  const reloadEvents = () => {
    setEvents(storageService.getEvents());
  };

  const handleToggleNotify = async (ev: EventItem) => {
    const nextState = !ev.notify;
    if (nextState) {
      const granted = await notificationService.requestPermission();
      if (!granted) {
        alert('Vui lòng cho phép trình duyệt phát thông báo để nhận nhắc nhở ngày lễ!');
      }
    }
    const updatedEvents = events.map((item) =>
      item.id === ev.id ? { ...item, notify: nextState } : item
    );
    setEvents(updatedEvents);
    storageService.saveEvents(updatedEvents);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    storageService.saveCustomEvent({
      name: newName.trim(),
      description: newDesc.trim(),
      isLunar: newIsLunar,
      lunarDay: newIsLunar ? newDay : 0,
      lunarMonth: newIsLunar ? newMonth : 0,
      solarDay: !newIsLunar ? newDay : undefined,
      solarMonth: !newIsLunar ? newMonth : undefined,
      type: newType,
      notify: true,
      color: newColor,
    });

    reloadEvents();
    setShowAddModal(false);
    setNewName('');
    setNewDesc('');
  };

  const handleDeleteEvent = (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa sự kiện "${name}" không?`)) {
      storageService.deleteCustomEvent(id);
      reloadEvents();
    }
  };

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === 'lunar') return matchesSearch && ev.isLunar;
    if (selectedCategory === 'solar') return matchesSearch && !ev.isLunar;
    return matchesSearch && ev.type === selectedCategory;
  });

  return (
    <div className="bg-white/90 dark:bg-oriental-dark-card/95 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-amber-200/90 dark:border-oriental-dark-border p-4 sm:p-6 backdrop-blur-md transition-all">
      
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-200/70 dark:border-oriental-dark-border">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-oriental-red-800 to-oriental-red-950 text-oriental-gold-300 flex items-center justify-center shadow-oriental text-xl shrink-0 border border-oriental-gold-400">
            🇻🇳
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide flex items-center gap-2">
              Lễ Hội & Sự Kiện Việt Nam
            </h2>
            <p className="text-xs text-amber-900/75 dark:text-amber-200/70 mt-0.5">
              Danh mục các ngày Quốc lễ, Tết truyền thống, Lễ Phật giáo và kỷ niệm lịch sử dân tộc ({events.length} ngày lễ)
            </p>
          </div>
        </div>

        {/* Admin Event Add Button */}
        {isAdminMode && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-oriental-red-800 hover:bg-oriental-red-900 text-oriental-gold-300 font-bold rounded-xl shadow-oriental transition-all flex items-center justify-center space-x-2 border border-oriental-gold-500/40 text-xs sm:text-sm shrink-0"
          >
            <Plus className="w-4 h-4 text-oriental-gold-400" />
            <span>+ Thêm Sự Kiện Mới</span>
          </button>
        )}
      </div>

      {/* Search Bar & Category Tabs Slider */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm lễ hội, ngày lễ 30/4, Quốc khánh 2/9, Giỗ Tổ Hùng Vương..."
            className="w-full pl-10 pr-4 py-2.5 bg-amber-50/60 dark:bg-oriental-dark-bg border border-amber-200/80 dark:border-amber-900 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500 shadow-2xs font-medium"
          />
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: `🌟 Tất Cả (${events.length})` },
            { id: 'lunar', label: '🌙 Lễ Âm Lịch' },
            { id: 'solar', label: '☀️ Ngày Lễ Quốc Gia (Dương)' },
            { id: 'tet', label: '🏮 Tết Nguyên Đán' },
            { id: 'phat-giao', label: '🪷 Phật Giáo & Cầu An' },
            { id: 'dan-gian', label: '📜 Dân Gian & Lịch Sử' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === tab.id
                  ? 'bg-oriental-red-800 text-oriental-gold-300 shadow-sm border border-oriental-gold-500/40 scale-105'
                  : 'bg-amber-100/60 dark:bg-oriental-dark-bg text-slate-700 dark:text-amber-200/80 hover:bg-amber-200 border border-amber-200/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid (Pure Professional Typography without images) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((ev) => {
          const { daysRemaining } = lunarService.getNextEventOccurrence(ev);
          return (
            <div
              key={ev.id}
              className="bg-amber-50/40 dark:bg-oriental-dark-bg/60 rounded-2xl p-4 border border-amber-200/80 dark:border-oriental-dark-border shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Badges Bar */}
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-extrabold text-white shadow-2xs flex items-center gap-1.5"
                    style={{ backgroundColor: ev.color || '#D97706' }}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{ev.isLunar ? 'Lễ Truyền Thống' : 'Quốc Lễ Việt Nam'}</span>
                  </span>

                  {/* Countdown Badge */}
                  <span
                    className={`font-serif font-bold text-xs px-2.5 py-0.5 rounded-full border shadow-2xs ${
                      daysRemaining === 0
                        ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                        : daysRemaining <= 7
                        ? 'bg-amber-500 text-oriental-red-950 border-amber-300 font-extrabold'
                        : 'bg-amber-100 dark:bg-amber-900/40 text-oriental-red-900 dark:text-oriental-gold-300 border-amber-300/50'
                    }`}
                  >
                    {daysRemaining === 0
                      ? '🎉 Hôm nay là ngày diễn ra!'
                      : `⏳ Còn ${daysRemaining} ngày nữa`}
                  </span>
                </div>

                {/* Event Name */}
                <h3 className="font-serif font-extrabold text-base sm:text-lg text-oriental-red-900 dark:text-oriental-gold-300 mb-1 leading-snug">
                  {ev.name}
                </h3>

                <p className="text-[11px] font-semibold text-amber-900/70 dark:text-amber-200/60 mb-2">
                  {ev.isLunar
                    ? `🌙 Ngày Mùng ${ev.lunarDay}/${ev.lunarMonth} Âm Lịch Hàng Năm`
                    : `☀️ Ngày ${ev.solarDay}/${ev.solarMonth} Dương Lịch Hàng Năm`}
                </p>

                {/* Description Text Box */}
                <div className="bg-white/80 dark:bg-oriental-dark-card p-3 rounded-xl border border-amber-200/50 dark:border-amber-900/30 text-xs text-slate-700 dark:text-amber-200/80 leading-relaxed font-sans">
                  {ev.description}
                </div>
              </div>

              {/* Action Bar: Notification Toggle Button & Admin Delete */}
              <div className="pt-2.5 mt-3 border-t border-amber-200/50 dark:border-amber-900/40 flex items-center justify-between">
                <button
                  onClick={() => handleToggleNotify(ev)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-2xs ${
                    ev.notify
                      ? 'bg-amber-200/90 dark:bg-amber-900/60 text-oriental-red-900 dark:text-oriental-gold-300 border border-oriental-gold-500/40 hover:bg-amber-300'
                      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                  }`}
                  title={ev.notify ? 'Tắt thông báo nhắc nhở' : 'Bật thông báo nhắc nhở ngày lễ này'}
                >
                  {ev.notify ? (
                    <>
                      <Bell className="w-3.5 h-3.5 text-oriental-gold-600 dark:text-oriental-gold-400 animate-pulse" />
                      <span>Đã bật nhắc nhở</span>
                    </>
                  ) : (
                    <>
                      <BellOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>Tắt nhắc nhở</span>
                    </>
                  )}
                </button>

                {isAdminMode && (
                  <button
                    onClick={() => handleDeleteEvent(ev.id, ev.name)}
                    className="p-1.5 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-lg text-xs flex items-center gap-1 font-semibold transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Admin Add Custom Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-oriental-dark-card rounded-2xl max-w-md w-full p-5 shadow-2xl border border-amber-200 dark:border-oriental-dark-border">
            <h3 className="text-lg font-serif font-bold text-oriental-red-900 dark:text-oriental-gold-400 mb-3">
              Thêm Sự Kiện / Ngày Lễ Mới (Admin)
            </h3>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium mb-1">Tên Ngày Lễ / Sự Kiện</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nhập tên sự kiện..."
                  className="w-full px-3 py-2 bg-amber-50 dark:bg-oriental-dark-bg border border-amber-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Mô Tả Ý Nghĩa</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Mô tả tóm tắt ý nghĩa ngày lễ..."
                  className="w-full px-3 py-2 bg-amber-50 dark:bg-oriental-dark-bg border border-amber-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1">Loại Lịch</label>
                  <select
                    value={newIsLunar ? 'lunar' : 'solar'}
                    onChange={(e) => setNewIsLunar(e.target.value === 'lunar')}
                    className="w-full px-3 py-2 bg-amber-50 dark:bg-oriental-dark-bg border border-amber-300 rounded-xl font-bold"
                  >
                    <option value="lunar">🌙 Lịch Âm</option>
                    <option value="solar">☀️ Lịch Dương</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">Phân Loại</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as EventType)}
                    className="w-full px-3 py-2 bg-amber-50 dark:bg-oriental-dark-bg border border-amber-300 rounded-xl font-bold"
                  >
                    <option value="tet">🏮 Tết Truyền Thống</option>
                    <option value="phat-giao">🪷 Phật Giáo</option>
                    <option value="dan-gian">📜 Dân Gian & Quốc Lễ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1">Ngày ({newIsLunar ? 'Âm' : 'Dương'})</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={newDay}
                    onChange={(e) => setNewDay(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-amber-50 dark:bg-oriental-dark-bg border border-amber-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Tháng ({newIsLunar ? 'Âm' : 'Dương'})</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={newMonth}
                    onChange={(e) => setNewMonth(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-amber-50 dark:bg-oriental-dark-bg border border-amber-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Màu Sắc Nhãn</label>
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-full h-9 p-1 bg-amber-50 border border-amber-300 rounded-xl cursor-pointer"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-200 rounded-xl font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-oriental-red-800 text-oriental-gold-300 font-bold rounded-xl"
                >
                  Lưu Sự Kiện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
