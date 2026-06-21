---
name: token-query
description: "查询 Jarvis Token Center → 调用 DeepSeek API 获取实时 Token 数据 → 显示赛博朋克 Dashboard"
---

# Jarvis Token Query Skill

当用户输入 "查询token"、"查看token"、"查询令牌"、"check token"、"token状态"、"查看用量"、"token余额"、"查token"、"用量查询" 等指令时调用此 skill。

## 工作流程

1. 确保 Jarvis Token Center 开发服务器在运行
2. 调用 `GET http://localhost:3000/api/token` 获取最新数据
3. 展示格式化结果摘要
4. 在浏览器中打开 Dashboard 查看完整视觉效果

## 前置条件

- 项目路径：`/path/to/ai-token-monitor`
- 开发服务器运行在 `http://localhost:3000`
- API Key 已通过首次配置保存到 `config/deepseek-config.json`

## Step 1: 确保服务器运行

如果服务器未运行，先启动：

```powershell
$project = "/path/to/ai-token-monitor"
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next*dev*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Process -WindowStyle Hidden powershell -ArgumentList "-Command cd '$project'; npm run dev"
Start-Sleep -Seconds 8
```

## Step 2: 查询 API

调用本地 API 获取数据：

```powershell
$resp = Invoke-WebRequest -Uri "http://localhost:3000/api/token" -UseBasicParsing -TimeoutSec 15
$body = $resp.Content | ConvertFrom-Json
```

### 无 API Key 的情况

如果 `$body.needsApiKey` 为 `true`，说明需要先配置 API Key：
- 在浏览器中打开 http://localhost:3000
- 点击 "🔵 查看 Token" 按钮
- 在弹出的对话框中输入 DeepSeek API Key
- 保存后再执行本 skill

## Step 3: 格式化结果

将 API 返回的数据格式化为清晰的中文摘要：

```
Jarvis Token Center — 查询结果
═══════════════════════════

【余额信息】
  当前余额: ¥{currentBalance}
  剩余 Token: {remainingTokens}
  月度变化: {balanceChange}%

【使用统计】
  7日请求量: {weeklyRequests}
  高峰时段: {peakHour}:00
  平均延迟: {avgLatency}s
  缓存命中率: {cacheHit}%
  上下文用量: {ctxUsage}%

【AI 健康评分】
  CPU 负载: {cpuLoad}%
  内存使用: {memoryUsage}%
  请求成功率: {requestSuccess}%

【7日用量趋势】
{7-day heatmap bars}

数据来源: api.deepseek.com/user/balance
更新于: {updatedAt}
```

## Step 4: 浏览器查看完整 Dashboard

在 in-app 浏览器中打开 http://localhost:3000 查看完整的 Cyberpunk HUD Dashboard。

用户可点击 "🔵 查看 Token" 按钮打开全屏 Dashboard 覆盖层。

## 触发关键词

- 查询token
- 查看token
- 查询令牌
- check token
- token状态
- 查看用量
- token余额
- 查token
- 用量查询
- token report
- balance check
- jarvis token
- jarvis 查询

## 注意事项

- 余额数据直接来自 `GET https://api.deepseek.com/user/balance`（实时）
- 历史图表数据来自 `stats/history.json`（本地自动积累）
- DeepSeek 没有公开账单查询 API，所以今日消费/月消费等数据不可用
- Dashboard 使用本机 localhost:3000，浏览器需能访问该地址
- 所有数据通过 API 获取，无需 mock 或随机数


