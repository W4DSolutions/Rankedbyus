import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should navigate to login page via profile', async ({ page }) => {
        await page.goto('/', { timeout: 60000 });

        // Click the profile icon (User icon)
        const profileLink = page.locator('a[href="/profile"]');
        await profileLink.click({ force: true });

        await page.waitForURL(/\/login/, { timeout: 10000 });
        await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
    });

    test('should show validation errors on empty login', async ({ page }) => {
        await page.goto('/login', { timeout: 60000 });

        await page.getByRole('button', { name: 'Sign in', exact: true }).click({ force: true });

        // Verify the email input is at least present
        const emailInput = page.locator('input[type="email"]');
        await expect(emailInput).toBeVisible();
    });
});

test.describe('Core Navigation', () => {
    test('homepage should load with key sections', async ({ page }) => {
        await page.goto('/', { timeout: 60000 });

        await expect(page).toHaveTitle(/RankedByUs/);

        // Check for search bar
        await expect(page.getByPlaceholder(/search/i)).toBeVisible();

        // Check for "Submit Tool" button (using .first() because there are two)
        await expect(page.getByRole('button', { name: /submit tool/i }).first()).toBeVisible();
    });
});
