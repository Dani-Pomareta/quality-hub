import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test("Successful Login @smoke @auth", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");

  // Check that we transitioned to the inventory page
  await expect(page).toHaveURL(/.*inventory.html/);
});
