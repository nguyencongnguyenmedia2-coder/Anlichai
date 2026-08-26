import React, { useState } from 'react';
import {
  Settings,
  Key,
  Save,
  CheckCircle,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  Cpu,
  Zap,
  Check,
  AlertCircle,
  RefreshCw,
  Server,
  ShieldAlert,
  Bell
} from 'lucide-react';
import { AppSettings, AIProvider } from '../types';
import { AI_PROVIDER_PRESETS } from '../services/storageService';
import { aiService } from '../services/aiService';
import { notificationService } from '../services/notificationService';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  isAdminMode: boolean;
  onOpenAdminLogin?: () => void;
  onExitAdminMode: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  isAdminMode,
  onExitAdminMode,
}) => {
  const [adminPin, setAdminPin] = useState(settings.adminPin || '123456');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(settings.notificationsEnabled ?? true);

  // Private AI Assistant State
  const [aiProvider, setAiProvider] = useState<AIProvider>(settings.aiProvider || 'gemini');
  const [aiApiKey, setAiApiKey] = useState(settings.aiApiKey || '');
  const [aiModel, setAiModel] = useState(settings.aiModel || 'gemini-1.5-flash');
  const [aiBaseUrl, setAiBaseUrl] = useState(settings.aiBaseUrl || 'https://generativelanguage.googleapis.com/v1beta');
  const [showApiKey, setShowApiKey] = useState(false);

  // Test Connection State
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSelectProvider = (prov: AIProvider) => {
    const preset = AI_PROVIDER_PRESETS[prov] || AI_PROVIDER_PRESETS.deepseek;
    setAiProvider(prov);
    setAiBaseUrl(preset.baseUrl);
    setAiModel(preset.defaultModel);
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setIsTestingApi(true);
    setTestResult(null);

    const tempSettings: AppSettings = {
      ...settings,
      aiProvider,
      aiApiKey,
      aiModel,
      aiBaseUrl,
    };

    const res = await aiService.testConnection(tempSettings);
    setIsTestingApi(false);
    setTestResult(res);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppSettings = {
      ...settings,
      notificationsEnabled,
      adminPin: adminPin.trim(),
      aiProvider,
      aiApiKey: aiApiKey.trim(),
      aiModel: aiModel.trim(),
      aiBaseUrl: aiBaseUrl.trim(),
    };
    onSaveSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const activePreset = AI_PROVIDER_PRESETS[aiProvider] || AI_PROVIDER_PRESETS.deepseek;

  return (
    <div className="bg-white/80 dark:bg-oriental-dark-card/90 rounded-2xl shadow-xl border border-amber-200/80 dark:border-oriental-dark-border p-4 sm:p-6 backdrop-blur-md max-w-4xl mx-auto space-y-6">
      
      {/* Top Header Title */}
      <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-oriental-dark-border pb-4">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-oriental-red-800 dark:text-oriental-gold-400" />
          <div>
            <h2 className="text-xl font-serif font-bold text-oriental-red-900 dark:text-oriental-gold-400">
              Cài Đặt Hệ Thống & Trợ Lý AI
            </h2>
            <p className="text-xs text-amber-800/70 dark:text-amber-200/60">
              Tùy chỉnh Trợ lý AI riêng tư không qua server trung gian, giao diện và thông báo
            </p>
          </div>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-300 animate-pulse">
            <CheckCircle className="w-4 h-4" /> Đã lưu cài đặt!
          </span>
        )}
      </div>

      {/* Admin Access Mode Banner (Only shown when Admin Mode is active) */}
      {isAdminMode && (
        <div className="bg-gradient-to-r from-amber-100/80 to-amber-50/60 dark:from-amber-950/40 dark:to-oriental-dark-bg p-4 rounded-xl border border-oriental-gold-500/40 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-oriental-red-800 text-oriental-gold-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-oriental-red-900 dark:text-oriental-gold-400">
                Đang ở Chế Độ Quản Trị Viên (Admin)
              </h3>
              <p className="text-slate-600 dark:text-amber-200/70 text-[11px] mt-0.5">
                Bạn có toàn quyền chỉnh sửa sự kiện lễ hội và thay đổi mã PIN quản trị.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onExitAdminMode}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-oriental-red-950 font-bold rounded-lg shadow-sm flex items-center gap-1 shrink-0"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Thoát Admin</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
        
        {/* SECTION 1: PRIVATE AI ASSISTANT CONFIGURATION (CRITICAL FEATURE) */}
        <div className="bg-gradient-to-br from-amber-50/90 via-white to-emerald-50/40 dark:from-oriental-dark-card dark:to-oriental-dark-bg p-5 rounded-2xl border-2 border-oriental-gold-500/60 shadow-md space-y-4">
          
          <div className="flex flex-wrap items-center justify-between border-b border-amber-200/80 dark:border-oriental-dark-border pb-3 gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-oriental-red-800 text-oriental-gold-300 flex items-center justify-center font-bold text-base shadow-sm">
                🤖
              </div>
              <div>
                <h3 className="font-serif font-black text-base text-oriental-red-900 dark:text-oriental-gold-400">
                  Cấu Hình Trợ Lý AI Riêng Tư (Private AI)
                </h3>
                <p className="text-[11px] text-amber-900/75 dark:text-amber-200/70">
                  Sử dụng API Key cá nhân hoặc AI chạy trên máy local — Không qua server trung gian!
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] rounded-full border border-emerald-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bảo mật 100% Client-Side</span>
            </span>
          </div>

          {/* Privacy & Direct Connection Info Banner */}
          <div className="bg-emerald-500/10 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-400/40 text-xs leading-relaxed text-slate-700 dark:text-amber-200 flex items-start gap-2">
            <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>🔒 Quyền Riêng Tư Tuyệt Đối:</strong> Dữ liệu câu hỏi và API Key được lưu trực tiếp trên thiết bị của bạn (localStorage). Khi gửi tin nhắn, ứng dụng kết nối thẳng đến nhà cung cấp AI / Local AI mà <strong>không đi qua bất kỳ server trung gian nào</strong>.
            </div>
          </div>

          {/* Provider Selector Cards Grid */}
          <div>
            <label className="block font-serif font-bold text-slate-800 dark:text-amber-200 mb-2">
              Chọn Nhà Cung Cấp AI (AI Provider):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'deepseek', label: 'DeepSeek AI', icon: '⚡' },
                { id: 'gemini', label: 'Google Gemini', icon: '✨' },
                { id: 'openai', label: 'OpenAI (ChatGPT)', icon: '🟢' },
                { id: 'claude', label: 'Anthropic Claude', icon: '🟣' },
                { id: 'kimi', label: 'Kimi (Moonshot)', icon: '🌙' },
                { id: 'local', label: 'Local AI (Ollama)', icon: '🏠' },
                { id: 'custom', label: 'Custom API / ZenMux', icon: '🌐' },
              ].map((p) => {
                const isSelected = aiProvider === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectProvider(p.id as AIProvider)}
                    className={`p-3 rounded-xl border-2 text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-oriental-red-900 text-oriental-gold-300 border-oriental-gold-400 shadow-oriental scale-[1.02]'
                        : 'bg-white dark:bg-oriental-dark-card text-slate-700 dark:text-amber-200 border-amber-200 dark:border-amber-900/60 hover:border-oriental-gold-500/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">{p.icon}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-oriental-gold-400 font-bold" />
                      )}
                    </div>
                    <span className="font-serif font-bold text-xs leading-tight">
                      {p.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Provider Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* API Key Input */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800 dark:text-amber-200 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-oriental-gold-600" />
                  Mã API Key ({activePreset.name})
                </label>
                <span className="text-[11px] text-amber-800/70 dark:text-amber-300/60">
                  {activePreset.hintKey}
                </span>
              </div>

              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={aiApiKey}
                  onChange={(e) => {
                    setAiApiKey(e.target.value);
                    setTestResult(null);
                  }}
                  placeholder={activePreset.requiresKey ? 'Nhập mã API Key của bạn tại đây...' : 'Không bắt buộc đối với Local AI'}
                  className="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-oriental-dark-card border-2 border-amber-300 dark:border-amber-800 rounded-xl text-slate-800 dark:text-amber-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-oriental-gold-500"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-amber-200"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Model Name Input / Preset Selector */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-amber-200 mb-1 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-oriental-gold-600" />
                Tên Model AI
              </label>
              <div className="space-y-1.5">
                <select
                  value={activePreset.models.includes(aiModel) ? aiModel : 'custom'}
                  onChange={(e) => {
                    if (e.target.value !== 'custom') {
                      setAiModel(e.target.value);
                      setTestResult(null);
                    }
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-oriental-dark-card border border-amber-300 dark:border-amber-800 rounded-xl text-slate-800 dark:text-amber-100 font-medium focus:outline-none focus:ring-2 focus:ring-oriental-gold-500 text-xs"
                >
                  {activePreset.models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                  <option value="custom">✏️ Nhập model tùy chỉnh...</option>
                </select>

                {(!activePreset.models.includes(aiModel) || aiModel === 'custom') && (
                  <input
                    type="text"
                    value={aiModel}
                    onChange={(e) => {
                      setAiModel(e.target.value);
                      setTestResult(null);
                    }}
                    placeholder="Tên model cụ thể (VD: gpt-4o, llama3:70b...)"
                    className="w-full px-3 py-2 bg-white dark:bg-oriental-dark-card border border-amber-300 dark:border-amber-800 rounded-xl text-slate-800 dark:text-amber-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-oriental-gold-500"
                  />
                )}
              </div>
            </div>

            {/* Base URL Input */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-amber-200 mb-1 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-oriental-gold-600" />
                Địa Chỉ API Server (Base URL)
              </label>
              <input
                type="text"
                value={aiBaseUrl}
                onChange={(e) => {
                  setAiBaseUrl(e.target.value);
                  setTestResult(null);
                }}
                placeholder="https://api.openai.com/v1"
                className="w-full px-3 py-2 bg-white dark:bg-oriental-dark-card border border-amber-300 dark:border-amber-800 rounded-xl text-slate-800 dark:text-amber-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-oriental-gold-500"
              />
            </div>

          </div>

          {/* Test Connection Button & Result Feedback */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTestingApi}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-amber-50 font-bold rounded-xl shadow-sm text-xs flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isTestingApi ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang Kiểm Tra Kết Nối...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-oriental-gold-300" />
                  <span>Kiểm Tra Kết Nối AI Ngay</span>
                </>
              )}
            </button>

            {testResult && (
              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 flex-1 max-w-full ${
                  testResult.success
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-emerald-400'
                    : 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 border-rose-400'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="truncate">{testResult.message}</span>
              </div>
            )}
          </div>

        </div>



        {/* SECTION 4: ADMIN SECURITY CONFIG (ADMIN ONLY) */}
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

        {/* SECTION 4.5: NOTIFICATION SETTINGS & TEST */}
        <div className="bg-amber-50/70 dark:bg-oriental-dark-bg/80 p-4 rounded-xl border border-amber-200/80 dark:border-oriental-dark-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-oriental-red-900 dark:text-oriental-gold-400 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600 dark:text-oriental-gold-400" />
              Cài Đặt Thông Báo & Nhắc Nhở
            </h3>
            <button
              type="button"
              onClick={async () => {
                const granted = await notificationService.requestPermission();
                if (granted) {
                  notificationService.sendTestNotification();
                } else {
                  alert('Vui lòng cấp quyền thông báo trong trình duyệt của bạn!');
                }
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-oriental-red-950 font-bold rounded-lg text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Thử Phát Thông Báo</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="block font-medium text-xs text-slate-800 dark:text-amber-100">
                Bật Thông Báo Nhắc Nhở Lễ Hội & Sự Kiện
              </span>
              <span className="text-[11px] text-slate-500 dark:text-amber-200/60">
                Tự động gửi thông báo trên Desktop / Trình duyệt khi có sự kiện hoặc lịch cá nhân
              </span>
            </div>
            <button
              type="button"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                notificationsEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* SECTION 5: CREDITS */}
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
            className="px-6 py-2.5 bg-oriental-red-800 hover:bg-oriental-red-900 text-oriental-gold-300 font-bold rounded-xl shadow-oriental transition-all flex items-center space-x-2 border border-oriental-gold-500/40 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Tất Cả Cài Đặt</span>
          </button>
        </div>

      </form>

    </div>
  );
};
