import React, { useState } from 'react';
import { Compass, CheckCircle2, XCircle, Sparkles, User, Info, Share2 } from 'lucide-react';
import { lunarService } from '../services/lunarService';
import { BatTrachResult } from '../types';

export const BatTrachView: React.FC = () => {
  const [birthYear, setBirthYear] = useState<number>(1995);
  const [gender, setGender] = useState<'nam' | 'nu'>('nam');
  const [result, setResult] = useState<BatTrachResult>(() =>
    lunarService.getBatTrachPhongThuy(1995, 'nam')
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (birthYear < 1920 || birthYear > 2030) {
      alert('Vui lòng nhập năm sinh hợp lệ từ 1920 đến 2030');
      return;
    }
    const res = lunarService.getBatTrachPhongThuy(birthYear, gender);
    setResult(res);
  };

  const handleShareResult = () => {
    const text = `☯️ TRA CỨU BÁT TRẠCH PHONG THỦY - AN LỊCH AI\nNăm sinh: ${result.birthYear} (${result.gender === 'nam' ? 'Nam' : 'Nữ'})\nCung mệnh: ${result.cungMenh} (${result.menhNguHanh} - Mệnh ${result.element})\n✨ Hướng Tốt: ${result.goodDirections.map(g => `${g.name} (${g.direction})`).join(', ')}\n🔗 Xem ngay tại: https://www.anlichai.online/bat-trach`;
    if (navigator.share) {
      navigator.share({
        title: `Tra Cứu Bát Trạch Phong Thủy - An Lịch AI`,
        text: text,
        url: 'https://www.anlichai.online/bat-trach'
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Đã sao chép kết quả tra cứu Bát Trạch Phong Thủy vào bộ nhớ tạm!');
    }
  };

  return (
    <div className="bg-white/90 dark:bg-oriental-dark-card/95 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-amber-200/90 dark:border-oriental-dark-border p-4 sm:p-6 backdrop-blur-md transition-all space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-200/80 dark:border-oriental-dark-border">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-oriental-red-800 to-oriental-red-950 text-oriental-gold-300 flex items-center justify-center shadow-oriental text-xl shrink-0 border border-oriental-gold-400">
            🧭
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide flex items-center gap-2">
              Tra Cứu Bát Trạch Phong Thủy
            </h2>
            <p className="text-xs text-amber-900/75 dark:text-amber-200/70 mt-0.5">
              Xem hướng nhà, hướng cửa chính và hướng bàn làm việc đại cát đại lợi theo Cung Mệnh chuẩn xác
            </p>
          </div>
        </div>

        <button
          onClick={handleShareResult}
          className="self-start md:self-auto flex items-center gap-1.5 px-3.5 py-2 bg-amber-100 dark:bg-amber-900/60 text-oriental-red-900 dark:text-oriental-gold-300 rounded-xl font-bold text-xs hover:bg-amber-200 transition-colors border border-amber-300/60 shadow-2xs"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Chia sẻ kết quả</span>
        </button>
      </div>

      {/* Input Form Section */}
      <form onSubmit={handleCalculate} className="bg-amber-50/60 dark:bg-oriental-dark-bg/60 p-4 sm:p-5 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
          
          {/* Year Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-amber-200 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-600" />
              Năm sinh (Dương Lịch):
            </label>
            <input
              type="number"
              min="1920"
              max="2030"
              value={birthYear}
              onChange={(e) => setBirthYear(parseInt(e.target.value) || 1995)}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-oriental-dark-card border border-amber-300/80 dark:border-amber-900 text-xs sm:text-sm font-bold text-oriental-red-900 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-oriental-gold-500 shadow-2xs"
              required
            />
          </div>

          {/* Gender Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-amber-200 mb-1">
              Giới tính gia chủ:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('nam')}
                className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
                  gender === 'nam'
                    ? 'bg-oriental-red-800 text-oriental-gold-300 border-oriental-gold-500 shadow-oriental'
                    : 'bg-white dark:bg-oriental-dark-card text-slate-700 dark:text-amber-200 border-amber-200 dark:border-amber-900'
                }`}
              >
                👨 Nam Giới
              </button>

              <button
                type="button"
                onClick={() => setGender('nu')}
                className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
                  gender === 'nu'
                    ? 'bg-oriental-red-800 text-oriental-gold-300 border-oriental-gold-500 shadow-oriental'
                    : 'bg-white dark:bg-oriental-dark-card text-slate-700 dark:text-amber-200 border-amber-200 dark:border-amber-900'
                }`}
              >
                👩 Nữ Giới
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-oriental-red-800 to-oriental-red-950 text-oriental-gold-300 font-extrabold text-xs sm:text-sm rounded-xl border border-oriental-gold-400 shadow-oriental hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-oriental-gold-400" />
              <span>Tra Cứu Bát Trạch</span>
            </button>
          </div>

        </div>
      </form>

      {/* Result Display Section */}
      {result && (
        <div className="space-y-6">
          
          {/* Cung Menh Result Badge Box */}
          <div className="bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/80 dark:from-oriental-dark-bg dark:to-oriental-dark-card p-4 sm:p-5 rounded-2xl border-l-4 border-oriental-gold-500 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            
            <div className="bg-white/80 dark:bg-oriental-dark-card/80 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/30">
              <span className="text-[10px] text-slate-500 dark:text-amber-200/70 block uppercase font-bold">Cung Mệnh</span>
              <strong className="text-base sm:text-xl font-serif text-oriental-red-900 dark:text-oriental-gold-400 font-black">
                {result.cungMenh}
              </strong>
            </div>

            <div className="bg-white/80 dark:bg-oriental-dark-card/80 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/30">
              <span className="text-[10px] text-slate-500 dark:text-amber-200/70 block uppercase font-bold">Nhóm Mệnh</span>
              <strong className="text-sm sm:text-base font-serif text-oriental-red-900 dark:text-oriental-gold-400 font-black">
                {result.menhNguHanh}
              </strong>
            </div>

            <div className="bg-white/80 dark:bg-oriental-dark-card/80 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/30">
              <span className="text-[10px] text-slate-500 dark:text-amber-200/70 block uppercase font-bold">Ngũ Hành Cung</span>
              <strong className="text-sm sm:text-base font-serif text-oriental-red-900 dark:text-oriental-gold-400 font-black">
                Mệnh {result.element}
              </strong>
            </div>

            <div className="bg-white/80 dark:bg-oriental-dark-card/80 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/30">
              <span className="text-[10px] text-slate-500 dark:text-amber-200/70 block uppercase font-bold">Tuổi Can Chi</span>
              <strong className="text-sm sm:text-base font-serif text-oriental-red-900 dark:text-oriental-gold-400 font-black">
                {result.birthYear} ({result.gender === 'nam' ? 'Nam' : 'Nữ'})
              </strong>
            </div>

          </div>

          {/* 4 Hướng Tốt (Good Directions) */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-serif font-extrabold text-emerald-800 dark:text-emerald-400 flex items-center gap-2 border-b border-emerald-200 dark:border-emerald-950 pb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>4 Hướng Tốt Cát Tường (Nên Đặt Hướng Nhà, Hướng Cửa, Bàn Làm Việc)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {result.goodDirections.map((dir, idx) => (
                <div
                  key={idx}
                  className="bg-emerald-50/60 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-1.5 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-emerald-700 text-white shadow-2xs">
                      ✨ {dir.name}
                    </span>
                    <span className="font-serif font-extrabold text-sm text-emerald-900 dark:text-emerald-300">
                      Hướng {dir.direction}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-emerald-100/90 leading-relaxed pt-1">
                    {dir.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Hướng Xấu (Bad Directions) */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base sm:text-lg font-serif font-extrabold text-rose-800 dark:text-rose-400 flex items-center gap-2 border-b border-rose-200 dark:border-rose-950 pb-2">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>4 Hướng Xấu Hung Khí (Nên Tránh Đặt Hướng Nhà, Bàn Làm Việc)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {result.badDirections.map((dir, idx) => (
                <div
                  key={idx}
                  className="bg-rose-50/60 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 space-y-1.5 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-rose-700 text-white shadow-2xs">
                      ⚠️ {dir.name}
                    </span>
                    <span className="font-serif font-extrabold text-sm text-rose-900 dark:text-rose-300">
                      Hướng {dir.direction}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-rose-100/90 leading-relaxed pt-1">
                    {dir.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Advice Note Box */}
          <div className="p-4 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 border border-oriental-gold-500/40 text-xs text-oriental-red-900 dark:text-amber-200 leading-relaxed flex items-start gap-2.5">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Lời khuyên Bát Trạch Phong Thủy:</strong>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li><strong>Hướng Nhà & Hướng Cửa Chính:</strong> Ưu tiên chọn hướng <em>Sinh Khí</em> hoặc <em>Thiên Y</em> để đón sinh khí dồi dào.</li>
                <li><strong>Hướng Bàn Làm Việc:</strong> Đặt ngồi quay mặt nhìn về hướng <em>Sinh Khí</em> hoặc <em>Phục Vị</em> giúp tinh thần minh mẫn, công danh thăng tiến.</li>
                <li><strong>Hướng Giường Ngủ:</strong> Kê đầu giường quay về hướng <em>Thiên Y</em> hoặc <em>Diên Niên</em> giúp giấc ngủ sâu, sức khỏe dồi dào.</li>
              </ul>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
