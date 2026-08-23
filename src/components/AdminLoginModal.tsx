import React, { useState } from 'react';
import { X, Lock, ShieldCheck } from 'lucide-react';

interface AdminLoginModalProps {
  correctPin: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  correctPin,
  onSuccess,
  onClose,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === (correctPin || '123456')) {
      onSuccess();
    } else {
      setError('Mã PIN không đúng. Vui lòng thử lại!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-oriental-dark-card rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-amber-200 dark:border-oriental-dark-border relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/40 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-oriental-red-800 text-oriental-gold-300 flex items-center justify-center mb-2 shadow-oriental">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-bold text-oriental-red-900 dark:text-oriental-gold-400">
            Xác Thực Quyền Quản Trị
          </h3>
          <p className="text-xs text-slate-600 dark:text-amber-200/70 mt-1">
            Nhập mã PIN để mở khóa chức năng Thêm / Sửa / Xóa sự kiện và cài đặt hệ thống.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              autoFocus
              maxLength={12}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              placeholder="Nhập mã PIN..."
              className="w-full text-center text-lg tracking-widest px-4 py-2.5 bg-amber-50/50 dark:bg-oriental-dark-bg border border-amber-300 dark:border-amber-800 rounded-xl text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500"
            />
            {error && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 text-center font-medium">
                {error}
              </p>
            )}
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center bg-amber-50 dark:bg-oriental-dark-bg p-2 rounded-lg border border-amber-200/40">
            Mã PIN mặc định: <strong className="text-oriental-red-800 dark:text-oriental-gold-400 font-mono">123456</strong> (Có thể đổi trong Cài đặt).
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-oriental-red-800 hover:bg-oriental-red-900 text-oriental-gold-300 font-semibold text-xs rounded-lg shadow-md border border-oriental-gold-500/40 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Mở Khóa Quản Trị</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
