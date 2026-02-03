import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    // Selectors
    private readonly usernameInput = '#username';
    private readonly passwordInput = '#password';
    private readonly loginButton = '#doLogin';

    async navigate() {
        await this.page.goto('/#/admin');
    }

    async login(user: string, pass: string) {
        await this.page.fill(this.usernameInput, user);
        await this.page.fill(this.passwordInput, pass);
        await this.page.click(this.loginButton);
    }
}