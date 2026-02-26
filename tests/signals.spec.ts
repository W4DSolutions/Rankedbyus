import { test, expect } from '@playwright/test';

test.describe('Signals System (Votes & Reviews)', () => {
    // We'll use wordune as it's a known tool in their local dev
    const TOOL_SLUG = 'wordtune';

    test.beforeEach(async ({ page }) => {
        await page.goto(`/tool/${TOOL_SLUG}`, { timeout: 60000 });
    });

    test('should display initial scores and stats', async ({ page }) => {
        // Alpha Score display
        const alphaScoreLabel = page.getByText(/Alpha Score/i);
        await expect(alphaScoreLabel).toBeVisible();

        const alphaScoreValue = page.locator('div.text-xl.font-black').first();
        await expect(alphaScoreValue).toBeVisible();
        const scoreText = await alphaScoreValue.innerText();
        console.log(`Current Alpha Score: ${scoreText}`);

        // Stars/Rating display
        const ratingLabel = page.getByText(/Intelligence Signals/i);
        await expect(ratingLabel).toBeVisible();
    });

    test('voting system - anonymous upvote', async ({ page }) => {
        // Find VoteButtons container
        const voteContainer = page.locator('div.group\\/vote');
        await expect(voteContainer).toBeVisible();

        const initialVoteText = await voteContainer.locator('div.text-sm').innerText();
        const initialVoteCount = parseInt(initialVoteText.replace(/[^\d-]/g, ''));
        console.log(`Initial Internal Vote Count: ${initialVoteCount}`);

        const upvoteButton = voteContainer.locator('button').first();
        await upvoteButton.click();

        // Since it's anonymous, it might redirect to login IF we haven't enabled anonymous votes
        // But I just fixed VoteButtons.tsx to allow anonymous votes!

        // Wait for optimistic update or API response
        await expect(async () => {
            const newVoteText = await voteContainer.locator('div.text-sm').innerText();
            const newVoteCount = parseInt(newVoteText.replace(/[^\d-]/g, ''));
            expect(newVoteCount).not.toBe(initialVoteCount);
        }).toPass({ timeout: 5000 });

        console.log(`Updated Internal Vote Count: ${await voteContainer.locator('div.text-sm').innerText()}`);
    });

    test('review system - modal interaction', async ({ page }) => {
        // The button text is either "Write Review" or "Sign in to Review"
        const reviewButton = page.locator('button').filter({ hasText: /(Write Review|Sign in to Review)/i });
        await expect(reviewButton).toBeVisible();

        await reviewButton.click();

        // Modal should appear if authorized, or it might be the review modal even for anonymous
        // In current implementation, ReviewModal might require authentication for the POST, 
        // but let's see if the modal even opens.

        const modal = page.locator('div[role="dialog"], div.fixed.inset-0.z-50');
        await expect(modal).toBeVisible({ timeout: 10000 });

        if (await page.getByText(/Identity Verification/i).isVisible()) {
            console.log('Redirected to login within modal or page');
        } else {
            await expect(page.getByText(/Record Signal/i)).toBeVisible();
            await expect(page.locator('textarea')).toBeVisible();
        }
    });

    test('api check - vote endpoint', async ({ request }) => {
        // Test API directly to verify integration
        // We need a valid item_id. 
        // I'll grab one from the page or use a placeholder if I knew it.
        // Let's just verify the endpoint exists and returns 400 for bad input.
        const response = await request.post('/api/vote', {
            data: { item_id: 'invalid-uuid', value: 1 }
        });
        // Should fail due to invalid UUID or other validation
        expect(response.status()).toBeGreaterThanOrEqual(400);
    });
});
