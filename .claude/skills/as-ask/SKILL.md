---
name: as-ask
description: Gather missing requirements through structured dialogue before proceeding to implementation.
---

# As-Ask — Clarification Gathering

## Role

Requirements Analyst.

---

## Mục đích

Thu thập thông tin còn thiếu qua structured dialogue. Không plan, không implement, không tạo artifact nào ngoài câu trả lời.

---

## Scope Gate — Khi nào dùng skill này

Dùng khi **tất cả** điều sau đúng:

1. **Task chưa đủ spec** — Thiếu requirement, constraint, hoặc decision quan trọng
2. **Cần input từ user** — Task không thể tiến hành mà không có câu trả lời
3. **Không thể assume an toàn** — Đoán sai sẽ tốn effort hoặc đi sai hướng

Nếu task đã rõ → dùng skill phù hợp ngay (`/fullstack-feature-workflow`, `brainstorming`, `as-fix`).

---

## Workflow

### Bước 1: Đọc context dự án

Trước khi hỏi bất kỳ điều gì, đọc:
- `docs/SUMMARY.md` — Hiểu architecture tổng quan
- Feature config liên quan nếu có (`docs/features/*/config.yaml`)
- Code area liên quan nếu task liên quan đến code cụ thể

Không hỏi điều đã được ghi trong documentation.

### Bước 2: Xác định information gaps

Liệt kê chính xác những gì còn thiếu để tiến hành:

- Mục đích và user value của feature/change
- Scope boundaries (cái gì trong scope, cái gì không)
- Constraints (technical, UX, performance, business rules)
- Success criteria (làm thế nào biết task hoàn thành đúng?)
- Decisions cần đưa ra (có nhiều options, cần chọn một)

### Bước 3: Hỏi từng câu một

Dùng `AskUserQuestion` tool — **một câu hỏi mỗi lần**.

Rules:
- Ưu tiên **multiple-choice** (2-4 options) khi có thể enumerate các lựa chọn
- Free-form chỉ khi không có options hợp lý
- Không hỏi về implementation details khi chưa rõ requirements
- Không bundle nhiều quyết định vào một câu hỏi
- Không hỏi điều đã có trong docs

### Bước 4: Tổng hợp và hand off

Sau khi tất cả gaps được fill:

1. Tóm tắt ngắn các câu trả lời đã thu thập
2. Confirm với user: "Thông tin trên có đúng không?"
3. Đề xuất next step phù hợp:

| Complexity | Recommended next |
|---|---|
| Nhỏ, clear, ≤ 5 files | `quick-implement` hoặc `as-fix` |
| Feature mới, medium-large | `/fullstack-feature-workflow {feature-key}` |
| Ambiguous, nhiều options | `brainstorming` |
| Bug với clear repro | `as-fix` |

---

## Rules

- Không viết code
- Không tạo plan hay design document
- Không modify bất kỳ file nào (ngoài file docs nếu user yêu cầu ghi lại answers)
- Không assume — hỏi thay
- Áp dụng YAGNI: chỉ hỏi điều thực sự cần để proceed
- Giữ session ngắn — mục tiêu là unlock task, không phải explore toàn bộ domain

---

## Ví dụ sử dụng

```
User: "Thêm export vào màn hình nhà cung cấp"

AI chạy as-ask:
1. Đọc docs/features/suppliers/ → thấy Phase 4 đã có API nhưng chưa có export endpoint
2. Gaps: format export (Excel/CSV?), columns nào, filter có apply không, max rows?
3. Hỏi lần lượt 4 câu
4. Tóm tắt: "Export CSV, 8 columns theo Phase 4 DTO, áp dụng filter hiện tại, không giới hạn rows"
5. Recommend: "Đây là quick change trong workflow_mode: quick_change — chạy /fullstack-feature-workflow suppliers"
```

