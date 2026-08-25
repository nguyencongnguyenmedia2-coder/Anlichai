import { ChatMessage, DayDetail, AppSettings } from '../types';
import { storageService, AI_PROVIDER_PRESETS } from './storageService';

export const aiService = {
  async sendMessage(
    userMessage: string,
    history: ChatMessage[],
    dayContext: DayDetail | null,
    onChunk: (chunkText: string) => void,
    overrideSettings?: AppSettings
  ): Promise<string> {
    const currentSettings = overrideSettings || storageService.getSettings();
    const provider = currentSettings.aiProvider || 'custom';
    const preset = AI_PROVIDER_PRESETS[provider] || AI_PROVIDER_PRESETS.custom;

    let apiKey = (currentSettings.aiApiKey || '').trim();
    if (!apiKey && provider !== 'local') {
      // Fallback to env keys if user hasn't configured custom key
      apiKey = (import.meta.env.VITE_ZENMUX_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '').trim();
    }

    if (!apiKey && preset.requiresKey) {
      const errorMsg = `⚠️ Chưa cài đặt API Key cho ${preset.name}. Vui lòng vào tab [Cài Đặt] -> nhập Key của bạn để sử dụng Trợ Lý AI riêng tư không qua server trung gian!`;
      onChunk(errorMsg);
      return errorMsg;
    }

    let baseUrl = (currentSettings.aiBaseUrl || preset.baseUrl).trim().replace(/\/+$/, '');
    let model = (currentSettings.aiModel || preset.defaultModel).trim();

    // Comprehensive System Prompt tailored for Vietnamese Feng Shui & Astrology
    let systemPrompt = `Bạn là Trợ Lý Trí Tuệ Nhân Tạo "An Lịch AI" - Chuyên gia tư vấn cao cấp về Âm Dương Lịch Việt Nam, Phong Thủy Bát Trạch, Tử Vi 12 Con Giáp, Can Chi, Nạp Âm, 12 Trực, Nhị Thập Bát Tú, Giờ Cát Tường & Hướng Xuất Hành.
Phương châm làm việc của bạn: "Xem ngày • Hiểu mình • Sống an".

Phong cách trả lời & Định dạng:
1. Xưng hô lịch sự, tôn trọng: "Kính chào Quý gia chủ" hoặc "Chào bạn", xưng "An Lịch AI" hoặc "Tôi".
2. Cấu trúc câu trả lời rõ ràng, trực quan: Sử dụng gạch đầu dòng (✦), tiêu đề rõ ràng, icon phong thủy thích hợp (🔮 ☯️ ✨ 📜 🧭 🌕 ⭐).
3. Phân tích ngũ hành âm dương (Kim, Mộc, Thủy, Hỏa, Thổ), tương sinh tương khắc chuẩn xác.
4. Mang năng lượng tích cực, đưa ra lời khuyên thực tế giúp gia chủ hanh thông công việc, gia đạo an yên.`;

    if (dayContext) {
      systemPrompt += `\n\nNGỮ CẢNH NGÀY ĐƯỢC CHỌN HIỆN TẠI TRÊN LỊCH:
- Ngày Dương Lịch: ${dayContext.solarDay}/${dayContext.solarMonth}/${dayContext.solarYear}
- Ngày Âm Lịch: ${dayContext.lunarDay}/${dayContext.lunarMonth}/${dayContext.lunarYear} ${dayContext.isLeapMonth ? '(Tháng Nhuận)' : ''}
- Can Chi: Ngày ${dayContext.canChiDay}, Tháng ${dayContext.canChiMonth}, Năm ${dayContext.canChiYear}
- Nạp Âm Ngày: ${dayContext.napAm || 'Bình thường'}
- Tiết Khí: ${dayContext.tietKhi || 'Bình thường'}
- Trực Ngày: ${dayContext.truc || 'Bình thường'}
- Sao: ${dayContext.sao || 'Bình thường'}
- Đánh Giá Ngày: ${dayContext.dayRating} (${dayContext.isHoangDaoDay ? 'Ngày Hoàng Đạo Cát Tường' : 'Ngày Hắc Đạo - Cần Thận Trọng'})
- Hướng Xuất Hành: Tài Thần (${dayContext.xuatHanhDirections.taiThan}), Hỷ Thần (${dayContext.xuatHanhDirections.hyThan})
- Việc Nên Làm: ${dayContext.goodThings.join(', ') || 'Mọi việc bình thường'}
- Việc Kiêng Kỵ: ${dayContext.badThings.join(', ') || 'Không kỵ đặc biệt'}`;
    }

    // Direct fetch for Anthropic Claude native API format
    if (provider === 'claude' && baseUrl.includes('api.anthropic.com')) {
      return this.sendClaudeMessage(baseUrl, apiKey, model, systemPrompt, userMessage, history, onChunk);
    }

    // OpenAI compatible endpoint formatting (OpenAI, Gemini, DeepSeek, Kimi, Local AI, Custom Proxy)
    let endpointUrl = baseUrl;
    if (!endpointUrl.endsWith('/chat/completions')) {
      endpointUrl = `${endpointUrl}/chat/completions`;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10).map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
      { role: 'user', content: userMessage },
    ];

    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages: apiMessages,
          stream: true,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Lỗi kết nối AI (${response.status}): ${errText || response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Máy chủ AI không trả về dữ liệu luồng (ReadableStream null).');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;

          if (trimmed.startsWith('data: ')) {
            try {
              const jsonStr = trimmed.replace(/^data:\s*/, '');
              const parsed = JSON.parse(jsonStr);
              const contentChunk = parsed.choices?.[0]?.delta?.content || '';
              if (contentChunk) {
                fullContent += contentChunk;
                onChunk(contentChunk);
              }
            } catch (e) {
              // Ignore line parse error
            }
          }
        }
      }

      if (buffer.trim() && buffer.trim() !== 'data: [DONE]') {
        const trimmed = buffer.trim();
        if (trimmed.startsWith('data: ')) {
          try {
            const jsonStr = trimmed.replace(/^data:\s*/, '');
            const parsed = JSON.parse(jsonStr);
            const contentChunk = parsed.choices?.[0]?.delta?.content || '';
            if (contentChunk) {
              fullContent += contentChunk;
              onChunk(contentChunk);
            }
          } catch (e) {
            // Ignore parse error
          }
        }
      }

      return fullContent || 'Đã hoàn tất câu trả lời từ Trợ Lý AI.';
    } catch (error: any) {
      console.error(`Lỗi khi gọi API AI (${provider}):`, error);
      throw error;
    }
  },

  // Native Anthropic Claude API Stream Handler
  async sendClaudeMessage(
    baseUrl: string,
    apiKey: string,
    model: string,
    systemPrompt: string,
    userMessage: string,
    history: ChatMessage[],
    onChunk: (chunkText: string) => void
  ): Promise<string> {
    const endpointUrl = `${baseUrl.replace(/\/+$/, '')}/messages`;

    const messages = [
      ...history.slice(-10).map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
      { role: 'user', content: userMessage },
    ];

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: 2048,
        system: systemPrompt,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Lỗi kết nối Claude API (${response.status}): ${errText}`);
    }

    if (!response.body) {
      throw new Error('Claude API không trả về dữ liệu.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullContent = '';
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
          try {
            const jsonStr = trimmed.replace(/^data:\s*/, '');
            const parsed = JSON.parse(jsonStr);
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              fullContent += parsed.delta.text;
              onChunk(parsed.delta.text);
            }
          } catch (e) {
            // Ignore line parse error
          }
        }
      }
    }

    return fullContent || 'Đã nhận câu trả lời từ Anthropic Claude.';
  },

  // Real-time API Connection Tester
  async testConnection(settings: AppSettings): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    const startTime = Date.now();
    try {
      let resultText = '';
      await this.sendMessage(
        'Xin chào An Lịch AI, phản hồi "OK" nếu kết nối thành công.',
        [],
        null,
        (chunk) => {
          resultText += chunk;
        },
        settings
      );
      const latencyMs = Date.now() - startTime;
      return {
        success: true,
        message: `Phản hồi thành công (${latencyMs}ms)!: "${resultText.slice(0, 40).replace(/\n/g, ' ')}..."`,
        latencyMs,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Không thể kết nối đến máy chủ AI.',
      };
    }
  },
};
