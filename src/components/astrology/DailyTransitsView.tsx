import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { NatalChartData } from '../../types/astrology';
import { AstrologyEngine, getZodiacFromLongitude } from '../../services/astrologyEngine';
import { aiService } from '../../services/aiService';

interface DailyTransitsViewProps {
  chartData: NatalChartData | null;
}

export const DailyTransitsView: React.FC<DailyTransitsViewProps> = ({ chartData }) => {
  const [transitInsight, setTransitInsight] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Compute Today's Transits
  const today = new Date();
  const todayDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const todayJD = AstrologyEngine.calculateJulianDay(todayDateStr, '12:00', 'Asia/Ho_Chi_Minh');
  const todayPlanets = AstrologyEngine.calculatePlanetaryLongitudes(todayJD);

  const sunTransit = getZodiacFromLongitude(todayPlanets.Sun.totalDegree);
  const moonTransit = getZodiacFromLongitude(todayPlanets.Moon.totalDegree);

  const fetchTransitAI = async () => {
    if (!chartData) return;
    setIsLoading(true);
    try {
      const prompt = `
Phân tích năng lượng Chiêm tinh hôm nay (${todayDateStr}) cho quý gia chủ ${chartData.profile.fullName}:
- Mặt Trời hiện tại: ${sunTransit.sign} (${sunTransit.degree}°)
- Mặt Trăng hiện tại: ${moonTransit.sign} (${moonTransit.degree}°)
- Natal Sun: ${chartData.sun.sign}
- Natal Moon: ${chartData.moon.sign}
- Ascendant: ${chartData.ascendant.sign}

Hãy viết 1 đoạn luận giải ngắn gọn (khoảng 150-200 từ) về các xu hướng năng lượng hôm nay cho:
1. 🌞 Năng lượng tổng quan
2. 💼 Công việc & Học tập
3. ❤️ Tình cảm & Quan hệ
4. 🧠 Tinh thần & Cân bằng

Chú ý: Dùng ngôn ngữ văn minh "gợi ý", "mang tính tham khảo", không khẳng định định mệnh chắc chắn.
`;
      const res = await aiService.sendMessage(prompt, [], null, () => {});
      setTransitInsight(res);
    } catch {
      setTransitInsight('Năng lượng hôm nay gợi ý sự cân bằng và kiên nhẫn. Thích hợp cho việc lắng nghe bản thân và lập kế hoạch công việc.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (chartData && !transitInsight) {
      fetchTransitAI();
    }
  }, [chartData]);

  if (!chartData) {
    return (
      <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-3xl p-8 text-center border-2 border-amber-200">
        <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-2" />
        <h3 className="font-serif font-black text-lg text-oriental-red-900 dark:text-oriental-gold-400">
          Chưa có Bản Đồ Sao Cá Nhân
        </h3>
        <p className="text-xs text-amber-900/70 dark:text-amber-200/70 mt-1">
          Vui lòng tạo hoặc chọn một Bản đồ sao để xem phân tích Chiêm tinh hôm nay.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* TODAY TRANSIT HERO */}
      <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 dark:from-oriental-dark-card dark:to-amber-950 p-6 rounded-3xl border-2 border-oriental-gold-500/50 shadow-xl">
        <div className="flex items-center justify-between border-b border-oriental-gold-500/30 pb-3 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-oriental-red-900 dark:text-oriental-gold-400">
              CHIÊM TINH HÔM NAY ({todayDateStr})
            </span>
            <h3 className="text-xl font-serif font-black text-oriental-red-900 dark:text-oriental-gold-300">
              Vận Trình Transit Hàng Ngày của {chartData.profile.fullName}
            </h3>
          </div>

          <button
            onClick={fetchTransitAI}
            disabled={isLoading}
            className="p-2 rounded-xl bg-oriental-red-800 text-oriental-gold-300 font-bold text-xs shadow-oriental flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Cập nhật AI</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
          <div className="p-3 rounded-2xl bg-white/80 dark:bg-oriental-dark-bg border border-amber-300/60 flex items-center justify-between">
            <span>🌞 Mặt Trời Hiện Tại (Transit Sun):</span>
            <span className="text-oriental-red-900 dark:text-oriental-gold-400 text-sm">
              {sunTransit.signSymbol} {sunTransit.sign} ({sunTransit.degree}°)
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 dark:bg-oriental-dark-bg border border-amber-300/60 flex items-center justify-between">
            <span>🌙 Mặt Trăng Hiện Tại (Transit Moon):</span>
            <span className="text-indigo-700 dark:text-indigo-300 text-sm">
              {moonTransit.signSymbol} {moonTransit.sign} ({moonTransit.degree}°)
            </span>
          </div>
        </div>
      </div>

      {/* AI TRANSIT INTERPRETATION */}
      <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-3xl p-6 border-2 border-amber-200/90 dark:border-oriental-dark-border shadow-xl">
        <h4 className="font-serif font-black text-lg text-oriental-red-900 dark:text-oriental-gold-400 mb-3 flex items-center gap-2">
          <span>🔮</span> Luận Giải Năng Lượng Chiêm Tinh AI
        </h4>

        {isLoading ? (
          <div className="flex items-center space-x-2 py-6 text-amber-900 dark:text-amber-200 text-xs font-bold">
            <RefreshCw className="w-4 h-4 animate-spin text-oriental-gold-500" />
            <span>Đang đối chiếu góc hợp Transits và luận giải AI...</span>
          </div>
        ) : (
          <div className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-amber-100 whitespace-pre-wrap">
            {transitInsight}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-oriental-dark-border text-[11px] text-amber-900/70 dark:text-amber-200/60 italic">
          💡 Thông tin Chiêm tinh hôm nay mang tính tham khảo định hướng tâm thế và năng lượng tích cực cho ngày làm việc của bạn.
        </div>
      </div>

    </div>
  );
};
