import React, { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Sparkles, RefreshCw, X, Zap, Compass, Star } from 'lucide-react';
import { AppSettings, ChatMessage, DayDetail } from '../types';
import { aiService } from '../services/aiService';
import { storageService } from '../services/storageService';

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

  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [quickApiKeyInput, setQuickApiKeyInput] = useState<string>('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamText, isLoading]);

  // Clean asterisks formatting artifacts
  const cleanAsterisks = (text: string): string => {
    if (!text) return '';
    return text.replace(/\*/g, '');
  };

  const handleSaveQuickKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = quickApiKeyInput.trim();
    if (!cleanKey || cleanKey.length < 10) {
      alert('Vui lòng nhập API Key hợp lệ.');
      return;
    }
    const updatedSettings: AppSettings = {
      ...settings,
      geminiApiKey: cleanKey,
    };
    storageService.saveSettings(updatedSettings);
    window.location.reload();
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
        }
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
      const errorMessageStr = error.message || 'Không thể kết nối Gemini AI.';
      const errorMessage: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: `Rất tiếc, có lỗi xảy ra: ${errorMessageStr}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);

      if (errorMessageStr.includes('401') || errorMessageStr.includes('xác thực') || errorMessageStr.includes('Chưa cấu hình')) {
        setShowKeyModal(true);
      }
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
    <div className="bg-white/90 dark:bg-oriental-dark-card/95 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-amber-200/90 dark:border-oriental-dark-border p-3 sm:p-5 backdrop-blur-md flex flex-col h-[calc(100vh-140px)] max-h-[780px] transition-all relative">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-oriental-dark-border pb-3 mb-3 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-oriental-red-800 to-oriental-red-950 text-oriental-gold-300 flex items-center justify-center shadow-oriental text-xl shrink-0 border border-oriental-gold-400">
            🤖
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-serif font-extrabold text-oriental-red-900 dark:text-oriental-gold-400">
                Trợ Lý AI An Lịch
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500 fill-current" /> Phản hồi ~0.5s
              </span>
            </div>
            <p className="text-[11px] text-amber-900/75 dark:text-amber-200/70">
              Chuyên gia tư vấn Phong Thủy • Tử Vi 12 Con Giáp • Giờ Cát Tường
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Xóa lịch sử trò chuyện"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <div
            className="px-3 py-1.5 rounded-xl font-bold text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 flex items-center gap-1 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-current" />
            <span>AI Sẵn Sàng</span>
          </div>
        </div>
      </div>

      {/* Selected Day Context Banner */}
      {selectedDayContext && (
        <div className="bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/70 dark:from-oriental-dark-bg dark:to-oriental-dark-card p-2.5 rounded-xl border border-amber-300/70 dark:border-amber-800 text-xs flex items-center justify-between mb-3 shrink-0 shadow-2xs">
          <div className="flex items-center space-x-2 truncate">
            <span className="text-sm">📌</span>
            <span className="text-amber-950 dark:text-amber-100 font-semibold truncate">
              Đang xem ngữ cảnh ngày: <strong>{selectedDayContext.solarDay}/{selectedDayContext.solarMonth}/{selectedDayContext.solarYear}</strong> (Âm {selectedDayContext.lunarDay}/{selectedDayContext.lunarMonth} - {selectedDayContext.canChiDay})
            </span>
          </div>

          <button
            onClick={onClearContext}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-amber-200 shrink-0"
            title="Bỏ ngữ cảnh ngày"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Messages Scroll View Container */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs sm:text-sm">
        
        {/* Welcome Banner when history is empty */}
        {messages.length === 0 && (
          <div className="bg-gradient-to-br from-amber-50/70 via-white to-amber-50/60 dark:from-oriental-dark-bg/80 dark:to-oriental-dark-card p-5 rounded-2xl border border-amber-200/70 dark:border-oriental-dark-border text-center my-auto">
            <div className="w-12 h-12 rounded-2xl bg-oriental-red-800 text-oriental-gold-300 flex items-center justify-center text-2xl mx-auto mb-3 shadow-oriental">
              ☯
            </div>
            <h3 className="font-serif font-extrabold text-base sm:text-lg text-oriental-red-900 dark:text-oriental-gold-400 mb-1">
              Kính Chào Quý Gia Chủ!
            </h3>
            <p className="text-xs text-amber-900/75 dark:text-amber-200/70 max-w-md mx-auto leading-relaxed mb-4">
              Tôi là Trợ Lý AI của ứng dụng <strong>An Lịch AI</strong>. Tôi sẵn sàng giải đáp chuyên sâu các thắc mắc về xem ngày tốt xấu, hoàng đạo, tử vi 12 con giáp, giờ xuất hành và tư vấn phong thủy theo tinh thần <strong>"Xem ngày • Hiểu mình • Sống an"</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left max-w-lg mx-auto">
              <button
                onClick={() => handleSend('Hãy luận tử vi 12 con giáp chi tiết cho ngày hôm nay')}
                className="p-2.5 rounded-xl bg-amber-100/60 dark:bg-oriental-dark-card hover:bg-amber-200 border border-amber-300/60 text-slate-800 dark:text-amber-200 font-semibold text-xs transition-all flex items-center space-x-2"
              >
                <Star className="w-4 h-4 text-amber-500 fill-current shrink-0" />
                <span>🔮 Luận Tử Vi 12 Con Giáp</span>
              </button>

              <button
                onClick={() => handleSend('Hôm nay là ngày tốt hay xấu, nên làm những việc gì?')}
                className="p-2.5 rounded-xl bg-amber-100/60 dark:bg-oriental-dark-card hover:bg-amber-200 border border-amber-300/60 text-slate-800 dark:text-amber-200 font-semibold text-xs transition-all flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-oriental-gold-500 shrink-0" />
                <span>☯️ Ngày Hôm Nay Cát/Hung?</span>
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-oriental-red-800 text-oriental-gold-300 flex items-center justify-center font-bold text-sm shadow-2xs shrink-0 mt-0.5 border border-oriental-gold-500/30">
                ☯
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 shadow-2xs leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-oriental-red-800 to-oriental-red-950 text-oriental-gold-300 font-medium rounded-tr-xs shadow-oriental border border-oriental-gold-500/30'
                  : 'bg-white dark:bg-oriental-dark-card border border-amber-200/80 dark:border-oriental-dark-border text-slate-800 dark:text-amber-100 rounded-tl-xs'
              }`}
            >
              {cleanAsterisks(msg.content)}
            </div>
          </div>
        ))}

        {/* Streaming Realtime Response Output */}
        {isLoading && currentStreamText && (
          <div className="flex items-start space-x-2.5 justify-start">
            <div className="w-8 h-8 rounded-xl bg-oriental-red-800 text-oriental-gold-300 flex items-center justify-center font-bold text-sm shadow-2xs shrink-0 mt-0.5 border border-oriental-gold-500/30">
              ☯
            </div>
            <div className="max-w-[85%] sm:max-w-[80%] rounded-2xl rounded-tl-xs p-3.5 bg-white dark:bg-oriental-dark-card border border-amber-200/80 dark:border-oriental-dark-border text-slate-800 dark:text-amber-100 shadow-2xs leading-relaxed whitespace-pre-wrap">
              {cleanAsterisks(currentStreamText)}
              <span className="inline-block w-2 h-4 ml-1 bg-oriental-gold-500 animate-pulse" />
            </div>
          </div>
        )}

        {/* Loading Pulse Dots when waiting for initial SSE chunk */}
        {isLoading && !currentStreamText && (
          <div className="flex items-center space-x-2 text-slate-500 dark:text-amber-300/70 text-xs py-2 px-3 bg-amber-50 dark:bg-oriental-dark-card rounded-xl border border-amber-200/50 w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-oriental-gold-500" />
            <span>Trợ Lý An Lịch AI đang suy luận...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form & Categorized Quick Prompts */}
      <div className="pt-3 border-t border-amber-200/60 dark:border-oriental-dark-border space-y-2 shrink-0">
        
        {/* Quick Prompt Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => handleSend('Hãy luận tử vi 12 con giáp chi tiết cho ngày hôm nay')}
            className="px-3 py-1.5 rounded-xl bg-amber-100/70 dark:bg-amber-900/40 hover:bg-oriental-gold-500 hover:text-oriental-red-950 text-slate-800 dark:text-amber-200 font-semibold text-xs whitespace-nowrap transition-all border border-amber-300/50 flex items-center gap-1"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>Luận Tử Vi 12 Con Giáp</span>
          </button>

          <button
            type="button"
            onClick={() => handleSend('Xem giờ tốt xuất hành và hướng Tài Thần hôm nay')}
            className="px-3 py-1.5 rounded-xl bg-amber-100/70 dark:bg-amber-900/40 hover:bg-oriental-gold-500 hover:text-oriental-red-950 text-slate-800 dark:text-amber-200 font-semibold text-xs whitespace-nowrap transition-all border border-amber-300/50 flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5 text-oriental-gold-600" />
            <span>Giờ Tốt Xuất Hành</span>
          </button>

          <button
            type="button"
            onClick={() => handleSend('Hôm nay nên làm những việc gì và kiêng kỵ những gì?')}
            className="px-3 py-1.5 rounded-xl bg-amber-100/70 dark:bg-amber-900/40 hover:bg-oriental-gold-500 hover:text-oriental-red-950 text-slate-800 dark:text-amber-200 font-semibold text-xs whitespace-nowrap transition-all border border-amber-300/50 flex items-center gap-1"
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
            className="flex-1 px-4 py-2.5 bg-amber-50/70 dark:bg-oriental-dark-bg border border-amber-300 dark:border-amber-800 rounded-xl text-slate-800 dark:text-amber-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-oriental-gold-500 disabled:opacity-50 font-medium"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="p-2.5 rounded-xl bg-oriental-red-800 hover:bg-oriental-red-900 text-oriental-gold-300 disabled:opacity-50 transition-all shadow-oriental shrink-0 border border-oriental-gold-500/40"
          >
            <Send className="w-4 h-4 text-oriental-gold-400" />
          </button>
        </form>

      </div>

      {/* Quick API Key Setup Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-amber-50 dark:bg-oriental-dark-card border-2 border-oriental-gold-500 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-amber-200/80 dark:border-oriental-dark-border pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🔑</span>
                <h3 className="font-serif font-black text-base text-oriental-red-900 dark:text-oriental-gold-400">
                  Nhập OpenRouter / Gemini API Key
                </h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-amber-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
              Để trò chuyện cùng Trợ Lý AI Phong Thủy, bạn có thể sử dụng <strong>OpenRouter API Key</strong> (sk-or-...) hoặc Google Gemini API Key.
            </p>

            <form onSubmit={handleSaveQuickKey} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-amber-200 mb-1">
                  Dán API Key (bắt đầu bằng sk-or-... hoặc AIzaSy...):
                </label>
                <input
                  type="password"
                  value={quickApiKeyInput}
                  onChange={(e) => setQuickApiKeyInput(e.target.value)}
                  placeholder="sk-or-v1-..."
                  required
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-oriental-dark-bg border border-amber-300 dark:border-amber-700 rounded-xl text-slate-800 dark:text-amber-100 font-mono text-xs focus:ring-2 focus:ring-oriental-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-oriental-red-800 dark:text-oriental-gold-400 font-bold hover:underline"
                >
                  🔗 Lấy Key Miễn Phí Tại OpenRouter.ai
                </a>
              </div>

              <div className="flex items-center space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowKeyModal(false);
                    onOpenSettings();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-200/80 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 font-bold text-xs hover:bg-amber-300 transition-colors"
                >
                  Mở Cài Đặt Khác
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl bg-oriental-red-800 hover:bg-oriental-red-900 text-oriental-gold-300 font-bold text-xs shadow-oriental transition-colors border border-oriental-gold-500/40"
                >
                  Lưu & Kết Nối
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
