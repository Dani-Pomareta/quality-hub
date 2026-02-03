const fs = require('fs');

// Basic templates for the tabs
const generateHTML = (uiData, apiData, perfData) => `
<!DOCTYPE html>
<html>
<head>
    <title>Quality Gate Dashboard</title>
    <style>
        body { font-family: sans-serif; background: #f4f7f6; padding: 20px; }
        .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
        .tab { padding: 10px 20px; background: #ddd; cursor: pointer; border-radius: 5px; }
        .tab.active { background: #007bff; color: white; }
        .content { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .hidden { display: none; }
        .pass { color: green; font-weight: bold; }
        .fail { color: red; font-weight: bold; }
    </style>
</head>
<body>
    <h1>🚀 Quality Gate: Unified Report</h1>
    <div class="tabs">
        <div class="tab active" onclick="show('ui')">UI (Playwright)</div>
        <div class="tab" onclick="show('api')">API (Pytest)</div>
        <div class="tab" onclick="show('perf')">Performance (k6)</div>
    </div>

    <div id="ui" class="content">
        <h2>UI Test Results</h2>
        <pre>${uiData}</pre>
    </div>
    <div id="api" class="content hidden">
        <h2>API Test Results</h2>
        <pre>${apiData}</pre>
    </div>
    <div id="perf" class="content hidden">
        <h2>Performance Metrics</h2>
        <pre>${perfData}</pre>
    </div>

    <script>
        function show(id) {
            document.querySelectorAll('.content').forEach(c => c.classList.add('hidden'));
            document.getElementById(id).classList.remove('hidden');
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            event.target.classList.add('active');
        }
    </script>
</body>
</html>
`;

// Helper to read files safely
const read = (path) => fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : "No data found for this run.";

const dashboard = generateHTML(read('playwright-report/results.json'), read('api-report.json'), read('k6-summary.json'));
fs.writeFileSync('dashboard.html', dashboard);