$ErrorActionPreference = "Continue"
$API = "http://localhost:3000/api/token"

try {
    $null = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
} catch {
    $project = "E:\Users\admin\Documents\测试\ai-token-monitor"
    Start-Process -WindowStyle Hidden powershell -ArgumentList "-Command cd '$project'; npm run dev"
    Start-Sleep -Seconds 8
}

try {
    $resp = Invoke-WebRequest -Uri $API -UseBasicParsing -TimeoutSec 15
    $body = $resp.Content | ConvertFrom-Json

    if ($body.needsApiKey) {
        Write-Output "needsApiKey=true"
        exit 0
    }

    Write-Output "currentBalance=$($body.currentBalance)"
    Write-Output "remainingTokens=$($body.remainingTokens)"
    Write-Output "weeklyRequests=$($body.weeklyRequests)"
    Write-Output "peakHour=$($body.peakHour)"
    Write-Output "avgLatency=$($body.avgLatency)"
    Write-Output "cacheHit=$($body.cacheHit)"
    Write-Output "ctxUsage=$($body.ctxUsage)"
    Write-Output "balanceChange=$($body.balanceChange)"

    if ($body.healthMetrics) {
        Write-Output "cpuLoad=$($body.healthMetrics.cpuLoad)"
        Write-Output "memoryUsage=$($body.healthMetrics.memoryUsage)"
        Write-Output "requestSuccess=$($body.healthMetrics.requestSuccess)"
    }

    if ($body.dailyHistory) {
        $days = $body.dailyHistory | ForEach-Object { "$($_.dayOfWeek):$($_.tokens)" }
        Write-Output "dailyHistory=$($days -join '|')"
    }
} catch {
    Write-Error "API request failed: $($_.Exception.Message)"
    exit 1
}
