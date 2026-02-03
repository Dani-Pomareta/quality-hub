import http from 'k6/http';
import { check, sleep } from 'k6';
// Use the official k6 jslib for the summary

export const options = {
  vus: 5,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<500'], 
  },
};

export default function smokeLoad () {
  const res = http.get('https://www.saucedemo.com/');
  check(res, { 'status was 200': (r) => r.status === 200 });
  sleep(1);
}

// STABLE SUMMARY HANDLER
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }), // Prints to GitHub Logs
    'k6-summary.json': JSON.stringify(data), // Saves raw data for the bundle
  };
}

// Helper function for the console summary
function textSummary(data, options) {
 // const { indent, enableColors } = options;
  return `k6 Performance Results Summary\n` + 
         `Total Requests: ${data.metrics.http_reqs.values.count}\n` +
         `Failures: ${data.metrics.http_req_failed.values.passes}\n` +
         `Avg Latency: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms`;
}