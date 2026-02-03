const fs = require('fs');

const readJSON = (p) => { 
    try { 
        if (!fs.existsSync(p)) return null;
        return JSON.parse(fs.readFileSync(p, 'utf8')); 
    } catch (e) { return null; } 
};

const api = readJSON('api-report.json');
const ui = readJSON('playwright-report/results.json');
const perf = readJSON('k6-summary.json');

const getApiResults = () => api?.tests?.map(t => ({
    name: t.nodeid ? t.nodeid.split('::').pop() : 'Unknown Test',
    status: t.outcome === 'passed' ? '✅ PASS' : '❌ FAIL',
    duration: t.duration ? `${t.duration.toFixed(2)}s` : '0s' // Fixed toFixed error
})) || [];

const getUiResults = () => {
    const results = [];
    if (!ui || !ui.suites) return [];
    ui.suites.forEach(suite => {
        suite.specs.forEach(spec => {
            const result = spec.tests?.[0]?.results?.[0];
            results.push({
                name: spec.title,
                status: result?.status === 'expected' ? '✅ PASS' : '❌ FAIL',
                duration: result ? `${(result.duration / 1000).toFixed(2)}s` : '0s'
            });
        });
    });
    return results;
};

const getPerfMetrics = () => {
    if (!perf || !perf.metrics) return [];
    const m = perf.metrics;
    return [
        { name: 'Avg Latency', value: `${m.http_req_duration?.values.avg.toFixed(2) || 0}ms` },
        { name: 'Success Rate', value: `${((1 - (m.http_req_failed?.values.rate || 0)) * 100).toFixed(0)}%` }
    ];
};

const generateRows = (data) => data.length > 0 ? data.map(item => `
    <tr>
        <td style="padding:12px; border-bottom:1px solid #eee;">${item.name}</td>
        <td style="padding:12px; border-bottom:1px solid #eee;">${item.status || item.value}</td>
        <td style="padding:12px; border-bottom:1px solid #eee;">${item.duration || '-'}</td>
    </tr>`).join('') : '<tr><td colspan="3">No data available</td></tr>';

const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; margin:0; padding:40px; background:#f4f7f6;">
    <h1 style="color:#2c3e50;">🏁 Quality Gate Dashboard</h1>
    <div style="background:white; padding:20px; border-radius:8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom:20px;">
        <h2>🖥️ UI Tests (Playwright)</h2><table style="width:100%; border-collapse:collapse;">${generateRows(getUiResults())}</table>
    </div>
    <div style="background:white; padding:20px; border-radius:8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom:20px;">
        <h2>🔌 API Tests (Pytest)</h2><table style="width:100%; border-collapse:collapse;">${generateRows(getApiResults())}</table>
    </div>
    <div style="background:white; padding:20px; border-radius:8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2>⚡ Performance (k6)</h2><table style="width:100%; border-collapse:collapse;">${generateRows(getPerfMetrics())}</table>
    </div>
</body>
</html>`;

fs.writeFileSync('dashboard.html', html);
console.log("✅ Dashboard generated.");