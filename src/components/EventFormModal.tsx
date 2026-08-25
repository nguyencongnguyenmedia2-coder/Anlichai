import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { EventItem, EventType } from '../types';

interface EventFormModalProps {
  initialEvent?: EventItem | null;
  onSave: (event: EventItem) => void;
  onClose: () => void;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  initialEvent,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(initialEvent?.name || '');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [lunarDay, setLunarDay] = useState(initialEvent?.lunarDay || 1);
  const [lunarMonth, setLunarMonth] = useState(initialEvent?.lunarMonth || 1);
  const [type, setType] = useState<EventType>(initialEvent?.type || 'phat-giao');
  const [color, setColor] = useState(initialEvent?.color || '#D97706');
  const [image, setImage] = useState(initialEvent?.image || '');
  const [notify, setNotify] = useState(initialEvent?.notify ?? true);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Vui lòng chọn ảnh nhỏ hơn 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const event: EventItem = {
      id: initialEvent?.id || `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      lunarDay,
      lunarMonth,
      isLunar: true,
      type,
      color,
      image,
      notify,
      isCustom: true,
    };

    onSave(event);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-oriental-dark-card rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 dark:border-oriental-dark-border relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/40 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-serif font-bold text-oriental-red-900 dark:text-oriental-gold-400 mb-4">
          {initialEvent ? 'Chỉnh Sửa Sự Kiện' : 'Thêm Sự Kiện Lễ Hội Mới'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-amber-200 mb-1">
              Tên Sự Kiện / Lễ Hội *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Ngày Vía Quan Thế Âm..."
              className="w-full px-3 py-2 bg-amber-50/50 dark:bg-oriental-dark-bg border border-amber-300 dark:border-amber-800 rounded-lg text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-amber-200 mb-1">
                Mùng (Ngày Âm)
              </label>
              <select
                value={lunarDay}
                onChange={(e) => setLunarDay(Number(e.target.value))}
                className="w-full px-3 py-2 bg-amber-50/50 dark:bg-oriental-dark-bg border border-amber-300 dark:border-amber-800 rounded-lg text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    Ngày {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-amber-200 mb-1">
                Tháng Âm Lịch
              </label>
              <select
                value={lunarMonth}
                onChange={(e) => setLunarMonth(Number(e.target.value))}
                className="w-full px-3 py-2 bg-amber-50/50 dark:bg-oriental-dark-bg border border-amber-300 dark:border-amber-800 rounded-lg text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Tháng {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-amber-200 mb-1">
                Phân Loại
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="w-full px-3 py-2 bg-amber-50/50 dark:bg-oriental-dark-bg border border-amber-300 dark:border-amber-800 rounded-lg text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500"
              >
                <option value="phat-giao">Phật Giáo</option>
                <option value="dan-gian">Dân Gian Truyền Thống</option>
                <option value="tet">Tết Cổ Truyền</option>
                <option value="khac">Khác</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-amber-200 mb-1">
                Màu Nhãn Trên Lịch
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-9 p-1 bg-amber-50/50 dark:bg-oriental-dark-bg border border-amber-300 dark:border-amber-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-amber-200 mb-1">
              Mô Tả Ý Nghĩa Sự Kiện
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập chi tiết ý nghĩa, hoạt động lễ cúng..."
              className="w-full px-3 py-2 bg-amber-50/50 dark:bg-oriental-dark-bg border border-amber-300 dark:border-amber-800 rounded-lg text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-amber-200 mb-1">
              Hình Ảnh Minh Họa (URL hoặc Upload)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 bg-amber-50/50 dark:bg-oriental-dark-bg border border-amber-300 dark:border-amber-800 rounded-lg text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500"
              />
              <label className="px-3 py-2 bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 rounded-lg cursor-pointer hover:bg-amber-300 flex items-center gap-1 font-medium">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            {image && (
              <div className="mt-2 flex items-center space-x-2">
                <img src={image} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-amber-300" />
                <span className="text-[10px] text-slate-500">Ảnh xem trước</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="notify"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              className="w-4 h-4 text-oriental-gold-600 rounded focus:ring-oriental-gold-500"
            />
            <label htmlFor="notify" className="font-medium text-slate-700 dark:text-amber-200">
              Nhắc nhở thông báo khi đến ngày lễ này
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-amber-200 dark:border-oriental-dark-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-oriental-red-800 hover:bg-oriental-red-900 text-oriental-gold-300 font-semibold rounded-lg shadow-md border border-oriental-gold-500/40"
            >
              Lưu Sự Kiện
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
