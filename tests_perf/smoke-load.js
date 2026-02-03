import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  console.log('Preparing the breakdown...');
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }), // Show in logs
    'k6-summary.json': JSON.stringify(data), // For data lovers
  };
}

// Helper to make the logs look nice
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

export const options = {
  vus: 5, // 5 concurrent users
  duration: "10s", // short burst for the CI gate
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests must be under 500ms
  },
};

export default function smokeLoad () {
  const res = http.get("https://www.saucedemo.com/");
  check(res, { "status was 200": (r) => r.status === 200 });
  sleep(1);
}
