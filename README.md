# Token Query Skill

Jarvis Token Center 查询技能 — 通过 DeepSeek API 获取实时 Token 余额与用量统计，并以 Cyberpunk HUD Dashboard 展示。

同时支持 **Claude Code** 和 **Codex** 两个 AI 编程工具。

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

## 使用方式

### ▶️ 在 Codex 中使用

在聊天中输入触发词（需要已将 skill 导入 Codex）：

- 查询token / 查看token / token状态
- 查看用量 / token余额 / 查token

### ▶️ 在 Claude Code 中使用

将本仓库中的 `CLAUDE.md` 放入你的项目根目录，然后在 Claude Code 中输入：

- 查 token / token 状态 / check token
- 查询用量 / token balance / jarvis 查询

Claude Code 会自动执行工作流：启动服务器 → 查询 API → 格式化展示结果。

### ▶️ 命令行使用（跨平台）

Node.js CLI 工具（可在任何操作系统运行）：

```bash
# 直接查询（需先启动服务器）
node bin/token-query.mjs

# 指定项目路径，自动启动服务器并查询
node bin/token-query.mjs --server /path/to/ai-token-monitor

# 输出原始 JSON
node bin/token-query.mjs --raw
```

Windows PowerShell 快速脚本：

```powershell
# 直接运行
.\scripts\quick-query.ps1
```

## 项目结构

```
token-query/
├── CLAUDE.md              # Claude Code 指令文件
├── SKILL.md               # Codex 技能定义文件
├── README.md              # 本文件
├── bin/
│   └── token-query.mjs    # 跨平台 Node.js CLI 工具
├── scripts/
│   └── quick-query.ps1    # Windows PowerShell 查询脚本
└── assets/                # 素材目录
```

## 兼容性

| 平台/工具      | 支持方式                     |
|---------------|------------------------------|
| Codex (桌面版) | `SKILL.md` 自动加载           |
| Claude Code   | 放置 `CLAUDE.md` 到项目根目录 |
| macOS/Linux   | `bin/token-query.mjs` CLI    |
| Windows       | `scripts/quick-query.ps1`    |

## 数据来源

- 余额数据：`GET https://api.deepseek.com/user/balance`（实时）
- 历史图表：本地 `stats/history.json`（自动积累）
- Dashboard：本机 `localhost:3000`

> 注意：DeepSeek 没有公开账单查询 API，今日消费/月消费等数据可能不可用。

## License

MIT
