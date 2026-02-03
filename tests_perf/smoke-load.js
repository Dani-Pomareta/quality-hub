import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5, // 5 concurrent users
  duration: '10s', // short burst for the CI gate
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must be under 500ms
  },
};

export default function () {
  const res = http.get('https://www.saucedemo.com/');
  check(res, { 'status was 200': (r) => r.status === 200 });
  sleep(1);
}