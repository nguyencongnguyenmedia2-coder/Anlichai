import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Bell, Save, Check } from 'lucide-react';
import { PersonalEvent, PersonalEventType } from '../types';

interface PersonalEventModalProps {
  initialEvent?: PersonalEvent | null;
  onSave: (eventData: Omit<PersonalEvent, 'id' | 'createdAt'> | PersonalEvent) => void;
  onClose: () => void;
}

export const CATEGORY_CONFIG: Record<PersonalEventType, { label: string; icon: string; color: string; defaultRemind: number }> = {
  'giỗ': { label: 'Ngày Giỗ', icon: '🕯️', color: '#991b1b', defaultRemind: 3 },
  'sinh-nhat': { label: 'Sinh Nhật', icon: '🎂', color: '#ec4899', defaultRemind: 1 },
  'ngay-cuoi': { label: 'Ngày Cưới', icon: '💍', color: '#eab308', defaultRemind: 3 },
  'khai-truong': { label: 'Khai Trương', icon: '🏮', color: '#dc2626', defaultRemind: 1 },
  'di-chua': { label: 'Lịch Đi Chùa', icon: '🪷', color: '#d97706', defaultRemind: 1 },
  'hop': { label: 'Ngày Họp', icon: '💼', color: '#2563eb', defaultRemind: 0 },
  'cong-viec': { label: 'Công Việc', icon: '📌', color: '#0284c7', defaultRemind: 0 },
  'deadline': { label: 'Deadline', icon: '⏳', color: '#ea580c', defaultRemind: 1 },
  'di-xa': { label: 'Đi Xa / Du Lịch', icon: '✈️', color: '#059669', defaultRemind: 3 },
  'quan-trong': { label: 'Ngày Quan Trọng', icon: '⭐', color: '#9333ea', defaultRemind: 1 },
};

export const PersonalEventModal: React.FC<PersonalEventModalProps> = ({
  initialEvent,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [category, setCategory] = useState<PersonalEventType>(initialEvent?.category || 'giỗ');
  const [isLunar, setIsLunar] = useState<boolean>(initialEvent?.isLunar ?? true); // Default Lunar for Giỗ
  const [day, setDay] = useState<number>(initialEvent?.day || 15);
  const [month, setMonth] = useState<number>(initialEvent?.month || 8);
  const [time, setTime] = useState<string>(initialEvent?.time || '08:00');
  const [remindBeforeDays, setRemindBeforeDays] = useState<number>(initialEvent?.remindBeforeDays ?? 3);
  const [note, setNote] = useState<string>(initialEvent?.note || '');
  const [color, setColor] = useState<string>(initialEvent?.color || CATEGORY_CONFIG['giỗ'].color);
  const [notify, setNotify] = useState<boolean>(initialEvent?.notify ?? true);

  const handleCategoryChange = (cat: PersonalEventType) => {
    setCategory(cat);
    const cfg = CATEGORY_CONFIG[cat];
    setColor(cfg.color);
    setRemindBeforeDays(cfg.defaultRemind);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tên lịch cá nhân');
      return;
    }

    if (initialEvent) {
      onSave({
        ...initialEvent,
        title: title.trim(),
        category,
        isLunar,
        day,
        month,
        time,
        remindBeforeDays,
        note: note.trim(),
        color,
        notify,
      });
    } else {
      onSave({
        title: title.trim(),
        category,
        isLunar,
        day,
        month,
        time,
        remindBeforeDays,
        note: note.trim(),
        color,
        notify,
      });
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-oriental-dark-card rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-amber-200 dark:border-oriental-dark-border relative my-auto space-y-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-200/80 dark:border-oriental-dark-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-oriental-red-800 text-oriental-gold-300 shadow-oriental text-xl flex items-center justify-center border border-oriental-gold-500/40">
              🗓️
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-extrabold text-oriental-red-900 dark:text-oriental-gold-400">
                {initialEvent ? 'Chỉnh Sửa Lịch Cá Nhân' : 'Thêm Lịch Cá Nhân Mới'}
              </h3>
              <p className="text-xs text-amber-900/75 dark:text-amber-200/70">
                Nhắc nhở Âm Lịch & Dương Lịch chuẩn xác
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/40 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          
          {/* Title Input */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-amber-200 mb-1">
              Tên Sự Kiện / Công Việc <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Giỗ Ông Nội, Sinh Nhật Vợ, Lịch Đi Chùa..."
              className="w-full px-3.5 py-2.5 bg-amber-50/50 dark:bg-oriental-dark-bg border border-amber-300 dark:border-amber-800 rounded-xl text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500 font-bold text-xs sm:text-sm"
            />
          </div>

          {/* Category Selector Grid */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-amber-200 mb-1.5">
              Phân Loại Sự Kiện
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-amber-50/40 dark:bg-oriental-dark-bg/60 p-2 rounded-2xl border border-amber-200/60">
              {(Object.keys(CATEGORY_CONFIG) as PersonalEventType[]).map((catKey) => {
                const cfg = CATEGORY_CONFIG[catKey];
                const selected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => handleCategoryChange(catKey)}
                    className={`flex items-center space-x-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                      selected
                        ? 'bg-oriental-red-800 text-oriental-gold-300 shadow-sm border border-oriental-gold-500/40 font-bold scale-[1.02]'
                        : 'bg-white dark:bg-oriental-dark-card text-slate-700 dark:text-amber-200/80 hover:bg-amber-100/80'
                    }`}
                  >
                    <span className="text-sm shrink-0">{cfg.icon}</span>
                    <span className="truncate">{cfg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Type Selector: Âm Lịch vs Dương Lịch */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-amber-200 mb-1.5">
              Loại Lịch Tính Ngày
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setIsLunar(true)}
                className={`py-2.5 px-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
                  isLunar
                    ? 'bg-oriental-red-800 text-oriental-gold-300 border-oriental-gold-500 shadow-sm'
                    : 'bg-amber-50 dark:bg-oriental-dark-bg text-slate-600 dark:text-slate-400 border-amber-200 dark:border-amber-900'
                }`}
              >
                <span>🌙 Lịch Âm (Giỗ, Chùa, Vía...)</span>
                {isLunar && <Check className="w-4 h-4 text-oriental-gold-400" />}
              </button>

              <button
                type="button"
                onClick={() => setIsLunar(false)}
                className={`py-2.5 px-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
                  !isLunar
                    ? 'bg-oriental-red-800 text-oriental-gold-300 border-oriental-gold-500 shadow-sm'
                    : 'bg-amber-50 dark:bg-oriental-dark-bg text-slate-600 dark:text-slate-400 border-amber-200 dark:border-amber-900'
                }`}
              >
                <span>☀️ Lịch Dương (Họp, Sinh nhật)</span>
                {!isLunar && <Check className="w-4 h-4 text-oriental-gold-400" />}
              </button>
            </div>
          </div>

          {/* Day & Month Pickers */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 dark:text-amber-200 mb-1 text-xs">
                Ngày {isLunar ? 'Âm' : 'Dương'}
              </label>
              <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full px-3 py-2 bg-amber-50/50 dark:bg-oriental-dark-bg border border-amber-300 dark:border-amber-800 rounded-xl text-slate-800 dark:text-amber-100 font-bold text-xs sm:text-sm"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {isLunar ? `Mùng ${d}` : `Ngày ${d}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-amber-200 mb-1 text-xs">
                Tháng {isLunar ? 'Âm' : 'Dương'}
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-3 py-2 bg-amber-50/50 dark:bg-oriental-dark-bg border border-amber-300 dark:border-amber-800 rounded-xl text-slate-800 dark:text-amber-100 font-bold text-xs sm:text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Tháng {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-amber-200 mb-1 text-xs">
                Giờ Diễn Ra
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-2 py-1.5 bg-amber-50/50 dark:bg-oriental-dark-bg border border-amber-300 dark:border-amber-800 rounded-xl text-slate-800 dark:text-amber-100 font-bold text-xs sm:text-sm text-center"
              />
            </div>
          </div>

          {/* Reminder Before Days Selector */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-amber-200 mb-1 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              Cấu Hình Nhắc Nhở Trước
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { days: 0, label: 'Đúng ngày' },
                { days: 1, label: 'Trước 1 ngày' },
                { days: 3, label: 'Trước 3 ngày' },
                { days: 7, label: 'Trước 7 ngày' },
              ].map((r) => (
                <button
                  key={r.days}
                  type="button"
                  onClick={() => setRemindBeforeDays(r.days)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                    remindBeforeDays === r.days
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-amber-50/50 dark:bg-oriental-dark-bg text-slate-700 dark:text-slate-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100/60'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note / Memo */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-amber-200 mb-1">
              Ghi Chú / Chi Tiết Mâm Cỗ, Công Việc
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú thêm thông tin chuẩn bị..."
              className="w-full px-3.5 py-2 bg-amber-50/50 dark:bg-oriental-dark-bg border border-amber-300 dark:border-amber-800 rounded-xl text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500 text-xs sm:text-sm font-medium"
            />
          </div>

          {/* Notify Switch */}
          <div className="flex items-center justify-between bg-amber-50/50 dark:bg-oriental-dark-bg/50 p-3 rounded-xl border border-amber-200/60">
            <span className="font-bold text-xs sm:text-sm text-slate-700 dark:text-amber-200 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" />
              Bật Chuông Nhắc Nhở Sự Kiện Này
            </span>
            <input
              type="checkbox"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              className="w-4 h-4 text-oriental-gold-600 rounded cursor-pointer"
            />
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-3 flex justify-end space-x-2.5 border-t border-amber-200/60 dark:border-oriental-dark-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-300 transition-colors"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-oriental-red-800 hover:bg-oriental-red-900 text-oriental-gold-300 font-extrabold rounded-xl shadow-oriental transition-all flex items-center space-x-1.5 border border-oriental-gold-500/40 text-xs sm:text-sm"
            >
              <Save className="w-4 h-4 text-oriental-gold-400" />
              <span>{initialEvent ? 'Cập Nhật Lịch' : 'Lưu Lịch Cá Nhân'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>,
    document.body
  );
};
