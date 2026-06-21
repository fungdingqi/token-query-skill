# Token Query Skill — Claude Code 指令

当用户输入"查 token"、"token 状态"、"查询用量"、"check token"、"token balance"等指令时，执行以下工作流。

## 前置条件

项目路径由用户告知，通常是 `ai-token-monitor` 或自定义路径。
服务器运行在 `http://localhost:3000`。

## 工作流程

### Step 1: 确保服务器运行

```bash
if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null | grep -q 200; then
  PROJECT_DIR="/path/to/ai-token-monitor"  # 替换为实际路径
  
  # macOS/Linux
  cd "$PROJECT_DIR" && npm run dev &
  
  # 等待服务器就绪
  for i in $(seq 1 15); do
    sleep 1
    curl -s -o /dev/null http://localhost:3000 && break
  done
fi
```

> **Windows 用户**：改用 `cd "$PROJECT_DIR"; npm run dev` 在 PowerShell 或 CMD 中启动。

### Step 2: 查询 API

```bash
curl -s http://localhost:3000/api/token
```

如果返回 `{"needsApiKey": true}`，告知用户：请在浏览器打开 http://localhost:3000，点击"🔵 查看 Token"按钮，输入 DeepSeek API Key 并保存，然后重新查询。

### Step 3: 格式化展示结果

将 API 返回的 JSON 格式化为清晰的中文摘要：

```
Jarvis Token Center — 查询结果
═══════════════════════════

【余额信息】
  当前余额: ¥{currentBalance}
  剩余 Token: {remainingTokens}
  月度变化: {balanceChange}%
  今日消费: ¥{todayCost}
  本月消费: ¥{monthCost}

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

【模型分布】
{model bars (■ per 2%)}

【近7日 Token 用量趋势】
{heatmap bars with date + token count}

数据来源: api.deepseek.com/user/balance
更新于: {updatedAt}
```

用 ASCII 柱状图（`█` 字符）展示趋势，每格约 5% 比例。

### Step 4: 提供 Dashboard 入口

告知用户：可在浏览器中打开 http://localhost:3000 查看完整的赛博朋克 HUD Dashboard。

## 触发关键词

- 查 token / 查询 token / 查看 token
- token 状态 / token 余额 / token report
- 查询用量 / 查看用量 / balance check
- check token / token balance
- jarvis token / jarvis 查询

## 注意事项

- 余额数据来自 `GET https://api.deepseek.com/user/balance`（实时）
- 历史图表数据来自 `stats/history.json`（本地自动积累）
- DeepSeek 没有公开账单查询 API，所以今日消费/月消费等数据可能不可用
- 无 API Key 时需用户先通过浏览器配置
- 所有数据通过 API 获取，无需 mock 或随机数
- PowerShell 脚本 `scripts/quick-query.ps1` 可在 Windows 上直接运行
- 跨平台 Node.js CLI 工具 `bin/token-query.mjs` 可在任何环境下使用
