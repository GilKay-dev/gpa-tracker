# Checklist kiểm thử người dùng (UAT) – GPA Tracker

Giai đoạn 4 (Waterfall). Người thực hiện: **Boss**. Đánh dấu `[x]` khi đạt; nếu lỗi, ghi ngắn vào mục **Lỗi phát hiện** ở cuối để tôi sửa.

## Cách mở ứng dụng

- **Trên máy tính:** chạy `npm run dev`, mở địa chỉ hiện ra (thường là `http://localhost:5173`).
- **Trên điện thoại:** máy tính và điện thoại dùng chung Wi-Fi. Chạy `npm run dev -- --host`, mở trên điện thoại địa chỉ ở dòng `Network:` (VD `http://192.168.1.5:5173`).
- Nên bắt đầu với danh sách trống: nếu đã có môn, bấm **Xoá tất cả** trước.

---

## A. Trang trống (F3)

- [ ] A1. Mở trang lần đầu: ô kết quả hiện "—", dưới bảng có dòng "Hãy thêm môn học đầu tiên".
- [ ] A2. Nút **Xoá tất cả** bị mờ, bấm không có tác dụng.

## B. Thêm môn học (F1)

- [ ] B1. Nhập `Giải tích 1` / `3` / `8,5` → bấm **Thêm môn**: môn hiện trong bảng, form được xoá trắng, con trỏ về ô Tên môn.
- [ ] B2. Nhập môn thứ hai bằng phím **Enter** thay vì bấm nút: `Lập trình hướng đối tượng` / `4` / `7.2` (dấu chấm) → thêm được.
- [ ] B3. Bấm **Thêm môn** khi cả 3 ô trống: hiện đủ 3 lỗi cùng lúc, con trỏ nhảy về ô Tên môn.
- [ ] B4. Tên môn chỉ gồm dấu cách → báo "Vui lòng nhập tên môn".
- [ ] B5. Tên môn dài hơn 100 ký tự → báo "Tên môn tối đa 100 ký tự".
- [ ] B6. Số tín chỉ `0`, `11`, `2,5`, `abc` → mỗi trường hợp đều báo "Số tín chỉ phải là số nguyên từ 1 đến 10".
- [ ] B7. Điểm `-1`, `10,5`, `abc` → mỗi trường hợp đều báo "Điểm phải là số từ 0 đến 10".
- [ ] B8. Điểm `0` và `10` → đều thêm được.
- [ ] B9. Điểm `7,46` → bảng hiện `7,5` (làm tròn 1 chữ số).
- [ ] B10. Chỉ sai 1 ô (VD tín chỉ `0`): con trỏ nhảy đúng vào ô sai, sửa lại xong thì thêm được và lỗi biến mất.

## C. Quy đổi điểm (F2)

Thêm lần lượt các môn với điểm dưới đây (tín chỉ tuỳ ý), xem cột **Điểm chữ** và **Hệ 4**:

| Điểm nhập | Điểm chữ đúng | Hệ 4 đúng | Đạt |
|-----------|---------------|-----------|-----|
| 8,5       | A             | 4,0       | [ ] |
| 8,4       | B+            | 3,5       | [ ] |
| 8,0       | B+            | 3,5       | [ ] |
| 7,9       | B             | 3,0       | [ ] |
| 6,5       | C+            | 2,5       | [ ] |
| 5,5       | C             | 2,0       | [ ] |
| 5,0       | D+            | 1,5       | [ ] |
| 4,0       | D             | 1,0       | [ ] |
| 3,9       | F             | 0,0       | [ ] |
| 8,45      | A (vì làm tròn thành 8,5) | 4,0 | [ ] |

Xong phần này bấm **Xoá tất cả** để sang phần D.

## D. Tính GPA và xếp loại (F3)

Thêm đúng 3 môn sau vào danh sách trống:

| Tên môn    | Tín chỉ | Điểm |
|------------|---------|------|
| Giải tích 1 | 3      | 8,5  |
| Vật lý      | 4      | 7,2  |
| Triết học   | 2      | 3,5  |

- [ ] D1. Kết quả: **Số môn 3 · Tổng tín chỉ 9 · Tín chỉ đạt 7 · GPA hệ 4 = 2,67 · GPA hệ 10 = 6,81 · Xếp loại Khá**.
- [ ] D2. Kết quả cập nhật ngay sau mỗi lần thêm/sửa/xoá, không cần tải lại trang.
- [ ] D3. Sửa Triết học thành điểm `9` → GPA hệ 4 = **3,56**, xếp loại **Giỏi**, tín chỉ đạt = 9.

## E. Sửa và xoá môn (F4)

- [ ] E1. Bấm **Sửa** ở một môn: dữ liệu lên form, tiêu đề đổi thành "Sửa môn học", nút đổi thành **Lưu**, dòng đang sửa được tô màu, có thêm nút **Huỷ**.
- [ ] E2. Đổi điểm rồi bấm **Lưu**: bảng và GPA cập nhật, form quay về "Thêm môn học".
- [ ] E3. Khi sửa, nhập sai (VD tín chỉ `0`) → báo lỗi giống lúc thêm, không lưu.
- [ ] E4. Bấm **Huỷ** (hoặc phím **Esc** trên máy tính) → thoát chế độ sửa, dữ liệu môn không đổi.
- [ ] E5. Bấm **Xoá** → có hỏi xác nhận. Chọn **Huỷ/Cancel** → môn vẫn còn.
- [ ] E6. Bấm **Xoá** → chọn **OK** → môn biến mất, GPA cập nhật.
- [ ] E7. Đang sửa môn X mà bấm **Xoá** chính môn X → form xoá trắng, quay về "Thêm môn học".
- [ ] E8. Có 2 môn trùng tên: sửa/xoá một môn thì chỉ môn đó bị ảnh hưởng.

## F. Lưu dữ liệu (F5)

- [ ] F1. Thêm vài môn, tải lại trang (F5) → dữ liệu và GPA vẫn còn nguyên.
- [ ] F2. Sửa, xoá một môn rồi tải lại trang → thay đổi vẫn còn.
- [ ] F3. Đóng hẳn trình duyệt, mở lại → dữ liệu vẫn còn.
- [ ] F4. Bấm **Xoá tất cả** → có hỏi xác nhận. Chọn **Huỷ/Cancel** → không mất gì.
- [ ] F5. Bấm **Xoá tất cả** → **OK** → danh sách trống, hiện "—" và "Hãy thêm môn học đầu tiên"; tải lại trang vẫn trống.
- [ ] F6. _(Tuỳ chọn, trên máy tính)_ Thử dữ liệu hỏng: nhấn **F12** → tab **Console** → gõ
  `localStorage.setItem('gpa-tracker:v1', 'abc')` rồi Enter → tải lại trang: trang vẫn hiện bình thường, danh sách trống.

## G. Giao diện và điện thoại

- [ ] G1. Trên điện thoại (hoặc thu nhỏ cửa sổ hết cỡ): không phải kéo ngang trang.
- [ ] G2. Mỗi môn hiện thành một thẻ: tên môn ở trên, Tín chỉ / Điểm hệ 10 / Điểm chữ / Hệ 4 bên dưới; nút Sửa, Xoá dễ bấm.
- [ ] G3. Tên môn rất dài tự xuống dòng, không tràn ra ngoài.
- [ ] G4. Bàn phím điện thoại: ô Tín chỉ hiện bàn phím số; ô Điểm gõ được dấu phẩy.
- [ ] G5. Toàn bộ chữ trên trang và thông báo lỗi là tiếng Việt, không lỗi dấu.
- [ ] G6. Trên máy tính, danh sách hiện dạng bảng đủ 7 cột.

---

## Lỗi phát hiện

| # | Mục | Mô tả lỗi (làm gì → thấy gì → mong muốn gì) | Máy / trình duyệt | Trạng thái |
|---|-----|---------------------------------------------|-------------------|------------|
|   |     |                                             |                   |            |

## Kết luận

- [ ] Boss xác nhận đạt, cho phép chuyển sang giai đoạn 5 (Deploy Vercel).
