# Trạng thái dự án – GPA Tracker

_Cập nhật lần cuối: 2026-10-07_

## 1. Tình trạng hiện tại

| Giai đoạn | Trạng thái |
|-----------|------------|
| 1. Yêu cầu (PRD) | ✅ Hoàn thành |
| 2. Thiết kế luồng (Mermaid) | ✅ Hoàn thành (Boss duyệt 2026-10-07) |
| 3. Cài đặt + kiểm thử tự động | ⏳ Sắp bắt đầu |
| 4. Kiểm thử người dùng (Boss) | ⬜ Chưa bắt đầu |
| 5. Deploy Vercel | ⬜ Chưa bắt đầu |

**Việc tiếp theo:** Khởi tạo dự án Vite + Vitest, bắt đầu cài đặt F1.

**URL công khai:** _(chưa có)_

## 2. Quyết định kỹ thuật

| Ngày | Quyết định | Lý do |
|------|------------|-------|
| 2026-10-07 | Quy trình làm việc theo mô hình Waterfall | Yêu cầu rõ ràng, phạm vi nhỏ, cố định từ PRD |
| 2026-10-07 | Flowchart viết bằng cú pháp Mermaid, lưu ở `docs/FLOWS.md` | Xem trực tiếp trên GitHub/VS Code, dễ sửa cùng mã nguồn |
| 2026-10-07 | Vite + HTML/CSS/JS thuần, test bằng Vitest, deploy Vercel | Theo yêu cầu PRD |
| 2026-10-07 | Tách phần tính toán (kiểm tra dữ liệu, quy đổi, tính GPA, đọc dữ liệu lưu) khỏi phần giao diện | Để viết unit test trực tiếp, dễ kiểm soát lỗi |

## 3. Thay đổi so với ban đầu

| Ngày | Thay đổi | Lý do | Tài liệu bị ảnh hưởng |
|------|----------|-------|------------------------|
| 2026-10-07 | Dữ liệu lưu hỏng một phần: giữ các môn hợp lệ, bỏ môn sai (PRD cũ: khởi tạo danh sách rỗng) | Tránh mất toàn bộ dữ liệu vì một dòng lỗi | `PRD.md` F5, `docs/FLOWS.md` F5a |
| 2026-10-07 | Bổ sung 5 chi tiết PRD chưa nêu: nút "Huỷ" khi sửa, xoá môn đang sửa thì xoá trắng form, báo lỗi khi không lưu được, khoá "Xoá tất cả" khi danh sách trống, hiện lỗi cả 3 ô cùng lúc | Làm rõ hành vi, Boss đã duyệt | `docs/FLOWS.md` (mục Giả định) |
