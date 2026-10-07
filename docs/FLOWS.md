# Luồng nghiệp vụ – GPA Tracker

Tài liệu giai đoạn 2 (Waterfall). Mỗi flowchart bám theo `PRD.md`. Các điểm PRD chưa nói rõ được ghi ở mục **Giả định** cuối tài liệu để Boss duyệt.

---

## 0. Luồng tổng thể

```mermaid
flowchart TD
    A([Mở trang]) --> B["Đọc dữ liệu đã lưu (F5)"]
    B --> C["Hiển thị bảng môn học"]
    C --> D["Tính và hiển thị GPA (F3)"]
    D --> E{Người dùng thao tác gì?}
    E -->|Thêm môn| F1["F1 – Thêm môn học"]
    E -->|Sửa môn| F4a["F4 – Sửa môn học"]
    E -->|Xoá môn| F4b["F4 – Xoá môn học"]
    E -->|Xoá tất cả| F5c["F5 – Xoá tất cả"]
    F1 --> S{Danh sách có thay đổi?}
    F4a --> S
    F4b --> S
    F5c --> S
    S -->|Có| G["Lưu vào trình duyệt (F5)"]
    G --> C
    S -->|Không| E
```

---

## F1. Thêm môn học

```mermaid
flowchart TD
    A([Nhập Tên môn, Số tín chỉ, Điểm hệ 10]) --> B["Nhấn 'Thêm môn' hoặc Enter"]
    B --> C["Kiểm tra dữ liệu"]

    C --> N{"Tên môn (đã bỏ khoảng trắng 2 đầu) có trống?"}
    N -->|Có| NE["Lỗi: 'Vui lòng nhập tên môn'"]
    N -->|Không| N2{"Dài quá 100 ký tự?"}
    N2 -->|Có| NE2["Lỗi: 'Tên môn tối đa 100 ký tự'"]
    N2 -->|Không| NOK[Tên môn hợp lệ]

    C --> T{"Số tín chỉ là số nguyên từ 1 đến 10?"}
    T -->|Không| TE["Lỗi: 'Số tín chỉ phải là số nguyên từ 1 đến 10'"]
    T -->|Có| TOK[Tín chỉ hợp lệ]

    C --> P["Đổi dấu phẩy thành dấu chấm"]
    P --> P2{"Là số từ 0 đến 10?"}
    P2 -->|Không| PE["Lỗi: 'Điểm phải là số từ 0 đến 10'"]
    P2 -->|Có| P3["Làm tròn 1 chữ số thập phân"]
    P3 --> POK[Điểm hợp lệ]

    NE --> X["Hiện lỗi ngay dưới ô tương ứng, giữ nguyên dữ liệu đã nhập"]
    NE2 --> X
    TE --> X
    PE --> X
    X --> Z([Chờ người dùng sửa])

    NOK --> ALL{Cả 3 ô đều hợp lệ?}
    TOK --> ALL
    POK --> ALL
    ALL -->|Có| ADD["Thêm môn vào bảng (kèm điểm chữ, hệ 4 – F2)"]
    ADD --> CLR["Xoá trắng form, xoá thông báo lỗi"]
    CLR --> FOC["Đặt con trỏ vào ô Tên môn"]
    FOC --> GPA["Tính lại GPA (F3) và lưu (F5)"]
    GPA --> END([Kết thúc])
```

---

## F2. Quy đổi điểm

Đầu vào là điểm hệ 10 **đã làm tròn 1 chữ số** (ví dụ 8,45 → 8.5 → A).

```mermaid
flowchart TD
    A(["Điểm hệ 10 (đã làm tròn)"]) --> B{"≥ 8.5?"}
    B -->|Có| RA["A – 4.0"]
    B -->|Không| C{"≥ 8.0?"}
    C -->|Có| RBp["B+ – 3.5"]
    C -->|Không| D{"≥ 7.0?"}
    D -->|Có| RB["B – 3.0"]
    D -->|Không| E{"≥ 6.5?"}
    E -->|Có| RCp["C+ – 2.5"]
    E -->|Không| F{"≥ 5.5?"}
    F -->|Có| RC["C – 2.0"]
    F -->|Không| G{"≥ 5.0?"}
    G -->|Có| RDp["D+ – 1.5"]
    G -->|Không| H{"≥ 4.0?"}
    H -->|Có| RD["D – 1.0"]
    H -->|Không| RF["F – 0.0"]
```

---

## F3. Tính GPA và xếp loại

```mermaid
flowchart TD
    A([Danh sách môn thay đổi hoặc vừa tải trang]) --> B{Có môn nào không?}
    B -->|Không| E1["GPA hệ 4, hệ 10, xếp loại hiển thị '—'"]
    E1 --> E2["Số môn, tổng tín chỉ, tín chỉ đạt = 0"]
    E2 --> E3["Hiện dòng 'Hãy thêm môn học đầu tiên'"]
    E3 --> END([Kết thúc])

    B -->|Có| C["Tổng số môn, tổng tín chỉ"]
    C --> D["Tín chỉ đạt = tổng tín chỉ các môn có điểm hệ 10 ≥ 4.0"]
    D --> G4["GPA hệ 4 = Σ(hệ 4 × tín chỉ) ÷ Σ tín chỉ"]
    D --> G10["GPA hệ 10 = Σ(hệ 10 × tín chỉ) ÷ Σ tín chỉ"]
    G4 --> R["Làm tròn 2 chữ số thập phân"]
    G10 --> R
    R --> X{"GPA hệ 4 ≥ 3.6?"}
    X -->|Có| K1[Xuất sắc]
    X -->|Không| Y{"≥ 3.2?"}
    Y -->|Có| K2[Giỏi]
    Y -->|Không| Z{"≥ 2.5?"}
    Z -->|Có| K3[Khá]
    Z -->|Không| W{"≥ 2.0?"}
    W -->|Có| K4[Trung bình]
    W -->|Không| K5[Yếu]
    K1 --> S[Hiển thị kết quả]
    K2 --> S
    K3 --> S
    K4 --> S
    K5 --> S
    S --> END
```

---

## F4. Sửa và xoá môn học

### F4a. Sửa

```mermaid
flowchart TD
    A(["Nhấn 'Sửa' ở một dòng"]) --> B["Đưa Tên môn, Tín chỉ, Điểm của dòng đó lên form"]
    B --> C["Nút 'Thêm môn' đổi thành 'Lưu', hiện nút 'Huỷ'"]
    C --> D{Người dùng chọn gì?}
    D -->|Huỷ| H["Xoá trắng form, nút trở lại 'Thêm môn'"]
    H --> END([Kết thúc])
    D -->|"Lưu (hoặc Enter)"| V["Kiểm tra dữ liệu (giống F1)"]
    V --> OK{Hợp lệ?}
    OK -->|Không| ERR["Hiện lỗi dưới ô tương ứng"]
    ERR --> D
    OK -->|Có| U["Cập nhật môn đó trong bảng (giữ nguyên vị trí)"]
    U --> R["Xoá trắng form, nút trở lại 'Thêm môn'"]
    R --> G["Tính lại GPA (F3) và lưu (F5)"]
    G --> END
```

### F4b. Xoá

```mermaid
flowchart TD
    A(["Nhấn 'Xoá' ở một dòng"]) --> B{"Hỏi: 'Bạn có chắc muốn xoá môn này?'"}
    B -->|Không| END([Giữ nguyên, kết thúc])
    B -->|Có| C["Xoá môn khỏi bảng"]
    C --> D{Môn này đang được sửa trên form?}
    D -->|Có| E["Xoá trắng form, nút trở lại 'Thêm môn'"]
    D -->|Không| G
    E --> G["Tính lại GPA (F3) và lưu (F5)"]
    G --> END2([Kết thúc])
```

---

## F5. Lưu và tải dữ liệu

### F5a. Tải dữ liệu khi mở trang

```mermaid
flowchart TD
    A([Mở trang]) --> B["Đọc key 'gpa-tracker:v1' từ trình duyệt"]
    B --> C{Có dữ liệu?}
    C -->|Không| EMPTY[Danh sách rỗng]
    C -->|Có| D{Đọc được không?}
    D -->|"Không (dữ liệu hỏng)"| EMPTY
    D -->|Có| E{Đúng dạng danh sách môn?}
    E -->|Không| EMPTY
    E -->|Có| F["Giữ lại các môn hợp lệ, bỏ qua môn sai dữ liệu"]
    F --> SHOW
    EMPTY --> SHOW["Hiển thị bảng và GPA (F3)"]
    SHOW --> END([Trang hoạt động bình thường])
```

### F5b. Lưu khi có thay đổi

```mermaid
flowchart TD
    A(["Thêm / Sửa / Xoá / Xoá tất cả"]) --> B["Ghi toàn bộ danh sách vào key 'gpa-tracker:v1'"]
    B --> C{Ghi thành công?}
    C -->|Có| END([Kết thúc])
    C -->|"Không (trình duyệt chặn / đầy bộ nhớ)"| W["Hiện thông báo 'Không lưu được dữ liệu'; ứng dụng vẫn chạy"]
    W --> END
```

### F5c. Xoá tất cả

```mermaid
flowchart TD
    A(["Nhấn 'Xoá tất cả'"]) --> B{Danh sách đang trống?}
    B -->|Có| END([Không làm gì])
    B -->|Không| C{"Hỏi: 'Xoá toàn bộ môn học? Không thể hoàn tác.'"}
    C -->|Không| END
    C -->|Có| D["Xoá toàn bộ danh sách, xoá trắng form"]
    D --> E["Tính lại GPA (F3) → hiện '—' và hướng dẫn"]
    E --> F["Lưu danh sách rỗng (F5b)"]
    F --> END2([Kết thúc])
```

---

## Giả định (PRD chưa nói rõ – Boss đã duyệt 2026-10-07)

1. **Nút "Huỷ" khi sửa (F4a):** thêm nút Huỷ để thoát chế độ sửa mà không lưu.
2. **Xoá môn đang sửa (F4b):** form được xoá trắng và trở về chế độ "Thêm môn".
3. **Dữ liệu lưu bị hỏng một phần (F5a):** giữ các môn hợp lệ, bỏ qua môn sai, thay vì bỏ cả danh sách.
4. **Không lưu được (F5b):** hiện thông báo nhẹ, ứng dụng vẫn dùng bình thường.
5. **"Xoá tất cả" khi danh sách trống (F5c):** nút bị vô hiệu, không hỏi xác nhận.
6. **Hiển thị lỗi (F1):** kiểm tra cả 3 ô cùng lúc và hiện tất cả lỗi một lượt.
