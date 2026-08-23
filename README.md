# Lịch Âm Dương Việt Nam - Phong Thủy & Trợ Lý Google Gemini AI (Web & Desktop .exe)

Ứng dụng xem **Lịch Âm Dương Việt Nam** hiện đại, chuẩn xác và sang trọng, hỗ trợ chạy trên cả **Trình duyệt Web** và **Desktop Windows (file `.exe`)** được đóng gói bằng Electron. Ứng dụng tích hợp đầy đủ thông tin âm lịch từ **1900 đến 2100**, tính toán giờ hoàng đạo, Tam Nương, Nguyệt Kỵ, Trực, Sao, Ngũ hành nạp âm, hướng xuất hành, cùng hệ thống thông báo lễ hội và Trợ lý AI Google Gemini (`gemini-3.6-flash`).

---

## 🌟 Tính Năng Nổi Bật

1. **Lịch Tháng & Lịch Ngày Á Đông**:
   - Hiển thị song song Ngày Dương (lớn) & Ngày Âm (nhỏ).
   - Đánh dấu trực quan các ngày **Tam Nương** (3, 7, 13, 18, 22, 27 âm), **Nguyệt Kỵ** (5, 14, 23 âm), **Ngày Hoàng Đạo** & ngày Lễ Hội.
   - Chuyển tháng/năm linh hoạt (Hỗ trợ chọn nhanh tháng & nhập năm 1900 - 2100, nút "Hôm Nay").

2. **Chi Tiết Ngày & Phong Thủy**:
   - **Can Chi**: Ngày, Tháng, Năm.
   - **Tiết Khí, Ngũ Hành Nạp Âm, Trực (12 trực), Sao (28 sao)**.
   - **6 Giờ Hoàng Đạo & 6 Giờ Hắc Đạo** trong ngày kèm khung giờ chuẩn xác (Tý 23h-1h, Sửu 1h-3h,...).
   - **Việc Nên Làm & Việc Kiêng Kỵ** (Tố tụng, cưới hỏi, nhập trạch, mở hàng,...).
   - **Hướng Xuất Hành Cát Tường** (Tài Thần, Hỷ Thần).

3. **Danh Sách Sự Kiện Lễ Hội Phật Giáo & Dân Gian**:
   - Cài sẵn bộ dữ liệu các đại lễ lớn: *Lễ Thượng Nguyên (15/1 âm), Phật Đản (15/4 âm), Vu Lan Báo Hiếu (15/7 âm), Ngày vía Quan Thế Âm (19/2, 19/6, 19/9 âm), Vía Ca Diếp Tôn Giả (12/7 âm), Tết Nguyên Đán, Tết Trung Thu, Tết Hàn Thực, Tết Đoan Ngọ,...*
   - Quản lý sự kiện: Thêm, Sửa, Xóa sự kiện cá nhân với form nhập liệu đầy đủ (màu nhãn, ảnh upload/URL, cài đặt nhắc nhở).
   - Lọc sự kiện theo phân loại (Phật giáo, Dân gian, Tết, Khác) và tìm kiếm thông minh.

4. **Thông Báo Native Desktop & Web Notification**:
   - Tự động kiểm tra các sự kiện lễ hội âm/dương lịch trong ngày khi ứng dụng mở hoặc chạy nền.
   - Phát thông báo Native Popup (Electron) kèm tiêu đề, mô tả và hình ảnh.
   - Tùy chỉnh giờ nhắc nhở (mặc định 7:00 sáng), lưu trạng thái đã thông báo để không bị lặp lại trong ngày.

5. **Trợ Lý AI Google Gemini (`gemini-3.6-flash`)**:
   - Tích hợp trực tiếp Google Gemini API với hiệu ứng gõ chữ (Streaming).
   - Tự động đính kèm thông tin ngày đang xem khi chọn *"Hỏi Trợ Lý AI về Ngày Này"*.
   - Tư vấn phong thủy, tử vi, nghi lễ Phật giáo, giải đáp thắc mắc người dùng.
   - Lưu lịch sử hội thoại vào `localStorage` (hỗ trợ xóa lịch sử).

6. **Tùy Biến Giao Diện**:
   - Chế độ Á Đông Cổ Điển, Chế độ Tối (Dark Mode) và Chế độ Sáng (Light Mode).
   - Upload ảnh nền tùy chỉnh (Base64 hoặc URL) với hiệu ứng làm mờ tinh tế.

---

## 🛠️ Yêu Cầu Hệ Thống & Cài Đặt

### Môi trường cần thiết:
- **Node.js**: Phiên bản 18.0.0 trở lên.
- **npm** hoặc **yarn** / **pnpm**.

### 1. Cài đặt Dependencies:
```bash
npm install
```

---

## 🚀 Hướng Dẫn Chạy Ứng Dụng

### 1. Chạy Ứng Dụng Trên Trình Duyệt Web (Vite Dev Server)
```bash
npm run dev
```
Ứng dụng sẽ mở tại địa chỉ: `http://localhost:3000`

### 2. Chạy Ứng Dụng Desktop (Electron Dev Mode)
```bash
npm run electron:dev
```

---

## 📦 Hướng Dẫn Đóng Gói Thành File `.exe` Cho Windows

```bash
npm run dist
```
Sau khi hoàn tất, file cài đặt `.exe` sẽ được tạo tại thư mục `release/`:
- `release/LichAmDuongVietNam Setup 1.0.0.exe` (File cài đặt tự động)
- `release/LichAmDuongVietNam 1.0.0.exe` (File chạy ngay không cần cài đặt)

---

## 🔑 Hướng Dẫn Cấu Hình Google Gemini API Key

1. Đăng ký/Lấy key tại **Google AI Studio**: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Nhập Key vào ứng dụng trong file `.env`:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   Hoặc nhập trực tiếp tại giao diện mục **Cài Đặt** -> **Lưu Cài Đặt**.
