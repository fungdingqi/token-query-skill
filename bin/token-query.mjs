#!/usr/bin/env node

/**
 * Token Query CLI — 跨平台 Token 余额查询工具
 * 支持 macOS / Linux / Windows
 *
 * 用法:
 *   node bin/token-query.mjs               查询 Token 数据（自动启动服务器）
 *   node bin/token-query.mjs --server PATH 指定项目路径启动服务器并查询
 *   node bin/token-query.mjs --raw         输出原始 JSON
 */

const API_URL = 'http://localhost:3000';
const TOKEN_API = `${API_URL}/api/token`;

// ── 格式化 ──────────────────────────────────────────────
function fmt(n) {
  if (n == null) return 'N/A';
  return Number(n).toLocaleString();
}

function fmtPct(n) {
  if (n == null) return 'N/A';
  return Number(n).toFixed(1) + '%';
}

function fmtYuan(n) {
  if (n == null) return 'N/A';
  return '¥' + Number(n).toFixed(2);
}

const BAR = '█';

function barChart(value, maxValue, length = 25) {
  const l = Math.round((value / maxValue) * length);
  return BAR.repeat(l).padEnd(length);
}

function formatOutput(data) {
  const lines = [];
  lines.push('');
  lines.push('Jarvis Token Center — 查询结果');
  lines.push('═══════════════════════════════════════');
  lines.push('');
  lines.push('【余额信息】');
  lines.push(`  当前余额: ${fmtYuan(data.currentBalance)}`);
  lines.push(`  剩余 Token: ${fmt(data.remainingTokens)}`);
  lines.push(`  月度变化: ${fmtPct(data.balanceChange)}`);
  lines.push(`  今日消费: ${fmtYuan(data.todayCost)}`);
  lines.push(`  本月消费: ${fmtYuan(data.monthCost)}`);
  lines.push('');
  lines.push('【使用统计】');
  lines.push(`  7日请求量: ${fmt(data.weeklyRequests)}`);
  lines.push(`  高峰时段: ${data.peakHour}:00`);
  lines.push(`  平均延迟: ${data.avgLatency}s`);
  lines.push(`  缓存命中率: ${fmtPct(data.cacheHit)}`);
  lines.push(`  上下文用量: ${fmtPct(data.ctxUsage)}`);
  lines.push('');

  if (data.healthMetrics) {
    lines.push('【AI 健康评分】');
    lines.push(`  CPU 负载: ${fmtPct(data.healthMetrics.cpuLoad)}`);
    lines.push(`  内存使用: ${fmtPct(data.healthMetrics.memoryUsage)}`);
    lines.push(`  请求成功率: ${fmtPct(data.healthMetrics.requestSuccess)}`);
    lines.push('');
  }

  if (data.modelDistribution && data.modelDistribution.length) {
    lines.push('【模型分布】');
    for (const m of data.modelDistribution) {
      const barLen = Math.round(m.percentage / 2);
      lines.push(`  ${m.name}: ${BAR.repeat(barLen).padEnd(20)} ${m.percentage}%`);
    }
    lines.push('');
  }

  if (data.dailyHistory && data.dailyHistory.length) {
    const maxTokens = Math.max(...data.dailyHistory.map(d => d.tokens));
    lines.push('【近7日 Token 用量趋势】');
    for (const d of data.dailyHistory) {
      const dateLabel = d.date ? d.date.slice(5) : d.dayOfWeek;
      const bar = barChart(d.tokens, maxTokens);
      lines.push(`  ${dateLabel} ${bar} ${fmt(d.tokens)} (${fmt(d.requests)} req)`);
    }
    lines.push('');
  }

  lines.push('数据来源: api.deepseek.com/user/balance');
  if (data.updatedAt) {
    const d = new Date(data.updatedAt);
    lines.push(`更新于: ${d.toLocaleString('zh-CN')}`);
  }
  lines.push('');

  return lines.join('\n');
}

// ── 服务器检查 ──────────────────────────────────────────
async function isServerRunning() {
  try {
    const resp = await fetch(API_URL, { signal: AbortSignal.timeout(2000) });
    return resp.ok;
  } catch {
    return false;
  }
}

async function startServer(projectDir) {
  const { spawn } = await import('child_process');
  const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, ['next', 'dev'], {
      cwd: projectDir,
      stdio: 'ignore',
      detached: true,
      shell: true,
    });
    proc.unref();

    // Poll until server is up
    const start = Date.now();
    const poll = setInterval(async () => {
      if (await isServerRunning()) {
        clearInterval(poll);
        resolve();
      }
      if (Date.now() - start > 20000) {
        clearInterval(poll);
        reject(new Error('Server start timeout (20s)'));
      }
    }, 1000);
  });
}

// ── 主流程 ──────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const rawMode = args.includes('--raw');

  // 查找 --server 参数
  const serverIdx = args.indexOf('--server');
  const projectDir = serverIdx >= 0 && args[serverIdx + 1]
    ? args[serverIdx + 1]
    : null;

  // 确保服务器运行
  if (!(await isServerRunning())) {
    if (projectDir) {
      console.error('⏳ 正在启动 Token Center 服务器...');
      try {
        await startServer(projectDir);
      } catch (e) {
        console.error('❌ 启动服务器失败:', e.message);
        process.exit(1);
      }
    } else {
      console.error('❌ 服务器未运行在 localhost:3000');
      console.error('   请先启动项目，或使用 --server PATH 指定项目路径');
      process.exit(1);
    }
  }

  // 查询 API
  try {
    const resp = await fetch(TOKEN_API, { signal: AbortSignal.timeout(15000) });
    const data = await resp.json();

    if (data.needsApiKey) {
      console.error('⚠️  需要配置 DeepSeek API Key');
      console.error('   请在浏览器中打开 http://localhost:3000');
      console.error('   点击 "🔵 查看 Token" 按钮输入 Key 并保存');
      process.exit(1);
    }

    if (rawMode) {
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log(formatOutput(data));
    }
  } catch (e) {
    console.error('❌ 查询失败:', e.message);
    process.exit(1);
  }
}

main();
