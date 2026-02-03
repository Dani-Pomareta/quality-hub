import { check, sleep } from 'k6';
import { getBookings } from './lib/api.js';
import { standardThresholds } from './config/thresholds.js';
// Import the data
const userData = JSON.parse(open('./data/users.json'));

export const options = {
    // We reuse our SLAs, but we might allow slightly higher latency for stress
    thresholds: {
        ...standardThresholds,
        'http_req_duration': ['p(99)<3000'], // Allow 3s spikes at peak load
    },
    stages: [
        { duration: '30s', target: 20 }, // Ramp up to 20 users
        { duration: '1m', target: 20 },  // Stay at 20 users (Stress point)
        { duration: '30s', target: 50 }, // Push to 50 users (Breaking point?)
        { duration: '1m', target: 50 },  // Soak test
        { duration: '30s', target: 0 },  // Ramp down
    ],
};

export default function () {
    // 1. Simulate a real user thinking/typing
    const res = getBookings();
    
    check(res, {
        'is status 200': (r) => r.status === 200,
        'transaction successful': (r) => !r.error,
    });

    // 2. Pace the requests to mimic human behavior
    // This prevents "DDoS-ing" your own app by accident
    sleep(Math.random() * 3 + 1); 
}