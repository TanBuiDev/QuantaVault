$ErrorActionPreference = "Stop"

$stateDirectory = Join-Path $env:LOCALAPPDATA "LeetcodeJavaWorkspace"
$pidFile = Join-Path $stateDirectory "dev-server.pid"
$stopped = $false

function Get-RunnerContainerIds {
    $previousPreference = $ErrorActionPreference
    $ErrorActionPreference = "SilentlyContinue"
    try {
        return @(& docker ps -aq --filter "label=leetcode.local-java-runner=true" 2>$null)
    } finally {
        $ErrorActionPreference = $previousPreference
    }
}

function Stop-DockerDesktop {
    $previousPreference = $ErrorActionPreference
    $ErrorActionPreference = "SilentlyContinue"
    try {
        & docker desktop stop 1>$null 2>$null
        return $LASTEXITCODE -eq 0
    } finally {
        $ErrorActionPreference = $previousPreference
    }
}

try {
    if (Test-Path -LiteralPath $pidFile) {
        $serverPid = [int](Get-Content -LiteralPath $pidFile -Raw).Trim()
        if (Get-Process -Id $serverPid -ErrorAction SilentlyContinue) {
            & taskkill.exe /PID $serverPid /T /F *> $null
            $stopped = $LASTEXITCODE -eq 0
        }
        Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
    }

    if (Get-Command docker -ErrorAction SilentlyContinue) {
        $containerIds = Get-RunnerContainerIds
        foreach ($containerId in $containerIds) {
            if ($containerId) {
                & docker rm -f $containerId *> $null
            }
        }

        $dockerProcesses = Get-Process -Name "Docker Desktop", "com.docker.backend" -ErrorAction SilentlyContinue
        if ($dockerProcesses) {
            Write-Host "Dang tat Docker Desktop..."
            $dockerStopped = Stop-DockerDesktop
            if (-not $dockerStopped) {
                throw "Docker Desktop khong the tat tu dong."
            }
        }
    }

    if ($stopped) {
        Write-Host "Da tat du an va Docker Desktop."
    } else {
        Write-Host "Da tat Docker Desktop. Website khong chay hoac khong duoc khoi dong bang KHOI-DONG.bat."
    }
    exit 0
} catch {
    Write-Host "Khong the tat du an: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
