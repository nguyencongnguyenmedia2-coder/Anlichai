import { Solar } from 'lunar-javascript';
import { DayDetail, HoangDaoHour, ZodiacHoroscope } from '../types';
import { storageService } from './storageService';

// Chinese to Vietnamese Translation Dictionary
const CN_TO_VN_MAP: Record<string, string> = {
  // Heavenly Stems (Thiên Can)
  '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu',
  '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý',

  // Earthly Branches (Địa Chi)
  '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn', '巳': 'Tỵ',
  '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi',

  // 12 Trực
  '建': 'Kiến', '除': 'Trừ', '满': 'Mãn', '滿': 'Mãn', '平': 'Bình', '定': 'Định',
  '执': 'Chấp', '執': 'Chấp', '破': 'Phá', '危': 'Nguy', '成': 'Thành', '收': 'Thâu',
  '开': 'Khai', '開': 'Khai', '闭': 'Bế', '閉': 'Bế',

  // Ngũ Hành Nạp Âm
  '海中金': 'Hải Trung Kim', '炉中火': 'Lư Trung Hỏa', '爐中火': 'Lư Trung Hỏa',
  '大林木': 'Đại Lâm Mộc', '路旁土': 'Lộ Bàng Thổ', '剑锋金': 'Kiếm Phong Kim', '劍鋒金': 'Kiếm Phong Kim',
  '山头火': 'Sơn Đầu Hỏa', '山頭火': 'Sơn Đầu Hỏa', '涧下水': 'Giản Hạ Thủy', '澗下水': 'Giản Hạ Thủy',
  '城头土': 'Thành Đầu Thổ', '城頭土': 'Thành Đầu Thổ', '白蜡金': 'Bạch Lạp Kim', '白蠟金': 'Bạch Lạp Kim',
  '杨柳木': 'Dương Liễu Mộc', '楊柳木': 'Dương Liễu Mộc', '泉中水': 'Tuyền Trung Thủy',
  '屋上土': 'Ốc Thượng Thổ', '霹雳火': 'Tích Lịch Hỏa', '霹靂火': 'Tích Lịch Hỏa',
  '松柏木': 'Tùng Bách Mộc', '长流水': 'Trường Lưu Thủy', '長流水': 'Trường Lưu Thủy',
  '沙中金': 'Sa Trung Kim', '山下火': 'Sơn Hạ Hỏa', '平地木': 'Bình Địa Mộc',
  '壁上土': 'Bích Thượng Thổ', '金箔金': 'Kim Bạc Kim', '佛灯火': 'Phúc Đăng Hỏa', '佛燈火': 'Phúc Đăng Hỏa',
  '天河水': 'Thiên Hà Thủy', '大驿土': 'Đại Dịch Thổ', '大驛土': 'Đại Dịch Thổ',
  '钗钏金': 'Thoa Xuyến Kim', '釵釧金': 'Thoa Xuyến Kim', '桑柘木': 'Tang Đố Mộc',
  '大溪水': 'Đại Khê Thủy', '沙中土': 'Sa Trung Thổ', '天上火': 'Thiên Thượng Hỏa',
  '石榴木': 'Thạch Lựu Mộc', '大海水': 'Đại Hải Thủy',

  // Tiết Khí (24 Jie Qi)
  '立春': 'Lập Xuân', '雨水': 'Vũ Thủy', '惊蛰': 'Kinh Trập', '驚蟄': 'Kinh Trập',
  '春分': 'Xuân Phân', '清明': 'Thanh Minh', '谷雨': 'Cốc Vũ', '穀雨': 'Cốc Vũ',
  '立夏': 'Lập Hạ', '小满': 'Tiểu Mãn', '小滿': 'Tiểu Mãn', '芒种': 'Mang Chủng', '芒種': 'Mang Chủng',
  '夏至': 'Hạ Chí', '小暑': 'Tiểu Thử', '大暑': 'Đại Thử', '立秋': 'Lập Thu',
  '处暑': 'Xử Thử', '處暑': 'Xử Thử', '白露': 'Bạch Lộ', '秋分': 'Thu Phân',
  '寒露': 'Hàn Lộ', '霜降': 'Sương Giáng', '立冬': 'Lập Đông', '小雪': 'Tiểu Tuyết',
  '大雪': 'Đại Tuyết', '冬至': 'Đông Chí', '小寒': 'Tiểu Hàn', '大寒': 'Đại Hàn',

  // 28 Sao (Nhị Thập Bát Tú)
  '角': 'Giác', '亢': 'Kang', '氐': 'Đê', '房': 'Phòng', '心': 'Tâm', '尾': 'Vĩ', '箕': 'Cơ',
  '斗': 'Đẩu', '牛': 'Ngưu', '女': 'Nữ', '虚': 'Hư', '虛': 'Hư', '室': 'Thất', '壁': 'Bích',
  '奎': 'Khuê', '娄': 'Lâu', '婁': 'Lâu', '胃': 'Vị', '昴': 'Mão', '毕': 'Tất', '畢': 'Tất',
  '觜': 'Chủy', '参': 'Sâm', '參': 'Sâm', '井': 'Tỉnh', '鬼': 'Quỷ', '柳': 'Liễu',
  '星': 'Tinh', '张': 'Trương', '張': 'Trương', '翼': 'Dực', '轸': 'Chẩn', '軫': 'Chẩn',

  // Luck
  '吉': 'Tốt', '凶': 'Xấu',

  // Directions
  '正東': 'Đông', '正西': 'Tây', '正南': 'Nam', '正北': 'Bắc',
  '東南': 'Đông Nam', '西南': 'Tây Nam', '東北': 'Đông Bắc', '西北': 'Tây Bắc',
  '東': 'Đông', '西': 'Tây', '南': 'Nam', '北': 'Bắc',
};

export function toVietnamese(text: string | null | undefined): string {
  if (!text) return '';
  let str = text;

  // First replace exact multi-character phrases
  Object.keys(CN_TO_VN_MAP).forEach((key) => {
    if (key.length > 1 && str.includes(key)) {
      str = str.split(key).join(CN_TO_VN_MAP[key]);
    }
  });

  // Then replace single character matches
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    result += CN_TO_VN_MAP[char] !== undefined ? CN_TO_VN_MAP[char] + (i < str.length - 1 && CN_TO_VN_MAP[str[i+1]] ? ' ' : '') : char;
  }

  // Clean double spaces
  return result.replace(/\s+/g, ' ').trim();
}

// 12 Can Chi hours with standard Vietnamese time ranges
const CAN_CHI_HOURS = [
  { zhi: 'Tý', name: 'Tý', timeRange: '23:00 - 01:00' },
  { zhi: 'Sửu', name: 'Sửu', timeRange: '01:00 - 03:00' },
  { zhi: 'Dần', name: 'Dần', timeRange: '03:00 - 05:00' },
  { zhi: 'Mão', name: 'Mão', timeRange: '05:00 - 07:00' },
  { zhi: 'Thìn', name: 'Thìn', timeRange: '07:00 - 09:00' },
  { zhi: 'Tỵ', name: 'Tỵ', timeRange: '09:00 - 11:00' },
  { zhi: 'Ngọ', name: 'Ngọ', timeRange: '11:00 - 13:00' },
  { zhi: 'Mùi', name: 'Mùi', timeRange: '13:00 - 15:00' },
  { zhi: 'Thân', name: 'Thân', timeRange: '15:00 - 17:00' },
  { zhi: 'Dậu', name: 'Dậu', timeRange: '17:00 - 19:00' },
  { zhi: 'Tuất', name: 'Tuất', timeRange: '19:00 - 21:00' },
  { zhi: 'Hợi', name: 'Hợi', timeRange: '21:00 - 23:00' },
];

// Hoàng Đạo hours mapping according to Day Earthly Branch (Địa Chi Ngày)
const HOANG_DAO_MAPPING: Record<string, string[]> = {
  'Tý': ['Tý', 'Sửu', 'Mão', 'Ngọ', 'Thân', 'Dậu'],
  'Ngọ': ['Tý', 'Sửu', 'Mão', 'Ngọ', 'Thân', 'Dậu'],
  'Sửu': ['Dần', 'Mão', 'Tỵ', 'Thân', 'Tuất', 'Hợi'],
  'Mùi': ['Dần', 'Mão', 'Tỵ', 'Thân', 'Tuất', 'Hợi'],
  'Dần': ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'],
  'Thân': ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'],
  'Mão': ['Tý', 'Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu'],
  'Dậu': ['Tý', 'Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu'],
  'Thìn': ['Dần', 'Thìn', 'Tỵ', 'Thân', 'Dậu', 'Hợi'],
  'Tuất': ['Dần', 'Thìn', 'Tỵ', 'Thân', 'Dậu', 'Hợi'],
  'Tỵ': ['Sửu', 'Thìn', 'Ngọ', 'Mùi', 'Tuất', 'Hợi'],
  'Hợi': ['Sửu', 'Thìn', 'Ngọ', 'Mùi', 'Tuất', 'Hợi'],
};

// Tam Nương & Nguyệt Kỵ Days
const TAM_NUONG_DAYS = [3, 7, 13, 18, 22, 27];
const NGUYET_KY_DAYS = [5, 14, 23];

// 12 Zodiac Animals with Emojis and Tam Hợp / Lục Hợp relations
export const ZODIAC_ANIMALS = [
  { name: 'Tuổi Tý (Chuột)', branch: 'Tý', icon: '🐭', element: 'Thủy', tamHop: 'Thân, Thìn', lucHop: 'Sửu' },
  { name: 'Tuổi Sửu (Trâu)', branch: 'Sửu', icon: '🐮', element: 'Thổ', tamHop: 'Tỵ, Dậu', lucHop: 'Tý' },
  { name: 'Tuổi Dần (Hổ)', branch: 'Dần', icon: '🐯', element: 'Mộc', tamHop: 'Ngọ, Tuất', lucHop: 'Hợi' },
  { name: 'Tuổi Mão (Mèo)', branch: 'Mão', icon: '🐱', element: 'Mộc', tamHop: 'Hợi, Mùi', lucHop: 'Tuất' },
  { name: 'Tuổi Thìn (Rồng)', branch: 'Thìn', icon: '🐲', element: 'Thổ', tamHop: 'Thân, Tý', lucHop: 'Dậu' },
  { name: 'Tuổi Tỵ (Rắn)', branch: 'Tỵ', icon: '🐍', element: 'Hỏa', tamHop: 'Dậu, Sửu', lucHop: 'Thân' },
  { name: 'Tuổi Ngọ (Ngựa)', branch: 'Ngọ', icon: '🐴', element: 'Hỏa', tamHop: 'Dần, Tuất', lucHop: 'Mùi' },
  { name: 'Tuổi Mùi (Dê)', branch: 'Mùi', icon: '🐐', element: 'Thổ', tamHop: 'Mão, Hợi', lucHop: 'Ngọ' },
  { name: 'Tuổi Thân (Khỉ)', branch: 'Thân', icon: '🐵', element: 'Kim', tamHop: 'Tý, Thìn', lucHop: 'Tỵ' },
  { name: 'Tuổi Dậu (Gà)', branch: 'Dậu', icon: '🐔', element: 'Kim', tamHop: 'Tỵ, Sửu', lucHop: 'Thìn' },
  { name: 'Tuổi Tuất (Chó)', branch: 'Tuất', icon: '🐶', element: 'Thổ', tamHop: 'Dần, Ngọ', lucHop: 'Mão' },
  { name: 'Tuổi Hợi (Lợn)', branch: 'Hợi', icon: '🐷', element: 'Thủy', tamHop: 'Mão, Mùi', lucHop: 'Dần' },
];

export const lunarService = {
  getDayDetail(date: Date): DayDetail {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();

    const lunarDay = lunar.getDay();
    const lunarMonth = Math.abs(lunar.getMonth());
    const lunarYear = lunar.getYear();
    const isLeapMonth = lunar.getMonth() < 0;

    const rawCanChiDay = lunar.getDayInGanZhi();
    const rawCanChiMonth = lunar.getMonthInGanZhi();
    const rawCanChiYear = lunar.getYearInGanZhi();

    const canChiDay = toVietnamese(rawCanChiDay);
    const canChiMonth = toVietnamese(rawCanChiMonth);
    const canChiYear = toVietnamese(rawCanChiYear);

    const napAm = toVietnamese(lunar.getDayNaYin()) || 'Bình Thường';
    const tietKhi = toVietnamese(lunar.getJieQi()) || 'Không có';
    const truc = toVietnamese(lunar.getZhiXing()) || 'Thành';
    const xiuLuck = toVietnamese(lunar.getXiuLuck());
    const sao = lunar.getXiu() ? `${toVietnamese(lunar.getXiu())} (${xiuLuck || 'Bình'})` : 'Bình';

    // Day Branch (e.g. 'Tý' from 'Giáp Tý')
    const dayZhi = canChiDay.split(' ')[1] || 'Tý';
    const hoangDaoNames = HOANG_DAO_MAPPING[dayZhi] || HOANG_DAO_MAPPING['Tý'];

    // Map 12 Hours
    const allHours: HoangDaoHour[] = CAN_CHI_HOURS.map(h => {
      const isHD = hoangDaoNames.includes(h.zhi);
      return {
        name: `Giờ ${h.name}`,
        timeRange: h.timeRange,
        isHoangDao: isHD,
        canChi: `${h.name} (${isHD ? 'Hoàng Đạo' : 'Hắc Đạo'})`
      };
    });

    const hoangDaoHours = allHours.filter(h => h.isHoangDao);
    const hacDaoHours = allHours.filter(h => !h.isHoangDao);

    // Tam Nương / Nguyệt Kỵ
    const isTamNuong = TAM_NUONG_DAYS.includes(lunarDay);
    const isNguyetKy = NGUYET_KY_DAYS.includes(lunarDay);

    // Determine Day Rating
    const dayZhiIndex = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'].indexOf(dayZhi);
    const isHoangDaoDay = (dayZhiIndex % 2 === 0) && !isTamNuong && !isNguyetKy;

    let dayRating: 'Tốt (Hoàng Đạo)' | 'Xấu (Hắc Đạo)' | 'Bình thường' = 'Bình thường';
    if (isTamNuong || isNguyetKy) {
      dayRating = 'Xấu (Hắc Đạo)';
    } else if (isHoangDaoDay) {
      dayRating = 'Tốt (Hoàng Đạo)';
    }

    // Recommended & Forbidden activities based on Lunisolar day
    const goodThings: string[] = [];
    const badThings: string[] = [];

    if (isTamNuong) {
      badThings.push('Cưới hỏi, khởi công, nhập trạch (Ngày Tam Nương rất kỵ)');
    }
    if (isNguyetKy) {
      badThings.push('Khởi hành, làm việc đại sự, mở tiệc (Mùng 5, 14, 23 đi chơi cũng thiệt)');
    }

    if (dayRating === 'Tốt (Hoàng Đạo)') {
      goodThings.push('Cầu tài, cầu lộc, mở hàng, gặp gỡ đối tác');
      goodThings.push('Hội họp, làm lễ tạ ơn, dâng hương');
      goodThings.push('Xuất hành hướng Tài Thần / Hỷ Thần');
    } else if (dayRating === 'Xấu (Hắc Đạo)') {
      badThings.push('Tố tụng, tranh chấp, đào đất, làm nhà');
      badThings.push('Cho vay tiền, đầu tư rủi ro cao');
      goodThings.push('Cầu an, tĩnh tâm, đọc sách, ăn chay');
    } else {
      goodThings.push('Làm việc thường nhật, dọn dẹp nhà cửa, chăm sóc sức khỏe');
      goodThings.push('Thăm hỏi người thân, bạn bè');
      badThings.push('Đại sự có giá trị quá lớn nếu chưa xem giờ kỹ');
    }

    // Find Matching Events
    const allEvents = storageService.getEvents();
    const matchingEvents = allEvents.filter(e => {
      if (e.isLunar !== false) {
        return e.lunarDay === lunarDay && e.lunarMonth === lunarMonth;
      } else {
        return e.solarDay === day && e.solarMonth === month;
      }
    });

    // Find Matching Personal Events
    const allPersonalEvents = storageService.getPersonalEvents();
    const matchingPersonalEvents = allPersonalEvents.filter(pe => {
      if (pe.isLunar) {
        const matchDM = pe.day === lunarDay && pe.month === lunarMonth;
        return pe.year ? matchDM && pe.year === lunarYear : matchDM;
      } else {
        const matchDM = pe.day === day && pe.month === month;
        return pe.year ? matchDM && pe.year === year : matchDM;
      }
    });

    const taiDir = toVietnamese(lunar.getDayPositionTai());
    const xiDir = toVietnamese(lunar.getDayPositionXi());

    return {
      solarDate: date,
      solarDay: day,
      solarMonth: month,
      solarYear: year,

      lunarDay,
      lunarMonth,
      lunarYear,
      isLeapMonth,
      lunarMonthName: `${lunarMonth}${isLeapMonth ? ' (Nhuận)' : ''}`,

      canChiDay,
      canChiMonth,
      canChiYear,

      napAm,
      tietKhi,
      truc,
      sao,

      isTamNuong,
      isNguyetKy,
      isHoangDaoDay,
      dayRating,

      hoangDaoHours,
      hacDaoHours,

      goodThings,
      badThings,

      xuatHanhDirections: {
        taiThan: `Hướng ${taiDir || 'Đông Nam'}`,
        hyThan: `Hướng ${xiDir || 'Tây Nam'}`,
      },

      events: matchingEvents,
      personalEvents: matchingPersonalEvents
    };
  },

  getLyThuanPhongXuatHanhHours(date: Date) {
    const detail = this.getDayDetail(date);
    const day = detail.lunarDay;

    // 6 Ly Thuan Phong Xuat Hanh Hour Types
    const types = [
      { name: 'Tốc Hỷ', rating: 'Good', desc: 'Xuất hành giờ này gặp nhiều may mắn, niềm vui, cầu tài nên đi hướng Nam.' },
      { name: 'Đại An', rating: 'Good', desc: 'Mọi việc bình an, gia đạo hòa thuận, công việc hanh thông phát đạt.' },
      { name: 'Tiểu Cát', rating: 'Good', desc: 'Gặp may mắn nhỏ, buôn bán sinh lời, người đi sắp về nhà.' },
      { name: 'Xích Khẩu', rating: 'Bad', desc: 'Dễ xảy ra tranh luận, bất đồng ý kiến, nên đề phòng thị phi lời nói.' },
      { name: 'Không Vong', rating: 'Bad', desc: 'Cầu tài không có, dễ bị hao tài tốn của, đi xa kỵ sóng gió.' },
      { name: 'Tuyệt Lộ', rating: 'Bad', desc: 'Rất xấu, kỵ xuất hành xa, công việc mưu sự khó thành.' }
    ];

    return CAN_CHI_HOURS.map((h, i) => {
      const typeIdx = (day + i) % 6;
      const t = types[typeIdx];
      return {
        hourName: `Giờ ${h.name}`,
        timeRange: h.timeRange,
        typeName: t.name,
        rating: t.rating,
        description: t.desc
      };
    });
  },

  getZodiacHoroscope(zodiacIndex: number, date: Date): ZodiacHoroscope {
    const detail = this.getDayDetail(date);
    const zodiac = ZODIAC_ANIMALS[zodiacIndex % 12];
    const score = ((detail.solarDay + zodiacIndex) % 3) + 3; // 3, 4, or 5 stars

    const hoangDaoHourName = detail.hoangDaoHours[0]?.name || 'Giờ Tý';

    return {
      zodiacName: zodiac.name,
      earthlyBranch: zodiac.branch,
      element: zodiac.element,
      ratingScore: score,
      overview: `Hôm nay ngày ${detail.canChiDay} (${detail.napAm}), bản mệnh ${zodiac.name} có vận trình tương đối ổn định. Nên giữ vững tâm lý bình tĩnh, hành sự cẩn trọng theo triết lý Sống An.`,
      career: `Công việc chuyển biến tích cực. Có quý nhân phù trợ hướng ${detail.xuatHanhDirections.taiThan}. Thích hợp triển khai các dự án vừa và nhỏ.`,
      wealth: `Tài lộc có khởi sắc. Thích hợp cho việc mở hàng, thu hồi nợ hoặc ký kết hợp đồng thương mại.`,
      love: `Gia đạo êm ấm, thuận hòa. Người độc thân có vận đào hoa nở rộ khi tham gia các hoạt động tập thể.`,
      health: `Sức khỏe dồi dào, sinh khí dâng cao. Nên giữ thói quen vận động nhẹ nhàng và duy trì tâm lý tích cực.`,
      supportingZodiac: `Tam Hợp: ${zodiac.tamHop} • Lục Hợp: ${zodiac.lucHop}`,
      auspiciousHour: `${hoangDaoHourName} & ${detail.hoangDaoHours[1]?.name || 'Giờ Sửu'}`,
      luckyNumbers: [(zodiacIndex * 2 + detail.lunarDay) % 9 + 1, (zodiacIndex * 3 + detail.lunarMonth) % 9 + 1],
      luckyColors: zodiac.element === 'Hỏa' ? ['Đỏ', 'Cam', 'Xanh lá'] : zodiac.element === 'Mộc' ? ['Xanh lục', 'Đen'] : ['Vàng', 'Trắng', 'Nâu']
    };
  },

  getMonthDays(year: number, month: number): Date[] {
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay(); // 0 is Sunday
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startingDayOfWeek);

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      days.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }

    return days;
  }
};
