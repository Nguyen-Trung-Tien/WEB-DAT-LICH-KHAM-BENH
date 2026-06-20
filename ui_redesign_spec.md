# Tài Liệu Đặc Tả Thiết Kế Giao Diện Mới (Modern UI/UX Redesign Specification)

Tài liệu này định nghĩa ngôn ngữ thiết kế mới và kiến trúc giao diện trực quan cho toàn bộ hệ thống Đặt Lịch Khám Bệnh, hướng tới phong cách tối giản, hiện đại, và lấy bệnh nhân làm trung tâm (Patient-centric).

---

## 🎨 Ngôn Ngữ Thiết Kế Chủ Đạo (Design System)

### 1. Bảng Màu Mới (Harmonious Color Palette)
* **Primary (Màu chủ đạo):** `Deep Teal` (`#0d9488` / `rgb(13, 148, 136)`) - đại diện cho sự sạch sẽ, y khoa và đáng tin cậy. Màu nhấn phụ: `Mint Green` (`#2dd4bf`).
* **Secondary (Màu bổ trợ):** `Slate Blue` (`#1e3a8a`) - dùng cho các thanh điều hướng, tiêu đề chính để tăng tính nghiêm túc, vững chãi.
* **Neutral Backdrops (Màu nền):**
  * *Light Mode:* Nền trắng sữa dịu mắt (`#f8fafc` hoặc `#f1f5f9`), tránh dùng màu trắng tinh `#ffffff` trên các diện tích lớn để hạn chế mỏi mắt.
  * *Dark Mode:* Nền tối sâu sang trọng (`#0f172a` hoặc `#1e293b`), kết hợp các thẻ viền mờ (glassmorphism).
* **Alert & Accent (Màu cảnh báo & Điểm nhấn):** `Warm Coral` (`#f43f5e`) cho các thông báo khẩn cấp hoặc trạng thái hết chỗ; `Amber` (`#d97706`) cho các lưu ý.

### 📐 Kiểu Dáng & Hiệu Ứng (Shapes & Micro-interactions)
* **Góc Bo Tròn (Border Radius):** Đồng bộ `border-radius: 12px` cho các ô input/button nhỏ và `16px` cho các thẻ (Cards), Modals để tạo cảm giác thân thiện, mềm mại.
* **Hiệu ứng Kính mờ (Glassmorphism):** Áp dụng `backdrop-filter: blur(8px) saturate(180%)` kết hợp với viền trắng siêu mỏng (`border: 1px solid rgba(255, 255, 255, 0.125)`) trên nền tối hoặc nền ảnh.
* **Micro-interactions:** Hover vào card sẽ tự động nổi nhẹ (`transform: translateY(-4px)`) kèm đổ bóng mềm (`box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05)`).

---

## 🖥️ Thiết Kế Chi Tiết Từng Trang (Page-by-Page Redesign)

### 1. Trang Chủ Bệnh Nhân (Public Home Page)
```
┌────────────────────────────────────────────────────────┐
│  [Logo]   Chuyên Khoa   Cơ Sở Y Tế   Bác Sĩ     [Đăng Nhập] │
├────────────────────────────────────────────────────────┤
│                                                        │
│       TÌM KIẾM SỨC KHỎE CỦA BẠN TRÊN ĐẦU NGÓN TAY      │
│   ┌────────────────────────────────────────────────┐   │
│   │ [🔍 Tìm chuyên khoa, bác sĩ, phòng khám...]     │   │
│   └────────────────────────────────────────────────┘   │
│                                                        │
├────────────────────────────────────────────────────────┤
│  ⚡ Dịch Vụ Nổi Bật  (Chuyên Khoa / Bác Sĩ / Phòng Khám) │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │   Card 3D    │ │   Card 3D    │ │   Card 3D    │    │
│  │  Chuyên Khoa │ │   Bác Sĩ     │ │  Phòng Khám  │    │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
└────────────────────────────────────────────────────────┘
```
* **Hero Section:**
  * Bố cục split-screen hiện đại.
  * Phía trái: Slogan lớn với font chữ hiện đại (`Plus Jakarta Sans`), ô tìm kiếm đa năng tích hợp bộ lọc nhanh tự động gợi ý (Auto-complete search).
  * Phía phải: Sử dụng hình minh họa 3D chuyển động mượt hoặc hình ảnh bác sĩ thực tế chất lượng cao được xử lý bo tròn nghệ thuật.
* **Cards Danh Mục:**
  * Thay vì danh sách dọc đơn điệu, thiết kế dạng Grid (lưới) 4 cột.
  * Mỗi card chứa Icon dạng vẽ nét tối giản (Lucide Icons) phối trên nền tròn màu pastel nhẹ tương ứng.

### 2. Trang Chi Tiết Bác Sĩ & Đặt Lịch (Doctor Detail Page)
* **Bố cục Asymmetric (Bất đối xứng):**
  * **Cột trái (35%):** Profile Card của Bác sĩ được làm dính (sticky) khi cuộn trang. Chứa ảnh chân dung lớn bo góc tròn, học vị, lượt đánh giá (sao vàng), nút "Đặt lịch ngay" và các liên kết nhanh.
  * **Cột phải (65%):**
    * *Lịch Khám:* Hiển thị dưới dạng thanh trượt ngang chọn ngày (Date slider) với hiệu ứng trượt mượt. Danh sách giờ khám bên dưới dạng các "Time chips" đổi màu khi chọn.
    * *Thông tin chi tiết:* Thiết kế dạng Tab chuyển đổi (Giới thiệu chung, Quá trình đào tạo, Bài viết/Kinh nghiệm chuyên sâu).
    * *Giá khám & Bảo hiểm:* Hiển thị rõ ràng bằng các bảng giá tối giản, phân biệt rõ bảo hiểm y tế nhà nước vs tư nhân.

### 3. Biểu Mẫu Đặt Lịch Phân Bước (Step-by-step Booking Form)
* **Trải nghiệm mới:** Loại bỏ hoàn toàn các modal dài chứa hàng chục ô điền thông tin. Thay thế bằng form phân bước (Stepper) có chỉ báo tiến trình sinh động ở đầu trang:
  * **Bước 1: Chọn Lịch Khám** (Bác sĩ, Ngày & Giờ khám đã chọn trước đó, tự động hiển thị tóm tắt).
  * **Bước 2: Thông Tin Bệnh Nhân** (Cho phép chọn nhanh "Đặt cho mình" hoặc "Đặt cho người thân". Tự động điền lại thông tin nếu đã đăng nhập).
  * **Bước 3: Xác Nhận & Thanh Toán** (Tóm tắt lại phiếu khám, lựa chọn thanh toán bằng thẻ/ví điện tử hoặc trả sau tại phòng khám).

### 4. Bảng Điều Khiển Quản Trị & Bác Sĩ (Dashboard System)
* **Layout & Navigation:**
  * Sidebar bên trái dạng tối giản (chỉ chứa các Icon Lucide sắc nét, có thể thu gọn lại thành một thanh icon mỏng).
  * Header phía trên chứa thanh tìm kiếm nhanh, nút chuyển đổi ngôn ngữ/theme, và nút thông báo dạng chuông (có hiệu ứng chấm đỏ nhấp nháy khi có ca khám mới).
* **Trang Quản Lý Bệnh Nhân (Bác sĩ):**
  * Danh sách bệnh nhân chờ khám thiết kế dưới dạng **Kanban Board** (Chờ duyệt ➜ Đã duyệt ➜ Đang khám ➜ Hoàn thành) giúp bác sĩ kéo thả thay đổi trạng thái ca khám trực quan.
  * Tích hợp khung xem nhanh bệnh án điện tử (EHR Quick View) ngay bên cạnh danh sách mà không cần chuyển trang.

---

## 🛠️ Công Nghệ & Thư Viện Đề Xuất Cho Giao Diện Mới

1. **Styling & CSS:** `TailwindCSS` kết hợp `Bootstrap 5` (dùng các thành phần cấu trúc của Bootstrap và tùy biến CSS tiện ích của Tailwind để code giao diện nhanh và nhất quán).
2. **Icons:** `Lucide React` cho bộ icon vector sắc nét, tối giản, hỗ trợ tùy biến nét vẽ.
3. **Hiệu ứng chuyển động:** `Framer Motion` (Dành cho React) để xử lý các hiệu ứng xuất hiện, chuyển tab, mở modal và kéo thả Kanban.
4. **Biểu đồ:** `Recharts` để hiển thị biểu đồ thống kê trực quan cho Admin và Bác sĩ.
