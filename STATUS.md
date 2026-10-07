# Trạng thái dự án – GPA Tracker

_Cập nhật lần cuối: 2026-10-07_

## 1. Tình trạng hiện tại

| Giai đoạn | Trạng thái |
|-----------|------------|
| 1. Yêu cầu (PRD) | ✅ Hoàn thành |
| 2. Thiết kế luồng (Mermaid) | ✅ Hoàn thành (Boss duyệt 2026-10-07) |
| 3. Cài đặt + kiểm thử tự động | ✅ Hoàn thành (F1–F5, 119 test đạt, build thành công, giao diện đã kiểm tra ở 360px) |
| 4. Kiểm thử người dùng (Boss) | ⏳ Đang làm (checklist đã có: `docs/UAT.md`) |
| 5. Deploy Vercel | ⬜ Chưa bắt đầu |

**Việc tiếp theo:** Boss chạy thử theo `docs/UAT.md` trên máy tính và điện thoại, báo lỗi để tôi sửa.

**URL công khai:** _(chưa có)_

## 2. Quyết định kỹ thuật

| Ngày | Quyết định | Lý do |
|------|------------|-------|
| 2026-10-07 | Quy trình làm việc theo mô hình Waterfall | Yêu cầu rõ ràng, phạm vi nhỏ, cố định từ PRD |
| 2026-10-07 | Flowchart viết bằng cú pháp Mermaid, lưu ở `docs/FLOWS.md` | Xem trực tiếp trên GitHub/VS Code, dễ sửa cùng mã nguồn |
| 2026-10-07 | Vite + HTML/CSS/JS thuần, test bằng Vitest, deploy Vercel | Theo yêu cầu PRD |
| 2026-10-07 | Tách phần tính toán (kiểm tra dữ liệu, quy đổi, tính GPA, đọc dữ liệu lưu) khỏi phần giao diện | Để viết unit test trực tiếp, dễ kiểm soát lỗi |
| 2026-10-07 | Mỗi chức năng làm trên một nhánh riêng, xong và hết lỗi mới gộp vào `main` | Theo yêu cầu của Boss, giữ `main` luôn chạy được |
| 2026-10-07 | Xếp loại (F3) dựa trên GPA hệ 4 **đã làm tròn** 2 chữ số (VD 3,595 → 3,60 → Xuất sắc) | Khớp với con số người dùng nhìn thấy, đúng thứ tự trong flowchart F3 |
| 2026-10-07 | Khi tính GPA, cộng điểm theo đơn vị 0,1 (số nguyên) rồi mới chia | Tránh sai số máy tính làm lệch kết quả làm tròn |
| 2026-10-07 | Ô Tín chỉ và Điểm dùng ô nhập chữ (không dùng ô số của trình duyệt) | Ô số của một số trình duyệt không nhận dấu phẩy `8,5` |
| 2026-10-07 | Làm tròn điểm theo cách tính trên chuỗi số | Tránh sai số máy tính (VD: 8,45 phải ra 8,5 chứ không ra 8,4) |
| 2026-10-07 | Khi nhập sai, con trỏ nhảy về ô sai đầu tiên | Giúp người dùng sửa nhanh |
| 2026-10-07 | Bảng quy đổi F2 lưu dạng danh sách ngưỡng (từ cao xuống thấp), bảng môn học thêm 2 cột "Điểm chữ" và "Hệ 4" | Dễ đối chiếu với PRD, dễ kiểm thử từng ngưỡng |
| 2026-10-07 | F4: thêm/sửa/xoá trong danh sách viết thành hàm riêng (`src/courses.js`), mỗi môn có mã riêng (id) | Kiểm thử được, sửa/xoá đúng môn kể cả khi trùng tên |
| 2026-10-07 | F4: khi sửa, tiêu đề form đổi thành "Sửa môn học", dòng đang sửa được tô màu; phím Esc = Huỷ | Người dùng biết rõ mình đang sửa môn nào |
| 2026-10-07 | F4: hỏi xác nhận xoá bằng hộp thoại có sẵn của trình duyệt | Đơn giản, chạy được trên mọi máy và điện thoại |
| 2026-10-07 | F5: phần đọc/ghi dữ liệu viết riêng (`src/storage.js`); môn đọc lên được kiểm tra lại bằng đúng luật của F1 | Kiểm thử được; dữ liệu bị sửa tay cũng không làm sai GPA |
| 2026-10-07 | F5: bỏ môn trùng mã (id) khi tải, môn mới luôn nhận mã lớn hơn mã cao nhất | Sửa/xoá luôn đúng môn sau khi tải lại trang |
| 2026-10-07 | F5: nút "Xoá tất cả" đặt cạnh tiêu đề "Danh sách môn học"; thông báo "Không lưu được dữ liệu" hiện ở đầu trang, tự ẩn khi lưu lại được | Dễ thấy, không che nội dung |
| 2026-10-07 | Màn hình hẹp (< 640px): mỗi môn hiển thị thành một thẻ (tên môn ở trên, 4 ô điểm bên dưới, nút Sửa/Xoá to hơn), ẩn cột số thứ tự | Bảng 7 cột không vừa màn 360px, phải cuộn ngang và khó bấm nút |

## 3. Thay đổi so với ban đầu

| Ngày | Thay đổi | Lý do | Tài liệu bị ảnh hưởng |
|------|----------|-------|------------------------|
| 2026-10-07 | Dữ liệu lưu hỏng một phần: giữ các môn hợp lệ, bỏ môn sai (PRD cũ: khởi tạo danh sách rỗng) | Tránh mất toàn bộ dữ liệu vì một dòng lỗi | `PRD.md` F5, `docs/FLOWS.md` F5a |
| 2026-10-07 | Bổ sung 5 chi tiết PRD chưa nêu: nút "Huỷ" khi sửa, xoá môn đang sửa thì xoá trắng form, báo lỗi khi không lưu được, khoá "Xoá tất cả" khi danh sách trống, hiện lỗi cả 3 ô cùng lúc | Làm rõ hành vi, Boss đã duyệt | `docs/FLOWS.md` (mục Giả định) |
