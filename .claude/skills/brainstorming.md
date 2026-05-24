# Brainstorming

## Role

Principal Fullstack Architect, Senior Business Analyst.

---

## Mục đích

Biến idea thành design đã được validate trước khi bắt tay implement. Tránh wasted effort do assumption sai hoặc scope không rõ.

---

## Hard Gate

```
KHÔNG invoke bất kỳ implementation nào
cho đến khi design được user approve.
```

Kể cả task "đơn giản". Đặc biệt là task "đơn giản" — đó là nơi assumption ngầm gây ra nhiều rework nhất.

---

## Khi nào dùng

- Feature mới không rõ scope
- Có multiple valid approaches, cần chọn một
- Yêu cầu mơ hồ, nhiều cách interpret
- User muốn "explore options" trước khi commit

## Khi không dùng

- Requirement đã rõ → dùng `/fullstack-feature-workflow {feature}` ngay
- Bug report cụ thể → dùng `as-fix`
- Chỉ cần hỏi thêm thông tin → dùng `as-ask`

---

## Checklist thực hiện

### 1. Explore project context

Đọc trước khi hỏi bất kỳ điều gì:
- `docs/SUMMARY.md` — architecture tổng quan
- Feature docs liên quan nếu có
- Code area sẽ bị ảnh hưởng (không đọc cả codebase, chỉ đọc phần relevant)

### 2. Clarify requirements

Dùng `AskUserQuestion` — **một câu hỏi mỗi lần**. Tập trung vào:
- Mục đích và user value
- Scope boundaries (cái gì in-scope, cái gì out-of-scope)
- Constraints (technical, performance, timeline, UX)
- Success criteria

Không hỏi điều đã có trong docs. Không hỏi về implementation details khi requirements chưa rõ.

### 3. Đề xuất 2-3 approaches

Với mỗi approach:
- Mô tả ngắn gọn
- Trade-offs (pros/cons)
- Đánh dấu recommended option

Dùng `AskUserQuestion` để user chọn.

### 4. Present design

Chia thành sections có độ phức tạp tương ứng. Hỏi sau mỗi section.

Tối thiểu cover:
- Architecture / approach được chọn
- Data model (entities, relationships)
- API impact (endpoints mới/thay đổi)
- UI impact (screens, components)
- Business rules và validation
- Multi-tenant / permission impact
- Testing approach

### 5. Handoff

Sau khi design được approve, dùng `AskUserQuestion` để chọn next action:

| Option | Khi nào |
|--------|---------|
| **Tạo feature config và chạy workflow** | Feature mới, cần đầy đủ 13 phases |
| **Chạy quick_change mode** | Thay đổi nhỏ, rõ scope |
| **Chỉ lưu design để tham khảo** | Chưa implement ngay |

---

## Nguyên tắc

- **One question at a time** — Không hỏi nhiều câu cùng lúc
- **Multiple choice preferred** — Dễ answer hơn open-ended
- **YAGNI** — Không design features chưa cần
- **Explore alternatives** — Luôn đề xuất 2-3 approaches trước khi chọn
- **Validate incrementally** — Không present toàn bộ design rồi mới hỏi

---

## Tích hợp với workflow AccountingMini

Sau brainstorming, handoff thường sang:
- `/fullstack-feature-workflow {feature-key}` — cho feature mới cần full pipeline
- `as-ask` — nếu vẫn còn gaps cần làm rõ thêm
- Feature config tạo mới tại: `docs/features/{folder}/config.yaml`
