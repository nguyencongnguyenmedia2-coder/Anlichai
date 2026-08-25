import React from 'react';
import { User, Trash2, Plus, Star } from 'lucide-react';
import { BirthProfile } from '../../types/astrology';
import { astrologyStorageService } from '../../services/astrologyStorageService';

interface SavedProfilesViewProps {
  onSelectProfile: (profile: BirthProfile) => void;
  onCreateNew: () => void;
}

export const SavedProfilesView: React.FC<SavedProfilesViewProps> = ({ onSelectProfile, onCreateNew }) => {
  const [profiles, setProfiles] = React.useState<BirthProfile[]>(() => astrologyStorageService.getProfiles());

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có muốn xóa hồ sơ "${name}" không?`)) {
      astrologyStorageService.deleteProfile(id);
      setProfiles(astrologyStorageService.getProfiles());
    }
  };

  const handleSetDefault = (profile: BirthProfile) => {
    astrologyStorageService.saveProfile({ ...profile, isDefault: true });
    setProfiles(astrologyStorageService.getProfiles());
  };

  return (
    <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-3xl p-5 sm:p-8 border-2 border-amber-200/90 dark:border-oriental-dark-border shadow-xl">
      
      <div className="flex items-center justify-between pb-4 border-b border-amber-200/80 dark:border-oriental-dark-border mb-6">
        <div>
          <h3 className="font-serif font-black text-xl text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide">
            👥 Hồ Sơ Bản Đồ Sao Đã Lưu
          </h3>
          <p className="text-xs text-amber-900/75 dark:text-amber-200/70 mt-0.5">
            Quản lý hồ sơ bản đồ sao cho bản thân, người thân và bạn bè.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="px-4 py-2 rounded-xl bg-oriental-red-800 text-oriental-gold-300 font-bold text-xs shadow-oriental border border-oriental-gold-400/40 flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Hồ Sơ Mới</span>
        </button>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-10 bg-amber-50/60 dark:bg-oriental-dark-bg rounded-2xl border border-dashed border-amber-300">
          <User className="w-12 h-12 text-amber-400 mx-auto mb-2 opacity-60" />
          <p className="text-xs text-amber-900/70 dark:text-amber-200/70 font-medium mb-3">
            Chưa có hồ sơ bản đồ sao nào được lưu.
          </p>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 rounded-xl bg-amber-200 dark:bg-amber-900/60 text-oriental-red-900 dark:text-oriental-gold-300 font-bold text-xs border border-amber-300"
          >
            Tạo Hồ Sơ Đầu Tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => (
            <div 
              key={p.id}
              className="bg-amber-50/70 dark:bg-oriental-dark-bg p-4 rounded-2xl border-2 border-amber-200/80 dark:border-oriental-dark-border hover:border-oriental-gold-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif font-black text-base text-oriental-red-900 dark:text-oriental-gold-400 truncate">
                    {p.fullName}
                  </span>

                  {p.isDefault ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-400 text-oriental-red-950 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Mặc Định
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(p)}
                      className="text-[10px] font-bold text-amber-700 dark:text-amber-300 hover:underline"
                    >
                      Đặt mặc định
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-700 dark:text-amber-200/80 space-y-0.5">
                  <div>📅 生 Sinh: {p.birthDate} {p.unknownTime ? '(Không rõ giờ)' : `lúc ${p.birthTime}`}</div>
                  <div>📍 🗺️ Nơi sinh: {p.locationName}, {p.country}</div>
                </p>
              </div>

              <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-amber-200/60 dark:border-oriental-dark-border">
                <button
                  onClick={() => onSelectProfile(p)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-oriental-red-800 text-oriental-gold-300 font-bold text-xs shadow-oriental text-center hover:brightness-110 active:scale-95 transition-all"
                >
                  Xem Bản Đồ Sao
                </button>

                <button
                  onClick={() => handleDelete(p.id, p.fullName)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                  title="Xóa hồ sơ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
