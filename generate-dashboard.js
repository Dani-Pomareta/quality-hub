const fs = require('fs');

const readJSON = (path) => {
    try {
        const data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return { status: "Not Run", stats: {} };
    }
};

const uiResults = readJSON('playwright-report/results.json');
const apiResults = readJSON('api-report.json');
const perfResults = readJSON('k6-summary.json');

// Simple logic to count passes
const uiStatus = uiResults.config ? `Passed: ${uiResults.stats?.expected || 0} / Failed: ${uiResults.stats?.unexpected || 0}` : "Skipped";
const apiStatus = apiResults.summary ? `Passed: ${apiResults.summary.passed || 0}` : "Skipped";
const perfStatus = perfResults.metrics ? `Avg Latency: ${perfResults.metrics.http_req_duration?.values.avg.toFixed(2)}ms` : "Skipped";

const html = `
<html>
<body style="font-family: Arial; padding: 40px;">
    <h1>🏁 Full Quality Gate Results</h1>
    <div style="display: flex; gap: 20px;">
        <div style="border: 1px solid #ccc; padding: 20px; border-radius: 10px; flex: 1;">
            <h3>🖥️ UI Status</h3>
            <p>${uiStatus}</p>
        </div>
        <div style="border: 1px solid #ccc; padding: 20px; border-radius: 10px; flex: 1;">
            <h3>🔌 API Status</h3>
            <p>${apiStatus}</p>
        </div>
        <div style="border: 1px solid #ccc; padding: 20px; border-radius: 10px; flex: 1;">
            <h3>⚡ Perf Status</h3>
            <p>${perfStatus}</p>
        </div>
    </div>
    <br>
    <p>Check GitHub Artifacts for the deep-dive raw data.</p>
</body>
</html>
`;

fs.writeFileSync('dashboard.html', html);