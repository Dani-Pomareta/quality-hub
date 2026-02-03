import { Page } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) {}

    async wait(ms: number) {
        await this.page.waitForTimeout(ms);
    }
}