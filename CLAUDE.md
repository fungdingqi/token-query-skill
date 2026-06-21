This project provides a Jarvis Token Center at `http://localhost:3000` with real-time DeepSeek API Token stats.

When the user asks about Token information, execute all steps automatically WITHOUT asking for confirmation.

First, detect the OS. Use the appropriate commands below for the detected platform.

The project root path should be provided by the user. If unknown, ask them.

## Step 1: Ensure server is running

Check if localhost:3000 is reachable.

**macOS/Linux:**
```bash
if ! curl -s -o /dev/null http://localhost:3000/api/token 2>/dev/null; then
  cd /path/to/ai-token-monitor && npm run dev &
  sleep 8
fi
```

**Windows:**
```powershell
try { Invoke-WebRequest -Uri "http://localhost:3000/api/token" -TimeoutSec 3 } catch {
  Start-Process -WindowStyle Hidden powershell -Args "-Command cd '/path/to/ai-token-monitor'; npm run dev"
  Start-Sleep 8
}
```

## Step 2: Query and display formatted results with ASCII bar charts

**macOS/Linux (curl + python3):**
```bash
DATA=$(curl -s http://localhost:3000/api/token)
python3 -c "
import sys,json; d=json.load(sys.stdin)
b=d.get('currentBalance',''); t=d.get('remainingTokens',0)
r=d.get('weeklyRequests',0); p=d.get('peakHour','')
l=d.get('avgLatency',''); ca=d.get('cacheHit','')
ch=d.get('balanceChange',''); co=d.get('todayCost',''); mc=d.get('monthCost','')
hm=d.get('healthMetrics',{}); md=d.get('modelDistribution',[]); dh=d.get('dailyHistory',[])
u=d.get('updatedAt','')[:19] or ''

print(); print('Jarvis Token Center - Query Results'); print('='*35)
print(); print('[Balance]')
print(f'  Current: ${b}')
print(f'  Remaining Tokens: {t:,}'); print(f'  Change: {ch}%')
print(f'  Today: ${co}'); print(f'  This Month: ${mc}')
print(); print('[Usage Stats]')
print(f'  7-Day Requests: {r:,}'); print(f'  Peak Hour: {p}:00')
print(f'  Avg Latency: {l}s'); print(f'  Cache Hit: {ca}%')
if hm:
  print(); print('[AI Health]')
  print(f'  CPU: {hm.get("cpuLoad","")}%')
  print(f'  Memory: {hm.get("memoryUsage","")}%')
  print(f'  Success Rate: {hm.get("requestSuccess","")}%')
if md:
  print(); print('[Model Distribution]')
  for x in md:
    n=x['name']; pc=x['percentage']
    b=(chr(9608)*max(1,pc//2)).ljust(20)
    print(f'  {n}: {b} {pc}%')
if dh:
  mt=max(x['tokens'] for x in dh)
  print(); print('[7-Day Token Trend]')
  for x in dh:
    l2=max(1,int(x['tokens']/mt*25))
    bc=chr(9608)*l2
    tl=x['date'][5:]
    print(f'  {tl} {bc.ljust(25)} {x["tokens"]:,}')
print(); print('Source: api.deepseek.com/user/balance')
print(f'Updated: {u}'); print()
" <<< "$DATA"
```

Then open dashboard:
```bash
open http://localhost:3000
```

**Windows (PowerShell):**
```powershell
[char]$bar = 0x2588
$resp = Invoke-WebRequest -Uri "http://localhost:3000/api/token" -UseBasicParsing -TimeoutSec 15
$data = $resp.Content | ConvertFrom-Json
if ($data.needsApiKey) { Write-Host 'Configure Key at http://localhost:3000'; return }
$maxT = ($data.dailyHistory | Measure-Object -Property tokens -Maximum).Maximum

Write-Host "`nJarvis Token Center - Query Results"
Write-Host ("=" * 35)

Write-Host "`n[Balance]"
Write-Host ("  Current: " + $data.currentBalance)
Write-Host ("  Remaining Tokens: " + $data.remainingTokens.ToString('N0'))
Write-Host ("  Change: " + $data.balanceChange + "%")
Write-Host ("  Today: " + $data.todayCost)
Write-Host ("  This Month: " + $data.monthCost)

Write-Host "`n[Usage Stats]"
Write-Host ("  Peak Hour: " + $data.peakHour + ":00")
Write-Host ("  Avg Latency: " + $data.avgLatency + "s")
Write-Host ("  Cache Hit: " + $data.cacheHit + "%")

if ($data.healthMetrics) {
  Write-Host "`n[AI Health]"
  Write-Host ("  CPU: " + $data.healthMetrics.cpuLoad + "%")
  Write-Host ("  Memory: " + $data.healthMetrics.memoryUsage + "%")
  Write-Host ("  Success Rate: " + $data.healthMetrics.requestSuccess + "%")
}

if ($data.modelDistribution) {
  Write-Host "`n[Model Distribution]"
  foreach ($m in $data.modelDistribution) {
    $len = [math]::Max(1, [math]::Round($m.percentage / 2))
    $barLine = $bar.ToString().PadRight($len, $bar).PadRight(20)
    Write-Host ("  " + $m.name + ": " + $barLine + " " + $m.percentage + "%")
  }
}

if ($data.dailyHistory) {
  Write-Host "`n[7-Day Token Trend]"
  foreach ($d in $data.dailyHistory) {
    $len = [math]::Max(1, [math]::Round($d.tokens / $maxT * 25))
    $barLine = $bar.ToString().PadRight($len, $bar).PadRight(25)
    Write-Host ("  " + $d.date.Substring(5) + " " + $barLine + " " + $d.tokens.ToString('N0'))
  }
}

Write-Host "`nSource: api.deepseek.com/user/balance"
$up = (Get-Date $data.updatedAt).ToString('yyyy-MM-dd HH:mm')
Write-Host ("Updated: " + $up + "`n")

# Auto-open dashboard
Start-Process "http://localhost:3000"
```

## Notes

- Balance: `https://api.deepseek.com/user/balance` (real-time)
- History: `stats/history.json` (local)
- DeepSeek has no public billing API
