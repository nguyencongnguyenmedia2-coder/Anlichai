import React, { useState } from 'react';
import { Compass, CheckCircle2, XCircle, User, Info, Share2, Sparkles, Home, Briefcase, BedDouble, Utensils } from 'lucide-react';
import { lunarService } from '../services/lunarService';
import { BatTrachResult } from '../types';

export const BatTrachView: React.FC = () => {
  const [birthYearStr, setBirthYearStr] = useState<string>('1995');
  const [gender, setGender] = useState<'nam' | 'nu'>('nam');
  const [activeGuideTab, setActiveGuideTab] = useState<'house' | 'desk' | 'bed' | 'kitchen'>('house');

  const activeYear = parseInt(birthYearStr, 10) || 1995;

  const [result, setResult] = useState<BatTrachResult>(() =>
    lunarService.getBatTrachPhongThuy(1995, 'nam')
  );

  const updateYear = (valStr: string, targetGender = gender) => {
    setBirthYearStr(valStr);
    const parsed = parseInt(valStr, 10);
    if (!isNaN(parsed) && parsed >= 1920 && parsed <= 2030) {
      const res = lunarService.getBatTrachPhongThuy(parsed, targetGender);
      setResult(res);
    }
  };

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseInt(birthYearStr, 10);
    if (isNaN(parsed) || parsed < 1920 || parsed > 2030) {
      alert('Vui lòng nhập năm sinh hợp lệ từ 1920 đến 2030');
      return;
    }
    const res = lunarService.getBatTrachPhongThuy(parsed, gender);
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

  // Map 8 Compass Directions & Positions for La Ban SVG
  // 0° = North (Bắc), 45° = NE (Đông Bắc), 90° = East (Đông), 135° = SE (Đông Nam),
  // 180° = South (Nam), 225° = SW (Tây Nam), 270° = West (Tây), 315° = NW (Tây Bắc)
  const compassDirections = [
    { dir: 'Bắc', angle: 270 },
    { dir: 'Đông Bắc', angle: 315 },
    { dir: 'Đông', angle: 0 },
    { dir: 'Đông Nam', angle: 45 },
    { dir: 'Nam', angle: 90 },
    { dir: 'Tây Nam', angle: 135 },
    { dir: 'Tây', angle: 180 },
    { dir: 'Tây Bắc', angle: 225 },
  ];

  // Helper to find direction info for La Ban
  const getDirectionDetail = (dirName: string) => {
    const good = result.goodDirections.find(g => g.direction === dirName);
    if (good) return { type: 'good', name: good.name };
    const bad = result.badDirections.find(b => b.direction === dirName);
    if (bad) return { type: 'bad', name: bad.name };
    return { type: 'neutral', name: 'Trung Bình' };
  };

  // Five Elements & Lucky Numbers Info by Cung
  const cungMetaMap: Record<string, { luckyNums: string; colors: string; elementMeaning: string }> = {
    'Khảm': { luckyNums: '1, 6', colors: 'Xanh Dương, Đen, Trắng', elementMeaning: 'Mệnh Thủy đại diện cho trí tuệ, sự linh hoạt và khả năng ứng biến.' },
    'Ly': { luckyNums: '3, 4, 9', colors: 'Đỏ, Hồng, Tím, Xanh Lá', elementMeaning: 'Mệnh Hỏa đại diện cho nhiệt huyết, sự sáng tạo và năng lượng bùng nổ.' },
    'Chấn': { luckyNums: '3, 4', colors: 'Xanh Lá, Xanh Dương, Đen', elementMeaning: 'Mệnh Mộc đại diện cho sự phát triển, sinh chồi nộp lộc và nhân ái.' },
    'Tốn': { luckyNums: '3, 4', colors: 'Xanh Lá, Xanh Dương, Đen', elementMeaning: 'Mệnh Mộc đại diện cho sự nhịp nhàng, khéo léo và hòa nhã.' },
    'Càn': { luckyNums: '6, 7, 2, 8', colors: 'Trắng, Vàng, Nâu, Ánh Kim', elementMeaning: 'Mệnh Kim đại diện cho sự kiên định, quyền lực và chí khí.' },
    'Đoài': { luckyNums: '6, 7, 2, 8', colors: 'Trắng, Ánh Kim, Vàng', elementMeaning: 'Mệnh Kim đại diện cho sự thanh cao, hùng biện và tinh tế.' },
    'Cấn': { luckyNums: '2, 5, 8, 9', colors: 'Vàng, Nâu, Đỏ, Tím', elementMeaning: 'Mệnh Thổ đại diện cho sự vững chãi, điềm tĩnh và đáng tin cậy.' },
    'Khôn': { luckyNums: '2, 5, 8, 9', colors: 'Vàng, Nâu Đất, Đỏ', elementMeaning: 'Mệnh Thổ đại diện cho sự bao dung, nuôi dưỡng và ôn hòa.' },
  };

  const currentCungMeta = cungMetaMap[result.cungMenh] || { luckyNums: '1, 6', colors: 'Vàng, Trắng', elementMeaning: 'Cung mệnh phong thủy.' };

  const quickYears = [1980, 1985, 1990, 1992, 1995, 1998, 2000, 2003];

  return (
    <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-amber-200/90 dark:border-oriental-dark-border p-4 sm:p-6 backdrop-blur-md transition-all space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-200/80 dark:border-oriental-dark-border">
        <div className="flex items-start space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-oriental-red-800 to-oriental-red-950 text-oriental-gold-300 flex items-center justify-center shadow-oriental text-2xl shrink-0 border border-oriental-gold-400">
            🧭
          </div>
          <div>
            <div className="flex items-center space-x-2 text-oriental-gold-600 dark:text-oriental-gold-400 font-extrabold text-[11px] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BÁT TRẠCH PHONG THỦY ĐÔNG PHƯƠNG</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide mt-0.5">
              Tra Cứu Bát Trạch & Hướng Cát Tường
            </h2>
            <p className="text-xs text-amber-900/75 dark:text-amber-200/70 mt-0.5">
              Xác định Cung Mệnh, 4 Hướng Đại Cát, 4 Hướng Hung Khí & Bố trí Phong Thủy chuẩn xác
            </p>
          </div>
        </div>

        <button
          onClick={handleShareResult}
          className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2 bg-amber-100 dark:bg-amber-900/60 text-oriental-red-900 dark:text-oriental-gold-300 rounded-xl font-bold text-xs hover:bg-amber-200 transition-colors border border-amber-300/60 shadow-2xs"
        >
          <Share2 className="w-4 h-4" />
          <span>Chia sẻ kết quả</span>
        </button>
      </div>

      {/* Input Form Section */}
      <form onSubmit={handleCalculate} className="bg-amber-50/70 dark:bg-oriental-dark-bg/60 p-4 sm:p-5 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 space-y-4">
        
        {/* Quick Year Selector Pills */}
        <div>
          <span className="text-[11px] font-extrabold text-amber-900/80 dark:text-amber-200/70 uppercase tracking-wider mb-1.5 block">
            Chọn nhanh năm sinh phổ biến:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickYears.map(y => (
              <button
                key={y}
                type="button"
                onClick={() => updateYear(y.toString())}
                className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all ${
                  activeYear === y
                    ? 'bg-oriental-red-800 text-oriental-gold-300 shadow-sm border border-oriental-gold-400'
                    : 'bg-white dark:bg-oriental-dark-card text-slate-700 dark:text-amber-200 border border-amber-200 dark:border-amber-900 hover:bg-amber-100'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
          
          {/* Year Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-amber-200 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-600" />
              Năm sinh (Dương Lịch):
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              placeholder="Nhập 1995..."
              value={birthYearStr}
              onChange={(e) => updateYear(e.target.value)}
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
                onClick={() => {
                  setGender('nam');
                  updateYear(birthYearStr, 'nam');
                }}
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
                onClick={() => {
                  setGender('nu');
                  updateYear(birthYearStr, 'nu');
                }}
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
              <span>Tra Cứu Kết Quả</span>
            </button>
          </div>

        </div>
      </form>

      {/* Result Display Section */}
      {result && (
        <div className="space-y-6">
          
          {/* Cung Menh Result Summary Cards */}
          <div className="bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/80 dark:from-oriental-dark-bg dark:to-oriental-dark-card p-4 sm:p-5 rounded-2xl border-l-4 border-oriental-gold-500 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            
            <div className="bg-white/90 dark:bg-oriental-dark-card/90 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/30">
              <span className="text-[10px] text-slate-500 dark:text-amber-200/70 block uppercase font-bold">Cung Mệnh</span>
              <strong className="text-base sm:text-xl font-serif text-oriental-red-900 dark:text-oriental-gold-400 font-black">
                {result.cungMenh}
              </strong>
            </div>

            <div className="bg-white/90 dark:bg-oriental-dark-card/90 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/30">
              <span className="text-[10px] text-slate-500 dark:text-amber-200/70 block uppercase font-bold">Nhóm Mệnh</span>
              <strong className="text-xs sm:text-base font-serif text-oriental-red-900 dark:text-oriental-gold-400 font-black">
                {result.menhNguHanh}
              </strong>
            </div>

            <div className="bg-white/90 dark:bg-oriental-dark-card/90 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/30">
              <span className="text-[10px] text-slate-500 dark:text-amber-200/70 block uppercase font-bold">Ngũ Hành Cung</span>
              <strong className="text-xs sm:text-base font-serif text-oriental-red-900 dark:text-oriental-gold-400 font-black">
                Mệnh {result.element}
              </strong>
            </div>

            <div className="bg-white/90 dark:bg-oriental-dark-card/90 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/30">
              <span className="text-[10px] text-slate-500 dark:text-amber-200/70 block uppercase font-bold">Tuổi Can Chi</span>
              <strong className="text-xs sm:text-base font-serif text-oriental-red-900 dark:text-oriental-gold-400 font-black">
                {result.birthYear} ({result.gender === 'nam' ? 'Nam' : 'Nữ'})
              </strong>
            </div>

          </div>

          {/* LA BÀN BÁT TRẠCH SVG & DETAILED DIRECTIONS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* SVG Bát Trạch Compass Wheel */}
            <div className="bg-white/95 dark:bg-oriental-dark-card/95 p-4 rounded-3xl border-2 border-amber-200/90 dark:border-oriental-dark-border shadow-xl flex flex-col items-center">
              <h3 className="font-serif font-black text-sm sm:text-base text-oriental-red-900 dark:text-oriental-gold-400 mb-2 tracking-wide text-center">
                🧭 La Bàn Bát Trạch Cung {result.cungMenh}
              </h3>
              <p className="text-[11px] text-amber-900/70 dark:text-amber-200/70 mb-3 text-center">
                Phân bổ 4 Hướng Tốt (Xanh) & 4 Hướng Xấu (Đỏ)
              </p>

              {/* Compass SVG */}
              <div className="w-full max-w-[320px] aspect-square relative flex items-center justify-center">
                <svg viewBox="0 0 320 320" className="w-full h-full select-none drop-shadow-md">
                  {/* Base Circle */}
                  <circle cx="160" cy="160" r="145" fill="#4A0B10" stroke="#D4AF37" strokeWidth="3" />
                  <circle cx="160" cy="160" r="115" fill="#FFFDF7" className="dark:fill-[#1A0B0E]" stroke="#D4AF37" strokeWidth="2" />
                  <circle cx="160" cy="160" r="55" fill="#7A131B" stroke="#D4AF37" strokeWidth="2" />

                  {/* 8 Directions Sectors */}
                  {compassDirections.map((cd, idx) => {
                    const detail = getDirectionDetail(cd.dir);
                    const isGood = detail.type === 'good';
                    
                    const rad = (cd.angle * Math.PI) / 180;
                    const xLabel = 160 + 130 * Math.cos(rad);
                    const yLabel = 160 + 130 * Math.sin(rad);

                    const xBadge = 160 + 85 * Math.cos(rad);
                    const yBadge = 160 + 85 * Math.sin(rad);

                    // Line from inner circle to outer ring
                    const xInner = 160 + 55 * Math.cos(rad);
                    const yInner = 160 + 145 * Math.sin(rad);

                    return (
                      <g key={idx}>
                        {/* Ray Line */}
                        <line x1={xInner} y1={yInner} x2={160 + 145 * Math.cos(rad)} y2={160 + 145 * Math.sin(rad)} stroke="#D4AF37" strokeWidth="1" opacity="0.6" />

                        {/* Direction Label Outer Ring */}
                        <text
                          x={xLabel}
                          y={yLabel}
                          fill="#F3E5AB"
                          fontSize="11"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          {cd.dir}
                        </text>

                        {/* Aspect Badge Inner Circle */}
                        <circle
                          cx={xBadge}
                          cy={yBadge}
                          r="18"
                          fill={isGood ? '#10B981' : '#EF4444'}
                          stroke="#FFFDF7"
                          strokeWidth="1.5"
                        />
                        <text
                          x={xBadge}
                          y={yBadge}
                          fill="#FFFFFF"
                          fontSize="9"
                          fontWeight="extrabold"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          {detail.name.substring(0, 4)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Center Cung Badge */}
                  <text x="160" y="152" fill="#F3E5AB" fontSize="15" fontWeight="black" textAnchor="middle">
                    {result.cungMenh}
                  </text>
                  <text x="160" y="172" fill="#F3E5AB" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {result.menhNguHanh}
                  </text>
                </svg>
              </div>

              {/* Lucky Elements & Numbers Summary */}
              <div className="mt-4 w-full bg-amber-50/80 dark:bg-oriental-dark-bg p-3 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 text-xs space-y-1.5">
                <div>
                  <span className="font-bold text-oriental-red-900 dark:text-oriental-gold-400">✨ Số May Mắn:</span>{' '}
                  <span className="font-extrabold text-amber-900 dark:text-amber-100">{currentCungMeta.luckyNums}</span>
                </div>
                <div>
                  <span className="font-bold text-oriental-red-900 dark:text-oriental-gold-400">🎨 Màu Tương Hợp:</span>{' '}
                  <span className="font-semibold text-slate-700 dark:text-amber-200/80">{currentCungMeta.colors}</span>
                </div>
                <p className="text-[11px] text-amber-900/70 dark:text-amber-200/70 italic pt-1 border-t border-amber-200/60 dark:border-amber-900/30">
                  📌 {currentCungMeta.elementMeaning}
                </p>
              </div>
            </div>

            {/* 4 Hướng Tốt & 4 Hướng Xấu Grid (Right side 2-column) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* 4 Hướng Tốt (Good Directions) */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-serif font-extrabold text-emerald-800 dark:text-emerald-400 flex items-center gap-2 border-b border-emerald-200 dark:border-emerald-950 pb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>4 Hướng Tốt Cát Tường (Nên Đặt Hướng Nhà, Hướng Cửa, Bàn Làm Việc)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.goodDirections.map((dir, idx) => (
                    <div
                      key={idx}
                      className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-300 dark:border-emerald-900/60 space-y-1.5 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-emerald-600 text-white shadow-2xs">
                          ✨ {dir.name}
                        </span>
                        <span className="font-serif font-black text-sm text-emerald-900 dark:text-emerald-300">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.badDirections.map((dir, idx) => (
                    <div
                      key={idx}
                      className="bg-rose-50/70 dark:bg-rose-950/30 p-3.5 rounded-2xl border border-rose-300 dark:border-rose-900/60 space-y-1.5 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-rose-600 text-white shadow-2xs">
                          ⚠️ {dir.name}
                        </span>
                        <span className="font-serif font-black text-sm text-rose-900 dark:text-rose-300">
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

            </div>

          </div>

          {/* PRACTICAL FENG SHUI APPLICATION GUIDE TABS */}
          <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-3xl p-5 sm:p-6 border-2 border-amber-200/90 dark:border-oriental-dark-border shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-amber-200/80 dark:border-oriental-dark-border pb-3">
              <h3 className="font-serif font-black text-base sm:text-lg text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide flex items-center gap-2">
                🏛️ Hướng Dẫn Bố Trí Phong Thủy Nhà Ở Theo Cung {result.cungMenh}
              </h3>
            </div>

            {/* Sub-Tabs Selector */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveGuideTab('house')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeGuideTab === 'house'
                    ? 'bg-oriental-red-800 text-oriental-gold-300 shadow-oriental font-extrabold'
                    : 'bg-amber-100 dark:bg-oriental-dark-bg text-slate-700 dark:text-amber-200 hover:bg-amber-200'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Hướng Nhà & Cửa Chính</span>
              </button>

              <button
                onClick={() => setActiveGuideTab('desk')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeGuideTab === 'desk'
                    ? 'bg-oriental-red-800 text-oriental-gold-300 shadow-oriental font-extrabold'
                    : 'bg-amber-100 dark:bg-oriental-dark-bg text-slate-700 dark:text-amber-200 hover:bg-amber-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Hướng Bàn Làm Việc</span>
              </button>

              <button
                onClick={() => setActiveGuideTab('bed')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeGuideTab === 'bed'
                    ? 'bg-oriental-red-800 text-oriental-gold-300 shadow-oriental font-extrabold'
                    : 'bg-amber-100 dark:bg-oriental-dark-bg text-slate-700 dark:text-amber-200 hover:bg-amber-200'
                }`}
              >
                <BedDouble className="w-3.5 h-3.5" />
                <span>Hướng Giường Ngủ</span>
              </button>

              <button
                onClick={() => setActiveGuideTab('kitchen')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeGuideTab === 'kitchen'
                    ? 'bg-oriental-red-800 text-oriental-gold-300 shadow-oriental font-extrabold'
                    : 'bg-amber-100 dark:bg-oriental-dark-bg text-slate-700 dark:text-amber-200 hover:bg-amber-200'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Hướng Bếp (Tọa Xấu Hướng Tốt)</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="bg-amber-50/80 dark:bg-oriental-dark-bg p-4 rounded-2xl border border-amber-200/80 dark:border-oriental-dark-border text-xs leading-relaxed text-slate-800 dark:text-amber-100 space-y-2">
              {activeGuideTab === 'house' && (
                <div>
                  <h4 className="font-serif font-black text-sm text-oriental-red-900 dark:text-oriental-gold-400 mb-1">
                    🏠 Nguyên Tắc Bố Trí Hướng Nhà & Cửa Chính Gia Chủ Cung {result.cungMenh}:
                  </h4>
                  <p>
                    Gia chủ cung <strong>{result.cungMenh}</strong> thuộc nhóm <strong>{result.menhNguHanh}</strong>. Cửa chính là nơi nạp khí chủ đạo cho ngôi nhà, quyết định tài lộc và vận may của toàn gia đình.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 mt-1 text-emerald-950 dark:text-emerald-300 font-semibold">
                    <li>Ưu tiên chọn hướng nhà & hướng cửa chính quay về: <strong>{result.goodDirections.map(g => `${g.direction} (${g.name})`).join(', ')}</strong>.</li>
                    <li>Tuyệt đối tránh xây cửa chính nhìn về: <strong>{result.badDirections.map(b => `${b.direction} (${b.name})`).join(', ')}</strong>.</li>
                  </ul>
                </div>
              )}

              {activeGuideTab === 'desk' && (
                <div>
                  <h4 className="font-serif font-black text-sm text-oriental-red-900 dark:text-oriental-gold-400 mb-1">
                    💼 Nguyên Tắc Bố Trí Hướng Bàn Làm Việc:
                  </h4>
                  <p>
                    Bàn làm việc quản chiếu đường công danh sự nghiệp, thi cử và tiền tài. Đặt bàn đúng hướng giúp tinh thần minh mẫn, gặp nhiều quý nhân giúp đỡ.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 mt-1 font-semibold">
                    <li>Ngồi làm việc quay mặt nhìn về hướng <strong>{result.goodDirections[0]?.direction} ({result.goodDirections[0]?.name})</strong> để công danh thăng tiến nhanh nhất.</li>
                    <li>Hoặc quay mặt nhìn về hướng <strong>{result.goodDirections[3]?.direction} ({result.goodDirections[3]?.name})</strong> giúp tăng khả năng tập trung và thi cử đỗ đạt.</li>
                  </ul>
                </div>
              )}

              {activeGuideTab === 'bed' && (
                <div>
                  <h4 className="font-serif font-black text-sm text-oriental-red-900 dark:text-oriental-gold-400 mb-1">
                    🛏️ Nguyên Tắc Bố Trí Hướng Giường Ngủ:
                  </h4>
                  <p>
                    Giường ngủ quản chiếu sức khỏe, tinh thần tái tạo và tình cảm vợ chồng gia đạo.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 mt-1 font-semibold">
                    <li>Kê đầu giường hướng về <strong>{result.goodDirections[1]?.direction} ({result.goodDirections[1]?.name})</strong> để tăng cường sức khỏe, ngủ sâu giấc và gặp được thầy tốt thuốc hay.</li>
                    <li>Kê đầu giường hướng về <strong>{result.goodDirections[2]?.direction} ({result.goodDirections[2]?.name})</strong> để gia đạo êm ấm, tình cảm gắn kết.</li>
                  </ul>
                </div>
              )}

              {activeGuideTab === 'kitchen' && (
                <div>
                  <h4 className="font-serif font-black text-sm text-oriental-red-900 dark:text-oriental-gold-400 mb-1">
                    🍳 Nguyên Tắc "Tọa Xấu Hướng Tốt" Cho Bếp Nấu:
                  </h4>
                  <p>
                    Trong Bát Trạch Phong Thủy, Bếp đại diện cho Hỏa khí có khả năng thiêu đốt hung khí. Nguyên tắc vàng là <strong>"Tọa Xấu Hướng Tốt"</strong>:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 mt-1 font-semibold">
                    <li className="text-amber-900 dark:text-amber-300">
                      <strong>Đặt bếp đặt tại (Tọa):</strong> Hướng xấu <strong>{result.badDirections[3]?.direction} ({result.badDirections[3]?.name})</strong> hoặc <strong>{result.badDirections[2]?.direction} ({result.badDirections[2]?.name})</strong> để Hỏa bếp thiêu đốt hết hung khí.
                    </li>
                    <li className="text-emerald-800 dark:text-emerald-300">
                      <strong>Lưng bếp nhìn về (Hướng):</strong> Hướng tốt <strong>{result.goodDirections[0]?.direction} ({result.goodDirections[0]?.name})</strong> hoặc <strong>{result.goodDirections[1]?.direction} ({result.goodDirections[1]?.name})</strong> để nạp lộc tài.
                    </li>
                  </ul>
                </div>
              )}
            </div>

          </div>

          {/* Advice Note Box */}
          <div className="p-4 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 border border-oriental-gold-500/40 text-xs text-oriental-red-900 dark:text-amber-200 leading-relaxed flex items-start gap-2.5">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Tóm Tắt Bát Trạch Phong Thủy:</strong>
              <p className="mt-0.5">
                Xem ngày & chọn hướng theo Bát Trạch giúp cân bằng trường khí nhà ở và tạo năng lượng hài hòa cho cuộc sống. Lựa chọn hướng Sinh Khí, Thiên Y, Diên Niên, Phục Vị làm kim chỉ nam khi chọn đất, làm nhà và bố trí không gian sống!
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
