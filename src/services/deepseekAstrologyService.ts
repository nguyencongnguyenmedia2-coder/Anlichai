import { NatalChartData, AstrologyInterpretation } from '../types/astrology';
import { aiService } from './aiService';
import { AppSettings } from '../types';

export class DeepSeekAstrologyService {
  
  public async generateInterpretation(
    chartData: NatalChartData, 
    settings?: AppSettings
  ): Promise<AstrologyInterpretation> {
    const { profile, sun, moon, ascendant, planets, aspects, elements, modalities } = chartData;

    const payloadPrompt = `
Bạn là chuyên gia Chiêm Tinh Học Tây Phương (Western Tropical Astrology) của An Lịch AI.
Hãy phân tích dữ liệu bản đồ sao cá nhân dưới đây và đưa ra luận giải sâu sắc, ấm áp, khuyến khích tự khám phá bản thân.

BẮT BUỘC:
- Dùng ngôn ngữ văn minh, lịch sự: "theo góc nhìn chiêm tinh", "có thể gợi ý", "mang tính tham khảo".
- KHÔNG khẳng định tương lai chắc chắn giàu/nghèo, KHÔNG đưa ra lời khuyên y tế hay đầu tư tài chính chắc chắn.
- KHÔNG tạo cảm giác định mệnh tuyệt đối.

THÔNG TIN BẢN ĐỒ SAO:
- Họ tên: ${profile.fullName}
- Ngày sinh: ${profile.birthDate} ${profile.unknownTime ? '(Chưa rõ giờ sinh)' : `lúc ${profile.birthTime}`}
- Nơi sinh: ${profile.locationName}, ${profile.country}
- BIG 3:
  + Cung Mặt Trời (Sun): ${sun.sign} ${sun.degree}°${sun.minute}' (Nhà ${sun.house})
  + Cung Mặt Trăng (Moon): ${moon.sign} ${moon.degree}°${moon.minute}' (Nhà ${moon.house})
  + Cung Mọc (Ascendant): ${ascendant.sign} ${ascendant.degree}°${ascendant.minute}'
- Phân bổ Nguyên Tố: Lửa (${elements.fire.count}), Đất (${elements.earth.count}), Khí (${elements.air.count}), Nước (${elements.water.count})
- Phân bổ Tính Chất: Thống Lĩnh (${modalities.cardinal.count}), Tiên Phong (${modalities.fixed.count}), Biến Đổi (${modalities.mutable.count})
- Vị trí các hành tinh chính:
${planets.map(p => `  * ${p.name}: ${p.sign} ${p.degree}° (Nhà ${p.house}) ${p.isRetrograde ? '[Nghịch hành]' : ''}`).join('\n')}
- Góc hợp tiêu biểu:
${aspects.slice(0, 8).map(a => `  * ${a.planet1} ${a.aspectType} (${a.aspectSymbol}) ${a.planet2} (Orb ${a.orbDegree}°)`).join('\n')}

HÃY TRẢ VỀ DẠNG JSON CHUẨN KÈM CÁC TRƯỜNG DƯỚI ĐÂY (ĐÚNG ĐỊNH DẠNG JSON, KHÔNG THÊM MARKDOWN KHÁC):
{
  "overview": "...",
  "personality": "...",
  "loveAndRelationships": "...",
  "careerAndAmbition": "...",
  "communicationStyle": "...",
  "personalGrowth": "...",
  "keyStrengths": ["...", "...", "..."],
  "keyNoticePoints": ["...", "...", "..."],
  "disclaimer": "Chiêm tinh học mang tính tham khảo và khám phá bản thân, không phải phương pháp khoa học dự đoán chắc chắn tương lai. Các quyết định quan trọng nên dựa trên thông tin thực tế và đánh giá của chính bạn."
}
`;

    try {
      const responseText = await aiService.sendMessage(
        payloadPrompt,
        [],
        null,
        () => {},
        settings
      );

      // Parse JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          overview: parsed.overview || 'Tóm tắt tổng quan bản đồ sao cá nhân.',
          personality: parsed.personality || 'Phân tích nét tính cách cốt lõi.',
          loveAndRelationships: parsed.loveAndRelationships || 'Xu hướng cảm xúc và tình cảm.',
          careerAndAmbition: parsed.careerAndAmbition || 'Xu hướng nghề nghiệp và tham vọng.',
          communicationStyle: parsed.communicationStyle || 'Phương thức giao tiếp và tư duy.',
          personalGrowth: parsed.personalGrowth || 'Định hướng phát triển bản thân.',
          keyStrengths: Array.isArray(parsed.keyStrengths) ? parsed.keyStrengths : ['Tự chủ', 'Nhạy bén'],
          keyNoticePoints: Array.isArray(parsed.keyNoticePoints) ? parsed.keyNoticePoints : ['Cân bằng cảm xúc'],
          disclaimer: parsed.disclaimer || 'Chiêm tinh học mang tính tham khảo và khám phá bản thân, không phải phương pháp khoa học dự đoán chắc chắn tương lai. Các quyết định quan trọng nên dựa trên thông tin thực tế và đánh giá của chính bạn.'
        };
      }
    } catch (error) {
      console.warn('AI Interpretation failed fallback used:', error);
    }

    // Default Fallback Interpretation
    return {
      overview: `Bản đồ sao của ${profile.fullName} thể hiện sự kết hợp hài hòa giữa năng lượng ${sun.sign} (Mặt Trời) và ${moon.sign} (Mặt Trăng). Năng lượng bản đồ sao mang tính gợi mở giúp bạn hiểu rõ tiềm năng nội tại.`,
      personality: `Năng lượng Mặt Trời ở ${sun.sign} biểu thị tinh thần cốt lõi, trong khi Mặt Trăng ở ${moon.sign} nuôi dưỡng thế giới cảm xúc nội tâm. Cung Mọc ở ${ascendant.sign} định hình phong thái tiếp xúc ban đầu.`,
      loveAndRelationships: `Trong chuyện tình cảm, vị trí các hành tinh gợi ý xu hướng tìm kiếm sự chân thành, thấu hiểu và gắn kết dài lâu.`,
      careerAndAmbition: `Trên con đường sự nghiệp, bạn có xu hướng phát huy tối đa năng lực khi được hoạt động trong môi trường phù hợp với sở trường và giá trị cá nhân.`,
      communicationStyle: `Tư duy và giao tiếp được gợi ý qua các hành tinh mang năng lượng linh hoạt, phản ánh khả năng lắng nghe và truyền đạt rõ ràng.`,
      personalGrowth: `Định hướng phát triển gợi ý việc duy trì sự cân bằng giữa cảm xúc nội tâm và mục tiêu cuộc sống thực tế.`,
      keyStrengths: [`Tự tin khám phá năng lực cốt lõi (${sun.sign})`, `Trực giác cảm xúc nhạy bén (${moon.sign})`, `Khả năng ứng biến linh hoạt`],
      keyNoticePoints: [`Dành thời gian chăm sóc sức khỏe tinh thần`, `Tránh để cảm xúc nhất thời ảnh hưởng đến quyết định lớn`],
      disclaimer: `Chiêm tinh học mang tính tham khảo và khám phá bản thân, không phải phương pháp khoa học dự đoán chắc chắn tương lai. Các quyết định quan trọng nên dựa trên thông tin thực tế và đánh giá của chính bạn.`
    };
  }
}

export const deepseekAstrologyService = new DeepSeekAstrologyService();
