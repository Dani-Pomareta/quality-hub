import { check, sleep } from 'k6';
import { getBookings, getHealth } from './lib/api.js';
import { standardThresholds } from './config/thresholds.js';

export const options = {
    thresholds: standardThresholds,
    stages: [
        { duration: '10s', target: 5 },  // Ramp-up to 5 users
        { duration: '20s', target: 5 },  // Stay at 5 users
        { duration: '10s', target: 0 },  // Ramp-down
    ],
};

export default function () {
    // 1. Check System Health
    const healthRes = getHealth();
    check(healthRes, {
        'system is up': (r) => r.status === 200,
    });

    // 2. Load Bookings
    const bookingRes = getBookings();
    check(bookingRes, {
        'bookings retrieved': (r) => r.status === 200,
        'response time < 200ms': (r) => r.timings.duration < 200,
    });

    sleep(1);
}