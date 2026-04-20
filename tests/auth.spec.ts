import { test, expect } from '@playwright/test';

test.describe('Auth flows', () => {
  test('register new user', async ({ page }) => {
    const uniqueEmail = `newuser_${Date.now()}@test.dev`;

    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();

    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password').fill('testpassword123');

    await page.getByRole('button', { name: 'Register' }).click();

    // After successful registration, redirects to sign-in
    await page.waitForURL('**/sign-in**');
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });

  test('sign in with credentials', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

    await page.getByLabel('Email').fill('test@postforge.dev');
    await page.getByLabel('Password').fill('testpassword123');

    await page.getByRole('button', { name: 'Sign In' }).click();

    // After successful sign-in, redirects to dashboard root
    await page.waitForURL('http://localhost:3002/');
    await expect(page).toHaveURL('http://localhost:3002/');
  });

  test('redirect to sign-in when accessing / unauthenticated', async ({ page }) => {
    await page.goto('/');

    // Should be redirected to sign-in
    await page.waitForURL('**/sign-in**');
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });
});
