import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, UserCheck, RefreshCw, FileText, Compass, Layers, Share2 } from 'lucide-react';
import { BirthProfile, HouseSystem, NatalChartData, AstrologyInterpretation } from '../../types/astrology';
import { AstrologyEngine } from '../../services/astrologyEngine';
import { astrologyStorageService } from '../../services/astrologyStorageService';
import { deepseekAstrologyService } from '../../services/deepseekAstrologyService';
import { AppSettings } from '../../types';

import { BirthProfileForm } from './BirthProfileForm';
import { BigThreeCard } from './BigThreeCard';
import { NatalChartWheel } from './NatalChartWheel';
import { PlanetTable } from './PlanetTable';
import { HouseTable } from './HouseTable';
import { AspectsList } from './AspectsList';
import { ElementModalityChart } from './ElementModalityChart';
import { SavedProfilesView } from './SavedProfilesView';
import { DailyTransitsView } from './DailyTransitsView';

interface AstrologyViewProps {
  settings: AppSettings;
  onOpenSettings?: () => void;
}

export const AstrologyView: React.FC<AstrologyViewProps> = ({ settings }) => {
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'chart' | 'daily' | 'profiles'>('chart');
  
  const [currentProfile, setCurrentProfile] = useState<BirthProfile | null>(() => 
    astrologyStorageService.getDefaultProfile()
  );
  
  const [houseSystem, setHouseSystem] = useState<HouseSystem>('Placidus');
  const [chartData, setChartData] = useState<NatalChartData | null>(null);
  const [interpretation, setInterpretation] = useState<AstrologyInterpretation | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Recalculate chart whenever profile or house system changes
  useEffect(() => {
    if (currentProfile) {
      const computedChart = AstrologyEngine.calculateNatalChart(currentProfile, houseSystem);
      setChartData(computedChart);

      // Check cache for AI interpretation
      const chartHash = astrologyStorageService.generateChartHash(currentProfile, houseSystem);
      const cached = astrologyStorageService.getCachedAIInterpretation(chartHash);
      if (cached) {
        setInterpretation(cached);
      } else {
        fetchAiInterpretation(computedChart, chartHash);
      }
    }
  }, [currentProfile, houseSystem]);

  const fetchAiInterpretation = async (chart: NatalChartData, chartHash: string) => {
    setIsAiLoading(true);
    try {
      const res = await deepseekAstrologyService.generateInterpretation(chart, settings);
      setInterpretation(res);
      astrologyStorageService.cacheAIInterpretation(chartHash, res);
    } catch (e) {
      console.warn('AI interpretation error', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCalculateNewProfile = (profile: BirthProfile, selectedHouseSystem: HouseSystem) => {
    const saved = astrologyStorageService.saveProfile(profile);
    setCurrentProfile(saved);
    setHouseSystem(selectedHouseSystem);
    setActiveSubTab('chart');
  };

  const handleShareAstrology = () => {
    const shareText = `🔮 CHIÊM TINH AI AN LỊCH - BẢN ĐỒ SAO CÁ NHÂN\nKhám phá Cung Mặt Trời, Mặt Trăng, Cung Mọc và luận giải lá số chiêm tinh chuyên sâu!\n🔗 Xem ngay tại: https://www.anlichai.online/chiem-tinh`;
    if (navigator.share) {
      navigator.share({
        title: 'Chiêm Tinh AI An Lịch - Bản Đồ Sao Cá Nhân',
        text: shareText,
        url: 'https://www.anlichai.online/chiem-tinh'
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Đã sao chép liên kết Chiêm Tinh AI vào bộ nhớ tạm!');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* HERO BANNER SECTION */}
      <div className="bg-gradient-to-r from-oriental-red-900 via-oriental-red-950 to-amber-950 text-oriental-gold-100 p-6 sm:p-8 rounded-3xl border-2 border-oriental-gold-500/50 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-oriental-gold-400 font-extrabold text-xs tracking-widest uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            <span>HỆ CHIÊM TINH HỌC TÂY PHƯƠNG (WESTERN TROPICAL ASTROLOGY)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black text-oriental-gold-300 tracking-wide leading-tight">
            🔮 CHIÊM TINH AI AN LỊCH
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-2 leading-relaxed">
            Khám phá bản đồ sao cá nhân với tính toán thiên văn chính xác 100% dựa trên ngày, giờ, múi giờ và tọa độ nơi sinh. Luận giải chuyên sâu cùng Trợ Lý AI.
          </p>
        </div>

        <button
          onClick={handleShareAstrology}
          className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2.5 bg-oriental-gold-500 text-oriental-red-950 rounded-2xl font-extrabold text-xs shadow-gold-glow hover:scale-105 transition-all border border-amber-200 shrink-0"
        >
          <Share2 className="w-4 h-4" />
          <span>Chia sẻ trang này</span>
        </button>

        {/* TOP SUB-TAB NAVIGATION CAPSULE */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-oriental-gold-500/30">
          <button
            onClick={() => setActiveSubTab('chart')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'chart'
                ? 'bg-oriental-gold-500 text-oriental-red-950 shadow-gold-glow scale-102 font-extrabold'
                : 'bg-white/10 text-amber-200 hover:bg-white/20'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Bản Đồ Sao Cá Nhân</span>
          </button>

          <button
            onClick={() => setActiveSubTab('create')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'create'
                ? 'bg-oriental-gold-500 text-oriental-red-950 shadow-gold-glow scale-102 font-extrabold'
                : 'bg-white/10 text-amber-200 hover:bg-white/20'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Tạo Bản Đồ Sao Mới</span>
          </button>

          <button
            onClick={() => setActiveSubTab('daily')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'daily'
                ? 'bg-oriental-gold-500 text-oriental-red-950 shadow-gold-glow scale-102 font-extrabold'
                : 'bg-white/10 text-amber-200 hover:bg-white/20'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Chiêm Tinh Hôm Nay (Transits)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('profiles')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'profiles'
                ? 'bg-oriental-gold-500 text-oriental-red-950 shadow-gold-glow scale-102 font-extrabold'
                : 'bg-white/10 text-amber-200 hover:bg-white/20'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Hồ Sơ Đã Lưu</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CREATE FORM */}
      {activeSubTab === 'create' && (
        <BirthProfileForm
          onCalculate={handleCalculateNewProfile}
          initialProfile={currentProfile}
        />
      )}

      {/* SUB-TAB 2: NATAL CHART RESULT */}
      {activeSubTab === 'chart' && (
        <>
          {chartData ? (
            <div className="space-y-6">
              
              {/* BIG 3 HERO CARD */}
              <BigThreeCard chartData={chartData} />

              {/* HOUSE SYSTEM TOGGLE & ACTION TOOLS */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 dark:bg-oriental-dark-card/95 p-3.5 rounded-2xl border border-amber-200/90 dark:border-oriental-dark-border shadow-md">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-oriental-gold-600" />
                  <span className="text-xs font-bold text-slate-800 dark:text-amber-100">
                    Hệ Thống Nhà:
                  </span>
                  <select
                    value={houseSystem}
                    onChange={(e) => setHouseSystem(e.target.value as HouseSystem)}
                    className="px-3 py-1 rounded-xl border border-amber-300 dark:border-oriental-dark-border bg-amber-50 dark:bg-oriental-dark-bg text-xs font-bold text-oriental-red-900 dark:text-oriental-gold-300"
                  >
                    <option value="Placidus">Placidus (Mặc định)</option>
                    <option value="Whole Sign">Whole Sign (Cung Nguyên)</option>
                    <option value="Equal">Equal (Đồng Đều)</option>
                    <option value="Koch">Koch</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (chartData) {
                        const chartHash = astrologyStorageService.generateChartHash(currentProfile!, houseSystem);
                        fetchAiInterpretation(chartData, chartHash);
                      }
                    }}
                    disabled={isAiLoading}
                    className="px-3 py-1.5 rounded-xl bg-amber-200 dark:bg-amber-900/60 text-oriental-red-900 dark:text-oriental-gold-300 text-xs font-bold flex items-center gap-1 border border-oriental-gold-500/40 hover:bg-amber-300 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                    <span>Tải lại AI Luận</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-oriental-red-800 text-oriental-gold-300 text-xs font-bold flex items-center gap-1 shadow-oriental hover:brightness-110 transition-all border border-oriental-gold-400/40"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>In / Xuất Bản Đồ</span>
                  </button>
                </div>
              </div>

              {/* WHEEL + ELEMENTS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <NatalChartWheel chartData={chartData} />
                <ElementModalityChart elements={chartData.elements} modalities={chartData.modalities} />
              </div>

              {/* FULL WIDTH PLANETARY POSITIONS TABLE/GRID */}
              <PlanetTable planets={chartData.planets} />

              {/* HOUSES & ASPECTS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HouseTable houses={chartData.houses} houseSystem={chartData.houseSystem} />
                <AspectsList aspects={chartData.aspects} />
              </div>

              {/* DEEPSEEK AI INTERPRETATION SECTIONS */}
              <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-3xl p-6 sm:p-8 border-2 border-amber-200/90 dark:border-oriental-dark-border shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-amber-200/80 dark:border-oriental-dark-border pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-oriental-red-800 to-oriental-red-950 text-oriental-gold-300 flex items-center justify-center text-xl shadow-oriental border border-oriental-gold-400">
                      🤖
                    </span>
                    <div>
                      <h3 className="font-serif font-black text-xl text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide">
                        LUẬN GIẢI CHIÊM TINH DEEPSEEK AI
                      </h3>
                      <p className="text-xs text-amber-900/75 dark:text-amber-200/70">
                        Phân tích chuyên sâu dựa trên các thông số thiên văn của bản đồ sao.
                      </p>
                    </div>
                  </div>

                  {isAiLoading && (
                    <span className="flex items-center gap-1.5 text-xs text-oriental-gold-600 font-bold animate-pulse">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Đang suy luận...
                    </span>
                  )}
                </div>

                {interpretation ? (
                  <div className="space-y-6 text-xs sm:text-sm text-slate-800 dark:text-amber-100 leading-relaxed">
                    
                    {/* OVERVIEW */}
                    <div className="bg-amber-50/70 dark:bg-oriental-dark-bg p-4 rounded-2xl border border-amber-200/80 dark:border-oriental-dark-border">
                      <h4 className="font-serif font-black text-sm text-oriental-red-900 dark:text-oriental-gold-400 mb-1.5 uppercase tracking-wider">
                        📌 1. TỔNG QUAN BẢN ĐỒ SAO
                      </h4>
                      <p>{interpretation.overview}</p>
                    </div>

                    {/* PERSONALITY */}
                    <div className="bg-amber-50/70 dark:bg-oriental-dark-bg p-4 rounded-2xl border border-amber-200/80 dark:border-oriental-dark-border">
                      <h4 className="font-serif font-black text-sm text-oriental-red-900 dark:text-oriental-gold-400 mb-1.5 uppercase tracking-wider">
                        🌟 2. NÉT TÍNH CÁCH CỐT LÕI (BIG 3)
                      </h4>
                      <p>{interpretation.personality}</p>
                    </div>

                    {/* LOVE */}
                    <div className="bg-amber-50/70 dark:bg-oriental-dark-bg p-4 rounded-2xl border border-amber-200/80 dark:border-oriental-dark-border">
                      <h4 className="font-serif font-black text-sm text-oriental-red-900 dark:text-oriental-gold-400 mb-1.5 uppercase tracking-wider">
                        ❤️ 3. TÌNH CẢM & MỐI QUAN HỆ (VENUS & MOON)
                      </h4>
                      <p>{interpretation.loveAndRelationships}</p>
                    </div>

                    {/* CAREER */}
                    <div className="bg-amber-50/70 dark:bg-oriental-dark-bg p-4 rounded-2xl border border-amber-200/80 dark:border-oriental-dark-border">
                      <h4 className="font-serif font-black text-sm text-oriental-red-900 dark:text-oriental-gold-400 mb-1.5 uppercase tracking-wider">
                        💼 4. CÔNG VIỆC & THAM VỌNG (MC & 10TH HOUSE)
                      </h4>
                      <p>{interpretation.careerAndAmbition}</p>
                    </div>

                    {/* COMMUNICATION */}
                    <div className="bg-amber-50/70 dark:bg-oriental-dark-bg p-4 rounded-2xl border border-amber-200/80 dark:border-oriental-dark-border">
                      <h4 className="font-serif font-black text-sm text-oriental-red-900 dark:text-oriental-gold-400 mb-1.5 uppercase tracking-wider">
                        🧠 5. GIAO TIẾP & TƯ DUY (MERCURY)
                      </h4>
                      <p>{interpretation.communicationStyle}</p>
                    </div>

                    {/* PERSONAL GROWTH */}
                    <div className="bg-amber-50/70 dark:bg-oriental-dark-bg p-4 rounded-2xl border border-amber-200/80 dark:border-oriental-dark-border">
                      <h4 className="font-serif font-black text-sm text-oriental-red-900 dark:text-oriental-gold-400 mb-1.5 uppercase tracking-wider">
                        🌱 6. PHÁT TRIỂN CÁ NHÂN & BÀI HỌC CUỘC SỐNG (NORTH NODE & SATURN)
                      </h4>
                      <p>{interpretation.personalGrowth}</p>
                    </div>

                    {/* STRENGTHS & NOTICES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-300">
                        <h4 className="font-serif font-black text-sm text-emerald-900 dark:text-emerald-300 mb-2 uppercase">
                          💪 ĐIỂM MẠNH NỔI BẬT
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          {interpretation.keyStrengths.map((str, idx) => (
                            <li key={idx}>{str}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-amber-50/80 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-300">
                        <h4 className="font-serif font-black text-sm text-amber-900 dark:text-amber-300 mb-2 uppercase">
                          💡 ĐIỂM CẦN LƯU Ý
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          {interpretation.keyNoticePoints.map((not, idx) => (
                            <li key={idx}>{not}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* DISCLAIMER */}
                    <div className="p-4 rounded-2xl bg-amber-100/70 dark:bg-oriental-dark-bg border border-amber-300/80 text-[11px] text-amber-950 dark:text-amber-200 italic leading-relaxed">
                      ⚠️ <strong>MẸO CHÚ Ý:</strong> {interpretation.disclaimer}
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-amber-900/70 dark:text-amber-200/70">
                    Đang khởi tạo luận giải AI cho bản đồ sao...
                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="text-center py-12 bg-white/95 dark:bg-oriental-dark-card rounded-3xl border-2 border-amber-200">
              <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-2" />
              <h3 className="font-serif font-black text-lg text-oriental-red-900 dark:text-oriental-gold-400">
                Chưa Có Hồ Sơ Bản Đồ Sao
              </h3>
              <p className="text-xs text-amber-900/70 dark:text-amber-200/70 mt-1 mb-4">
                Vui lòng nhập thông tin sinh để tạo bản đồ sao cá nhân đầu tiên.
              </p>
              <button
                onClick={() => setActiveSubTab('create')}
                className="px-4 py-2 rounded-xl bg-oriental-red-800 text-oriental-gold-300 font-bold text-xs shadow-oriental"
              >
                Tạo Bản Đồ Sao Ngay
              </button>
            </div>
          )}
        </>
      )}

      {/* SUB-TAB 3: DAILY TRANSITS */}
      {activeSubTab === 'daily' && (
        <DailyTransitsView chartData={chartData} />
      )}

      {/* SUB-TAB 4: SAVED PROFILES */}
      {activeSubTab === 'profiles' && (
        <SavedProfilesView
          onSelectProfile={(p) => {
            setCurrentProfile(p);
            setActiveSubTab('chart');
          }}
          onCreateNew={() => setActiveSubTab('create')}
        />
      )}

    </div>
  );
};
