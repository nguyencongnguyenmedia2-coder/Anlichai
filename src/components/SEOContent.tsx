import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, BookOpen, Star, HelpCircle, ShieldCheck } from 'lucide-react';

export const SEOContent: React.FC = () => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'An Lịch AI là ứng dụng gì?',
      a: 'An Lịch AI là nền tảng Lịch Âm Dương Việt Nam thế hệ mới tích hợp Trợ Lý Trí Tuệ Nhân Tạo Google Gemini AI. Ứng dụng giúp tra cứu Lịch Vạn Niên chuẩn xác từ năm 1900 đến 2100, xem ngày Hoàng Đạo, giờ xuất hành, tử vi 12 con giáp và quản lý lịch cá nhân thông minh.'
    },
    {
      q: 'Làm thế nào để xem giờ Hoàng Đạo và hướng xuất hành hôm nay?',
      a: 'Bạn chỉ cần chọn vào bất kỳ ngày nào trên bảng Lịch Tháng của An Lịch AI. Hệ thống sẽ tính toán chính xác 6 khung giờ Hoàng Đạo, hướng Tài Thần, Hỷ Thần và bảng tư vấn xuất hành Lý Thuần Phong (Tốc Hỷ, Đại An, Tiểu Cát).'
    },
    {
      q: 'Tử Vi 12 Con Giáp trên An Lịch AI tính toán như thế nào?',
      a: 'An Lịch AI tính toán vận trình tử vi cho 12 con giáp (Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi) dựa trên nguyên lý Thiên Can - Địa Chi, Tam Hợp, Lục Hợp, Nạp Âm Ngũ Hành và Nhị Thập Bát Tú.'
    },
    {
      q: 'Ứng dụng có nhắc nhở các ngày Giỗ, Sinh Nhật, Lễ Chùa theo Lịch Âm không?',
      a: 'Có. Tính năng "🗓️ Lịch Cá Nhân" của An Lịch AI hỗ trợ thêm mới các sự kiện như Ngày Giỗ, Sinh Nhật, Ngày Cưới, Khai Trương, Lịch Đi Chùa theo Lịch Âm hoặc Lịch Dương kèm chế độ nhắc trước 1, 3, 7 ngày.'
    }
  ];

  return (
    <article className="mt-12 bg-white/80 dark:bg-oriental-dark-card/90 rounded-3xl p-6 sm:p-8 border border-amber-200/80 dark:border-oriental-dark-border shadow-lg backdrop-blur-md transition-all">
      
      {/* Article Header with Brand H1 / H2 Tags for Google */}
      <header className="mb-6 border-b border-amber-200/60 dark:border-oriental-dark-border pb-4 space-y-2">
        <div className="flex items-center space-x-2 text-oriental-red-800 dark:text-oriental-gold-400 font-bold text-xs">
          <BookOpen className="w-4 h-4" />
          <span>CẨM NANG LỊCH PHÁP & PHONG THỦY VIỆT NAM CHÍNH THỨC</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-serif font-black text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide">
          An Lịch AI - Tra Cứu Lịch Âm Dương, Xem Ngày Hoàng Đạo & Tử Vi 12 Con Giáp
        </h1>
        <p className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-200/70">
          Chào mừng bạn đến với <strong>An Lịch AI</strong> (website: <strong>www.anlichai.online</strong>) - Nền tảng xem Lịch Âm Dương Việt Nam trực tuyến thế hệ mới. Với thông điệp <em>"Xem ngày • Hiểu mình • Sống an"</em>, <strong>An Lịch AI</strong> giúp bạn dễ dàng tra cứu lịch vạn niên, giờ tốt xuất hành, hướng Tài Thần, Hỷ Thần và quản lý sự kiện cá nhân trọn vẹn nhất.
        </p>
      </header>

      {/* Grid Features SEO Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 text-xs sm:text-sm">
        
        <section className="bg-amber-50/50 dark:bg-oriental-dark-bg/60 p-4 rounded-2xl border border-amber-200/60">
          <h2 className="font-serif font-bold text-base text-oriental-red-900 dark:text-oriental-gold-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Lịch Âm Dương An Lịch AI (1900 - 2100)
          </h2>
          <p className="text-slate-700 dark:text-amber-200/80 leading-relaxed text-xs">
            Tra cứu chuẩn xác Lịch Âm Dương hôm nay, Thiên Can, Địa Chi, Nạp Âm Ngũ Hành, 12 Trực và 28 Sao Nhị Thập Bát Tú hoàn toàn bằng tiếng Việt thuần túy.
          </p>
        </section>

        <section className="bg-amber-50/50 dark:bg-oriental-dark-bg/60 p-4 rounded-2xl border border-amber-200/60">
          <h2 className="font-serif font-bold text-base text-oriental-red-900 dark:text-oriental-gold-400 mb-2 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500 fill-current" />
            Tử Vi 12 Con Giáp An Lịch AI
          </h2>
          <p className="text-slate-700 dark:text-amber-200/80 leading-relaxed text-xs">
            Phân tích chi tiết vận trình tử vi 12 con giáp hàng ngày (Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi), hợp xung tuổi, quý nhân phù trợ và con số may mắn.
          </p>
        </section>

        <section className="bg-amber-50/50 dark:bg-oriental-dark-bg/60 p-4 rounded-2xl border border-amber-200/60">
          <h2 className="font-serif font-bold text-base text-oriental-red-900 dark:text-oriental-gold-400 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Góc Phong Thủy & Cẩm Nang Văn Khấn
          </h2>
          <p className="text-slate-700 dark:text-amber-200/80 leading-relaxed text-xs">
            Trí tuệ dân gian đúc kết bài văn khấn mùng 1, văn khấn đêm Rằm, cẩm nang xem ngày tốt khai trương, nhập trạch, động thổ đầy đủ nhất tại An Lịch AI.
          </p>
        </section>

      </div>

      {/* Google Rich FAQ Section */}
      <section className="pt-6 border-t border-amber-200/60 dark:border-oriental-dark-border">
        <h3 className="font-serif font-extrabold text-lg sm:text-xl text-oriental-red-900 dark:text-oriental-gold-400 mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-oriental-gold-500" />
          Câu Hỏi Thường Gặp (FAQ)
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-amber-50/60 dark:bg-oriental-dark-bg/70 rounded-2xl border border-amber-200/70 dark:border-oriental-dark-border overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-oriental-red-900 dark:text-amber-100 flex items-center justify-between gap-2"
              >
                <span>{faq.q}</span>
                {openFaqIdx === idx ? (
                  <ChevronUp className="w-4 h-4 text-oriental-gold-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {openFaqIdx === idx && (
                <div className="px-4 pb-4 text-xs text-slate-700 dark:text-amber-200/80 leading-relaxed border-t border-amber-200/40 dark:border-amber-900/30 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </article>
  );
};
