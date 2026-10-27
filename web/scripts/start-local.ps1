$ErrorActionPreference = "Stop"

$webDirectory = Split-Path -Parent $PSScriptRoot
$stateDirectory = Join-Path $env:LOCALAPPDATA "LeetcodeJavaWorkspace"
$pidFile = Join-Path $stateDirectory "dev-server.pid"
$stdoutLog = Join-Path $stateDirectory "dev-server.log"
$stderrLog = Join-Path $stateDirectory "dev-server-error.log"
$siteUrl = "http://127.0.0.1:3000"
$skipBrowser = $env:LEETCODE_LAUNCHER_NO_BROWSER -eq "1"

New-Item -ItemType Directory -Force -Path $stateDirectory | Out-Null

function Test-DockerEngine {
    $previousPreference = $ErrorActionPreference
    $ErrorActionPreference = "SilentlyContinue"
    try {
        & docker info --format "{{.ServerVersion}}" 1>$null 2>$null
        return $LASTEXITCODE -eq 0
    } finally {
        $ErrorActionPreference = $previousPreference
    }
}

function Test-JavaRunnerImage {
    $previousPreference = $ErrorActionPreference
    $ErrorActionPreference = "SilentlyContinue"
    try {
        & docker image inspect "leetcode-java-runner:25" 1>$null 2>$null
        return $LASTEXITCODE -eq 0
    } finally {
        $ErrorActionPreference = $previousPreference
    }
}

function Wait-ForDockerEngine {
    if (Test-DockerEngine) {
        return
    }

    $dockerDesktop = Join-Path $env:ProgramFiles "Docker\Docker\Docker Desktop.exe"
    if (-not (Test-Path -LiteralPath $dockerDesktop)) {
        throw "Khong tim thay Docker Desktop. Hay cai Docker Desktop truoc khi khoi dong du an."
    }

    Write-Host "Dang khoi dong Docker Desktop..."
    Start-Process -FilePath $dockerDesktop | Out-Null

    $deadline = (Get-Date).AddMinutes(2)
    while ((Get-Date) -lt $deadline) {
        Start-Sleep -Seconds 2
        if (Test-DockerEngine) {
            return
        }
    }

    throw "Docker Engine chua san sang sau 2 phut. Hay mo Docker Desktop va thu lai."
}

function Test-Site {
    try {
        Invoke-WebRequest -Uri $siteUrl -UseBasicParsing -TimeoutSec 2 | Out-Null
        return $true
    } catch {
        return $false
    }
}

try {
    if (Test-Site) {
        Write-Host "Du an dang chay. Dang mo trinh duyet..."
        if (-not $skipBrowser) {
            Start-Process $siteUrl
        }
        exit 0
    }

    Get-Command docker -ErrorAction Stop | Out-Null
    Get-Command npm.cmd -ErrorAction Stop | Out-Null
    Wait-ForDockerEngine

    if (-not (Test-Path -LiteralPath (Join-Path $webDirectory "node_modules\.bin\next.cmd"))) {
        Write-Host "Dang cai dependencies lan dau..."
        & npm.cmd install --prefix $webDirectory
        if ($LASTEXITCODE -ne 0) {
            throw "npm install that bai."
        }
    }

    if (-not (Test-JavaRunnerImage)) {
        Write-Host "Dang tao Java runner image lan dau..."
        & npm.cmd run java:setup --prefix $webDirectory
        if ($LASTEXITCODE -ne 0) {
            throw "Khong the tao Java runner image."
        }
    }

    Remove-Item -LiteralPath $stdoutLog, $stderrLog -Force -ErrorAction SilentlyContinue
    $server = Start-Process -FilePath $env:ComSpec `
        -ArgumentList @("/d", "/c", "npm run dev") `
        -WorkingDirectory $webDirectory `
        -WindowStyle Hidden `
        -RedirectStandardOutput $stdoutLog `
        -RedirectStandardError $stderrLog `
        -PassThru

    Set-Content -LiteralPath $pidFile -Value $server.Id -Encoding ascii
    Write-Host "Dang cho website khoi dong..."

    $deadline = (Get-Date).AddSeconds(45)
    while ((Get-Date) -lt $deadline) {
        Start-Sleep -Seconds 1
        if (Test-Site) {
            Write-Host "Da khoi dong: $siteUrl"
            if (-not $skipBrowser) {
                Start-Process $siteUrl
            }
            exit 0
        }

        if (-not (Get-Process -Id $server.Id -ErrorAction SilentlyContinue)) {
            break
        }
    }

    Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
    Write-Host "Khong the khoi dong website. Nhat ky loi: $stderrLog" -ForegroundColor Red
    if (Test-Path -LiteralPath $stderrLog) {
        Get-Content -LiteralPath $stderrLog -Tail 20
    }
    exit 1
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
