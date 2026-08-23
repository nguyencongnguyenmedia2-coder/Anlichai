import { EventItem, AppSettings, PersonalEvent, ChatMessage } from '../types';

const SETTINGS_KEY = 'lich_am_duong_settings_v2';
const EVENTS_KEY = 'lich_am_duong_events_v2';
const PERSONAL_EVENTS_KEY = 'lich_am_duong_personal_events_v1';
const CHAT_KEY = 'lich_am_duong_chat_history_v1';

export const getBuiltinMasterKey = (): string => {
  try {
    return atob('c2stb3ItdjEtYWQ3Y2E1YWM5MTA4MzY3NTBhOGZhNWMyZTA4NGU2MTAwNThhYTUzZjg3NjNiYTc3YjQ3M2U0YWRjYWFlZTY4OQ==');
  } catch {
    return '';
  }
};

export const BUILTIN_MASTER_KEY = getBuiltinMasterKey();

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'oriental',
  notificationsEnabled: true,
  notificationTime: '07:00',
  notifyBeforeDays: 1,
  bgType: 'default',
  customBgUrl: '',
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || BUILTIN_MASTER_KEY,
  geminiModel: 'google/gemini-2.5-flash',
  adminPin: '123456',
  timeZone: 'Asia/Ho_Chi_Minh',
};

// Comprehensive Catalog of Vietnamese Traditional & National Holidays
const DEFAULT_FESTIVAL_EVENTS: EventItem[] = [
  // 1. Tết & Truyền Thống (Âm Lịch)
  { id: 'ev_1', name: 'Tết Nguyên Đán (Mùng 1 Tết)', isLunar: true, lunarDay: 1, lunarMonth: 1, description: 'Tết Âm Lịch cổ truyền - Ngày đầu năm mới dân tộc Việt Nam', type: 'tet', notify: true, color: '#DC2626' },
  { id: 'ev_2', name: 'Tết Thượng Nguyên (Rằm Tháng Giêng)', isLunar: true, lunarDay: 15, lunarMonth: 1, description: 'Lễ hội Đêm Rằm đầu năm, đi chùa lễ Phật cầu an gia đạo', type: 'phat-giao', notify: true, color: '#B45309' },
  { id: 'ev_3', name: 'Tết Hàn Thực (Mùng 3 Tháng 3)', isLunar: true, lunarDay: 3, lunarMonth: 3, description: 'Tục ăn bánh trôi bánh chay tưởng nhớ tổ tiên', type: 'dan-gian', notify: true, color: '#D97706' },
  { id: 'ev_4', name: 'Giỗ Tổ Hùng Vương (Mùng 10 Tháng 3)', isLunar: true, lunarDay: 10, lunarMonth: 3, description: 'Ngày Quốc lễ tưởng nhớ các Vua Hùng đã có công dựng nước', type: 'dan-gian', notify: true, color: '#B91C1C' },
  { id: 'ev_5', name: 'Lễ Phật Đản (Rằm Tháng 4)', isLunar: true, lunarDay: 15, lunarMonth: 4, description: 'Đại lễ kỷ niệm Ngày Đức Phật Đản Sinh', type: 'phat-giao', notify: true, color: '#EAB308' },
  { id: 'ev_6', name: 'Tết Đoan Ngọ (Mùng 5 Tháng 5)', isLunar: true, lunarDay: 5, lunarMonth: 5, description: 'Tết diệt sâu bọ, ăn bánh tro, nếp cẩm, hoa quả đầu mùa', type: 'dan-gian', notify: true, color: '#059669' },
  { id: 'ev_7', name: 'Lễ Vu Lan Báo Hiếu (Rằm Tháng 7)', isLunar: true, lunarDay: 15, lunarMonth: 7, description: 'Đại lễ Báo hiếu công ơn cha mẹ, tưởng nhớ tổ tiên', type: 'phat-giao', notify: true, color: '#9333EA' },
  { id: 'ev_8', name: 'Tết Trung Thu (Rằm Tháng 8)', isLunar: true, lunarDay: 15, lunarMonth: 8, description: 'Tết trông trăng, rước đèn ông sao, phá cỗ thiếu nhi', type: 'dan-gian', notify: true, color: '#EA580C' },
  { id: 'ev_9', name: 'Tết Táo Quân (23 Tháng Chạp)', isLunar: true, lunarDay: 23, lunarMonth: 12, description: 'Lễ cúng tiễn Táo Quân cưỡi cá chép về trời báo cáo', type: 'dan-gian', notify: true, color: '#DC2626' },
  { id: 'ev_10', name: 'Đêm Giao Thừa (30 Tháng Chạp)', isLunar: true, lunarDay: 30, lunarMonth: 12, description: 'Khoảnh khắc chuyển giao giữa năm cũ và năm mới', type: 'tet', notify: true, color: '#B91C1C' },

  // 2. Ngày Lễ Quốc Gia Việt Nam (Dương Lịch)
  { id: 'ev_11', name: 'Tết Dương Lịch (1/1)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 1, solarMonth: 1, description: 'Ngày đầu năm mới theo lịch Dương', type: 'dan-gian', notify: true, color: '#2563EB' },
  { id: 'ev_12', name: 'Ngày Thành Lập Đảng ĐCS Việt Nam (3/2)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 3, solarMonth: 2, description: 'Kỷ niệm Ngày thành lập Đảng Cộng Sản Việt Nam (1930)', type: 'dan-gian', notify: true, color: '#B91C1C' },
  { id: 'ev_13', name: 'Ngày Thầy Thuốc Việt Nam (27/2)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 27, solarMonth: 2, description: 'Tôn vinh cống hiến y tế và y bác sĩ Việt Nam', type: 'dan-gian', notify: true, color: '#0284C7' },
  { id: 'ev_14', name: 'Ngày Quốc Tế Phụ Nữ (8/3)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 8, solarMonth: 3, description: 'Tôn vinh phái đẹp và phụ nữ trên toàn thế giới', type: 'dan-gian', notify: true, color: '#EC4899' },
  { id: 'ev_15', name: 'Ngày Giải Phóng Miền Nam (30/4)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 30, solarMonth: 4, description: 'Ngày Giải phóng miền Nam, thống nhất đất nước Việt Nam (1975)', type: 'dan-gian', notify: true, color: '#B91C1C' },
  { id: 'ev_16', name: 'Ngày Quốc Tế Lao Động (1/5)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 1, solarMonth: 5, description: 'Ngày tôn vinh giai cấp công nhân và người lao động', type: 'dan-gian', notify: true, color: '#DC2626' },
  { id: 'ev_17', name: 'Ngày Chiến Thắng Điện Biên Phủ (7/5)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 7, solarMonth: 5, description: 'Kỷ niệm chiến thắng Điện Biên Phủ lừng lẫy năm châu (1954)', type: 'dan-gian', notify: true, color: '#B91C1C' },
  { id: 'ev_18', name: 'Ngày Sinh Chủ Tịch Hồ Chí Minh (19/5)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 19, solarMonth: 5, description: 'Kỷ niệm Ngày sinh Bác Hồ vĩ đại (1890)', type: 'dan-gian', notify: true, color: '#B91C1C' },
  { id: 'ev_19', name: 'Ngày Quốc Tế Thiếu Nhi (1/6)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 1, solarMonth: 6, description: 'Ngày chăm sóc và tôn vinh trẻ em toàn thế giới', type: 'dan-gian', notify: true, color: '#F59E0B' },
  { id: 'ev_20', name: 'Ngày Báo Chí Cách Mạng Việt Nam (21/6)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 21, solarMonth: 6, description: 'Tôn vinh những người làm báo chí truyền thông Việt Nam', type: 'dan-gian', notify: true, color: '#0284C7' },
  { id: 'ev_21', name: 'Ngày Thương Binh Liệt Sĩ (27/7)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 27, solarMonth: 7, description: 'Tưởng nhớ công ơn các anh hùng liệt sĩ và thương bệnh binh', type: 'dan-gian', notify: true, color: '#991B1B' },
  { id: 'ev_22', name: 'Ngày Cách Mạng Tháng Tám (19/8)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 19, solarMonth: 8, description: 'Kỷ niệm thành công Cách Mạng Tháng Tám (1945)', type: 'dan-gian', notify: true, color: '#B91C1C' },
  { id: 'ev_23', name: 'Ngày Quốc Khánh Việt Nam (2/9)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 2, solarMonth: 9, description: 'Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập khai sinh nước Việt Nam (1945)', type: 'dan-gian', notify: true, color: '#B91C1C' },
  { id: 'ev_24', name: 'Ngày Giải Phóng Thủ Đô (10/10)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 10, solarMonth: 10, description: 'Kỷ niệm Ngày Giải phóng Thủ đô Hà Nội (1954)', type: 'dan-gian', notify: true, color: '#B91C1C' },
  { id: 'ev_25', name: 'Ngày Doanh Nhân Việt Nam (13/10)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 13, solarMonth: 10, description: 'Tôn vinh đóng góp của cộng đồng doanh nhân Việt Nam', type: 'dan-gian', notify: true, color: '#D97706' },
  { id: 'ev_26', name: 'Ngày Phụ Nữ Việt Nam (20/10)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 20, solarMonth: 10, description: 'Kỷ niệm Ngày thành lập Hội Liên hiệp Phụ nữ Việt Nam (1930)', type: 'dan-gian', notify: true, color: '#EC4899' },
  { id: 'ev_27', name: 'Ngày Nhà Giáo Việt Nam (20/11)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 20, solarMonth: 11, description: 'Ngày tôn vinh các thầy cô giáo và sự nghiệp giáo dục', type: 'dan-gian', notify: true, color: '#2563EB' },
  { id: 'ev_28', name: 'Ngày Thành Lập QĐND Việt Nam (22/12)', isLunar: false, lunarDay: 0, lunarMonth: 0, solarDay: 22, solarMonth: 12, description: 'Ngày thành lập Quân Đội Nhân Dân Việt Nam (1944)', type: 'dan-gian', notify: true, color: '#991B1B' },
];

const DEFAULT_PERSONAL_EVENTS: PersonalEvent[] = [
  {
    id: 'p1',
    title: 'Giỗ Ông Nội',
    note: 'Chuẩn bị mâm cỗ cúng gia tiên, làm lễ lúc 9:30 sáng',
    category: 'giỗ',
    isLunar: true,
    day: 15,
    month: 8,
    remindBeforeDays: 3,
    color: '#991b1b',
    notify: true,
    createdAt: Date.now()
  },
  {
    id: 'p2',
    title: 'Lịch Đi Chùa Cầu An',
    note: 'Đi chùa dâng hương mùng 1 đầu tháng',
    category: 'di-chua',
    isLunar: true,
    day: 1,
    month: 1,
    remindBeforeDays: 1,
    color: '#d97706',
    notify: true,
    createdAt: Date.now()
  }
];

export const storageService = {
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        const merged = { ...DEFAULT_SETTINGS, ...parsed };
        if (!merged.geminiApiKey || merged.geminiApiKey.length < 10) {
          merged.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || BUILTIN_MASTER_KEY;
        }
        if (!merged.geminiModel || merged.geminiModel === 'gemini-2.0-flash' || merged.geminiModel === 'gemini-1.5-flash' || merged.geminiModel === 'gemini-3.6-flash') {
          merged.geminiModel = 'google/gemini-2.5-flash';
        }
        return merged;
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  },

  getEvents(): EventItem[] {
    try {
      const data = localStorage.getItem(EVENTS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load events', e);
    }
    this.saveEvents(DEFAULT_FESTIVAL_EVENTS);
    return DEFAULT_FESTIVAL_EVENTS;
  },

  saveEvents(events: EventItem[]): void {
    try {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save events', e);
    }
  },

  saveCustomEvent(event: Omit<EventItem, 'id'>): EventItem {
    const events = this.getEvents();
    const created: EventItem = {
      ...event,
      id: 'e_' + Date.now()
    };
    const updated = [created, ...events];
    this.saveEvents(updated);
    return created;
  },

  deleteCustomEvent(id: string): void {
    const events = this.getEvents();
    const updated = events.filter(e => e.id !== id);
    this.saveEvents(updated);
  },

  // PERSONAL EVENTS MANAGEMENT
  getPersonalEvents(): PersonalEvent[] {
    try {
      const data = localStorage.getItem(PERSONAL_EVENTS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load personal events', e);
    }
    this.savePersonalEvents(DEFAULT_PERSONAL_EVENTS);
    return DEFAULT_PERSONAL_EVENTS;
  },

  savePersonalEvents(events: PersonalEvent[]): void {
    try {
      localStorage.setItem(PERSONAL_EVENTS_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save personal events', e);
    }
  },

  addPersonalEvent(newEvent: Omit<PersonalEvent, 'id' | 'createdAt'>): PersonalEvent {
    const events = this.getPersonalEvents();
    const created: PersonalEvent = {
      ...newEvent,
      id: 'pe_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      createdAt: Date.now()
    };
    const updated = [created, ...events];
    this.savePersonalEvents(updated);
    return created;
  },

  updatePersonalEvent(event: PersonalEvent): void {
    const events = this.getPersonalEvents();
    const updated = events.map(e => e.id === event.id ? event : e);
    this.savePersonalEvents(updated);
  },

  deletePersonalEvent(id: string): void {
    const events = this.getPersonalEvents();
    const updated = events.filter(e => e.id !== id);
    this.savePersonalEvents(updated);
  },

  // CHAT HISTORY MANAGEMENT
  getChatHistory(): ChatMessage[] {
    try {
      const data = localStorage.getItem(CHAT_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load chat history', e);
    }
    return [];
  },

  saveChatHistory(history: ChatMessage[]): void {
    try {
      localStorage.setItem(CHAT_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save chat history', e);
    }
  },

  clearChatHistory(): void {
    try {
      localStorage.removeItem(CHAT_KEY);
    } catch (e) {
      console.error('Failed to clear chat history', e);
    }
  }
};
