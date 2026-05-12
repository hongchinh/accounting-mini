# Review Codex: fullstack-feature-workflow.md

## Pham vi review

File duoc review: `.claude/skills/fullstack-feature-workflow.md`

Goc nhin review: AI Workflow Engineer, tap trung vao tinh nhat quan workflow, kha nang agent thuc thi dung phase, gate/approval, va rui ro sai lech giua master workflow, child skills, va `CLAUDE.md`.

## Ket qua review

### 1. High - Phase map khong dong bo giua master workflow, child skill files va CLAUDE.md

`fullstack-feature-workflow.md` hien dinh nghia workflow moi gom 13 phase:

```text
Phase 1  Frontend Basic Design
Phase 2  Frontend UI Pixel Analysis
Phase 3  Backend Basic Design
Phase 4  Backend API Contract Review
Phase 5  Frontend Implementation Plan
Phase 6  Backend Implementation Plan
Phase 7  Backend Coding
Phase 8  Frontend Coding
Phase 9  Frontend Visual Review
Phase 10 Backend Test
Phase 11 Frontend Test
Phase 12 Integration Test
Phase 13 Final Feature Review
```

Nhung thu muc `.claude/skills/` hien van dang theo mapping cu 10 phase:

```text
01-frontend-basic-design.md
02-backend-basic-design.md
03-backend-api-contract-review.md
04-frontend-implementation-plan.md
05-backend-implementation-plan.md
06-backend-coding.md
07-frontend-coding.md
08-backend-testing.md
09-frontend-testing.md
10-integration-testing.md
```

Van de cu the:

- Master workflow can `02-frontend-ui-pixel-analysis.md`, nhung file nay chua ton tai.
- Master workflow xem Backend Basic Design la Phase 3, nhung child skill hien la `02-backend-basic-design.md`.
- Master workflow xem API Contract Review la Phase 4, nhung child skill hien la `03-backend-api-contract-review.md`.
- Tu Phase 2 tro di, so phase trong master workflow va ten child skill gan nhu lech toan bo.
- `CLAUDE.md` van mo ta workflow cu 10 phase, khong phai workflow moi 13 phase.

Rui ro:

- Agent goi sai child skill.
- Agent tao sai output file.
- Workflow-status ghi Phase 2 theo nghia moi, nhung child skill Phase 2 lai la backend design.
- Gate approval bi hieu nham.
- UI Pixel Analysis va Frontend Visual Review co the bi skip hoac khong bao gio chay.

Khuyen nghi:

Chon `fullstack-feature-workflow.md` lam source of truth, sau do dong bo lai child skill files va `CLAUDE.md`.

Danh sach child skill nen co:

```text
01-frontend-basic-design.md
02-frontend-ui-pixel-analysis.md
03-backend-basic-design.md
04-backend-api-contract-review.md
05-frontend-implementation-plan.md
06-backend-implementation-plan.md
07-backend-coding.md
08-frontend-coding.md
09-frontend-visual-review.md
10-backend-testing.md
11-frontend-testing.md
12-integration-testing.md
13-final-feature-review.md
```

Can tao moi:

```text
02-frontend-ui-pixel-analysis.md
09-frontend-visual-review.md
13-final-feature-review.md
```

Can rename cac file cu:

```text
02-backend-basic-design.md            -> 03-backend-basic-design.md
03-backend-api-contract-review.md     -> 04-backend-api-contract-review.md
04-frontend-implementation-plan.md    -> 05-frontend-implementation-plan.md
05-backend-implementation-plan.md     -> 06-backend-implementation-plan.md
06-backend-coding.md                  -> 07-backend-coding.md
07-frontend-coding.md                 -> 08-frontend-coding.md
08-backend-testing.md                 -> 10-backend-testing.md
09-frontend-testing.md                -> 11-frontend-testing.md
10-integration-testing.md             -> 12-integration-testing.md
```

Dong thoi can sua noi dung ben trong cac child skill, vi output file va phase number trong file cung co the dang la mapping cu.

### 2. High - Adaptive workflow mode xung dot voi phase gates

`frontend_only` skip Phase 3, 6, 7, 10, 12. Tuy nhien gate truoc Phase 8 lai yeu cau Phase 7 Review Status phai la `Approved`.

`ui_only` skip Phase 3, 4, 6, 7, 10, 12. Tuy nhien gate Phase 5 yeu cau Phase 4 API Contract Approved, va gate Phase 8 yeu cau Phase 7 Approved.

Rui ro:

- Workflow co the tu block va khong bao gio chay den coding phase.
- Skipped phase khong duoc gate chap nhan nhu `Not Required`.
- Agent co the tu y override gate, lam mat tinh chat deterministic cua workflow.

Khuyen nghi:

Them gate override theo `workflow_mode`.

Vi du:

- Neu phase bi skip hop le boi `workflow_mode`, gate phu thuoc vao phase do phai chap nhan `Review Status = Not Required`.
- `frontend_only`: Phase 8 khong duoc yeu cau Phase 7 Approved; thay vao do yeu cau API contract verification va frontend implementation plan approved.
- `ui_only`: Phase 5/8 khong yeu cau Phase 4 API Contract; Phase 8 dung mock data va phai co note ro trong summary.
- `backend_only`: Phase 3 khong nen phu thuoc Phase 1/2 neu hai phase do da skip.

### 3. High - Default workflow_mode mau thuan voi feature size inference

Section 35 noi: neu thieu `workflow_mode`, default la `full`.

Section 41 noi: neu thieu `workflow_mode`, AI nen suy luan feature size, khuyen nghi mode, va hoi user mot lan.

Hai rule nay mau thuan nhau.

Rui ro:

- Mot agent co the default thang sang `full`.
- Agent khac co the hoi user chon mode.
- Workflow khong deterministic.

Khuyen nghi:

Sua thanh mot rule duy nhat:

```text
If workflow_mode is missing:
1. Infer feature size from config and request context.
2. If confidence is high, record inferred mode as an assumption in issues.md and continue.
3. If confidence is low, ask user once.
4. If user does not answer, default to full.
```

Hoac neu muon an toan hon:

```text
If workflow_mode is missing, default to full. Do not infer.
```

Nen chon mot cach duy nhat.

### 4. Medium - Phase 4 co hai source of truth ve trang thai

Phase 4 document dung block:

```markdown
## Approval Status
Status: Approved | Changes Required
```

Nhung gate lai noi `Phase 4 Review Status must be Approved` trong `workflow-status.md`.

Rui ro:

- Phase 4 document da `Approved`, nhung workflow-status van `Pending`.
- Hoac workflow-status `Approved`, nhung document Phase 4 la `Changes Required`.
- Agent khong ro source nao uu tien.

Khuyen nghi:

Dinh nghia mapping ro:

```text
Phase 4 Approval Status = Approved
=> workflow-status Status = Completed
=> workflow-status Review Status = Approved

Phase 4 Approval Status = Changes Required
=> workflow-status Status = Blocked hoac Completed tuy policy
=> workflow-status Review Status = Changes Required
```

Nen them rule: neu document va workflow-status mau thuan, document Phase 4 la source of truth cho contract status, nhung AI phai cap nhat workflow-status de dong bo truoc khi chay phase tiep theo.

### 5. Medium - Coding phase completion detection con yeu

Phase 7/8 duoc xem la complete neu source files matching implementation plan ton tai va summary file ton tai.

Rui ro:

- File ton tai nhung build fail.
- Frontend typecheck fail.
- Backend compile fail.
- Code khong khop API contract.
- Summary file ton tai nhung implementation dang do dang.

Khuyen nghi:

Them dieu kien hoan tat toi thieu:

Backend coding complete khi:

- Source files theo plan da duoc tao/sua.
- `07-backend-coding-summary.md` ton tai.
- Backend build pass, hoac neu khong chay duoc thi summary phai ghi ly do.
- API endpoints/DTO/permissions khop `04-api-contract-review.md`.
- Khong co open blocking issue trong `issues.md`.

Frontend coding complete khi:

- Source files theo plan da duoc tao/sua.
- `08-frontend-coding-summary.md` ton tai.
- Typecheck/lint/build pass, hoac summary ghi ly do khong chay duoc.
- API client usage khop contract.
- UI implementation co mapping den Phase 2 pixel spec.

### 6. Medium - Rule read all files xung dot voi cost optimization/read-minimum rules

Input Folder Rules noi AI phai read va analyze all files trong input folders.

Nhung cac section sau lai yeu cau:

- chi doc config fields can thiet,
- read minimum prior files,
- cost optimization,
- max output concise,
- khong doc qua nhieu context.

Rui ro:

- Folder input lon lam no context.
- Agent mat nhieu token cho file khong lien quan.
- Workflow cham va kho on dinh.

Khuyen nghi:

Doi rule thanh:

```text
AI must inventory all files in input folders.
AI must read all supported and relevant files for the current phase.
Large markdown files must be summarized section-by-section.
Unsupported or skipped files must be recorded in Missing Inputs / Input Notes with reason.
```

### 7. Low - Encoding bi loi mojibake

Nhieu doan tieng Viet va ky tu dac biet hien bi loi encoding, vi du:

```text
Danh má»¥c nhÃ cung cáº¥p
â€”
â†’
```

Rui ro:

- Giam do de doc.
- Co the lam hong exact phrase matching voi cau lenh tieng Viet.
- Tai lieu workflow kem tin cay khi agent trich dan/phat sinh noi dung.

Khuyen nghi:

Chuyen file ve UTF-8 chuan va sua cac chuoi tieng Viet bi mojibake.

## Mo ta ro hon ve viec dong bo phase map

Dong bo phase map nghia la cac noi sau phai cung mo ta mot workflow duy nhat:

1. `fullstack-feature-workflow.md`: master workflow, dinh nghia phase, gate, output file, status.
2. `.claude/skills/*.md`: child skill tuong ung voi tung phase.
3. `CLAUDE.md`: guide tong quan cho agent trong repo.
4. Noi dung ben trong tung child skill: phase number, purpose, input, output, restrictions.
5. Template/status examples neu co: `workflow-status.md`, command docs, usage docs.

Neu chi sua master workflow ma khong sua child skill va `CLAUDE.md`, agent van co the bi keo ve mapping cu.

Mapping dung nen la:

| Phase | Child skill file | Output document |
|---:|---|---|
| 1 | `01-frontend-basic-design.md` | `01-frontend-basic-design.md` |
| 2 | `02-frontend-ui-pixel-analysis.md` | `02-frontend-ui-pixel-analysis.md` |
| 3 | `03-backend-basic-design.md` | `03-backend-basic-design.md` |
| 4 | `04-backend-api-contract-review.md` | `04-api-contract-review.md` |
| 5 | `05-frontend-implementation-plan.md` | `05-frontend-implementation-plan.md` |
| 6 | `06-backend-implementation-plan.md` | `06-backend-implementation-plan.md` |
| 7 | `07-backend-coding.md` | `07-backend-coding-summary.md` |
| 8 | `08-frontend-coding.md` | `08-frontend-coding-summary.md` |
| 9 | `09-frontend-visual-review.md` | `09-frontend-visual-review.md` |
| 10 | `10-backend-testing.md` | `10-backend-test-plan.md` |
| 11 | `11-frontend-testing.md` | `11-frontend-test-plan.md` |
| 12 | `12-integration-testing.md` | `12-integration-test-plan.md` |
| 13 | `13-final-feature-review.md` | `13-final-feature-review.md` |

Checklist dong bo:

- Master phase table dung 13 phase.
- Section `Skill file:` trong master workflow tro dung child skill.
- Ten child skill files khop phase moi.
- Noi dung child skill khop phase number moi.
- Output file trong child skill khop master workflow.
- `CLAUDE.md` cap nhat bang skill files sang 13 phase.
- Cac gate/approval nhac den phase number dung nghia moi.
- `workflow-status.md` template, neu co, dung 13 phase moi.

## Thu tu sua khuyen nghi

1. Sua encoding ve UTF-8 de tranh nham noi dung khi patch.
2. Dong bo phase map giua master workflow, child skills va `CLAUDE.md`.
3. Tao cac child skill con thieu cho Phase 2, Phase 9, Phase 13.
4. Them gate override cho `frontend_only`, `backend_only`, `ui_only`, `bugfix`, `quick_change`.
5. Chuan hoa rule `workflow_mode` missing.
6. Chuan hoa mapping Phase 4 Approval Status sang workflow-status Review Status.
7. Tang dieu kien completion cho Phase 7/8 coding.
8. Dieu chinh input folder rule de vua inventory du file, vua khong doc qua muc can thiet.
