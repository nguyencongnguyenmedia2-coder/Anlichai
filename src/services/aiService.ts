import { ChatMessage, DayDetail } from '../types';
import { storageService, BUILTIN_MASTER_KEY } from './storageService';

const SYSTEM_PROMPT = `Bạn là Trợ lý Phong Thủy & Âm Dương Lịch Chuyên Nghiệp của ứng dụng "An Lịch AI" (Slogan: Xem ngày • Hiểu mình • Sống an).
Nhiệm vụ của bạn là giải đáp chuyên sâu các câu hỏi về:
1. Xem ngày tốt xấu, Hoàng Đạo, Hắc Đạo, Trực, Sao, Nạp Âm.
2. Giờ xuất hành cát tường, hướng Tài Thần, Hỷ Thần.
3. Phong thủy nhà ở, tuổi tác, xem tử vi 12 con giáp.
4. Lễ nghi dân gian Việt Nam, cúng giỗ, lễ chùa.

QUY TẮC BẮT BUỘC VỀ ĐỊNH DẠNG:
- TUYỆT ĐỐI KHÔNG sử dụng dấu sao (*) hoặc cú pháp Markdown dạng * **...** trong câu trả lời.
- Trả lời bằng văn bản thuần túy, trình bày rõ ràng từng dòng, mạch lạc, có cấu trúc.
- Trả lời chuyên sâu, có kiến thức sâu rộng, phản hồi NHANH SẮC VÀ CHUẨN XÁC theo triết lý "Xem ngày • Hiểu mình • Sống an".`;

export const aiService = {
  async sendMessage(
    userMessage: string,
    history: ChatMessage[],
    dayContext: DayDetail | null,
    onChunk: (chunkText: string) => void
  ): Promise<string> {
    const settings = storageService.getSettings();
    
    // Always fallback to built-in OpenRouter key so clients never need to input any key
    let apiKey = settings.geminiApiKey?.trim();
    if (!apiKey || apiKey.length < 10) {
      apiKey = BUILTIN_MASTER_KEY;
    }

    let modelName = settings.geminiModel?.trim();
    if (!modelName || !modelName.includes('/')) {
      modelName = 'google/gemini-2.5-flash';
    }

    let fullUserText = userMessage;
    if (dayContext) {
      const contextInfo = `[NGỮ CẢNH NGÀY ĐANG XEM: Dương Lịch ${dayContext.solarDay}/${dayContext.solarMonth}/${dayContext.solarYear}, Âm Lịch ${dayContext.lunarDay}/${dayContext.lunarMonthName}, Can Chi Ngày ${dayContext.canChiDay}, Can Chi Tháng ${dayContext.canChiMonth}, Nạp Âm ${dayContext.napAm}, Đánh giá: ${dayDetailRatingString(dayContext)}]`;
      fullUserText = `${contextInfo}\nCâu hỏi người dùng: ${userMessage}`;
    }

    const recentHistory = history.slice(-6);
    const openRouterEndpoint = 'https://openrouter.ai/api/v1/chat/completions';

    const messagesPayload: Array<{ role: string; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    recentHistory.forEach((msg) => {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messagesPayload.push({
          role: msg.role,
          content: msg.content
        });
      }
    });

    messagesPayload.push({ role: 'user', content: fullUserText });

    const requestBody = {
      model: modelName,
      stream: true,
      messages: messagesPayload,
      temperature: 0.3,
      max_tokens: 2048,
    };

    let response = await fetch(openRouterEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
        'X-Title': 'An Lich AI',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Fallback to Built-in Master Key if custom key fails
    if (!response.ok && apiKey !== BUILTIN_MASTER_KEY) {
      console.warn('Custom API Key failed, falling back to Built-in Master Key...');
      response = await fetch(openRouterEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BUILTIN_MASTER_KEY}`,
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
          'X-Title': 'An Lich AI',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Lỗi kết nối Trợ lý AI (${response.status}): ${errText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Không nhận được dữ liệu từ Trợ Lý AI.');
    }

    const decoder = new TextDecoder();
    let accumulatedText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6);
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const textChunk = parsed.choices?.[0]?.delta?.content || '';
            if (textChunk) {
              const cleanedChunk = textChunk.replace(/\*/g, '');
              accumulatedText += cleanedChunk;
              onChunk(cleanedChunk);
            }
          } catch (e) {
            // Ignore parse errors on partial chunks
          }
        }
      }
    }

    return accumulatedText;
  }
};

function dayDetailRatingString(d: DayDetail): string {
  if (d.isHoangDaoDay) return 'Ngày Hoàng Đạo (Rất Cát Tường)';
  if (d.isTamNuong) return 'Ngày Tam Nương (Nên Thận Trọng)';
  if (d.isNguyetKy) return 'Ngày Nguyệt Kỵ (Nên Thận Trọng)';
  return 'Ngày Bình Thường';
}
