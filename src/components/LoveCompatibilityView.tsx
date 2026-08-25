import React, { useState } from 'react';
import { Heart, Sparkles, User, Share2, CheckCircle2, AlertTriangle, MessageSquare, TrendingUp, DollarSign, Home as HomeIcon, Bot, RefreshCw } from 'lucide-react';
import { calculateCompatibility, ALL_ZODIAC_SIGNS, CompatibilityAnalysis } from '../services/compatibilityEngine';
import { aiService } from '../services/aiService';

export const LoveCompatibilityView: React.FC = () => {
  const [nameA, setNameA] = useState<string>('Nguyễn Văn A');
  const [yearAStr, setYearAStr] = useState<string>('1995');
  const [genderA, setGenderA] = useState<'nam' | 'nu'>('nam');
  const [zodiacA, setZodiacA] = useState<string>('Bọ Cạp');

  const [nameB, setNameB] = useState<string>('Trần Thị B');
  const [yearBStr, setYearBStr] = useState<string>('1998');
  const [genderB, setGenderB] = useState<'nam' | 'nu'>('nu');
  const [zodiacB, setZodiacB] = useState<string>('Song Ngư');

  const [aiCustomReading, setAiCustomReading] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const [analysis, setAnalysis] = useState<CompatibilityAnalysis>(() =>
    calculateCompatibility(
      { name: 'Nguyễn Văn A', birthYear: 1995, gender: 'nam', zodiacSign: 'Bọ Cạp' },
      { name: 'Trần Thị B', birthYear: 1998, gender: 'nu', zodiacSign: 'Song Ngư' }
    )
  );

  const quickYears = [1988, 1990, 1992, 1995, 1997, 1998, 2000, 2002];

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const yA = parseInt(yearAStr, 10) || 1995;
    const yB = parseInt(yearBStr, 10) || 1998;

    const res = calculateCompatibility(
      { name: nameA.trim() || 'Người A', birthYear: yA, gender: genderA, zodiacSign: zodiacA },
      { name: nameB.trim() || 'Người B', birthYear: yB, gender: genderB, zodiacSign: zodiacB }
    );
    setAnalysis(res);
    setAiCustomReading(null);
  };

  const handleFetchAiReading = async () => {
    setIsAiLoading(true);
    try {
      const prompt = `Bạn là Chuyên gia Phong thủy & Tử vi Chiêm tinh lứa đôi. Hãy phân tích mức độ hợp tuổi và hợp mệnh tình duyên giữa:
- Người A: ${analysis.personA.name}, Năm sinh: ${analysis.personA.birthYear} (${analysis.personA.canChiYear}, Mệnh: ${analysis.personA.element} - ${analysis.personA.napAm}, Cung: ${analysis.personA.cung}, Cung Hoàng Đạo: ${analysis.personA.zodiacSign}).
- Người B: ${analysis.personB.name}, Năm sinh: ${analysis.personB.birthYear} (${analysis.personB.canChiYear}, Mệnh: ${analysis.personB.element} - ${analysis.personB.napAm}, Cung: ${analysis.personB.cung}, Cung Hoàng Đạo: ${analysis.personB.zodiacSign}).
Điểm tương hợp tổng thể: ${analysis.totalScore}/100.

Hãy đưa ra bài luận giải chuyên sâu khoảng 300 từ bao gồm:
1. Điểm Mạnh Tương Hợp (Giao tiếp, Quan điểm sống, Hỗ trợ nhau).
2. Điểm Cần Lưu Ý (Tài chính, Cảm xúc, Cách xử lý mâu thuẫn).
3. Lời Khuyên Hạnh Phúc Bền Vững Lứa Đôi.`;

      const response = await aiService.sendMessage(prompt, [], null, () => {});
      setAiCustomReading(response);
    } catch (err) {
      console.warn('AI Love Reading Error', err);
      setAiCustomReading('Hệ thống AI đang phản hồi chậm, vui lòng thử lại sau ít phút.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleShare = () => {
    const text = `💕 TRA CỨU TƯƠNG HỢP TÌNH DUYÊN - AN LỊCH AI\n❤️ ${analysis.personA.name} (${analysis.personA.birthYear}) & ${analysis.personB.name} (${analysis.personB.birthYear})\n✨ Mức độ tương hợp: ${analysis.totalScore}/100 (${analysis.ratingLabel})\n🔗 Xem chi tiết tại: https://www.anlichai.online/hop-tuoi-tinh-duyen`;
    if (navigator.share) {
      navigator.share({
        title: 'Xem Hợp Tuổi / Hợp Mệnh Tình Duyên - An Lịch AI',
        text: text,
        url: 'https://www.anlichai.online/hop-tuoi-tinh-duyen'
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Đã sao chép kết quả xem hợp tuổi tình duyên vào bộ nhớ tạm!');
    }
  };

  return (
    <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-amber-200/90 dark:border-oriental-dark-border p-4 sm:p-6 backdrop-blur-md space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-200/80 dark:border-oriental-dark-border">
        <div className="flex items-start space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-900 text-white flex items-center justify-center shadow-lg text-2xl shrink-0 border border-rose-300">
            💕
          </div>
          <div>
            <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-extrabold text-[11px] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LUẬN GIẢI TƯƠNG HỢP TÌNH DUYÊN & TỬ VI BÁT TỰ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide mt-0.5">
              Xem Hợp Tuổi / Hợp Mệnh Lứa Đôi
            </h2>
            <p className="text-xs text-amber-900/75 dark:text-amber-200/70 mt-0.5">
              Phân tích Can Chi, Ngũ Hành Nạp Âm, Bát Trạch, Chiêm Tinh & Tính điểm tương hợp chuẩn xác
            </p>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2 bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 rounded-xl font-bold text-xs hover:bg-rose-200 transition-colors border border-rose-300/60 shadow-2xs"
        >
          <Share2 className="w-4 h-4" />
          <span>Chia sẻ kết quả</span>
        </button>
      </div>

      {/* Input Profiles Form (2 Columns: Person A vs Person B) */}
      <form onSubmit={handleCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Person A Card */}
          <div className="bg-amber-50/70 dark:bg-oriental-dark-bg/60 p-4 rounded-2xl border border-amber-200 dark:border-oriental-dark-border space-y-3">
            <h3 className="font-serif font-black text-sm text-oriental-red-900 dark:text-oriental-gold-400 flex items-center gap-1.5 border-b border-amber-200 dark:border-oriental-dark-border pb-2">
              <User className="w-4 h-4 text-amber-600" />
              <span>Thông Tin Người Thứ 1 (Người A)</span>
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-amber-200 mb-1">
                Họ và tên:
              </label>
              <input
                type="text"
                value={nameA}
                onChange={(e) => setNameA(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-oriental-dark-card border border-amber-300/80 dark:border-amber-900 text-xs font-bold text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-amber-200 mb-1">
                Chọn nhanh năm sinh:
              </label>
              <div className="flex flex-wrap gap-1 mb-2">
                {quickYears.map(y => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      setYearAStr(y.toString());
                      const res = calculateCompatibility(
                        { name: nameA, birthYear: y, gender: genderA, zodiacSign: zodiacA },
                        { name: nameB, birthYear: parseInt(yearBStr, 10) || 1998, gender: genderB, zodiacSign: zodiacB }
                      );
                      setAnalysis(res);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                      yearAStr === y.toString() ? 'bg-amber-600 text-white' : 'bg-white dark:bg-oriental-dark-card text-slate-700 dark:text-amber-200 border border-amber-200'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={yearAStr}
                    onChange={(e) => setYearAStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-oriental-dark-card border border-amber-300/80 dark:border-amber-900 text-xs font-bold text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <select
                    value={genderA}
                    onChange={(e) => setGenderA(e.target.value as 'nam' | 'nu')}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-oriental-dark-card border border-amber-300/80 dark:border-amber-900 text-xs font-bold text-slate-800 dark:text-amber-100 focus:outline-none"
                  >
                    <option value="nam">Nam Giới</option>
                    <option value="nu">Nữ Giới</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-amber-200 mb-1">
                Cung Hoàng Đạo (Chiêm Tinh):
              </label>
              <select
                value={zodiacA}
                onChange={(e) => setZodiacA(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-oriental-dark-card border border-amber-300/80 dark:border-amber-900 text-xs font-bold text-slate-800 dark:text-amber-100 focus:outline-none"
              >
                {ALL_ZODIAC_SIGNS.map(z => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Person B Card */}
          <div className="bg-rose-50/50 dark:bg-oriental-dark-bg/60 p-4 rounded-2xl border border-rose-200 dark:border-oriental-dark-border space-y-3">
            <h3 className="font-serif font-black text-sm text-rose-900 dark:text-rose-300 flex items-center gap-1.5 border-b border-rose-200 dark:border-oriental-dark-border pb-2">
              <Heart className="w-4 h-4 text-rose-600 fill-current" />
              <span>Thông Tin Người Thứ 2 (Đối Phương - Người B)</span>
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-amber-200 mb-1">
                Họ và tên:
              </label>
              <input
                type="text"
                value={nameB}
                onChange={(e) => setNameB(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-oriental-dark-card border border-rose-300/80 dark:border-amber-900 text-xs font-bold text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-amber-200 mb-1">
                Chọn nhanh năm sinh:
              </label>
              <div className="flex flex-wrap gap-1 mb-2">
                {quickYears.map(y => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      setYearBStr(y.toString());
                      const res = calculateCompatibility(
                        { name: nameA, birthYear: parseInt(yearAStr, 10) || 1995, gender: genderA, zodiacSign: zodiacA },
                        { name: nameB, birthYear: y, gender: genderB, zodiacSign: zodiacB }
                      );
                      setAnalysis(res);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                      yearBStr === y.toString() ? 'bg-rose-600 text-white' : 'bg-white dark:bg-oriental-dark-card text-slate-700 dark:text-amber-200 border border-rose-200'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={yearBStr}
                    onChange={(e) => setYearBStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-oriental-dark-card border border-rose-300/80 dark:border-amber-900 text-xs font-bold text-slate-800 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div>
                  <select
                    value={genderB}
                    onChange={(e) => setGenderB(e.target.value as 'nam' | 'nu')}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-oriental-dark-card border border-rose-300/80 dark:border-amber-900 text-xs font-bold text-slate-800 dark:text-amber-100 focus:outline-none"
                  >
                    <option value="nu">Nữ Giới</option>
                    <option value="nam">Nam Giới</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-amber-200 mb-1">
                Cung Hoàng Đạo (Chiêm Tinh):
              </label>
              <select
                value={zodiacB}
                onChange={(e) => setZodiacB(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-oriental-dark-card border border-rose-300/80 dark:border-amber-900 text-xs font-bold text-slate-800 dark:text-amber-100 focus:outline-none"
              >
                {ALL_ZODIAC_SIGNS.map(z => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Calculate Action Button */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-rose-700 via-rose-800 to-amber-800 text-white font-serif font-black text-sm rounded-2xl shadow-lg border border-amber-300 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Heart className="w-4 h-4 fill-current text-amber-300" />
          <span>Phân Tích Mức Độ Tương Hợp Tình Duyên</span>
        </button>
      </form>

      {/* ANALYSIS RESULT DISPLAY SECTION */}
      {analysis && (
        <div className="space-y-6 pt-2">
          
          {/* Main Score Hero Card */}
          <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-amber-600 p-6 rounded-3xl text-white shadow-2xl border-2 border-amber-300 text-center relative overflow-hidden space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-extrabold text-amber-200 border border-white/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>KẾT QUẢ TƯƠNG HỢP LỨA ĐÔI</span>
            </div>

            <div className="text-3xl sm:text-5xl font-serif font-black text-amber-200 tracking-tight flex items-center justify-center gap-2">
              <span>❤️ Mức Độ Tương Hợp:</span>
              <span className="text-white drop-shadow-md">{analysis.totalScore} / 100</span>
            </div>

            <p className="text-sm sm:text-base font-bold text-amber-100 italic">
              ✨ {analysis.ratingLabel}
            </p>

            {/* Profile Comparison Badges */}
            <div className="pt-2 grid grid-cols-2 gap-3 max-w-lg mx-auto text-xs font-semibold">
              <div className="bg-black/25 p-3 rounded-2xl border border-white/20">
                <div className="font-extrabold text-amber-200 text-sm">{analysis.personA.name}</div>
                <div className="text-xs text-white font-bold">{analysis.personA.canChiYear}</div>
                <div className="text-[11px] opacity-90">Mệnh {analysis.personA.element} ({analysis.personA.napAm})</div>
                <div className="text-[10px] opacity-80 mt-0.5">Cung {analysis.personA.cung} • {analysis.personA.zodiacSign}</div>
              </div>

              <div className="bg-black/25 p-3 rounded-2xl border border-white/20">
                <div className="font-extrabold text-amber-200 text-sm">{analysis.personB.name}</div>
                <div className="text-xs text-white font-bold">{analysis.personB.canChiYear}</div>
                <div className="text-[11px] opacity-90">Mệnh {analysis.personB.element} ({analysis.personB.napAm})</div>
                <div className="text-[10px] opacity-80 mt-0.5">Cung {analysis.personB.cung} • {analysis.personB.zodiacSign}</div>
              </div>
            </div>
          </div>

          {/* 5 DOMAIN PROGRESS BARS */}
          <div className="bg-white/95 dark:bg-oriental-dark-card/95 p-4 sm:p-5 rounded-3xl border border-amber-200 dark:border-oriental-dark-border shadow-md space-y-3">
            <h3 className="font-serif font-black text-sm text-oriental-red-900 dark:text-oriental-gold-400 flex items-center gap-2 border-b border-amber-200/80 dark:border-oriental-dark-border pb-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>Chỉ Số Tương Hợp Theo 5 Khía Cạnh Cuộc Sống:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-bold">
              
              {/* Communication */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-700 dark:text-amber-200">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                    <span>Giao Tiếp & Thấu Hiểu:</span>
                  </span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">{analysis.domainMetrics.communicationScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-oriental-dark-bg h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${analysis.domainMetrics.communicationScore}%` }} />
                </div>
              </div>

              {/* Career */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-700 dark:text-amber-200">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Hỗ Trợ Sự Nghiệp:</span>
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{analysis.domainMetrics.careerScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-oriental-dark-bg h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${analysis.domainMetrics.careerScore}%` }} />
                </div>
              </div>

              {/* Finance */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-700 dark:text-amber-200">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                    <span>Quản Lý Tài Chính:</span>
                  </span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">{analysis.domainMetrics.financeScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-oriental-dark-bg h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${analysis.domainMetrics.financeScore}%` }} />
                </div>
              </div>

              {/* Family */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-700 dark:text-amber-200">
                  <span className="flex items-center gap-1">
                    <HomeIcon className="w-3.5 h-3.5 text-purple-500" />
                    <span>Gia Đạo & Con Cái:</span>
                  </span>
                  <span className="font-mono text-purple-600 dark:text-purple-400">{analysis.domainMetrics.familyScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-oriental-dark-bg h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${analysis.domainMetrics.familyScore}%` }} />
                </div>
              </div>

              {/* Romance */}
              <div className="space-y-1 sm:col-span-2">
                <div className="flex justify-between text-slate-700 dark:text-amber-200">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                    <span>Cảm Xúc & Lãng Mạn:</span>
                  </span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">{analysis.domainMetrics.romanceScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-oriental-dark-bg h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${analysis.domainMetrics.romanceScore}%` }} />
                </div>
              </div>

            </div>
          </div>

          {/* 4 DETAILED CRITERIA CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* 1. Can Chi Year Match */}
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-oriental-dark-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-oriental-red-900 dark:text-oriental-gold-400 flex items-center gap-1">
                  ☯️ Tuổi & Can Chi:
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                  analysis.canChiMatch.status === 'good' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {analysis.canChiMatch.label}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-amber-200/80 leading-relaxed pt-1">
                {analysis.canChiMatch.description}
              </p>
            </div>

            {/* 2. Ngũ Hành Element Match */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                  🔥 Ngũ Hành Nạp Âm:
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                  analysis.elementMatch.status === 'good' ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800'
                }`}>
                  {analysis.elementMatch.label}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-emerald-100/80 leading-relaxed pt-1">
                {analysis.elementMatch.description}
              </p>
            </div>

            {/* 3. Cung Bát Trạch Match */}
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-oriental-dark-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-oriental-red-900 dark:text-oriental-gold-400 flex items-center gap-1">
                  🧭 Cung Bát Trạch:
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-200 text-amber-900 border border-amber-400">
                  {analysis.cungMatch.label}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-amber-200/80 leading-relaxed pt-1">
                {analysis.cungMatch.description}
              </p>
            </div>

            {/* 4. Chiêm Tinh & Zodiac Match */}
            <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-purple-900 dark:text-purple-300 flex items-center gap-1">
                  ✨ Chiêm Tinh Hoàng Đạo:
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-600 text-white">
                  {analysis.zodiacMatch.label}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-purple-100/80 leading-relaxed pt-1">
                {analysis.zodiacMatch.description}
              </p>
            </div>

          </div>

          {/* AI DEEP ANALYSIS SECTION: STRENGTHS & CHALLENGES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Điểm Mạnh (Strengths) */}
            <div className="bg-emerald-50/90 dark:bg-emerald-950/40 p-4 sm:p-5 rounded-2xl border border-emerald-300 dark:border-emerald-900/60 space-y-3">
              <h3 className="font-serif font-black text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-2 border-b border-emerald-200 dark:border-emerald-900/60 pb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>🌟 Điểm Mạnh Tương Hợp Nổi Bật:</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-800 dark:text-emerald-100 leading-relaxed">
                {analysis.aiSummary.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white/70 dark:bg-black/20 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/30 font-medium">
                    <span className="text-emerald-600 font-extrabold">✦</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Điểm Cần Lưu Ý (Challenges) */}
            <div className="bg-rose-50/90 dark:bg-rose-950/40 p-4 sm:p-5 rounded-2xl border border-rose-300 dark:border-rose-900/60 space-y-3">
              <h3 className="font-serif font-black text-sm text-rose-900 dark:text-rose-300 flex items-center gap-2 border-b border-rose-200 dark:border-rose-900/60 pb-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>⚠️ Điểm Cần Lưu Ý & Dung Hòa:</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-800 dark:text-rose-100 leading-relaxed">
                {analysis.aiSummary.challenges.map((chal, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white/70 dark:bg-black/20 p-2.5 rounded-xl border border-rose-200/60 dark:border-rose-900/30 font-medium">
                    <span className="text-rose-600 font-extrabold">⚡</span>
                    <span>{chal}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* DYNAMIC AI DETAILED READING BUTTON & DISPLAY */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-100/80 dark:bg-amber-950/40 border border-oriental-gold-500/50 text-xs text-oriental-red-900 dark:text-amber-200 leading-relaxed space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/80 dark:border-amber-900/50 pb-2">
              <div className="font-serif font-black text-sm text-oriental-red-900 dark:text-oriental-gold-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>💡 Lời Khuyên Hài Hòa Tình Duyên Từ Trợ Lý AI:</span>
              </div>

              <button
                type="button"
                onClick={handleFetchAiReading}
                disabled={isAiLoading}
                className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-oriental-red-800 to-oriental-red-950 text-oriental-gold-300 rounded-xl font-bold text-xs shadow-oriental border border-oriental-gold-400 hover:scale-105 transition-all disabled:opacity-50 shrink-0"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>AI Đang Phân Tích...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5" />
                    <span>AI Luận Giải Chi Tiết</span>
                  </>
                )}
              </button>
            </div>

            <p className="pt-1 font-medium">
              {analysis.aiSummary.advice}
            </p>

            {aiCustomReading && (
              <div className="mt-3 p-4 rounded-xl bg-white/90 dark:bg-oriental-dark-card/90 border border-amber-300/80 dark:border-oriental-dark-border text-slate-800 dark:text-amber-100 leading-relaxed space-y-2 font-serif">
                <div className="font-bold text-xs text-oriental-red-900 dark:text-oriental-gold-400 flex items-center gap-1 border-b border-amber-200 dark:border-amber-900 pb-1">
                  <span>🤖 Luận Giải Chi Tiết Từ Chuyên Gia AI:</span>
                </div>
                <div className="whitespace-pre-wrap text-xs sm:text-sm font-sans pt-1 text-slate-800 dark:text-amber-100">
                  {aiCustomReading}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
