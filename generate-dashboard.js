const fs = require('fs');
const path = require('path');

const readJSON = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.log(`Warning: Could not parse ${filePath}`);
    }
    return null;
};

const uiResults = readJSON('playwright-report/results.json');
const apiResults = readJSON('api-report.json');
const perfResults = readJSON('k6-summary.json');

const getStatus = (data, type) => {
    if (!data) return '<span style="color: gray;">Not Run</span>';
    if (type === 'ui') return data.stats?.unexpected > 0 ? `<span style="color: red;">Failed (${data.stats.unexpected})</span>` : '<span style="color: green;">Passed</span>';
    if (type === 'api') return data.exit_code === 0 ? '<span style="color: green;">Passed</span>' : '<span style="color: red;">Failed</span>';
    if (type === 'perf') return data.metrics ? `<span style="color: blue;">Avg: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms</span>` : 'Ran';
    return 'Unknown';
};

const html = `
<html>
<body style="font-family: sans-serif; padding: 30px; line-height: 1.6;">
    <h1 style="color: #333;">🏁 Quality Gate Dashboard</h1>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
        <div style="padding: 20px; border: 2px solid #eee; border-radius: 10px;">
            <h3>🖥️ UI (Playwright)</h3>
            <p>Status: ${getStatus(uiResults, 'ui')}</p>
        </div>
        <div style="padding: 20px; border: 2px solid #eee; border-radius: 10px;">
            <h3>🔌 API (Pytest)</h3>
            <p>Status: ${getStatus(apiResults, 'api')}</p>
        </div>
        <div style="padding: 20px; border: 2px solid #eee; border-radius: 10px;">
            <h3>⚡ Perf (k6)</h3>
            <p>Status: ${getStatus(perfResults, 'perf')}</p>
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync('dashboard.html', html);
console.log("✅ dashboard.html generated successfully.");