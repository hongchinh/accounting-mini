<#
.SYNOPSIS
    Khởi động Brainstorm Visual Companion Server.

.DESCRIPTION
    Chạy brainstorm-server.js và in ra JSON chứa URL + screen_dir + state_dir.
    AI sẽ capture output này để biết nơi viết HTML và đọc events.

.PARAMETER ProjectDir
    Thư mục gốc dự án (mặc định: thư mục hiện tại).
    Mockup files sẽ được lưu vào <ProjectDir>/.superpowers/brainstorm/.

.PARAMETER Host
    Địa chỉ bind (mặc định: localhost). Dùng 0.0.0.0 nếu cần remote access.

.PARAMETER UrlHost
    Hostname in ra trong URL (mặc định: giống Host, hoặc localhost nếu Host là 0.0.0.0).

.EXAMPLE
    # Dùng mặc định — AI capture stdout JSON
    .\scripts\Start-BrainstormServer.ps1

.EXAMPLE
    # Chỉ định thư mục dự án
    .\scripts\Start-BrainstormServer.ps1 -ProjectDir "D:\Projects\AccountingMini"

.NOTES
    Yêu cầu: Node.js 18+
    Server tự tắt sau 30 phút không hoạt động.
    Khi dùng từ Bash tool trong Claude Code (Windows), set run_in_background: true.
#>

[CmdletBinding()]
param(
    [string] $ProjectDir = $PWD.Path,
    [string] $ServerHost = 'localhost',
    [string] $UrlHost    = ''
)

$ErrorActionPreference = 'Stop'

# Verify node exists
try {
    $null = Get-Command node -ErrorAction Stop
} catch {
    Write-Error "Node.js không tìm thấy. Hãy cài Node.js 18+ trước khi dùng Visual Companion."
    exit 1
}

$serverScript = Join-Path $PSScriptRoot "brainstorm-server.js"

if (-not (Test-Path $serverScript)) {
    Write-Error "Không tìm thấy: $serverScript"
    exit 1
}

$nodeArgs = @($serverScript, '--project-dir', $ProjectDir)

if ($ServerHost) { $nodeArgs += '--host', $ServerHost }
if ($UrlHost)    { $nodeArgs += '--url-host', $UrlHost }

# Run node — stdout is the JSON startup message captured by caller
& node @nodeArgs
