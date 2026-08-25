import { Solar } from 'lunar-javascript';
import { lunarService, toVietnamese } from './lunarService';

export interface PersonProfile {
  name: string;
  birthYear: number;
  gender: 'nam' | 'nu';
  zodiacSign?: string;
}

export interface DomainMetrics {
  communicationScore: number;
  careerScore: number;
  financeScore: number;
  familyScore: number;
  romanceScore: number;
}

export interface CompatibilityAnalysis {
  personA: PersonProfile & { canChiYear: string; element: string; cung: string; napAm: string };
  personB: PersonProfile & { canChiYear: string; element: string; cung: string; napAm: string };
  totalScore: number;
  ratingLabel: string;
  ratingColor: string;
  
  domainMetrics: DomainMetrics;

  canChiMatch: {
    status: 'good' | 'bad' | 'neutral';
    label: string;
    description: string;
  };
  
  elementMatch: {
    status: 'good' | 'bad' | 'neutral';
    label: string;
    description: string;
  };

  cungMatch: {
    status: 'good' | 'bad' | 'neutral';
    label: string;
    description: string;
  };

  zodiacMatch: {
    status: 'good' | 'bad' | 'neutral';
    label: string;
    description: string;
  };

  aiSummary: {
    strengths: string[];
    challenges: string[];
    advice: string;
  };
}

// Zodiac Elements Mapping
const ZODIAC_ELEMENTS: Record<string, 'Fire' | 'Earth' | 'Air' | 'Water'> = {
  'Bạch Dương': 'Fire', 'Sư Tử': 'Fire', 'Nhân Mã': 'Fire',
  'Kim Ngưu': 'Earth', 'Xử Nữ': 'Earth', 'Ma Kết': 'Earth',
  'Song Tử': 'Air', 'Thiên Bình': 'Air', 'Bảo Bình': 'Air',
  'Cự Giải': 'Water', 'Bọ Cạp': 'Water', 'Song Ngư': 'Water'
};

export const ALL_ZODIAC_SIGNS = [
  'Bạch Dương', 'Kim Ngưu', 'Song Tử', 'Cự Giải', 'Sư Tử', 'Xử Nữ',
  'Thiên Bình', 'Bọ Cạp', 'Nhân Mã', 'Ma Kết', 'Bảo Bình', 'Song Ngư'
];

export const calculateCompatibility = (pA: PersonProfile, pB: PersonProfile): CompatibilityAnalysis => {
  const batTrachA = lunarService.getBatTrachPhongThuy(pA.birthYear, pA.gender);
  const batTrachB = lunarService.getBatTrachPhongThuy(pB.birthYear, pB.gender);

  // Nap Am calculation
  const solarA = Solar.fromYmd(pA.birthYear, 6, 15);
  const lunarA = solarA.getLunar();
  const napAmA = toVietnamese(lunarA.getYearNaYin()) || 'Nạp Âm';

  const solarB = Solar.fromYmd(pB.birthYear, 6, 15);
  const lunarB = solarB.getLunar();
  const napAmB = toVietnamese(lunarB.getYearNaYin()) || 'Nạp Âm';

  const canChiYearA = batTrachA.lunarYearCanChi;
  const canChiYearB = batTrachB.lunarYearCanChi;

  const zhiA = canChiYearA.split(' ')[1] || 'Tý';
  const zhiB = canChiYearB.split(' ')[1] || 'Tý';

  // 1. Can Chi Year Match
  const tamHopPairs = [
    ['Thân', 'Tý', 'Thìn'],
    ['Tỵ', 'Dậu', 'Sửu'],
    ['Dần', 'Ngọ', 'Tuất'],
    ['Hợi', 'Mão', 'Mùi']
  ];

  const lucHopPairs = [
    ['Tý', 'Sửu'], ['Dần', 'Hợi'], ['Mão', 'Tuất'], ['Thìn', 'Dậu'], ['Tỵ', 'Thân'], ['Ngọ', 'Mùi']
  ];

  const tuHanhXungPairs = [
    ['Tý', 'Ngọ'], ['Mão', 'Dậu'], ['Dần', 'Thân'], ['Tỵ', 'Hợi'], ['Sửu', 'Mùi'], ['Thìn', 'Tuất']
  ];

  let canChiScore = 15;
  let canChiStatus: 'good' | 'bad' | 'neutral' = 'neutral';
  let canChiLabel = 'Bình Hòa (Bình Thường)';
  let canChiDesc = `Chi ${zhiA} và Chi ${zhiB} không xung cũng không hợp, thuộc quan hệ bình hòa tự nhiên.`;

  const isTamHop = tamHopPairs.some(group => group.includes(zhiA) && group.includes(zhiB));
  const isLucHop = lucHopPairs.some(pair => pair.includes(zhiA) && pair.includes(zhiB));
  const isTuXung = tuHanhXungPairs.some(pair => pair.includes(zhiA) && pair.includes(zhiB));

  if (isTamHop) {
    canChiScore = 25;
    canChiStatus = 'good';
    canChiLabel = 'Tam Hợp Cát Tường 🌟';
    canChiDesc = `Tuổi ${canChiYearA} và ${canChiYearB} nằm trong bộ Tam Hợp. Gia đạo hòa thuận, hỗ trợ sự nghiệp.`;
  } else if (isLucHop) {
    canChiScore = 25;
    canChiStatus = 'good';
    canChiLabel = 'Lục Hợp Quý Nhân ✨';
    canChiDesc = `Tuổi ${canChiYearA} và ${canChiYearB} thuộc Lục Hợp. Đôi bên có sức hút tự nhiên và rất thấu hiểu nhau.`;
  } else if (isTuXung) {
    canChiScore = 5;
    canChiStatus = 'bad';
    canChiLabel = 'Tứ Hành Xung ⚡';
    canChiDesc = `Tuổi ${canChiYearA} và ${canChiYearB} nằm trong bộ Lục Xung. Cần nhường nhịn và kiềm chế cái tôi.`;
  }

  // 2. Element Match (Ngũ Hành)
  const elemA = batTrachA.element;
  const elemB = batTrachB.element;

  const elementSinh: Record<string, string> = {
    'Kim': 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim'
  };

  const elementKhac: Record<string, string> = {
    'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim'
  };

  let elementScore = 15;
  let elementStatus: 'good' | 'bad' | 'neutral' = 'neutral';
  let elementLabel = 'Tương Hòa (Đồng Mệnh)';
  let elementDesc = `Mệnh ${elemA} (${napAmA}) và Mệnh ${elemB} (${napAmB}) cùng hành, dễ dàng thấu hiểu thói quen của nhau.`;

  if (elementSinh[elemA] === elemB || elementSinh[elemB] === elemA) {
    elementScore = 25;
    elementStatus = 'good';
    elementLabel = 'Ngũ Hành Tương Sinh 🟢';
    elementDesc = `Mệnh ${elemA} (${napAmA}) và Mệnh ${elemB} (${napAmB}) tương sinh hỗ trợ. Đôi bên là chỗ dựa năng lượng vững chắc.`;
  } else if (elementKhac[elemA] === elemB || elementKhac[elemB] === elemA) {
    elementScore = 8;
    elementStatus = 'bad';
    elementLabel = 'Ngũ Hành Tương Khắc 🔴';
    elementDesc = `Mệnh ${elemA} (${napAmA}) và Mệnh ${elemB} (${napAmB}) tương khắc. Cần kiên nhẫn lắng nghe và tôn trọng lẫn nhau.`;
  }

  // 3. Cung Bát Trạch Match
  const cungA = batTrachA.cungMenh;
  const cungB = batTrachB.cungMenh;

  let cungScore = 20;
  let cungStatus: 'good' | 'bad' | 'neutral' = 'neutral';
  let cungLabel = 'Bát Trạch Hòa Nhã';
  let cungDesc = `Cung ${cungA} (${batTrachA.menhNguHanh}) và Cung ${cungB} (${batTrachB.menhNguHanh}) cân bằng.`;

  if (batTrachA.menhNguHanh === batTrachB.menhNguHanh) {
    cungScore = 25;
    cungStatus = 'good';
    cungLabel = `Đồng Trạch (${batTrachA.menhNguHanh}) 🏆`;
    cungDesc = `Cả hai đều thuộc nhóm ${batTrachA.menhNguHanh}. Rất thuận lợi khi chọn hướng nhà và bố trí không gian sống.`;
  } else {
    cungScore = 12;
    cungStatus = 'bad';
    cungLabel = `Khác Trạch (${batTrachA.menhNguHanh} - ${batTrachB.menhNguHanh})`;
    cungDesc = `Một người thuộc Đông Tứ Trạch, một người thuộc Tây Tứ Trạch. Cần khéo léo chọn hướng nhà dung hòa.`;
  }

  // 4. Zodiac Match
  const signA = pA.zodiacSign || 'Bọ Cạp';
  const signB = pB.zodiacSign || 'Song Ngư';
  const elemZodA = ZODIAC_ELEMENTS[signA] || 'Water';
  const elemZodB = ZODIAC_ELEMENTS[signB] || 'Water';

  let zodScore = 15;
  let zodStatus: 'good' | 'bad' | 'neutral' = 'neutral';
  let zodLabel = 'Chiêm Tinh Nhịp Nhàng';
  let zodDesc = `Cung ${signA} (${elemZodA}) và Cung ${signB} (${elemZodB}) tương tác nhịp nhàng.`;

  if (elemZodA === elemZodB) {
    zodScore = 25;
    zodStatus = 'good';
    zodLabel = `Tam Hợp Nguyên Tố (${elemZodA}) ✨`;
    zodDesc = `Hai cung cùng nhóm nguyên tố Chiêm tinh. Tâm hồn đồng điệu, cảm xúc và suy nghĩ ăn ý.`;
  } else if ((elemZodA === 'Fire' && elemZodB === 'Air') || (elemZodA === 'Air' && elemZodB === 'Fire') ||
             (elemZodA === 'Earth' && elemZodB === 'Water') || (elemZodA === 'Water' && elemZodB === 'Earth')) {
    zodScore = 22;
    zodStatus = 'good';
    zodLabel = 'Tương Sinh Nguyên Tố Chiêm Tinh 🌟';
    zodDesc = `Nguyên tố ${elemZodA} và ${elemZodB} thúc đẩy lẫn nhau. Mối quan hệ tràn đầy cảm hứng.`;
  }

  // Calculate Total Score (Scale 55-99)
  const rawSum = canChiScore + elementScore + cungScore + zodScore;
  const totalScore = Math.min(99, Math.max(58, rawSum));

  let ratingLabel = 'Đại Cát Đại Lợi - Tương Sinh Hoàn Hảo 💕';
  let ratingColor = 'text-emerald-700 dark:text-emerald-300';
  if (totalScore < 72) {
    ratingLabel = 'Cần Cân Bằng & Thấu Hiểu Nhau 💖';
    ratingColor = 'text-amber-700 dark:text-amber-300';
  } else if (totalScore >= 72 && totalScore < 85) {
    ratingLabel = 'Hài Hòa Tốt Đẹp - Duyên Phận Thắm Thiết ❤️';
    ratingColor = 'text-rose-700 dark:text-rose-300';
  }

  // Domain Scores
  const domainMetrics: DomainMetrics = {
    communicationScore: Math.min(98, Math.max(68, Math.round(totalScore * 1.02))),
    careerScore: Math.min(95, Math.max(65, Math.round(totalScore * 0.96))),
    financeScore: Math.min(92, Math.max(60, Math.round(totalScore * 0.92))),
    familyScore: Math.min(99, Math.max(70, Math.round(totalScore * 1.04))),
    romanceScore: Math.min(98, Math.max(72, Math.round(totalScore * 1.01)))
  };

  const strengths = [
    `Giao tiếp & sự thấu hiểu: ${canChiStatus === 'good' ? 'Rất ăn ý, dễ dàng chia sẻ mọi vui buồn trong cuộc sống.' : 'Khởi đầu nhẹ nhàng, càng ở bên nhau càng gắn kết.'}`,
    `Quan điểm sống & giá trị gia đình: ${elementStatus === 'good' ? 'Cùng chung định hướng phát triển và xây dựng tổ ấm.' : 'Tôn trọng sự khác biệt cá tính của đối phương.'}`,
    `Hỗ trợ công danh & sự nghiệp: Cả hai luôn là hậu phương tinh thần vững chắc, tạo động lực vươn lên.`
  ];

  const challenges = [
    `Quản lý tài chính & tiền bạc: Thống nhất mục tiêu tiết kiệm và kế hoạch chi tiêu gia đình.`,
    `Cảm xúc & lắng nghe: Khi xảy ra bất đồng, cho nhau khoảng không gian tĩnh tâm trước khi tranh luận.`,
    `Cách xử lý mâu thuẫn: Tránh nóng giận nhất thời, ưu tiên đối thoại chân thành và bao dung.`
  ];

  const advice = `Hai bạn có mức độ tương hợp ${totalScore}/100. Hãy duy trì sự tôn trọng, lắng nghe và chia sẻ chân thành. Sự thấu hiểu và nhường nhịn chính là chìa khóa vàng giữ lửa hạnh phúc lứa đôi!`;

  return {
    personA: {
      ...pA,
      canChiYear: canChiYearA,
      element: elemA,
      cung: cungA,
      napAm: napAmA
    },
    personB: {
      ...pB,
      canChiYear: canChiYearB,
      element: elemB,
      cung: cungB,
      napAm: napAmB
    },
    totalScore,
    ratingLabel,
    ratingColor,
    domainMetrics,
    canChiMatch: {
      status: canChiStatus,
      label: canChiLabel,
      description: canChiDesc
    },
    elementMatch: {
      status: elementStatus,
      label: elementLabel,
      description: elementDesc
    },
    cungMatch: {
      status: cungStatus,
      label: cungLabel,
      description: cungDesc
    },
    zodiacMatch: {
      status: zodStatus,
      label: zodLabel,
      description: zodDesc
    },
    aiSummary: {
      strengths,
      challenges,
      advice
    }
  };
};
