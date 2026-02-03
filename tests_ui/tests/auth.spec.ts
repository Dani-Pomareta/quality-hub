import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Authentication Management', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    // 3.1 Smoke: Run always
    test('Login page should load correctly @smoke', async ({ page }) => {
        await expect(page).toHaveTitle(/Restful-booker/);
    });

    // 3.2 Regression: Run on #full or #regression
    test('Should show error with invalid credentials @regression', async ({ page }) => {
        await loginPage.login('wrong_user', 'wrong_pass');
        const errorMsg = page.locator('.alert');
        await expect(errorMsg).toBeVisible();
    });
});