import { test, expect } from '@playwright/test';

async function signIn(page: any) {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill('test@postforge.dev');
  await page.getByLabel('Password').fill('testpassword123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('http://localhost:3000/');
}

test.describe('Settings page', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test('navigate to settings page and verify it loads', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    // Verify key sections are visible
    await expect(page.getByRole('heading', { name: 'API Keys' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible();
  });

  test('save an OpenRouter API key', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();

    // Fill in the OpenRouter API key field (it's a password input with label)
    const openRouterInput = page.getByLabel('OpenRouter API Key');
    await openRouterInput.fill('sk-or-test-key-12345');

    // Click Save Changes
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Verify success message appears
    await expect(page.getByText('Settings saved successfully!')).toBeVisible();
  });

  test('toggle gate mode', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();

    // The gate_mode checkbox has an associated label
    const gateCheckbox = page.locator('#gate_mode');
    await expect(gateCheckbox).toBeVisible();

    const initialState = await gateCheckbox.isChecked();

    // Toggle the checkbox
    await gateCheckbox.click();

    const newState = await gateCheckbox.isChecked();
    expect(newState).toBe(!initialState);
  });
});
