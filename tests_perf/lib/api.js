import http from 'k6/http';

export const BASE_URL = 'https://automationintesting.online';

export function getBookings() {
    return http.get(`${BASE_URL}/booking/`);
}

export function getHealth() {
    return http.get(`${BASE_URL}/health/`);
}