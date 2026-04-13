import { test, expect } from '@playwright/test';

async function signIn(page: any) {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill('test@postforge.dev');
  await page.getByLabel('Password').fill('testpassword123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('http://localhost:3000/');
}

test.describe('Content page', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test('content page loads', async ({ page }) => {
    await page.goto('/content');

    // Verify page heading
    await expect(page.getByRole('heading', { name: 'Content' })).toBeVisible();

    // Verify subtitle
    await expect(page.getByText('Manage your social posts and newsletters')).toBeVisible();
  });

  test('Posts tab is visible and clickable', async ({ page }) => {
    await page.goto('/content');
    await expect(page.getByRole('heading', { name: 'Content' })).toBeVisible();

    // Posts tab should be visible (active by default)
    const postsTab = page.getByRole('button', { name: 'Posts' });
    await expect(postsTab).toBeVisible();

    // Click the tab
    await postsTab.click();

    // Wait for loading to finish
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 5000 });

    // Tab should still be visible and page should not have crashed
    await expect(postsTab).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Content' })).toBeVisible();
  });

  test('filter UI is present on page', async ({ page }) => {
    await page.goto('/content');
    await expect(page.getByRole('heading', { name: 'Content' })).toBeVisible();

    // Wait for loading to complete
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 5000 });

    // The platform filter select (only visible when Posts tab is active)
    const platformSelect = page.locator('select').filter({ hasText: 'All Platforms' });
    await expect(platformSelect).toBeVisible();

    // The status filter select is always visible
    const statusSelect = page.locator('select').filter({ hasText: 'All Status' });
    await expect(statusSelect).toBeVisible();
  });
});
