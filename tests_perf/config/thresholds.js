export const standardThresholds = {
    http_req_failed: ['rate<0.01'], // Global: Less than 1% errors
    http_req_duration: ['p(95)<500'], // 95% of requests must be under 500ms
    http_req_duration: ['p(99)<1500'], // 99% of requests must be under 1.5s (Tail latency)
};