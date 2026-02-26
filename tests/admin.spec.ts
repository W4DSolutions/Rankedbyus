import { test, expect } from '@playwright/test';

// Tactical Admin Verification Suite
test.describe('Admin Command Center', () => {
    test.slow(); // Increase timeout for cold starts

    test.beforeEach(async ({ page, context }) => {
        // Mocking the Admin Session via tactical cookie injection
        await context.addCookies([
            {
                name: 'admin_session',
                value: 'authenticated',
                domain: 'localhost',
                path: '/',
            }
        ]);

        // Verify cookie injection
        const cookies = await context.cookies();
        const adminCookie = cookies.find(c => c.name === 'admin_session');
        if (!adminCookie) throw new Error("Failed to inject admin session");
    });

    test('should render the dashboard with operational metrics', async ({ page }) => {
        page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

        // 1. Mission Start: Navigate to Admin Portal
        await page.goto('/admin');
        await page.waitForTimeout(2000); // Give it a sec to load client components

        await page.screenshot({ path: 'admin-dashboard-debug.png' });

        // 2. Identify Command Center Header
        await expect(page.getByRole('heading', { name: /command center/i })).toBeVisible();

        // 3. Verify Tactical Metrics are visible (Awaiting Audit, Moderation, Registry Total)
        await expect(page.getByText(/awaiting audit/i)).toBeVisible();
        await expect(page.getByText(/moderation/i).first()).toBeVisible();
        await expect(page.getByText(/registry total/i)).toBeVisible();
        await expect(page.getByText(/financial overview/i)).toBeVisible();

        // 4. Verify Analytics Chart exists
        await expect(page.locator('svg').first()).toBeVisible();
    });

    test('should display asset ingress queue and signal moderation', async ({ page }) => {
        await page.goto('/admin');

        // 1. Check Asset Ingress section
        await expect(page.getByText(/asset ingress/i)).toBeVisible();

        // 2. Check Signal Moderation section
        await expect(page.getByText(/signal moderation/i)).toBeVisible();
    });
});
