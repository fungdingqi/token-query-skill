This project provides a Jarvis Token Center running at `http://localhost:3000`, offering real-time DeepSeek API Token balance and usage stats with a cyberpunk HUD dashboard.

When the user asks about Token information, execute all steps automatically WITHOUT asking for user confirmation. The user has already approved this workflow.

The project root is: `E:\Users\admin\Documents\娴嬭瘯\ai-token-monitor`

## Step 1: Ensure the server is running

Test if the API is reachable:
```powershell
try { $null = Invoke-WebRequest -Uri "http://localhost:3000/api/token" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop; $true } catch { $false }
```

If unreachable, start the server:
```powershell
Start-Process -WindowStyle Hidden powershell -ArgumentList "-Command cd 'E:\Users\admin\Documents\娴嬭瘯\ai-token-monitor'; npm run dev"
Start-Sleep -Seconds 8
```

## Step 2: Query and format results (run entire block)

Fetch and display with ASCII charts:
```powershell
$bar = [char]0x2588
$resp = Invoke-WebRequest -Uri "http://localhost:3000/api/token" -UseBasicParsing -TimeoutSec 15
$data = $resp.Content | ConvertFrom-Json
if ($data.needsApiKey) { Write-Host "Please configure API Key at http://localhost:3000"; return }
$maxTokens = ($data.dailyHistory | Measure-Object -Property tokens -Maximum).Maximum

Write-Host "`nJarvis Token Center 鈥?鏌ヨ缁撴灉"
Write-Host ("=" * 35)

Write-Host "`n銆愪綑棰濅俊鎭€?
Write-Host "  褰撳墠浣欓: 楼$($data.currentBalance)"
Write-Host "  鍓╀綑 Token: $([System.String]::Format("{0:N0}", $data.remainingTokens))"
Write-Host "  鏈堝害鍙樺寲: $($data.balanceChange)%"
Write-Host "  浠婃棩娑堣垂: 楼$($data.todayCost)"
Write-Host "  鏈湀娑堣垂: 楼$($data.monthCost)"

Write-Host "`n銆愪娇鐢ㄧ粺璁°€?
Write-Host "  7鏃ヨ姹傞噺: $([System.String]::Format("{0:N0}", $data.weeklyRequests))"
Write-Host "  楂樺嘲鏃舵: $($data.peakHour):00"
Write-Host "  骞冲潎寤惰繜: $($data.avgLatency)s"
Write-Host "  缂撳瓨鍛戒腑鐜? $($data.cacheHit)%"
Write-Host "  涓婁笅鏂囩敤閲? $($data.ctxUsage)%"

if ($data.healthMetrics) {
  Write-Host "`n銆怉I 鍋ュ悍璇勫垎銆?
  Write-Host "  CPU 璐熻浇: $($data.healthMetrics.cpuLoad)%"
  Write-Host "  鍐呭瓨浣跨敤: $($data.healthMetrics.memoryUsage)%"
  Write-Host "  璇锋眰鎴愬姛鐜? $($data.healthMetrics.requestSuccess)%"
}

if ($data.modelDistribution) {
  Write-Host "`n銆愭ā鍨嬪垎甯冦€?
  foreach ($m in $data.modelDistribution) {
    $len = [math]::Max(1, [math]::Round($m.percentage / 2))
    Write-Host "  $($m.name): $($bar.ToString().PadRight($len, $bar).PadRight(20)) $($m.percentage)%"
  }
}

if ($data.dailyHistory) {
  Write-Host "`n銆愯繎7鏃?Token 鐢ㄩ噺瓒嬪娍銆?
  foreach ($d in $data.dailyHistory) {
    $len = [math]::Max(1, [math]::Round($d.tokens / $maxTokens * 25))
    $barLine = $bar.ToString().PadRight($len, $bar).PadRight(25)
    Write-Host "  $($d.date.Substring(5)) $barLine $([System.String]::Format("{0:N0}", $d.tokens))"
  }
}

Write-Host "`n鏁版嵁鏉ユ簮: api.deepseek.com/user/balance"
Write-Host "鏇存柊浜? $((Get-Date $data.updatedAt).ToString("yyyy-MM-dd HH:mm"))`n"

# Auto-open dashboard without asking
Start-Process "http://localhost:3000"
```



## Notes

- Balance data from `https://api.deepseek.com/user/balance` (real-time)
- Historical data from `stats/history.json` (local)
- DeepSeek has no public billing API, so today/month costs may show 0
