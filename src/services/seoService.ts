export interface PageSeoConfig {
  title: string;
  description: string;
  slug: string;
}

export const SEO_CONFIGS: Record<string, PageSeoConfig> = {
  calendar: {
    title: 'An Lịch AI - Xem Lịch Âm Dương & Ngày Hoàng Đạo 2026',
    description: 'Tra cứu lịch âm dương 2026, xem ngày hoàng đạo, giờ tốt xuất hành, hướng Tài Thần, Hỷ Thần và tử vi ngày hôm nay chuẩn xác.',
    slug: 'lich-thang'
  },
  personal: {
    title: 'Lịch Cá Nhân & Nhắc Nhở Sự Kiện Âm Dương - An Lịch AI',
    description: 'Quản lý sự kiện gia đình, ghi nhớ ngày giỗ chạp âm lịch, sinh nhật âm dương và nhắc nhở sự kiện quan trọng.',
    slug: 'lich-ca-nhan'
  },
  events: {
    title: 'Lễ Hội Truyền Thống & Ngày Lễ Việt Nam 2026 - An Lịch AI',
    description: 'Danh sách tổng hợp đầy đủ các ngày lễ Tết, lễ hội truyền thống âm dương và sự kiện văn hóa Việt Nam năm 2026.',
    slug: 'le-hoi-su-kien'
  },
  blog: {
    title: 'Bài Viết Phong Thủy & Tử Vi Phương Đông - An Lịch AI',
    description: 'Tổng hợp các bài viết chuyên sâu về phong thủy nhà ở, tử vi 12 con giáp, ngày lành tháng tốt và tri thức phương Đông.',
    slug: 'bai-viet'
  },
  battrach: {
    title: 'Tra Cứu Bát Trạch Phong Thủy - Xem Hướng Nhà & Cung Mệnh',
    description: 'Tra cứu cung mệnh Bát Trạch, 4 hướng đại cát (Sinh Khí, Thiên Y, Diên Niên, Phục Vị) và vị trí đặt bàn làm việc, giường ngủ.',
    slug: 'bat-trach'
  },
  astrology: {
    title: 'Chiêm Tinh AI - Bản Đồ Sao Cá Nhân (Natal Chart) & Luận Giải',
    description: 'Khám phá bản đồ sao cá nhân thiên văn chính xác 100%, phân tích Cung Mặt Trời, Mặt Trăng, Cung Mọc, 12 Nhà và các Góc Hợp.',
    slug: 'chiem-tinh'
  },
  love: {
    title: 'Xem Hợp Tuổi Tình Duyên & Hợp Mệnh Lứa Đôi - An Lịch AI',
    description: 'Tra cứu hợp tuổi hợp mệnh tình duyên lứa đôi, phân tích Tuổi, Can Chi, Ngũ Hành, Bát Trạch, Chiêm Tinh và tính Điểm Tương Hợp.',
    slug: 'hop-tuoi-tinh-duyen'
  },
  horoscope: {
    title: 'Tử Vi Hàng Ngày 12 Con Giáp 2026 - An Lịch AI',
    description: 'Xem tử vi hàng ngày 12 con giáp về công danh, tài lộc, tình duyên, sức khỏe và vận hạn ngày hôm nay.',
    slug: 'tu-vi'
  },
  settings: {
    title: 'Cài Đặt Ứng Dụng & Quản Trị Hệ Thống - An Lịch AI',
    description: 'Cài đặt tùy chỉnh ứng dụng An Lịch AI, cấu hình API Key và quản trị hệ thống.',
    slug: 'cai-dat'
  }
};

export const updatePageSEO = (pageKey: string, customTitle?: string, customDesc?: string) => {
  const config = SEO_CONFIGS[pageKey] || SEO_CONFIGS.calendar;
  const targetTitle = customTitle || config.title;
  const targetDesc = customDesc || config.description;
  const baseUrl = 'https://www.anlichai.online';
  const fullUrl = `${baseUrl}/${config.slug}`;

  // 1. Update Document Title
  document.title = targetTitle;

  // 2. Update or Create Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', targetDesc);

  // 3. Update Open Graph Meta Tags for Facebook / Zalo Sharing
  const updateOgTag = (property: string, content: string) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  updateOgTag('og:title', targetTitle);
  updateOgTag('og:description', targetDesc);
  updateOgTag('og:url', fullUrl);
  updateOgTag('og:type', 'website');

  // 4. Update Canonical URL Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', fullUrl);
};
