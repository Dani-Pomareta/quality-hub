import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test('Full Checkout Regression @regression @billing', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const checkout = new CheckoutPage(page);

  // 1. Login
  await login.goto();
  //await login.login('standard_user', 'secret_sauce');
  await login.login('standard_user', 'secret_sauceXX'); // Breaker

  // 2. Inventory Actions
  await inventory.addBackpack();
  await inventory.goToCart();

  // 3. Checkout Flow
  await page.locator('[data-test="checkout"]').click(); // Quick click
  await checkout.fillDetails('FakeName', 'FakeLastName', '123456');
  await checkout.complete();

  // 4. Final Assertion
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});