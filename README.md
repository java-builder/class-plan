# ClassPlan - Hệ Thống Quản Lý Lịch Dạy & Lộ Trình Khóa Học Online

Ứng dụng web dành cho giáo viên và gia sư dạy online, giúp quản lý thời khóa biểu dạy cố định hàng tuần, tổ chức giáo trình - bài giảng và theo dõi danh sách học viên/lớp học trực tuyến.

---

## Tính Năng Chính

### 1. Thời Khóa Biểu Cố Định Hàng Tuần (Weekly Fixed Schedule)
- Lên lịch dạy cố định theo các thứ trong tuần (Thứ Hai đến Chủ Nhật).
- Phân loại rõ ràng ca dạy **1:1 (Cá nhân)** và ca dạy **Lớp học**.
- Tích hợp sẵn link phòng học online (**Google Meet**, **Zoom**) với thao tác bấm mở trực tiếp 1 chạm.
- Bộ lọc thông minh theo hình thức học và chọn nhanh từng thứ trong tuần trên điện thoại.

### 2. Lộ Trình Khóa Học & Theo Dõi Tiến Độ (Curriculum)
- Quản lý cây bài giảng trực quan: **Khóa học** -> **Chapter** -> **Bài học**.
- Tích hợp Checkbox theo dõi bài đã dạy / chưa dạy, tự động tính tỷ lệ hoàn thành theo từng Chapter.
- Thêm nhanh khóa học, chapter và bài giảng mới ngay trên giao diện.

### 3. Quản Lý Học Viên & Nhóm Lớp
- Danh sách học viên kèm số điện thoại (hỗ trợ bấm gọi trực tiếp trên mobile) và ghi chú học tập.
- Tạo nhóm lớp học trực tuyến và phân chia học viên vào từng lớp.
- Thao tác Thêm / Sửa / Xóa nhanh chóng.

### 4. Thiết Kế & Trải Nghiệm Người Dùng
- Tuân thủ phong cách **Google Material Design** gọn gàng, hiện đại (Bo góc chuẩn 4px, màu chủ đạo `#1a73e8`).
- **Responsive 100%**: Giao diện tối ưu hoàn hảo cho cả điện thoại di động (Mobile), máy tính bảng (Tablet) và máy tính để bàn (Desktop).

---

## Công Nghệ Sử Dụng (Tech Stack)

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, TypeScript)
- **UI Library**: [Material-UI (MUI v6)](https://mui.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL 100% trực tiếp)
- **Deployment**: [Vercel](https://vercel.com/)

---

## Cấu Trúc Thư Mục Dự Án

```
class-plan-webapp/
├── app/
│   ├── api/              # API Route Handlers (students, classes, lessons)
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx        # Root Layout với ThemeRegistry
│   └── page.tsx          # Giao diện chính điều hướng các tab
├── components/
│   ├── CalendarView.tsx        # Thời khóa biểu cố định hàng tuần
│   ├── CurriculumView.tsx      # Lộ trình khóa học & bài giảng
│   ├── StudentsClassesView.tsx # Quản lý học viên & lớp học
│   ├── LessonDialog.tsx        # Popup thêm/sửa ca học cố định
│   ├── StudentDialog.tsx       # Popup thêm/sửa học viên
│   ├── ClassDialog.tsx         # Popup thêm/sửa lớp học
│   ├── ConfirmDialog.tsx       # Modal xác nhận xóa chuẩn Material Design
│   └── Icons.tsx               # Icon SVG chuẩn tối ưu cho Turbopack
├── lib/
│   ├── storage.ts        # Tầng thao tác cơ sở dữ liệu Supabase (100% Database)
│   └── supabase/
│       └── client.ts     # Khởi tạo Supabase Client
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # Script khởi tạo bảng & RLS Supabase
├── theme/
│   ├── theme.ts          # Cấu hình Material Design Theme
│   └── ThemeRegistry.tsx # Emotion Cache Provider cho SSR
└── types/
    └── database.ts       # Định nghĩa kiểu TypeScript
```

---

## Hướng Dẫn Cài Đặt & Chạy Local

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Cấu hình Biến Môi Trường
Sao chép file `.env.example` thành `.env.local`:
```bash
cp .env.example .env.local
```

Nội dung `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_DB_PASSWORD=your_db_password
DATABASE_URL=postgresql://postgres:your_password@db.your-project.supabase.co:5432/postgres
```

*(Toàn bộ dữ liệu của hệ thống được lưu trữ và đồng bộ trực tiếp 100% với Supabase Database)*

### 3. Khởi chạy Server Phát Triển
```bash
npm run dev
```
Truy cập [http://localhost:3000](http://localhost:3000) trên trình duyệt.

### 4. Kiểm tra Build Production
```bash
npm run build
```

---

## Hướng Dẫn Deploy Lên Vercel

1. **Đẩy mã nguồn lên GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete classplan ready for deployment"
   git push origin main
   ```

2. **Kết nối dự án trên Vercel**:
   - Truy cập [vercel.com](https://vercel.com/) và đăng nhập.
   - Bấm **Add New Project** -> Chọn repository GitHub chứa dự án.

3. **Cấu hình Environment Variables trên Vercel**:
   - Trong mục **Environment Variables**, thêm các biến sau:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_DB_PASSWORD`
     - `DATABASE_URL`

4. **Bấm Deploy**:
   - Vercel sẽ tự động build và cung cấp domain trực tuyến miễn phí (`*.vercel.app`).
