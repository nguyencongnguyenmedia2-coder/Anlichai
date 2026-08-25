import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Trash2,
  Sparkles,
  RefreshCw,
  X,
  Compass,
  Star,
  Pin,
  Bot,
  Settings as SettingsIcon,
  ShieldCheck,
} from 'lucide-react';
import { AppSettings, ChatMessage, DayDetail } from '../types';
import { aiService } from '../services/aiService';
import { storageService, AI_PROVIDER_PRESETS } from '../services/storageService';

interface AIChatViewProps {
  settings: AppSettings;
  onOpenSettings: () => void;
  selectedDayContext: DayDetail | null;
  onClearContext: () => void;
}

export const AIChatView: React.FC<AIChatViewProps> = ({
  settings,
  onOpenSettings,
  selectedDayContext,
  onClearContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => storageService.getChatHistory());
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStreamText, setCurrentStreamText] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const provider = settings.aiProvider || 'deepseek';
  const preset = AI_PROVIDER_PRESETS[provider] || AI_PROVIDER_PRESETS.deepseek;
  const currentModel = settings.aiModel || preset.defaultModel;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamText, isLoading]);

  const cleanAsterisks = (text: string): string => {
    if (!text) return '';
    return text.replace(/\*/g, '');
  };

  const handleSend = async (queryOverride?: string) => {
    const textToSend = (queryOverride || inputQuery).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    storageService.saveChatHistory(updatedHistory);

    if (!queryOverride) setInputQuery('');
    setIsLoading(true);
    setCurrentStreamText('');

    try {
      let accumulatedText = '';
      const fullResponse = await aiService.sendMessage(
        textToSend,
        messages,
        selectedDayContext,
        (chunkText) => {
          accumulatedText += chunkText;
          setCurrentStreamText(accumulatedText);
        },
        settings
      );

      const assistantMessage: ChatMessage = {
        id: 'ast_' + Date.now(),
        role: 'assistant',
        content: fullResponse || accumulatedText,
        timestamp: Date.now(),
      };

      const finalHistory = [...updatedHistory, assistantMessage];
      setMessages(finalHistory);
      storageService.saveChatHistory(finalHistory);
    } catch (error: any) {
      const errorMessageStr = error.message || 'Không thể kết nối Trợ Lý AI.';
      const errorMessage: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: `⚠️ Có lỗi xảy ra khi kết nối AI (${preset.name}): ${errorMessageStr}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setCurrentStreamText('');
    }
  };

  const handleClearHistory = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện không?')) {
      setMessages([]);
      storageService.clearChatHistory();
    }
  };

  return (
    <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-amber-200/90 dark:border-oriental-dark-border p-3 sm:p-6 backdrop-blur-md flex flex-col h-[calc(100vh-145px)] sm:h-[calc(100vh-150px)] max-h-[820px] transition-all relative">
      
      {/* Header Bar - Luxury Header with Active AI Model Badge */}
      <div className="flex items-center justify-between border-b border-amber-200/80 dark:border-oriental-dark-border pb-3 mb-3 shrink-0">
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-oriental-red-800 via-oriental-red-900 to-oriental-red-950 text-oriental-gold-300 flex items-center justify-center shadow-oriental text-xl sm:text-2xl shrink-0 border-2 border-oriental-gold-400">
            🤖
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-xl font-serif font-black text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide leading-tight">
                Trợ Lý AI An Lịch Riêng Tư
              </h2>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Trực Tiếp Client
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-900/75 dark:text-amber-200/70 truncate max-w-[210px] sm:max-w-none mt-0.5">
              Tư vấn Phong Thủy • Tử Vi 12 Con Giáp • Giờ Cát Tường
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Active Provider Badge */}
          <button
            onClick={onOpenSettings}
            className="px-3 py-1.5 rounded-full font-bold text-[11px] sm:text-xs bg-emerald-100 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border border-emerald-400/80 flex items-center gap-1.5 shadow-2xs hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
            title="Nhấp để thay đổi Model AI hoặc Key trong Cài đặt"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] truncate max-w-[130px] sm:max-w-[200px]">
              {preset.name} ({currentModel})
            </span>
            <SettingsIcon className="w-3.5 h-3.5 ml-1 text-emerald-700 dark:text-emerald-400 shrink-0" />
          </button>

          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Xóa lịch sử trò chuyện"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* AI Assistant Direct Connection Status Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 dark:from-oriental-dark-bg dark:to-oriental-dark-card p-3 rounded-2xl border-2 border-emerald-300 dark:border-emerald-900/60 shadow-2xs mb-3 flex items-start gap-2.5 shrink-0">
        <div className="w-7 h-7 rounded-xl bg-emerald-700 text-amber-100 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
          ⚡
        </div>
        <div className="text-xs text-slate-800 dark:text-amber-100 leading-relaxed font-sans flex-1">
          <strong className="text-emerald-900 dark:text-emerald-400 font-extrabold font-serif block text-xs sm:text-sm">
            ✨ Trợ Lý AI Đã Trực Tuyến ({preset.name}):
          </strong>
          <span>
            Các câu hỏi luận đoán phong thủy và lá số được gửi <strong>trực tiếp từ trình duyệt của bạn đến {preset.name} ({currentModel})</strong> mà không qua bất kỳ máy chủ trung gian nào. Gia chủ có thể bắt đầu trò chuyện ngay!
          </span>
        </div>

        <button
          onClick={onOpenSettings}
          className="px-2.5 py-1 bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 rounded-lg text-[11px] font-bold shrink-0 hover:bg-amber-300 flex items-center gap-1 border border-amber-400/50"
        >
          <SettingsIcon className="w-3 h-3" />
          <span>Đổi AI Key</span>
        </button>
      </div>

      {/* Selected Day Context Banner */}
      {selectedDayContext && (
        <div className="bg-gradient-to-r from-amber-200/80 via-amber-100/90 to-amber-200/80 dark:from-oriental-dark-bg dark:to-amber-950/60 p-2.5 sm:p-3 rounded-2xl border-2 border-oriental-gold-500/50 text-xs shadow-2xs flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center space-x-2 truncate">
            <span className="bg-oriental-red-800 text-oriental-gold-300 px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold flex items-center gap-1 shrink-0">
              <Pin className="w-3 h-3 fill-current" /> Ngữ cảnh ngày
            </span>
            <span className="text-amber-950 dark:text-amber-100 font-bold truncate">
              {selectedDayContext.solarDay}/{selectedDayContext.solarMonth}/{selectedDayContext.solarYear} (Âm {selectedDayContext.lunarDay}/{selectedDayContext.lunarMonth} - {selectedDayContext.canChiDay})
            </span>
          </div>

          <button
            onClick={onClearContext}
            className="p-1 rounded-lg text-amber-800 dark:text-amber-300 hover:bg-amber-300/60 dark:hover:bg-amber-900/60 shrink-0 ml-1 transition-colors"
            title="Bỏ ngữ cảnh ngày"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Messages Scroll View Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm custom-scrollbar">
        
        {/* Welcome Banner when history is empty */}
        {messages.length === 0 && (
          <div className="bg-gradient-to-br from-amber-50/90 via-white to-amber-50/80 dark:from-oriental-dark-bg/90 dark:to-oriental-dark-card p-5 sm:p-8 rounded-3xl border-2 border-amber-200/80 dark:border-oriental-dark-border text-center my-auto shadow-md">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-oriental-red-800 to-oriental-red-950 text-oriental-gold-300 flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-3 shadow-oriental border-2 border-oriental-gold-400">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-oriental-gold-300" />
            </div>
            <h3 className="font-serif font-black text-base sm:text-xl text-oriental-red-900 dark:text-oriental-gold-400 mb-1.5 tracking-wide">
              Kính Chào Quý Gia Chủ!
            </h3>
            <p className="text-xs sm:text-sm text-amber-900/85 dark:text-amber-200/80 max-w-lg mx-auto leading-relaxed mb-5">
              Tôi là Trợ Lý AI riêng tư của <strong>An Lịch AI</strong> ({preset.name}). Tôi sẵn sàng giải đáp chuyên sâu về xem ngày cát tường, hoàng đạo, tử vi 12 con giáp, phong thủy bát trạch và giờ xuất hành theo phương châm <strong>"Xem ngày • Hiểu mình • Sống an"</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left max-w-lg mx-auto">
              <button
                onClick={() => handleSend('Hãy luận tử vi 12 con giáp chi tiết cho ngày hôm nay')}
                className="p-3 rounded-2xl bg-gradient-to-r from-amber-100/90 to-amber-200/80 dark:from-oriental-dark-card dark:to-amber-950/40 hover:brightness-105 border-2 border-oriental-gold-500/40 text-amber-950 dark:text-amber-200 font-extrabold text-xs transition-all flex items-center space-x-2.5 shadow-2xs active:scale-98 cursor-pointer"
              >
                <Star className="w-4.5 h-4.5 text-amber-500 fill-current shrink-0" />
                <span>🔮 Luận Tử Vi 12 Con Giáp</span>
              </button>

              <button
                onClick={() => handleSend('Xem giờ tốt xuất hành và hướng Tài Thần hôm nay')}
                className="p-3 rounded-2xl bg-gradient-to-r from-amber-100/90 to-amber-200/80 dark:from-oriental-dark-card dark:to-amber-950/40 hover:brightness-105 border-2 border-oriental-gold-500/40 text-amber-950 dark:text-amber-200 font-extrabold text-xs transition-all flex items-center space-x-2.5 shadow-2xs active:scale-98 cursor-pointer"
              >
                <Compass className="w-4.5 h-4.5 text-oriental-gold-600 shrink-0" />
                <span>🧭 Giờ Cát Tường & Xuất Hành</span>
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages List */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-oriental-red-800 to-oriental-red-950 text-oriental-gold-300 flex items-center justify-center font-extrabold text-sm sm:text-base shadow-md shrink-0 mt-0.5 border-2 border-oriental-gold-400">
                <Bot className="w-5 h-5 text-oriental-gold-300" />
              </div>
            )}

            <div
              className={`max-w-[90%] sm:max-w-[82%] rounded-2xl shadow-md leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-oriental-red-800 via-oriental-red-900 to-oriental-red-950 text-amber-50 font-semibold rounded-tr-xs p-3.5 sm:p-4 border border-oriental-gold-400/40 text-xs sm:text-sm'
                  : 'bg-white/95 dark:bg-oriental-dark-card/95 border-2 border-amber-200/90 dark:border-oriental-dark-border text-slate-800 dark:text-amber-100 rounded-tl-xs p-4 sm:p-5'
              }`}
            >
              {msg.role === 'user' ? (
                <div className="whitespace-pre-wrap">{cleanAsterisks(msg.content)}</div>
              ) : (
                renderFormattedContent(cleanAsterisks(msg.content))
              )}
            </div>
          </div>
        ))}

        {/* Streaming Realtime Response Output */}
        {isLoading && currentStreamText && (
          <div className="flex items-start space-x-2.5 justify-start">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-oriental-red-800 to-oriental-red-950 text-oriental-gold-300 flex items-center justify-center font-extrabold text-sm sm:text-base shadow-md shrink-0 mt-0.5 border-2 border-oriental-gold-400">
              <Bot className="w-5 h-5 text-oriental-gold-300" />
            </div>
            <div className="max-w-[90%] sm:max-w-[82%] rounded-2xl rounded-tl-xs p-4 sm:p-5 bg-white/95 dark:bg-oriental-dark-card/95 border-2 border-amber-200/90 dark:border-oriental-dark-border text-slate-800 dark:text-amber-100 shadow-md leading-relaxed">
              {renderFormattedContent(cleanAsterisks(currentStreamText))}
              <span className="inline-block w-2 h-4 ml-1 bg-oriental-gold-500 animate-pulse rounded-xs" />
            </div>
          </div>
        )}

        {/* Loading Pulse Indicator */}
        {isLoading && !currentStreamText && (
          <div className="flex items-center space-x-2 text-slate-700 dark:text-amber-200 font-bold text-xs py-2.5 px-4 bg-amber-100/80 dark:bg-oriental-dark-card rounded-2xl border-2 border-oriental-gold-500/40 w-fit shadow-2xs">
            <RefreshCw className="w-4 h-4 animate-spin text-oriental-gold-600" />
            <span>Trợ Lý An Lịch AI ({preset.name}) đang suy luận...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form & Quick Suggestion Pills */}
      <div className="pt-3 border-t border-amber-200/80 dark:border-oriental-dark-border space-y-2.5 shrink-0">
        
        {/* Quick Suggestion Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <button
            type="button"
            onClick={() => handleSend('Hãy luận tử vi 12 con giáp chi tiết cho ngày hôm nay')}
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100/90 to-amber-200/80 dark:from-amber-950/60 dark:to-oriental-dark-card hover:brightness-105 text-amber-950 dark:text-amber-200 font-extrabold text-[11px] sm:text-xs whitespace-nowrap transition-all border border-oriental-gold-500/50 shadow-2xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>Luận Tử Vi 12 Con Giáp</span>
          </button>

          <button
            type="button"
            onClick={() => handleSend('Xem giờ tốt xuất hành và hướng Tài Thần hôm nay')}
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100/90 to-amber-200/80 dark:from-amber-950/60 dark:to-oriental-dark-card hover:brightness-105 text-amber-950 dark:text-amber-200 font-extrabold text-[11px] sm:text-xs whitespace-nowrap transition-all border border-oriental-gold-500/50 shadow-2xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-oriental-gold-600" />
            <span>Giờ Tốt Xuất Hành</span>
          </button>

          <button
            type="button"
            onClick={() => handleSend('Tư vấn phong thủy Bát Trạch và hướng nhà theo tuổi')}
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100/90 to-amber-200/80 dark:from-amber-950/60 dark:to-oriental-dark-card hover:brightness-105 text-amber-950 dark:text-amber-200 font-extrabold text-[11px] sm:text-xs whitespace-nowrap transition-all border border-oriental-gold-500/50 shadow-2xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Phong Thủy Bát Trạch</span>
          </button>

          <button
            type="button"
            onClick={() => handleSend('Hôm nay nên làm những việc gì và kiêng kỵ những gì?')}
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100/90 to-amber-200/80 dark:from-amber-950/60 dark:to-oriental-dark-card hover:brightness-105 text-amber-950 dark:text-amber-200 font-extrabold text-[11px] sm:text-xs whitespace-nowrap transition-all border border-oriental-gold-500/50 shadow-2xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-oriental-gold-500" />
            <span>Việc Nên Làm & Kiêng Kỵ</span>
          </button>
        </div>

        {/* Input Bar Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Nhập câu hỏi luận đoán phong thủy chuyên sâu..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 sm:px-5 sm:py-3 bg-amber-50/80 dark:bg-oriental-dark-bg border-2 border-amber-300 dark:border-amber-700 rounded-2xl text-slate-800 dark:text-amber-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-oriental-gold-500 focus:border-oriental-gold-500 disabled:opacity-50 font-medium transition-all shadow-inner placeholder:text-slate-400 dark:placeholder:text-amber-300/40"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-oriental-red-800 to-oriental-red-950 hover:from-oriental-red-700 hover:to-oriental-red-900 text-oriental-gold-300 disabled:opacity-50 transition-all shadow-oriental shrink-0 border border-oriental-gold-500/40 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Send className="w-4.5 h-4.5 text-oriental-gold-300" />
          </button>
        </form>

      </div>

    </div>
  );
};

// Helper: Formats AI responses into structured, elegant magazine-like typography
function renderFormattedContent(text: string) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="space-y-2.5 leading-relaxed text-xs sm:text-sm">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Numbered section header like "1. Tính chất ngày:"
        const matchNumbered = trimmed.match(/^(\d+)\.\s*(.*)/);
        if (matchNumbered) {
          return (
            <div key={idx} className="mt-3.5 mb-1.5 font-serif font-black text-oriental-red-900 dark:text-oriental-gold-400 text-xs sm:text-sm flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-oriental-red-800 text-oriental-gold-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs border border-oriental-gold-500/40">
                {matchNumbered[1]}
              </span>
              <span className="flex-1 leading-snug">{matchNumbered[2]}</span>
            </div>
          );
        }

        // Bullet items like "- Khai trương:" or "• ..." or "✦ ..."
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('✦ ')) {
          const bulletText = trimmed.replace(/^[-•✦]\s*/, '');
          return (
            <div key={idx} className="ml-3 sm:ml-5 flex items-start gap-2 text-slate-700 dark:text-amber-200/90 text-xs sm:text-sm">
              <span className="text-oriental-gold-600 dark:text-oriental-gold-400 font-bold shrink-0 text-[10px] mt-0.5">✦</span>
              <span className="flex-1">{bulletText}</span>
            </div>
          );
        }

        // Normal paragraph text
        return (
          <p key={idx} className="text-slate-800 dark:text-amber-100 text-xs sm:text-sm leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
