import React, { useState } from 'react';
import { Settings, Key, Bell, Palette, Save, CheckCircle, Upload, ShieldCheck, Lock, Unlock, Globe, User } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  isAdminMode: boolean;
  onOpenAdminLogin: () => void;
  onExitAdminMode: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  isAdminMode,
  onOpenAdminLogin,
  onExitAdminMode,
}) => {
  const [adminPin, setAdminPin] = useState(settings.adminPin || '123456');
  const [timeZone, setTimeZone] = useState(settings.timeZone || 'Asia/Ho_Chi_Minh');
  const [theme, setTheme] = useState<'light' | 'dark' | 'oriental'>(settings.theme);
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled);
  const [notificationTime, setNotificationTime] = useState(settings.notificationTime || '07:00');
  const [bgType, setBgType] = useState<'default' | 'pattern' | 'custom'>(settings.bgType || 'default');
  const [customBgUrl, setCustomBgUrl] = useState(settings.customBgUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('File ảnh quá lớn (>4MB). Vui lòng chọn ảnh dung lượng nhỏ hơn.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomBgUrl(reader.result as string);
        setBgType('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppSettings = {
      ...settings,
      adminPin: adminPin.trim(),
      timeZone,
      theme,
      notificationsEnabled,
      notificationTime,
      bgType,
      customBgUrl,
    };
    onSaveSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-white/80 dark:bg-oriental-dark-card/90 rounded-2xl shadow-xl border border-amber-200/80 dark:border-oriental-dark-border p-6 backdrop-blur-md max-w-3xl mx-auto">
      
      <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-oriental-dark-border pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-oriental-red-800 dark:text-oriental-gold-400" />
          <div>
            <h2 className="text-xl font-serif font-bold text-oriental-red-900 dark:text-oriental-gold-400">
              Cài Đặt Ứng Dụng
            </h2>
            <p className="text-xs text-amber-800/70 dark:text-amber-200/60">
              Tùy chỉnh giao diện, múi giờ, thông báo nhắc nhở và quản trị hệ thống
            </p>
          </div>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-300">
            <CheckCircle className="w-4 h-4" /> Đã lưu cài đặt!
          </span>
        )}
      </div>

      {/* Section 0: Admin Access Management Card */}
      <div className="mb-6 bg-gradient-to-r from-amber-100/80 to-amber-50/60 dark:from-amber-950/40 dark:to-oriental-dark-bg p-4 rounded-xl border border-oriental-gold-500/40 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-oriental-red-800 text-oriental-gold-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-oriental-red-900 dark:text-oriental-gold-400">
              {isAdminMode ? 'Đang ở Chế Độ Quản Trị Viên (Admin)' : 'Chế Độ Người Dùng Thường'}
            </h3>
            <p className="text-slate-600 dark:text-amber-200/70 text-[11px] mt-0.5">
              {isAdminMode
                ? 'Bạn có toàn quyền thêm, sửa, xóa sự kiện lễ hội và thay đổi mã PIN quản trị.'
                : 'Người dùng xem lịch tự do không cần đăng ký. Bấm nút bên phải để nhập PIN Admin.'}
            </p>
          </div>
        </div>

        {isAdminMode ? (
          <button
            type="button"
            onClick={onExitAdminMode}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-oriental-red-950 font-bold rounded-lg shadow-sm flex items-center gap-1 shrink-0"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Thoát Admin</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAdminLogin}
            className="px-3.5 py-1.5 bg-oriental-red-800 hover:bg-oriental-red-900 text-oriental-gold-300 font-semibold rounded-lg shadow-sm flex items-center gap-1 shrink-0"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Mở Khóa Admin</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
        
        {/* Section 1: User Preferences (Available to everyone) */}
        <div className="bg-amber-50/50 dark:bg-oriental-dark-bg/60 p-4 rounded-xl border border-amber-200/60 dark:border-oriental-dark-border space-y-3">
          <h3 className="font-serif font-bold text-sm text-oriental-red-900 dark:text-oriental-gold-400 flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-600" />
            Tùy Biến Giao Diện & Múi Giờ
          </h3>

          <div>
            <label className="block font-medium text-slate-700 dark:text-amber-200 mb-2">
              Chế Độ Giao Diện
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'oriental', label: 'Á Đông Sang Trọng' },
                { id: 'dark', label: 'Chế Độ Tối (Dark)' },
                { id: 'light', label: 'Chế Độ Sáng (Light)' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id as any)}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                    theme === t.id
                      ? 'bg-oriental-red-800 text-oriental-gold-300 border-oriental-gold-500 shadow-sm'
                      : 'bg-white dark:bg-oriental-dark-card text-slate-700 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-medium text-slate-700 dark:text-amber-200 mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-amber-600" />
                Múi Giờ Xem Lịch
              </label>
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-oriental-dark-card border border-amber-300 dark:border-amber-800 rounded-lg text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500 font-medium"
              >
                <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (UTC+07:00 - Việt Nam)</option>
                <option value="Asia/Bangkok">Asia/Bangkok (UTC+07:00)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (UTC+09:00 - Nhật Bản)</option>
                <option value="Europe/Paris">Europe/Paris (UTC+01:00 - Pháp)</option>
                <option value="America/New_York">America/New_York (UTC-05:00 - Mỹ)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-amber-200 mb-1">
                Ảnh Nền Tùy Chỉnh (URL hoặc Tải Lên)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={customBgUrl}
                  onChange={(e) => {
                    setCustomBgUrl(e.target.value);
                    if (e.target.value) setBgType('custom');
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-2 bg-white dark:bg-oriental-dark-card border border-amber-300 dark:border-amber-800 rounded-lg text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500"
                />
                <label className="px-3 py-2 bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 rounded-lg cursor-pointer hover:bg-amber-300 flex items-center gap-1 font-medium text-xs shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                  <input type="file" accept="image/*" onChange={handleCustomBgUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Notifications Setup (Available to everyone) */}
        <div className="bg-amber-50/50 dark:bg-oriental-dark-bg/60 p-4 rounded-xl border border-amber-200/60 dark:border-oriental-dark-border space-y-3">
          <h3 className="font-serif font-bold text-sm text-oriental-red-900 dark:text-oriental-gold-400 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-600" />
            Cài Đặt Thông Báo Lễ Hội
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-slate-800 dark:text-amber-100 block">
                Bật Thông Báo Nhắc Nhở Lễ Lớn
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Phát thông báo Native Desktop (.exe) hoặc Web Notification vào mùng 15, ngày Phật Đản, Vu Lan...
              </span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-5 h-5 text-oriental-gold-600 rounded focus:ring-oriental-gold-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-medium text-slate-700 dark:text-amber-200 mb-1">
                Giờ Nhắc Nhở Hàng Ngày
              </label>
              <input
                type="time"
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-oriental-dark-card border border-amber-300 dark:border-amber-800 rounded-lg text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: AI Assistant Maintenance Notice */}
        <div className="bg-amber-100/60 dark:bg-amber-950/30 p-4 rounded-xl border border-oriental-gold-500/50 space-y-3">
          <div className="flex items-center justify-between border-b border-amber-300/60 dark:border-amber-800 pb-2">
            <h3 className="font-serif font-bold text-sm text-oriental-red-900 dark:text-oriental-gold-400 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-600" />
              Trạng Thái Trợ Lý AI Phong Thủy
            </h3>
            <span className="text-xs text-amber-800 dark:text-amber-300 font-bold bg-amber-200/80 dark:bg-amber-900 px-2.5 py-0.5 rounded-full border border-amber-400">
              🛠️ Đang Phát Triển & Bảo Trì
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-amber-200/80 leading-relaxed">
            Tính năng Trợ Lý AI hiện đang được bảo trì và nâng cấp thuật toán chuyên sâu để nâng cao chất lượng phản hồi âm dương ngũ hành.
          </p>
        </div>

        {/* Section 4: Admin Security Configuration (Admin Only) */}
        {isAdminMode && (
          <div className="bg-rose-50/60 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-300 dark:border-rose-900 space-y-3">
            <h3 className="font-serif font-bold text-sm text-oriental-red-900 dark:text-oriental-gold-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              Bảo Mật Quản Trị Viên (Admin Only)
            </h3>
            <div>
              <label className="block font-medium text-slate-700 dark:text-amber-200 mb-1">
                Mã PIN Đăng Nhập Admin Mới
              </label>
              <input
                type="text"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="123456"
                className="w-full max-w-xs px-3 py-2 bg-white dark:bg-oriental-dark-card border border-rose-300 dark:border-rose-800 rounded-lg text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500 font-mono font-bold text-center"
              />
            </div>
          </div>
        )}

        {/* Section: Designer & Developer Credits */}
        <div className="bg-amber-50/70 dark:bg-oriental-dark-bg/80 p-4 rounded-xl border border-oriental-gold-500/40 space-y-2">
          <h3 className="font-serif font-bold text-sm text-oriental-red-900 dark:text-oriental-gold-400 flex items-center gap-2">
            <User className="w-4 h-4 text-amber-600" />
            Thông Tin Tác Giả & Nhà Thiết Kế
          </h3>
          <div className="text-xs text-slate-700 dark:text-amber-200/90 leading-relaxed space-y-1">
            <p>
              • <strong>Nhà thiết kế & Phát triển:</strong> Nguyễn Công Nguyên
            </p>
            <p>
              • <strong>Số điện thoại / Zalo:</strong> <a href="tel:0934811307" className="font-bold text-oriental-red-800 dark:text-oriental-gold-400 underline">0934811307</a>
            </p>
            <p className="text-[11px] text-amber-900/70 dark:text-amber-300/60 pt-1">
              Bản quyền thuộc về Nguyễn Công Nguyên © 2026. Ứng dụng An Lịch AI - Xem ngày • Hiểu mình • Sống an.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-oriental-red-800 hover:bg-oriental-red-900 text-oriental-gold-300 font-bold rounded-xl shadow-oriental transition-all flex items-center space-x-2 border border-oriental-gold-500/40"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Cài Đặt</span>
          </button>
        </div>

      </form>

    </div>
  );
};
