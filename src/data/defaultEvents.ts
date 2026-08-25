import { EventItem } from '../types';

export const DEFAULT_EVENTS: EventItem[] = [
  {
    id: 'tet-nguyen-dan',
    name: 'Tết Nguyên Đán (Mùng 1)',
    description: 'Tết Cổ Truyền Việt Nam, ngày đầu tiên của năm mới âm lịch mang ý nghĩa đoàn viên và may mắn.',
    lunarDay: 1,
    lunarMonth: 1,
    isLunar: true,
    type: 'tet',
    color: '#DC2626', // Red
    image: 'https://images.unsplash.com/photo-1548625361-185121b6814b?auto=format&fit=crop&w=600&q=80',
    notify: true
  },
  {
    id: 'thuong-nguyen',
    name: 'Lễ Thượng Nguyên (Rằm tháng Giêng / Tết Nguyên Tiêu)',
    description: 'Đêm Rằm đầu tiên của năm mới, dân gian có câu: "Lễ Phật quanh năm không bằng Rằm tháng Giêng".',
    lunarDay: 15,
    lunarMonth: 1,
    isLunar: true,
    type: 'dan-gian',
    color: '#D97706', // Gold/Amber
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80',
    notify: true
  },
  {
    id: 'phat-nhap-niet-ban',
    name: 'Đức Phật Thích Ca nhập Niết Bàn',
    description: 'Kỷ niệm ngày Đức Phật Thích Ca Mâu Ni nhập Niết Bàn tại Rừng Sa La Song Thọ.',
    lunarDay: 15,
    lunarMonth: 2,
    isLunar: true,
    type: 'phat-giao',
    color: '#991B1B', // Dark Red
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=600&q=80',
    notify: true
  },
  {
    id: 'quan-am-dan-sinh',
    name: 'Ngày vía Quan Thế Âm Bồ Tát Đản Sinh',
    description: 'Ngày kỷ niệm Quan Thế Âm Bồ Tát giáng sinh linh ứng bảo hộ chúng sinh.',
    lunarDay: 19,
    lunarMonth: 2,
    isLunar: true,
    type: 'phat-giao',
    color: '#EAB308', // Yellow
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80',
    notify: true
  },
  {
    id: 'gio-to-hung-vuong',
    name: 'Giỗ Tổ Hùng Vương',
    description: 'Ngày tưởng nhớ công ơn các Vị Vực Tổ Hùng Vương dựng nước Việt Nam.',
    lunarDay: 10,
    lunarMonth: 3,
    isLunar: true,
    type: 'dan-gian',
    color: '#B91C1C',
    image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=600&q=80',
    notify: true
  },
  {
    id: 'tet-han-thuc',
    name: 'Tết Hàn Thực (Bánh Trôi Bánh Chay)',
    description: 'Ngày Tết làm bánh trôi, bánh chay dâng cúng tổ tiên gia bảo.',
    lunarDay: 3,
    lunarMonth: 3,
    isLunar: true,
    type: 'dan-gian',
    color: '#CA8A04',
    notify: true
  },
  {
    id: 'phat-dan',
    name: 'Lễ Phật Đản (Vesak)',
    description: 'Kỷ niệm ngày Đức Phật Thích Ca Mâu Ni đản sinh tại vườn Lâm Tỳ Ni.',
    lunarDay: 15,
    lunarMonth: 4,
    isLunar: true,
    type: 'phat-giao',
    color: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    notify: true
  },
  {
    id: 'tet-doan-ngo',
    name: 'Tết Đoan Ngọ (Diệt Sâu Bệnh)',
    description: 'Ngày ăn nếp cẩm, hoa quả đầu mùa để diệt sâu bệnh và cầu sức khỏe bình an.',
    lunarDay: 5,
    lunarMonth: 5,
    isLunar: true,
    type: 'dan-gian',
    color: '#16A34A', // Green
    notify: true
  },
  {
    id: 'quan-am-thanh-dao',
    name: 'Ngày vía Quan Thế Âm Bồ Tát Thành Đạo',
    description: 'Ngày tưởng niệm Quan Thế Âm Bồ Tát đắc quả thành đạo tu hành chứng quả.',
    lunarDay: 19,
    lunarMonth: 6,
    isLunar: true,
    type: 'phat-giao',
    color: '#EAB308',
    notify: true
  },
  {
    id: 'ca-diep-ton-gia',
    name: 'Ngày vía Ca Diếp Tôn Giả',
    description: 'Kỷ niệm ngày vía Đại Ca Diếp Tôn Giả - Đầu đà đệ nhất của Đức Phật.',
    lunarDay: 12,
    lunarMonth: 7,
    isLunar: true,
    type: 'phat-giao',
    color: '#059669', // Emerald
    image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80',
    notify: true
  },
  {
    id: 'vu-lan',
    name: 'Lễ Vu Lan Báo Hiếu & Xá Tội Vong Nhân',
    description: 'Ngày đại lễ báo hiếu cha mẹ, tổ tiên và phát tâm bồ đề cứu độ thập loại chúng sinh.',
    lunarDay: 15,
    lunarMonth: 7,
    isLunar: true,
    type: 'phat-giao',
    color: '#EC4899', // Pink
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    notify: true
  },
  {
    id: 'tet-trung-thu',
    name: 'Tết Trung Thu (Rằm Tháng Tám)',
    description: 'Lễ hội trông trăng, rước đèn phá cỗ và thắt chặt tình thân gia đình.',
    lunarDay: 15,
    lunarMonth: 8,
    isLunar: true,
    type: 'tet',
    color: '#EA580C', // Orange
    image: 'https://images.unsplash.com/photo-1531973573985-64f33190df03?auto=format&fit=crop&w=600&q=80',
    notify: true
  },
  {
    id: 'quan-am-xuat-gia',
    name: 'Ngày vía Quan Thế Âm Bồ Tát Xuất Gia',
    description: 'Ngày kỷ niệm Ngài xả bỏ vinh hoa để dấn thân vào con đường tu tập phát nguyện độ sinh.',
    lunarDay: 19,
    lunarMonth: 9,
    isLunar: true,
    type: 'phat-giao',
    color: '#EAB308',
    notify: true
  },
  {
    id: 'phat-thich-ca-thanh-dao',
    name: 'Lễ Kỷ Niệm Phật Thích Ca Thành Đạo',
    description: 'Kỷ niệm đêm Đức Phật Thích Ca Mâu Ni khai ngộ dưới gốc đại bồ đề.',
    lunarDay: 8,
    lunarMonth: 12,
    isLunar: true,
    type: 'phat-giao',
    color: '#9333EA', // Purple
    notify: true
  },
  {
    id: 'ong-tao-ve-troi',
    name: 'Ngày Đưa Táo Quân Về Trời',
    description: 'Lễ cúng Ông Táo cưỡi cá chép chầu Trời tấu trình việc trong gia đình một năm.',
    lunarDay: 23,
    lunarMonth: 12,
    isLunar: true,
    type: 'dan-gian',
    color: '#DC2626',
    notify: true
  }
];
