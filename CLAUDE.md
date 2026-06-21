This project provides a Jarvis Token Center running at `http://localhost:3000`, offering real-time DeepSeek API Token balance and usage stats with a cyberpunk HUD dashboard.

When the user asks about Token information (phrases like "查 token", "看下余额", "用量怎么样", "token 状态", "check balance", "还剩多少"), follow these steps:

First, ask the user for the path to the Jarvis Token Center project if they haven't provided it.

## Step 1: Ensure the server is running

Check if `http://localhost:3000` is reachable:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

If it returns 200, go to Step 2.
If unreachable, start the server:

```bash
cd /path/to/ai-token-monitor  # Replace with actual path
npm run dev
```

Wait a few seconds for the server to be ready (poll up to 15s).

## Step 2: Query the API

```bash
curl -s http://localhost:3000/api/token
```

If `{"needsApiKey": true}` is returned, ask the user to open http://localhost:3000 in a browser, click the "🔵 查看 Token" button, enter their DeepSeek API Key, save it, and try again.

## Step 3: Format and display the results

Format the JSON response into a clean Chinese summary with ASCII charts:

```text
Jarvis Token Center — 查询结果
═══════════════════════════

【余额信息】
  当前余额: ¥<currentBalance>
  剩余 Token: <remainingTokens>
  月度变化: <balanceChange>%
  今日消费: ¥<todayCost>
  本月消费: ¥<monthCost>

【使用统计】
  7日请求量: <weeklyRequests>
  高峰时段: <peakHour>:00
  平均延迟: <avgLatency>s
  缓存命中率: <cacheHit>%
  上下文用量: <ctxUsage>%

【AI 健康评分】
  CPU 负载: <cpuLoad>%
  内存使用: <memoryUsage>%
  请求成功率: <requestSuccess>%

【模型分布】
<Model bar chart with █ per 2%>

【近 7 日 Token 用量趋势】
<Daily bar chart with █>

Updated from: api.deepseek.com/user/balance
Updated at: <updatedAt>
```

Use Chinese locale number formatting (with thousands separators). Display percentages with % sign.
Use `█` for bar charts: model distribution = █ per 2%, daily trend = scale to fit.

## Step 4: Offer Dashboard link

Tell the user:
> You can view the full cyberpunk HUD dashboard at http://localhost:3000.
> Click the "🔵 查看 Token" button to open the full-screen overlay.

## Notes

- Balance data comes from `https://api.deepseek.com/user/balance` in real-time
- Historical data from `stats/history.json` (accumulated locally)
- DeepSeek doesn't have a public billing API, so today/month costs may show 0
- No API Key configured? User needs to set it via the browser at http://localhost:3000
- Cross-platform CLI available: `node bin/token-query.mjs --server <path>`
- Windows users can also use `scripts/quick-query.ps1`

## Placement

This `CLAUDE.md` must be in your project root (the folder opened in VS Code). Claude Code reads it automatically. Once placed, just say "查 token" and it will work.
