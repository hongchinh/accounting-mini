---
name: workspace-isolation
description: Set up git worktree isolation before Phase 7/8 feature coding for complex features.
---

# Workspace Isolation — Git Worktree

## Role

DevOps / Git Workflow.

---

## Mục đích

Đảm bảo feature work xảy ra trong isolated workspace, bảo vệ branch `main` và work đang in-progress.

Dùng trước khi bắt đầu Phase 7 (Backend Coding) hoặc Phase 8 (Frontend Coding) cho feature phức tạp.

---

## Khi nào nên dùng

| Scenario | Nên dùng worktree? |
|----------|-------------------|
| Feature lớn (workflow_mode: full) | Có — isolate khỏi main |
| Hotfix cần deploy nhanh | Có — không ảnh hưởng feature đang develop |
| Quick change nhỏ | Không cần |
| Chỉ viết docs | Không cần |

---

## Workflow

### Bước 1: Detect existing isolation

```powershell
$gitDir = git rev-parse --git-dir 2>$null
$gitCommon = git rev-parse --git-common-dir 2>$null
```

Nếu `$gitDir != $gitCommon` → đã trong worktree. Skip sang Bước 3.

### Bước 2: Tạo worktree

```powershell
# Đảm bảo .worktrees/ được ignore
$ignored = git check-ignore -q .worktrees 2>$null
if (-not $?) {
    Add-Content .gitignore ".worktrees/"
    git add .gitignore
    git commit -m "chore: ignore .worktrees directory"
}

# Tạo worktree với branch mới
$branchName = "feature/{feature-key}"
git worktree add ".worktrees/$branchName" -b $branchName
Set-Location ".worktrees/$branchName"
```

**Naming convention:**
- Feature: `feature/{feature-key}` (ví dụ: `feature/suppliers`)
- Hotfix: `hotfix/{issue-description}` (ví dụ: `hotfix/tenant-isolation-breach`)
- Experiment: `experiment/{slug}`

### Bước 3: Setup project

```powershell
# Backend dependencies
dotnet restore accounting_api/

# Frontend dependencies
pnpm install --prefix accounting_web/
```

### Bước 4: Verify clean baseline

```powershell
# Backend
dotnet test accounting_api/tests/

# Frontend
pnpm test --run --prefix accounting_web/
```

Nếu tests fail → báo cáo ngay, không tiến hành feature work khi baseline đã broken.

### Bước 5: Báo cáo ready

```
Worktree ready: .worktrees/feature/{feature-key}
Branch: feature/{feature-key}
Backend tests: {n} passed, 0 failed
Frontend tests: {n} passed, 0 failed
Ready to implement: {feature-name}
```

---

## Kết thúc work trong worktree

### Option 1: Merge về main (local)

```powershell
# Từ main repo root
Set-Location $mainRoot
git checkout main
git pull origin main
git merge feature/{feature-key}

# Verify sau merge
dotnet test accounting_api/tests/
pnpm test --run --prefix accounting_web/

# Clean up worktree
git worktree remove ".worktrees/feature/{feature-key}"
git worktree prune
git branch -d feature/{feature-key}
```

### Option 2: Push và tạo PR

```powershell
git push -u origin feature/{feature-key}
gh pr create --title "{Feature Name}" --body "..."
# Giữ worktree để iterate trên PR feedback
```

### Option 3: Discard

Xác nhận bằng cách gõ `discard`:

```powershell
git worktree remove ".worktrees/feature/{feature-key}" --force
git worktree prune
git branch -D feature/{feature-key}
```

---

## Red flags — không bao giờ được làm

- Tạo worktree khi đã đang trong worktree (tạo nested worktrees)
- Bỏ qua verify `.worktrees/` đã được gitignore
- Tiến hành feature work khi baseline tests đang fail
- Xóa worktree trước khi merge thành công
- Merge mà không chạy lại tests sau khi merge

---

## Tích hợp với workflow AccountingMini

- Dùng trước Phase 7 cho feature có `workflow_mode: full`
- Giữ worktree alive trong suốt Phase 7 → 12
- Merge/PR sau Phase 13 Final Feature Review được approve

