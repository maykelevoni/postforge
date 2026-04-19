import { test, expect } from '@playwright/test';

async function signIn(page: any) {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill('test@postforge.dev');
  await page.getByLabel('Password').fill('testpassword123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL((url: URL) => !url.pathname.startsWith('/sign-in'), { timeout: 60000 });
}

// ─── Landing Pages API — auth protection ─────────────────────────────────────

test.describe('Landing Pages API auth', () => {
  test('GET /api/landing-pages returns 401 when unauthenticated', async ({ request }) => {
    const res = await request.get('/api/landing-pages');
    expect(res.status()).toBe(401);
  });

  test('POST /api/landing-pages returns 401 when unauthenticated', async ({ request }) => {
    const res = await request.post('/api/landing-pages', {
      data: { serviceId: 'any', template: 'saas' },
    });
    expect(res.status()).toBe(401);
  });

  test('PATCH /api/landing-pages/[id] returns 401 when unauthenticated', async ({ request }) => {
    const res = await request.patch('/api/landing-pages/nonexistent-id', {
      data: { status: 'published' },
    });
    expect(res.status()).toBe(401);
  });

  test('DELETE /api/landing-pages/[id] returns 401 when unauthenticated', async ({ request }) => {
    const res = await request.delete('/api/landing-pages/nonexistent-id');
    expect(res.status()).toBe(401);
  });
});

// ─── Landing Pages API — validation ──────────────────────────────────────────

test.describe('Landing Pages API validation', () => {
  test('POST /api/landing-pages returns 400 when serviceId is missing', async ({ page, request }) => {
    await signIn(page);
    const ctx = page.context();
    const res = await ctx.request.post('/api/landing-pages', {
      data: { template: 'saas' },
    });
    expect(res.status()).toBe(400);
  });

  test('POST /api/landing-pages returns 400 when template is missing', async ({ page }) => {
    await signIn(page);
    const ctx = page.context();
    const res = await ctx.request.post('/api/landing-pages', {
      data: { serviceId: 'some-service-id' },
    });
    expect(res.status()).toBe(400);
  });

  test('POST /api/landing-pages returns 404 for non-existent serviceId', async ({ page }) => {
    await signIn(page);
    const ctx = page.context();
    const res = await ctx.request.post('/api/landing-pages', {
      data: { serviceId: 'does-not-exist', template: 'saas' },
    });
    expect(res.status()).toBe(404);
  });

  test('PATCH /api/landing-pages/[id] returns 404 for non-existent landing page', async ({ page }) => {
    await signIn(page);
    const ctx = page.context();
    const res = await ctx.request.patch('/api/landing-pages/does-not-exist', {
      data: { status: 'published' },
    });
    expect(res.status()).toBe(404);
  });

  test('DELETE /api/landing-pages/[id] returns 404 for non-existent landing page', async ({ page }) => {
    await signIn(page);
    const ctx = page.context();
    const res = await ctx.request.delete('/api/landing-pages/does-not-exist');
    expect(res.status()).toBe(404);
  });
});

// ─── Lead Webhook ─────────────────────────────────────────────────────────────

test.describe('Lead webhook /api/webhooks/lead', () => {
  test('returns 400 when name is missing', async ({ request }) => {
    const res = await request.post('/api/webhooks/lead', {
      data: { email: 'test@example.com', landingPageId: 'some-id' },
    });
    expect(res.status()).toBe(400);
  });

  test('returns 400 when email is missing', async ({ request }) => {
    const res = await request.post('/api/webhooks/lead', {
      data: { name: 'Test User', landingPageId: 'some-id' },
    });
    expect(res.status()).toBe(400);
  });

  test('returns 400 when landingPageId is missing', async ({ request }) => {
    const res = await request.post('/api/webhooks/lead', {
      data: { name: 'Test User', email: 'test@example.com' },
    });
    expect(res.status()).toBe(400);
  });

  test('returns 404 when landingPageId does not exist', async ({ request }) => {
    const res = await request.post('/api/webhooks/lead', {
      data: {
        name: 'Test User',
        email: 'test@example.com',
        landingPageId: 'nonexistent-landing-page-id',
      },
    });
    expect(res.status()).toBe(404);
  });

  test('returns 400 with empty body', async ({ request }) => {
    const res = await request.post('/api/webhooks/lead', { data: {} });
    expect(res.status()).toBe(400);
  });
});

// ─── Subscribers API — auth protection ───────────────────────────────────────

test.describe('Subscribers API auth', () => {
  test('GET /api/subscribers returns 401 when unauthenticated', async ({ request }) => {
    const res = await request.get('/api/subscribers');
    expect(res.status()).toBe(401);
  });

  test('GET /api/subscribers/export returns 401 when unauthenticated', async ({ request }) => {
    const res = await request.get('/api/subscribers/export');
    expect(res.status()).toBe(401);
  });
});

// ─── Subscribers API — authenticated responses ────────────────────────────────

test.describe('Subscribers API authenticated', () => {
  test('GET /api/subscribers returns array when authenticated', async ({ page }) => {
    await signIn(page);
    const ctx = page.context();
    const res = await ctx.request.get('/api/subscribers');
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('GET /api/subscribers/export returns CSV when authenticated', async ({ page }) => {
    await signIn(page);
    const ctx = page.context();
    const res = await ctx.request.get('/api/subscribers/export');
    expect(res.status()).toBe(200);
    const contentType = res.headers()['content-type'];
    expect(contentType).toContain('text/csv');
    const body = await res.text();
    // CSV must contain header row
    expect(body).toContain('Name,Email,Source,Landing Page,Service,Date Joined');
  });

  test('GET /api/landing-pages returns array when authenticated', async ({ page }) => {
    await signIn(page);
    const ctx = page.context();
    const res = await ctx.request.get('/api/landing-pages');
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

// ─── Landing page renderer /l/[slug] ─────────────────────────────────────────

test.describe('Landing page renderer', () => {
  test('returns 404 for a nonexistent slug', async ({ page }) => {
    const res = await page.goto('/l/this-slug-does-not-exist-abc123');
    // Next.js notFound() returns 404
    expect(res?.status()).toBe(404);
  });

  test('non-existent landing page shows 404 UI', async ({ page }) => {
    await page.goto('/l/totally-invalid-slug-xyz');
    // Next.js default 404 page or custom 404 — either way status is 404
    const title = await page.title();
    // page title should contain "404" or "Not Found"
    expect(title.toLowerCase()).toMatch(/404|not found/);
  });
});

// ─── Subscribers page — auth & structure ─────────────────────────────────────

test.describe('Subscribers page auth', () => {
  test('unauthenticated access redirects to sign-in', async ({ page }) => {
    await page.goto('/subscribers');
    await page.waitForURL(/sign-in/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });
});

test.describe('Subscribers page structure', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.goto('/subscribers');
  });

  test('page loads with Subscribers heading', async ({ page }) => {
    // h1 only renders after the subscriber API fetch completes (async)
    await expect(page.getByRole('heading', { name: 'Subscribers' })).toBeVisible({ timeout: 15000 });
  });

  test('Export CSV button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Export CSV/i })).toBeVisible();
  });

  test('Landing Page filter dropdown is visible', async ({ page }) => {
    await expect(page.getByText('Landing Page:')).toBeVisible();
  });

  test('Service filter dropdown is visible', async ({ page }) => {
    await expect(page.getByText('Service:')).toBeVisible();
  });

  test('shows empty state or subscriber rows', async ({ page }) => {
    // Wait for async loading to finish before checking content
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 15000 });
    // Either shows "No subscribers yet" or a table with rows
    const isEmpty = await page.getByText('No subscribers yet').isVisible().catch(() => false);
    const hasTable = await page.locator('table').isVisible().catch(() => false);
    expect(isEmpty || hasTable).toBe(true);
  });

  test('table has correct column headers when subscribers exist', async ({ page }) => {
    // Wait for async loading to finish first
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 15000 });
    const hasTable = await page.locator('table').isVisible().catch(() => false);
    if (!hasTable) {
      test.skip();
      return;
    }
    await expect(page.getByText('Name', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Email', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Landing Page', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Service', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Date Joined', { exact: true }).first()).toBeVisible();
  });

  test('Subscribers nav item is visible in sidebar', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Subscribers' })).toBeVisible();
  });

  test('Subscribers nav item navigates to /subscribers', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Subscribers' }).click();
    await expect(page).toHaveURL(/\/subscribers/);
    await expect(page.getByRole('heading', { name: 'Subscribers' })).toBeVisible();
  });
});

// ─── Settings page — Resend fields ───────────────────────────────────────────

test.describe('Settings page — Resend integration', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.goto('/settings');
  });

  test('Resend API Key field is visible', async ({ page }) => {
    await expect(page.locator('#resend_api_key')).toBeVisible();
  });

  test('Resend From Email field is visible', async ({ page }) => {
    await expect(page.locator('#resend_from_email')).toBeVisible();
  });

  test('no Systeme.io fields are present', async ({ page }) => {
    await expect(page.locator('#systeme_api_key')).not.toBeAttached();
    await expect(page.locator('#systeme_domain')).not.toBeAttached();
    await expect(page.locator('#systeme_funnel_url')).not.toBeAttached();
  });

  test('API Keys section heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'API Keys' })).toBeVisible();
  });
});

// ─── Services page — Landing page button & modal ─────────────────────────────

test.describe('Services page — landing page integration', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.goto('/services');
  });

  test('services page still loads correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Services' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: 'Add Service' })).toBeVisible({ timeout: 15000 });
  });

  test('Landing Page button is visible on service cards (if services exist)', async ({ page }) => {
    // Wait for async service load to finish
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 15000 });
    const hasCards = await page.getByRole('button', { name: /Generate Landing Page/i }).count();
    if (hasCards === 0) {
      test.skip();
      return;
    }
    await expect(page.getByRole('button', { name: /Generate Landing Page/i }).first()).toBeVisible();
  });

  test('landing page modal opens and shows 3 templates', async ({ page }) => {
    // Wait for async service load to finish
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 15000 });
    const lpButton = page.getByRole('button', { name: /Generate Landing Page/i }).first();
    const hasButton = await lpButton.isVisible().catch(() => false);
    if (!hasButton) {
      test.skip();
      return;
    }

    await lpButton.click();

    // Modal should show the 3 templates
    await expect(page.getByText('SaaS', { exact: true })).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Service', { exact: true })).toBeVisible();
    await expect(page.getByText('Lead Magnet', { exact: true })).toBeVisible();
  });
});

// ─── Lead webhook rate limiting ───────────────────────────────────────────────

test.describe('Lead webhook rate limiting', () => {
  test('returns 429 after 5 requests from the same IP within 60s', async ({ request }) => {
    const payload = {
      name: 'Rate Test',
      email: 'ratetest@example.com',
      landingPageId: 'nonexistent-rate-limit-test-id',
    };

    // Fire 5 requests — all should pass rate limit (and return 404 for unknown page)
    for (let i = 0; i < 5; i++) {
      const res = await request.post('/api/webhooks/lead', { data: payload });
      expect(res.status()).not.toBe(429);
    }

    // 6th request — should be rate limited
    const res = await request.post('/api/webhooks/lead', { data: payload });
    expect(res.status()).toBe(429);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });
});

// ─── Lead form UI — mocked ─────────────────────────────────────────────────

test.describe('Lead form UI', () => {
  test('form shows success state when submission succeeds', async ({ page }) => {
    // Intercept to return a published landing page response for an arbitrary slug
    // We test the lead-form component directly via a mocked landing page page
    await page.route('/api/webhooks/lead', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ received: true }),
      })
    );

    // Navigate to a real landing page — if none exists, use a mocked HTML page
    await page.goto('/l/test-service-playwright-abc1');

    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByRole('button', { name: 'Get Started' }).click();

    await expect(page.getByText("You're in!")).toBeVisible({ timeout: 5000 });
  });

  test('form shows duplicate state when submission is a duplicate', async ({ page }) => {
    await page.route('/api/webhooks/lead', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ duplicate: true }),
      })
    );

    await page.goto('/l/test-service-playwright-abc1');
    const is404 = await page.getByText('404').isVisible().catch(() => false);
    if (is404) {
      test.skip();
      return;
    }

    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByRole('button', { name: 'Get Started' }).click();

    await expect(page.getByText('Already subscribed')).toBeVisible({ timeout: 5000 });
  });
});
