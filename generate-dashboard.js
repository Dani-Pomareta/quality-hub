const fs = require('fs');

const readJSON = (p) => { 
    try { return JSON.parse(fs.readFileSync(p, 'utf8')); } 
    catch (e) { return null; } 
};

// 1. Data Extraction Logic
const api = readJSON('api-report.json');
const ui = readJSON('playwright-report/results.json');
const perf = readJSON('k6-summary.json');

// 2. Adapter Functions (Task 2.4.1)
const getApiResults = () => api?.tests?.map(t => ({
    name: t.nodeid.split('::').pop(),
    status: t.outcome === 'passed' ? '✅ PASS' : '❌ FAIL',
    duration: `${t.duration.toFixed(2)}s`
})) || [];

const getUiResults = () => {
    const results = [];
    ui?.suites?.forEach(suite => {
        suite.specs.forEach(spec => {
            results.push({
                name: spec.title,
                status: spec.tests[0]?.results[0]?.status === 'expected' ? '✅ PASS' : '❌ FAIL',
                duration: `${(spec.tests[0]?.results[0]?.duration / 1000).toFixed(2)}s`
            });
        });
    });
    return results;
};

const getPerfMetrics = () => perf?.metrics ? [
    { name: 'Avg Latency', value: `${perf.metrics.http_req_duration.values.avg.toFixed(2)}ms` },
    { name: 'P(95) Latency', value: `${perf.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms` },
    { name: 'Success Rate', value: `${(perf.metrics.http_req_failed.values.passes === 0 ? 100 : 0)}%` }
] : [];

// 3. HTML Generation (Simplified for clarity)
const generateRows = (data) => data.map(item => `
    <tr>
        <td style="padding:12px; border-bottom:1px solid #eee;">${item.name || item.name}</td>
        <td style="padding:12px; border-bottom:1px solid #eee;">${item.status || item.value}</td>
        <td style="padding:12px; border-bottom:1px solid #eee;">${item.duration || '-'}</td>
    </tr>`).join('');

const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; margin:0; padding:40px; background:#f4f7f6;">
    <h1 style="color:#2c3e50;">🏁 Quality Gate: Project Unified</h1>
    <div style="background:white; padding:20px; border-radius:8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2>🖥️ UI Tests</h2><table>${generateRows(getUiResults())}</table>
        <h2>🔌 API Tests</h2><table>${generateRows(getApiResults())}</table>
        <h2>⚡ Performance Metrics</h2><table>${generateRows(getPerfMetrics())}</table>
    </div>
</body>
</html>`;

fs.writeFileSync('dashboard.html', html);