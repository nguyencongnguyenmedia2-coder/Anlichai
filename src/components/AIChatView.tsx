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
  selectedDayContext,
  onClearContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => storageService.getChatHistory());
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStreamText, setCurrentStreamText] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const errorMessageStr = error.message || 'Không thể kết nối Trợ Lý AI.';
      const errorMessage: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: `Rất tiếc, có lỗi xảy ra: ${errorMessageStr}`,
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
    <div className="bg-white/90 dark:bg-oriental-dark-card/95 rounded-2xl sm:rounded-3xl shadow-xl border border-amber-200/90 dark:border-oriental-dark-border p-2.5 sm:p-5 backdrop-blur-md flex flex-col h-[calc(100vh-145px)] sm:h-[calc(100vh-150px)] max-h-[800px] transition-all relative">
      
      {/* Header Bar - Responsive Mobile Optimized */}
      <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-oriental-dark-border pb-2.5 mb-2.5 shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-oriental-red-800 to-oriental-red-950 text-oriental-gold-300 flex items-center justify-center shadow-oriental text-lg sm:text-xl shrink-0 border border-oriental-gold-400">
            🤖
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm sm:text-lg font-serif font-black text-oriental-red-900 dark:text-oriental-gold-400 leading-tight">
                Trợ Lý AI An Lịch
              </h2>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500 fill-current" /> Phản hồi ~0.5s
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-amber-900/75 dark:text-amber-200/70 truncate max-w-[200px] sm:max-w-none">
              Tư vấn Phong Thủy • Tử Vi 12 Con Giáp • Giờ Cát Tường
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Xóa lịch sử trò chuyện"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <div className="px-2.5 py-1 rounded-full font-bold text-[11px] bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-300/80 flex items-center gap-1 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Sẵn Sàng</span>
          </div>
        </div>
      </div>

      {/* Selected Day Context Banner */}
      {selectedDayContext && (
        <div className="bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/70 dark:from-oriental-dark-bg dark:to-oriental-dark-card p-2 sm:p-2.5 rounded-xl border border-amber-300/70 dark:border-amber-800 text-[11px] sm:text-xs flex items-center justify-between mb-2.5 shrink-0 shadow-2xs">
          <div className="flex items-center space-x-1.5 truncate">
            <span className="text-xs">📌</span>
            <span className="text-amber-950 dark:text-amber-100 font-semibold truncate">
              Ngữ cảnh: <strong>{selectedDayContext.solarDay}/{selectedDayContext.solarMonth}/{selectedDayContext.solarYear}</strong> (Âm {selectedDayContext.lunarDay}/{selectedDayContext.lunarMonth} - {selectedDayContext.canChiDay})
            </span>
          </div>

          <button
            onClick={onClearContext}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-amber-200 shrink-0 ml-1"
            title="Bỏ ngữ cảnh ngày"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Messages Scroll View Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs sm:text-sm">
        
        {/* Welcome Banner when history is empty */}
        {messages.length === 0 && (
          <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/70 dark:from-oriental-dark-bg/80 dark:to-oriental-dark-card p-4 sm:p-6 rounded-2xl border border-amber-200/70 dark:border-oriental-dark-border text-center my-auto">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-oriental-red-800 text-oriental-gold-300 flex items-center justify-center text-xl sm:text-2xl mx-auto mb-2.5 shadow-oriental border border-oriental-gold-500/30">
              ☯
            </div>
            <h3 className="font-serif font-extrabold text-sm sm:text-lg text-oriental-red-900 dark:text-oriental-gold-400 mb-1">
              Kính Chào Quý Gia Chủ!
            </h3>
            <p className="text-[11px] sm:text-xs text-amber-900/80 dark:text-amber-200/70 max-w-md mx-auto leading-relaxed mb-3.5">
              Tôi là Trợ Lý AI của <strong>An Lịch AI</strong>. Tôi sẵn sàng giải đáp chuyên sâu các thắc mắc về xem ngày tốt xấu, hoàng đạo, tử vi 12 con giáp, giờ xuất hành và phong thủy theo tinh thần <strong>"Xem ngày • Hiểu mình • Sống an"</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left max-w-lg mx-auto">
              <button
                onClick={() => handleSend('Hãy luận tử vi 12 con giáp chi tiết cho ngày hôm nay')}
                className="p-2.5 rounded-xl bg-amber-100/70 dark:bg-oriental-dark-card hover:bg-amber-200 border border-amber-300/60 text-slate-800 dark:text-amber-200 font-semibold text-[11px] sm:text-xs transition-all flex items-center space-x-2 active:scale-98"
              >
                <Star className="w-4 h-4 text-amber-500 fill-current shrink-0" />
                <span>🔮 Luận Tử Vi 12 Con Giáp</span>
              </button>

              <button
                onClick={() => handleSend('Hôm nay là ngày tốt hay xấu, nên làm những việc gì?')}
                className="p-2.5 rounded-xl bg-amber-100/70 dark:bg-oriental-dark-card hover:bg-amber-200 border border-amber-300/60 text-slate-800 dark:text-amber-200 font-semibold text-[11px] sm:text-xs transition-all flex items-center space-x-2 active:scale-98"
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
            className={`flex items-start space-x-2 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-oriental-red-800 text-oriental-gold-300 flex items-center justify-center font-bold text-xs sm:text-sm shadow-2xs shrink-0 mt-0.5 border border-oriental-gold-500/30">
                ☯
              </div>
            )}

            <div
              className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-3 sm:p-3.5 shadow-2xs leading-relaxed whitespace-pre-wrap text-xs sm:text-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-oriental-red-900 via-oriental-red-800 to-oriental-red-950 text-oriental-gold-200 font-medium rounded-tr-xs shadow-md border border-oriental-gold-500/30'
                  : 'bg-white dark:bg-oriental-dark-card border border-amber-200/90 dark:border-oriental-dark-border text-slate-800 dark:text-amber-100 rounded-tl-xs'
              }`}
            >
              {cleanAsterisks(msg.content)}
            </div>
          </div>
        ))}

        {/* Streaming Realtime Response Output */}
        {isLoading && currentStreamText && (
          <div className="flex items-start space-x-2 justify-start">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-oriental-red-800 text-oriental-gold-300 flex items-center justify-center font-bold text-xs sm:text-sm shadow-2xs shrink-0 mt-0.5 border border-oriental-gold-500/30">
              ☯
            </div>
            <div className="max-w-[88%] sm:max-w-[80%] rounded-2xl rounded-tl-xs p-3 sm:p-3.5 bg-white dark:bg-oriental-dark-card border border-amber-200/90 dark:border-oriental-dark-border text-slate-800 dark:text-amber-100 shadow-2xs leading-relaxed whitespace-pre-wrap text-xs sm:text-sm">
              {cleanAsterisks(currentStreamText)}
              <span className="inline-block w-1.5 h-3.5 ml-1 bg-oriental-gold-500 animate-pulse" />
            </div>
          </div>
        )}

        {/* Loading Pulse Dots when waiting for initial SSE chunk */}
        {isLoading && !currentStreamText && (
          <div className="flex items-center space-x-2 text-slate-600 dark:text-amber-300/70 text-xs py-2 px-3 bg-amber-50 dark:bg-oriental-dark-card rounded-xl border border-amber-200/50 w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-oriental-gold-500" />
            <span>Trợ Lý An Lịch AI đang suy luận...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form & Categorized Quick Prompts */}
      <div className="pt-2 sm:pt-3 border-t border-amber-200/60 dark:border-oriental-dark-border space-y-2 shrink-0">
        
        {/* Quick Prompt Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <button
            type="button"
            onClick={() => handleSend('Hãy luận tử vi 12 con giáp chi tiết cho ngày hôm nay')}
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-amber-100/70 dark:bg-amber-900/40 hover:bg-oriental-gold-500 hover:text-oriental-red-950 text-slate-800 dark:text-amber-200 font-semibold text-[11px] sm:text-xs whitespace-nowrap transition-all border border-amber-300/50 flex items-center gap-1 active:scale-95"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>Luận Tử Vi 12 Con Giáp</span>
          </button>

          <button
            type="button"
            onClick={() => handleSend('Xem giờ tốt xuất hành và hướng Tài Thần hôm nay')}
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-amber-100/70 dark:bg-amber-900/40 hover:bg-oriental-gold-500 hover:text-oriental-red-950 text-slate-800 dark:text-amber-200 font-semibold text-[11px] sm:text-xs whitespace-nowrap transition-all border border-amber-300/50 flex items-center gap-1 active:scale-95"
          >
            <Compass className="w-3.5 h-3.5 text-oriental-gold-600" />
            <span>Giờ Tốt Xuất Hành</span>
          </button>

          <button
            type="button"
            onClick={() => handleSend('Hôm nay nên làm những việc gì và kiêng kỵ những gì?')}
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-amber-100/70 dark:bg-amber-900/40 hover:bg-oriental-gold-500 hover:text-oriental-red-950 text-slate-800 dark:text-amber-200 font-semibold text-[11px] sm:text-xs whitespace-nowrap transition-all border border-amber-300/50 flex items-center gap-1 active:scale-95"
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
            placeholder="Nhập câu hỏi phong thủy..."
            disabled={isLoading}
            className="flex-1 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-amber-50/80 dark:bg-oriental-dark-bg border border-amber-300 dark:border-amber-800 rounded-xl text-slate-800 dark:text-amber-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-oriental-gold-500 disabled:opacity-50 font-medium"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="p-2 sm:p-2.5 rounded-xl bg-oriental-red-800 hover:bg-oriental-red-900 text-oriental-gold-300 disabled:opacity-50 transition-all shadow-oriental shrink-0 border border-oriental-gold-500/40 active:scale-95"
          >
            <Send className="w-4 h-4 text-oriental-gold-400" />
          </button>
        </form>

      </div>

    </div>
  );
};
