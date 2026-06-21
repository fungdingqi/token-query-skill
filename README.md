# Token Query Skill

Jarvis Token Center 查询技能 — 通过 DeepSeek API 获取实时 Token 余额与用量统计，并以 Cyberpunk HUD Dashboard 展示。

## 功能

- **实时余额查询** — 调用 `api.deepseek.com/user/balance` 获取当前余额和剩余 Token
- **使用统计** — 7 日请求量、高峰时段、平均延迟、缓存命中率、上下文用量
- **AI 健康评分** — CPU 负载、内存使用、请求成功率
- **7 日趋势图** — 每日 Token 消耗柱状图
- **模型分布** — GPT-5 / Claude / DeepSeek / Gemini 用量占比
- **赛博朋克 Dashboard** — 全屏 HUD 覆盖层（浏览器访问 `localhost:3000`）

## 前置条件

- Node.js 16+
- npm
- DeepSeek API Key（首次使用需在 Dashboard 中配置）

## 安装

### 1. 安装依赖

```bash
cd ai-token-monitor
npm install
```

### 2. 配置 API Key

在浏览器中打开 `http://localhost:3000`，点击「🔵 查看 Token」按钮，输入 DeepSeek API Key 并保存。

## 使用

### 在 Codex 中使用

在聊天中输入触发词：

- 查询token
- 查看token
- token状态
- 查看用量
- token余额
- 查token

### 命令行快速查询

```powershell
# 直接运行 quick-query 脚本
.\scripts\quick-query.ps1
```

## 项目结构

```
token-query/
├── SKILL.md              # Codex 技能定义文件
├── README.md             # 本文件
├── scripts/
│   └── quick-query.ps1   # Windows PowerShell 查询脚本
└── assets/               # 素材目录
```

## 数据来源

- 余额数据：`GET https://api.deepseek.com/user/balance`（实时）
- 历史图表：本地 `stats/history.json`（自动积累）
- Dashboard：本机 `localhost:3000`

> 注意：DeepSeek 没有公开账单查询 API，今日消费/月消费等数据不可用。

## License

MIT
