import { ChatMessage, DayDetail } from '../types';

export const aiService = {
  async sendMessage(
    _userMessage: string,
    _history: ChatMessage[],
    _dayContext: DayDetail | null,
    onChunk: (chunkText: string) => void
  ): Promise<string> {
    // Artificial delay to simulate smooth message streaming
    const notice = `🛠️ HỆ THỐNG TRỢ LÝ AI ĐANG TRONG QUÁ TRÌNH NÂNG CẤP & CẢI TIẾN 🛠️\n\nKính chào Quý người dùng,\n\nTính năng "Trợ Lý AI Phong Thủy & Âm Dương Lịch" hiện đang được đội ngũ An Lịch AI bảo trì, nâng cấp mô hình trí tuệ nhân tạo và tinh chỉnh tri thức âm dương ngũ hành để mang lại trải nghiệm chính xác, nhanh chóng và sâu sắc nhất.\n\nTính năng sẽ sớm quay trở lại trong phiên bản tiếp theo. Rất mong Quý khách thông cảm và tiếp tục ủng hộ An Lịch AI!\n\nTrân trọng,\nĐội ngũ Phát triển An Lịch AI.`;

    const chunkSize = 8;
    for (let i = 0; i < notice.length; i += chunkSize) {
      const chunk = notice.slice(i, i + chunkSize);
      onChunk(chunk);
      await new Promise((res) => setTimeout(res, 20));
    }

    return notice;
  }
};
