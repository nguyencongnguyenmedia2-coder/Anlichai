export type EventType = 'phat-giao' | 'dan-gian' | 'tet' | 'khac';

export interface EventItem {
  id: string;
  name: string;
  description: string;
  lunarDay: number;
  lunarMonth: number;
  isLunar?: boolean; // Default true, if false it's solar date
  solarDay?: number;
  solarMonth?: number;
  type: EventType;
  color: string;
  image?: string;
  notify: boolean;
  isCustom?: boolean;
}

export interface HoangDaoHour {
  name: string;
  timeRange: string;
  isHoangDao: boolean;
  canChi: string;
}

export interface XuatHanhHour {
  direction: string;
  description: string;
  rating: 'Good' | 'Bad' | 'Neutral';
}

export interface DayDetail {
  solarDate: Date;
  solarDay: number;
  solarMonth: number;
  solarYear: number;
  
  lunarDay: number;
  lunarMonth: number;
  lunarYear: number;
  isLeapMonth: boolean;
  lunarMonthName: string;
  
  canChiDay: string;
  canChiMonth: string;
  canChiYear: string;
  
  napAm: string;
  tietKhi: string;
  truc: string;
  sao: string;
  
  isTamNuong: boolean;
  isNguyetKy: boolean;
  isHoangDaoDay: boolean; // Day grade
  dayRating: 'Tốt (Hoàng Đạo)' | 'Xấu (Hắc Đạo)' | 'Bình thường';
  
  hoangDaoHours: HoangDaoHour[];
  hacDaoHours: HoangDaoHour[];
  
  goodThings: string[];
  badThings: string[];
  xuatHanhDirections: {
    taiThan: string;
    hyThan: string;
  };
  
  events: EventItem[];
  personalEvents?: PersonalEvent[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'oriental';
  notificationsEnabled: boolean;
  notificationTime: string; // e.g. "07:00"
  notifyBeforeDays: number; // 0, 1, 3
  bgType: 'default' | 'pattern' | 'custom';
  customBgUrl: string;
  geminiApiKey: string;
  geminiModel: string;
  adminPin: string;
  timeZone: string;
}

export type PersonalEventType =
  | 'giỗ'
  | 'sinh-nhat'
  | 'ngay-cuoi'
  | 'khai-truong'
  | 'di-chua'
  | 'hop'
  | 'cong-viec'
  | 'deadline'
  | 'di-xa'
  | 'quan-trong';

export interface PersonalEvent {
  id: string;
  title: string;
  note?: string;
  category: PersonalEventType;
  isLunar: boolean; // true = Âm Lịch, false = Dương Lịch
  day: number;
  month: number;
  year?: number; // Optional specific year
  time?: string; // e.g. "09:00"
  remindBeforeDays: number; // 0, 1, 3, 7
  color: string;
  notify: boolean;
  createdAt: number;
}

export interface ZodiacHoroscope {
  zodiacName: string;
  earthlyBranch: string;
  element: string;
  ratingScore: number; // 1 to 5 stars
  overview: string;
  career: string;
  wealth: string;
  love: string;
  health: string;
  supportingZodiac: string;
  auspiciousHour: string;
  luckyNumbers: number[];
  luckyColors: string[];
}

export interface BlogSection {
  heading: string;
  body: string;
  bulletPoints?: string[];
  callout?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string;
  sections?: BlogSection[];
  category: 'phong-thuy' | 'lich-am' | 'tu-vi' | 'van-khan';
  author: string;
  publishedDate: string;
  readTime: string;
  tags: string[];
}

declare global {
  interface Window {
    electronAPI?: {
      showNotification: (options: { title?: string; body?: string; icon?: string }) => void;
      onNavigateTab: (callback: (tab: string) => void) => void;
      onToggleWidget: (callback: () => void) => void;
    };
  }
}
