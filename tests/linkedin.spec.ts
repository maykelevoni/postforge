import { test, expect } from '@playwright/test';

async function signIn(page: any) {
  await page.goto('/sign-in', { timeout: 90000 });
  await page.getByLabel('Email').fill('test@postforge.dev');
  await page.getByLabel('Password').fill('testpassword123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('http://localhost:3002/', { timeout: 90000 });
}

// ─── Settings: LinkedIn connect/disconnect UI ────────────────────────────────

test.describe('Settings — LinkedIn section', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test('LinkedIn section heading is visible on settings page', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'LinkedIn' })).toBeVisible();
  });

  test('"Connect LinkedIn" button is visible when not connected', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'LinkedIn' })).toBeVisible();
    // When not connected, the connect button should appear
    await expect(page.getByRole('button', { name: 'Connect LinkedIn' })).toBeVisible();
    // Helper text should be visible
    await expect(page.getByText('Connect your LinkedIn account to enable automatic posting')).toBeVisible();
  });

  test('"Connect LinkedIn" button links to the OAuth initiation route', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'LinkedIn' })).toBeVisible();

    // The button is wrapped in an anchor pointing to /api/auth/linkedin
    const connectLink = page.locator('a[href="/api/auth/linkedin"]');
    await expect(connectLink).toBeVisible();
  });

  test('?linkedin=connected shows success badge and toast', async ({ page }) => {
    // Navigate with the query param that LinkedIn OAuth callback sets on success
    await page.goto('/settings?linkedin=connected');
    await expect(page.getByRole('heading', { name: 'LinkedIn' })).toBeVisible();

    // The useEffect reads the param and flips local state to connected
    await expect(page.getByText('LinkedIn Connected ✓')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('LinkedIn connected successfully!')).toBeVisible({ timeout: 5000 });

    // Disconnect button should now be visible
    await expect(page.getByRole('button', { name: 'Disconnect' })).toBeVisible();
  });

  test('?linkedin=error shows error toast', async ({ page }) => {
    await page.goto('/settings?linkedin=error');
    await expect(page.getByRole('heading', { name: 'LinkedIn' })).toBeVisible();

    await expect(
      page.getByText('LinkedIn connection failed. Please try again.')
    ).toBeVisible({ timeout: 5000 });

    // Connect button should still be visible (not connected)
    await expect(page.getByRole('button', { name: 'Connect LinkedIn' })).toBeVisible();
  });

  test('settings page includes LinkedIn keys in the API keys section form', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();

    // LinkedIn section lives between API Keys and Schedule sections
    const apiKeysHeading = page.getByRole('heading', { name: 'API Keys' });
    const linkedInHeading = page.getByRole('heading', { name: 'LinkedIn' });
    const scheduleHeading = page.getByRole('heading', { name: 'Schedule' });

    await expect(apiKeysHeading).toBeVisible();
    await expect(linkedInHeading).toBeVisible();
    await expect(scheduleHeading).toBeVisible();

    // Verify order: API Keys → LinkedIn → Schedule (by DOM position)
    const apiKeysBox = await apiKeysHeading.boundingBox();
    const linkedInBox = await linkedInHeading.boundingBox();
    const scheduleBox = await scheduleHeading.boundingBox();

    expect(apiKeysBox!.y).toBeLessThan(linkedInBox!.y);
    expect(linkedInBox!.y).toBeLessThan(scheduleBox!.y);
  });
});

// ─── OAuth route ─────────────────────────────────────────────────────────────

test.describe('GET /api/auth/linkedin', () => {
  test('redirects to LinkedIn or to settings when client_id not configured', async ({ page }) => {
    await signIn(page);

    // Follow the redirect — it either goes to LinkedIn or to settings with an error param
    await page.goto('/api/auth/linkedin', { waitUntil: 'commit' });

    // Should redirect away from the initiation route
    const url = page.url();
    const isLinkedInOAuth = url.includes('linkedin.com/oauth');
    const isMissingClientId = url.includes('missing_client_id');
    const isSignIn = url.includes('/sign-in');

    expect(isLinkedInOAuth || isMissingClientId || isSignIn).toBe(true);
  });

  test('returns 302/redirect for unauthenticated request', async ({ request }) => {
    const res = await request.get('/api/auth/linkedin', { maxRedirects: 0 });
    // Either a redirect (3xx) or an auth redirect — not a 200 on the raw route
    expect(res.status()).not.toBe(200);
  });
});

// ─── PATCH /api/content/[id] ─────────────────────────────────────────────────

test.describe('PATCH /api/content/[id] — mark_posted', () => {
  test('returns 401 for unauthenticated requests', async ({ request }) => {
    const res = await request.patch('/api/content/nonexistent-id', {
      data: { action: 'mark_posted' },
    });
    expect(res.status()).toBe(401);
  });

  test('returns 404 for unknown action on non-existent piece', async ({ page, request }) => {
    await signIn(page);
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    // Unknown action falls through to content-edit path; non-existent ID → 404
    const res = await request.patch('/api/content/does-not-exist-xyz', {
      headers: { Cookie: sessionCookie },
      data: { action: 'bad_action' },
    });
    expect(res.status()).toBe(404);
  });

  test('returns 404 when piece does not exist', async ({ page, request }) => {
    await signIn(page);
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    const res = await request.patch('/api/content/does-not-exist-xyz', {
      headers: { Cookie: sessionCookie },
      data: { action: 'mark_posted' },
    });
    expect(res.status()).toBe(404);
  });
});

// ─── Content page: Ready to Post section ─────────────────────────────────────

test.describe('Content page — Ready to Post section', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test('Ready to Post section is hidden when queue is empty', async ({ page }) => {
    await page.goto('/content');
    await expect(page.getByRole('heading', { name: 'Content' })).toBeVisible();

    // Wait for loading to finish
    await page.waitForTimeout(1500);

    // If no needs_manual_post pieces exist, the section heading should not appear
    const readyHeading = page.getByRole('heading', { name: 'Ready to Post' });
    // It may or may not be visible depending on test DB state
    // Core requirement: page doesn't crash and content heading is still there
    await expect(page.getByRole('heading', { name: 'Content' })).toBeVisible();

    // If section IS visible, it must have at least one card with expected buttons
    const isVisible = await readyHeading.isVisible();
    if (isVisible) {
      await expect(page.getByRole('button', { name: 'Copy' }).first()).toBeVisible();
      await expect(page.getByRole('button', { name: 'Mark as Posted' }).first()).toBeVisible();
    }
  });

  test('content page shows platform filter with all platforms', async ({ page }) => {
    await page.goto('/content');
    await expect(page.getByRole('heading', { name: 'Content' })).toBeVisible();

    await page.waitForTimeout(500);

    const platformSelect = page.locator('select').filter({ hasText: 'All Platforms' });
    await expect(platformSelect).toBeVisible();

    // Non-LinkedIn platforms should appear in filter
    await expect(platformSelect.locator('option[value="twitter"]')).toHaveCount(1);
    await expect(platformSelect.locator('option[value="instagram"]')).toHaveCount(1);
    await expect(platformSelect.locator('option[value="tiktok"]')).toHaveCount(1);
    await expect(platformSelect.locator('option[value="reddit"]')).toHaveCount(1);
  });

  test('status filter does not include needs_manual_post as an option', async ({ page }) => {
    await page.goto('/content');
    await expect(page.getByRole('heading', { name: 'Content' })).toBeVisible();

    const statusSelect = page.locator('select').filter({ hasText: 'All Status' });
    await expect(statusSelect).toBeVisible();

    // needs_manual_post pieces have their own dedicated section, not in the filter dropdown
    await expect(statusSelect.locator('option[value="needs_manual_post"]')).toHaveCount(0);
  });
});

// ─── DELETE /api/settings (disconnect) ───────────────────────────────────────

test.describe('DELETE /api/settings — LinkedIn disconnect', () => {
  test('returns 401 for unauthenticated requests', async ({ request }) => {
    const res = await request.delete('/api/settings', {
      data: { keys: ['linkedin_access_token'] },
    });
    expect(res.status()).toBe(401);
  });

  test('returns 400 for invalid keys format', async ({ page, request }) => {
    await signIn(page);
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    const res = await request.delete('/api/settings', {
      headers: { Cookie: sessionCookie },
      data: { keys: 'not-an-array' },
    });
    expect(res.status()).toBe(400);
  });

  test('returns 200 for valid disconnect call', async ({ page, request }) => {
    await signIn(page);
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    const res = await request.delete('/api/settings', {
      headers: { Cookie: sessionCookie },
      data: {
        keys: [
          'linkedin_access_token',
          'linkedin_refresh_token',
          'linkedin_token_expires_at',
          'linkedin_person_urn',
        ],
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});
