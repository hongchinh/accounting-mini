# Visual Companion — Brainstorming

Browser-based visual companion để hiển thị mockups, diagrams và options trong quá trình brainstorming.

---

## Khi nào dùng browser, khi nào dùng terminal

Quyết định **theo từng câu hỏi**, không phải theo toàn session.
Test: *user hiểu vấn đề này tốt hơn bằng cách nhìn hay đọc?*

**Dùng browser** khi nội dung mang tính visual:

- **UI mockups** — wireframes, layouts, navigation structures, component designs
- **Architecture diagrams** — system components, data flow, relationship maps
- **Side-by-side visual comparisons** — so sánh 2 layouts, 2 color schemes, 2 design directions
- **Design polish** — câu hỏi về look & feel, spacing, visual hierarchy
- **Spatial relationships** — state machines, flowcharts, entity relationships dưới dạng diagram

**Dùng terminal** khi nội dung là text hoặc tabular:

- Requirements và scope questions
- Conceptual A/B/C choices (mô tả bằng chữ)
- Tradeoff lists — pros/cons, comparison tables
- Technical decisions — API design, data modeling, architectural approach
- Clarifying questions — bất kỳ câu nào mà câu trả lời là chữ, không phải visual preference

> Câu hỏi *về* UI topic không tự động là visual question.
> "Bạn muốn dạng wizard như thế nào?" → terminal.
> "Layout nào trong 3 cái này phù hợp hơn?" → browser.

---

## Cách hoạt động

Server chạy local, watch thư mục `screen_dir` để tìm file HTML mới nhất và serve cho browser.
AI viết HTML vào `screen_dir`, user xem trong browser và click chọn options.
Clicks được ghi vào `state_dir/events` mà AI đọc ở lượt tiếp theo.

**Content fragments vs full documents:**
- Nếu HTML bắt đầu bằng `<!DOCTYPE` hoặc `<html` → server serve nguyên (chỉ inject helper script).
- Ngược lại → server tự wrap vào frame template (CSS, indicator bar, polling script).
- **Mặc định viết content fragments.** Chỉ viết full document khi cần control toàn bộ page.

---

## Khởi động server

### Cách 1 — PowerShell script (khuyến nghị)

```powershell
# Từ thư mục gốc dự án
.\scripts\Start-BrainstormServer.ps1
```

Output JSON:
```json
{"type":"server-started","port":52341,"url":"http://localhost:52341",
 "screen_dir":".../.superpowers/brainstorm/12345-1706000000/content",
 "state_dir":".../.superpowers/brainstorm/12345-1706000000/state"}
```

Lưu `screen_dir` và `state_dir` từ output. Bảo user mở URL trong browser.

### Cách 2 — Node.js trực tiếp

```bash
node scripts/brainstorm-server.js --project-dir D:\Projects\AccountingMini
```

### Tham số tùy chọn

```powershell
# Remote access (cần khi dùng từ WSL hoặc Docker)
.\scripts\Start-BrainstormServer.ps1 -ServerHost 0.0.0.0 -UrlHost localhost

# Chỉ định thư mục dự án
.\scripts\Start-BrainstormServer.ps1 -ProjectDir "D:\Projects\AccountingMini"
```

### Quan trọng — Windows + Claude Code

Khi gọi từ **Bash tool trong Claude Code trên Windows**, phải dùng `run_in_background: true`
để server tiếp tục chạy qua các conversation turns:

```
Bash tool: node scripts/brainstorm-server.js --project-dir <path>
run_in_background: true
```

Sau đó đọc `$STATE_DIR/server-info` ở turn tiếp theo để lấy URL và port.

### Tìm lại connection info sau khi launch background

```powershell
# Tìm session mới nhất
$session = Get-ChildItem "$PWD\.superpowers\brainstorm" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
Get-Content "$($session.FullName)\state\server-info"
```

---

## Vòng lặp làm việc

### 1. Kiểm tra server còn sống → viết HTML

Trước mỗi lần viết, kiểm tra `$STATE_DIR/server-info` tồn tại.
Nếu không (hoặc `$STATE_DIR/server-stopped` tồn tại) → restart server trước.
Server tự tắt sau 30 phút không hoạt động.

Viết HTML vào `screen_dir` bằng **Write tool** (không dùng Bash echo/heredoc):

```
Write tool: {screen_dir}/layout-options.html
```

Dùng tên file có nghĩa: `layout.html`, `color-scheme.html`, `navigation.html`
**Không bao giờ reuse filename** — mỗi screen là một file mới.
Server tự serve file mới nhất theo modification time.

### 2. Bảo user xem và respond

- Nhắc lại URL (mỗi bước, không chỉ lần đầu)
- Tóm tắt ngắn nội dung đang hiển thị: "Đang show 3 layout options cho màn hình danh sách"
- Yêu cầu respond trong terminal: "Mở browser xem và cho biết bạn thích option nào."

### 3. Turn tiếp theo — đọc events

```powershell
# Đọc browser clicks (nếu file tồn tại)
if (Test-Path "$STATE_DIR\events") { Get-Content "$STATE_DIR\events" }
```

Format events (JSON lines):
```jsonl
{"type":"click","choice":"a","text":"Single Column Layout","timestamp":1706000101}
{"type":"click","choice":"c","text":"Dashboard Layout","timestamp":1706000115}
```

- Terminal message là primary feedback; events cung cấp structured data
- Event stream thể hiện exploration path — click nhiều lần trước khi chốt
- Nếu `events` không tồn tại → user không interact với browser, dùng terminal text thôi

### 4. Iterate hoặc advance

Nếu feedback thay đổi screen hiện tại → viết file mới (ví dụ: `layout-v2.html`).
Chỉ advance sang câu hỏi tiếp theo khi step hiện tại đã validated.

### 5. Unload khi quay về terminal

Khi step tiếp theo không cần browser (clarifying question, tradeoff discussion),
push màn hình "waiting" để tránh user nhìn vào content cũ:

```html
<!-- filename: waiting.html (hoặc waiting-2.html, ...) -->
<div style="display:flex;align-items:center;justify-content:center;min-height:60vh">
  <p class="subtitle">Tiếp tục trong terminal...</p>
</div>
```

---

## Viết content fragments

Chỉ viết phần nội dung — server tự wrap trong frame template (header, CSS, indicator bar).

**Ví dụ tối giản:**

```html
<h2>Layout nào phù hợp hơn?</h2>
<p class="subtitle">Xem xét trải nghiệm người dùng kế toán hàng ngày</p>

<div class="options">
  <div class="option" data-choice="a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>Single Column</h3>
      <p>Đọc tuần tự, phù hợp màn hình nhỏ</p>
    </div>
  </div>
  <div class="option" data-choice="b" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content">
      <h3>Sidebar + Main</h3>
      <p>Filter bên trái, data bên phải — quen thuộc với ERP</p>
    </div>
  </div>
</div>
```

Không cần `<html>`, không cần CSS, không cần `<script>`.

---

## CSS Classes có sẵn

### Options (A/B/C choices)

```html
<div class="options">
  <div class="option" data-choice="a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>Tên option</h3>
      <p>Mô tả</p>
    </div>
  </div>
</div>
```

**Multi-select** — thêm `data-multiselect` vào container:

```html
<div class="options" data-multiselect>
  <!-- user có thể toggle nhiều options -->
</div>
```

### Cards (visual designs)

```html
<div class="cards">
  <div class="card" data-choice="design1" onclick="toggleSelect(this)">
    <div class="card-image"><!-- mockup content --></div>
    <div class="card-body">
      <h3>Tên design</h3>
      <p>Mô tả</p>
    </div>
  </div>
</div>
```

### Mockup container

```html
<div class="mockup">
  <div class="mockup-header">Preview: Màn hình Nhà Cung Cấp</div>
  <div class="mockup-body"><!-- mockup HTML --></div>
</div>
```

### Split view (side-by-side)

```html
<div class="split">
  <div class="mockup"><!-- left --></div>
  <div class="mockup"><!-- right --></div>
</div>
```

### Pros/Cons

```html
<div class="pros-cons">
  <div class="pros"><h4>Ưu điểm</h4><ul><li>Benefit</li></ul></div>
  <div class="cons"><h4>Nhược điểm</h4><ul><li>Drawback</li></ul></div>
</div>
```

### Mock wireframe elements

```html
<div class="mock-nav">Logo | Tổng quan | Nhà cung cấp | Báo cáo</div>
<div style="display:flex">
  <div class="mock-sidebar">Bộ lọc</div>
  <div class="mock-content">Nội dung chính</div>
</div>
<button class="mock-button">Lưu</button>
<input class="mock-input" placeholder="Tìm kiếm...">
<div class="placeholder">Khu vực placeholder</div>
```

### Typography & Layout

| Class/Element | Dùng cho |
|---|---|
| `h2` | Tiêu đề trang |
| `h3` | Tiêu đề section |
| `.subtitle` | Mô tả phụ bên dưới tiêu đề |
| `.section` | Content block có bottom margin |
| `.label` | Small uppercase label text |

---

## Design tips

- **Scale fidelity theo câu hỏi** — wireframe cho layout questions, polish cho visual questions
- **Giải thích câu hỏi trên mỗi page** — "Layout nào chuyên nghiệp hơn?" chứ không phải "Chọn một"
- **Iterate trước khi advance** — nếu feedback thay đổi screen, viết version mới trước
- **Tối đa 4 options** mỗi screen — nhiều hơn gây cognitive overload
- **Dùng nội dung thực khi quan trọng** — cho màn hình danh sách, dùng tên field thật từ schema
- **Giữ mockup đơn giản** — focus vào layout và structure, không pixel-perfect

---

## File naming

- Dùng tên có nghĩa: `supplier-layout.html`, `color-scheme.html`, `table-vs-card.html`
- **Không bao giờ reuse filename** — mỗi screen là file mới
- Iterate: thêm suffix version như `layout-v2.html`, `layout-v3.html`
- Server serve file mới nhất theo modification time

---

## Dọn dẹp

Server tự tắt sau 30 phút. Để tắt thủ công:

```powershell
# Tìm PID từ server-info
$info = Get-Content "$STATE_DIR\server-info" | ConvertFrom-Json
Stop-Process -Id $info.port  # hoặc kill toàn bộ node nếu cần
```

Mockup files persist tại `.superpowers/brainstorm/` nếu dùng `--project-dir`.
Thêm `.superpowers/` vào `.gitignore` nếu chưa có.

---

## Tích hợp với AccountingMini

- Server dùng Node.js (có sẵn vì dự án có Next.js)
- Mockups lưu tại: `d:\Projects\AccountingMini\.superpowers\brainstorm\`
- Scripts tại: `scripts/brainstorm-server.js`, `scripts/Start-BrainstormServer.ps1`
- Frame template: `scripts/frame-template.html` (CSS cho tất cả classes trên)
- Client helper: `scripts/helper.js` (auto-reload + click recording)
