const fs = require('fs');

const readJSON = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return null; } };
const ui = readJSON('playwright-report/results.json');
const api = readJSON('api-report.json');
const perf = readJSON('k6-summary.json');

const buildTable = (title, rows) => `
    <h2 style="border-bottom: 2px solid #eee; padding-top: 20px;">${title}</h2>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr style="background: #f8f9fa; text-align: left;">
            <th style="padding: 10px; border: 1px solid #ddd;">Test Name / Metric</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Result</th>
        </tr>
        ${rows.join('')}
    </table>`;

// Disaggregate UI Tests
const uiRows = ui?.suites?.[0]?.specs?.map(spec => {
    const status = spec.tests[0]?.results[0]?.status;
    const color = status === 'expected' ? 'green' : 'red';
    return `<tr><td style="padding:10px; border:1px solid #ddd;">${spec.title}</td><td style="padding:10px; border:1px solid #ddd; color:${color}; font-weight:bold;">${status}</td></tr>`;
}) || ['<tr><td>No UI Data</td><td>-</td></tr>'];

// Disaggregate API Tests
const apiRows = api?.tests?.map(t => {
    const color = t.outcome === 'passed' ? 'green' : 'red';
    return `<tr><td style="padding:10px; border:1px solid #ddd;">${t.nodeid}</td><td style="padding:10px; border:1px solid #ddd; color:${color}; font-weight:bold;">${t.outcome}</td></tr>`;
}) || ['<tr><td>No API Data</td><td>-</td></tr>'];

// Performance Metrics
const perfRows = perf?.metrics ? [
    `<tr><td>Avg Latency</td><td>${perf.metrics.http_req_duration.values.avg.toFixed(2)}ms</td></tr>`,
    `<tr><td>Max Latency</td><td>${perf.metrics.http_req_duration.values.max.toFixed(2)}ms</td></tr>`,
    `<tr><td>Total Requests</td><td>${perf.metrics.http_reqs.values.count}</td></tr>`
] : ['<tr><td>No Perf Data</td><td>-</td></tr>'];

const html = `
<html>
<body style="font-family: sans-serif; padding: 40px; color: #333;">
    <h1>🚀 Unified Quality Gate Report</h1>
    ${buildTable('🖥️ UI Tests (Playwright)', uiRows)}
    ${buildTable('🔌 API Tests (Pytest)', apiRows)}
    ${buildTable('⚡ Performance (k6)', perfRows)}
</body>
</html>`;

fs.writeFileSync('dashboard.html', html);