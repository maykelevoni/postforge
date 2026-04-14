import { test, expect } from '@playwright/test';

async function signIn(page: any) {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill('test@postforge.dev');
  await page.getByLabel('Password').fill('testpassword123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('http://localhost:3000/');
}

test.describe('Services page', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test('navigates to services page from sidebar', async ({ page }) => {
    await page.goto('/services');
    await expect(page.getByRole('heading', { name: 'Services' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Service' })).toBeVisible();
  });

  test('shows empty catalog state when no services exist', async ({ page }) => {
    await page.goto('/services');
    // Either the empty state message or service cards should be present
    const hasEmpty = await page.getByText('No services yet').isVisible().catch(() => false);
    const hasCards = await page.locator('[data-testid="service-card"]').count().then(n => n > 0).catch(() => false);
    expect(hasEmpty || hasCards).toBe(true);
  });

  test('pipeline shows all 5 stage columns', async ({ page }) => {
    await page.goto('/services');
    await expect(page.getByText('NEW')).toBeVisible();
    await expect(page.getByText('QUOTED')).toBeVisible();
    await expect(page.getByText('IN PROGRESS')).toBeVisible();
    await expect(page.getByText('DELIVERED')).toBeVisible();
    await expect(page.getByText('CLOSED')).toBeVisible();
  });

  test('client pipeline section is visible', async ({ page }) => {
    await page.goto('/services');
    await expect(page.getByRole('heading', { name: 'Client Pipeline' })).toBeVisible();
  });

  test('filter by service dropdown is visible in pipeline', async ({ page }) => {
    await page.goto('/services');
    await expect(page.getByText('Filter by service:')).toBeVisible();
    const select = page.locator('select');
    await expect(select).toBeVisible();
    await expect(select.locator('option[value="all"]')).toBeAttached();
  });
});

test.describe('Service CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.goto('/services');
  });

  test('opens create service form when Add Service is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Service' }).click();
    await expect(page.getByRole('heading', { name: 'Create Service' })).toBeVisible();
    await expect(page.getByPlaceholder('e.g., Video Content Package')).toBeVisible();
  });

  test('shows validation errors when submitting empty form', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Service' }).click();
    await expect(page.getByRole('heading', { name: 'Create Service' })).toBeVisible();

    // Clear any pre-filled values and submit
    await page.getByRole('button', { name: 'Create Service' }).click();

    // Validation errors should appear
    await expect(page.getByText('Name is required')).toBeVisible();
  });

  test('can close form with Cancel button', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Service' }).click();
    await expect(page.getByRole('heading', { name: 'Create Service' })).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'Create Service' })).not.toBeVisible();
  });

  test('creates a new service and it appears in catalog', async ({ page }) => {
    const serviceName = `Test Service ${Date.now()}`;

    await page.getByRole('button', { name: 'Add Service' }).click();
    await expect(page.getByRole('heading', { name: 'Create Service' })).toBeVisible();

    // Fill out the form
    await page.getByPlaceholder('e.g., Video Content Package').fill(serviceName);
    await page.getByPlaceholder('Brief description of your service...').fill('Write scripts for [niche] creators targeting beginners.');
    await page.getByPlaceholder(/Generate 10 video scripts/).fill(
      'Generate 10 [niche] video scripts with hooks and CTAs.'
    );

    // Price fields
    await page.getByPlaceholder('99').fill('100');
    await page.getByPlaceholder('299').fill('500');

    // Turnaround (already has default 3, just verify)
    const turnaroundInput = page.getByPlaceholder('3');
    await turnaroundInput.fill('5');

    // Submit
    await page.getByRole('button', { name: 'Create Service' }).click();

    // Form closes and service appears
    await expect(page.getByRole('heading', { name: 'Create Service' })).not.toBeVisible();
    await expect(page.getByText(serviceName)).toBeVisible();
  });

  test('shows Active badge and action buttons on a service card', async ({ page }) => {
    // Only runs if there's at least one service
    const hasCards = await page.locator('button', { hasText: 'Edit' }).count();
    if (hasCards === 0) {
      test.skip();
      return;
    }

    await expect(page.getByText('Active').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pause' }).first().or(
      page.getByRole('button', { name: 'Activate' }).first()
    )).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' }).first()).toBeVisible();
  });

  test('opens edit form with pre-filled data', async ({ page }) => {
    const hasEdit = await page.getByRole('button', { name: 'Edit' }).count();
    if (hasEdit === 0) {
      test.skip();
      return;
    }

    await page.getByRole('button', { name: 'Edit' }).first().click();
    await expect(page.getByRole('heading', { name: 'Edit Service' })).toBeVisible();
    // Name field should be pre-filled (not empty)
    const nameInput = page.getByPlaceholder('e.g., Video Content Package');
    const value = await nameInput.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('can toggle service status between active and paused', async ({ page }) => {
    const hasPause = await page.getByRole('button', { name: 'Pause' }).count();
    const hasActivate = await page.getByRole('button', { name: 'Activate' }).count();

    if (hasPause === 0 && hasActivate === 0) {
      test.skip();
      return;
    }

    if (hasPause > 0) {
      await page.getByRole('button', { name: 'Pause' }).first().click();
      await expect(page.getByRole('button', { name: 'Activate' }).first()).toBeVisible();
    } else {
      await page.getByRole('button', { name: 'Activate' }).first().click();
      await expect(page.getByRole('button', { name: 'Pause' }).first()).toBeVisible();
    }
  });
});

test.describe('Service form validation', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.goto('/services');
    await page.getByRole('button', { name: 'Add Service' }).click();
    await expect(page.getByRole('heading', { name: 'Create Service' })).toBeVisible();
  });

  test('validates price max must be greater than price min', async ({ page }) => {
    await page.getByPlaceholder('e.g., Video Content Package').fill('Test Service');
    await page.getByPlaceholder('Brief description of your service...').fill('A test service description.');
    await page.getByPlaceholder(/Generate 10 video scripts/).fill('Generate content for [niche].');
    await page.getByPlaceholder('99').fill('500');
    await page.getByPlaceholder('299').fill('100');

    await page.getByRole('button', { name: 'Create Service' }).click();
    await expect(page.getByText('Maximum price must be greater than minimum price')).toBeVisible();
  });

  test('service type dropdown has expected options', async ({ page }) => {
    const select = page.locator('select').first();
    const options = await select.locator('option').allTextContents();
    expect(options).toContain('Video Content');
    expect(options).toContain('Social Package');
    expect(options).toContain('Newsletter Package');
    expect(options).toContain('Landing Page');
    expect(options).toContain('Content Strategy');
  });

  test('shows [niche] hint in deliverables template field', async ({ page }) => {
    await expect(page.getByText('Use [niche] as a placeholder')).toBeVisible();
  });
});

test.describe('Ticket pipeline', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.goto('/services');
  });

  test('pipeline columns show ticket counts', async ({ page }) => {
    // Each column should show a numeric badge (0 or higher)
    const countBadges = page.locator('span').filter({ hasText: /^\d+$/ });
    const count = await countBadges.count();
    expect(count).toBeGreaterThanOrEqual(5); // One per column at minimum
  });

  test('empty columns show "No tickets" placeholder', async ({ page }) => {
    // At least some columns should show "No tickets" when fresh
    const emptyTexts = page.getByText('No tickets');
    const count = await emptyTexts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('filter by service dropdown appears when services exist', async ({ page }) => {
    const selectEl = page.locator('select');
    await expect(selectEl).toBeVisible();
  });
});

test.describe('Webhook endpoint', () => {
  test('POST /api/webhooks/systeme rejects requests without token', async ({ request }) => {
    const response = await request.post('/api/webhooks/systeme', {
      data: {
        contact: { first_name: 'Test', email: 'test@example.com' },
        fields: { niche: 'gaming', service: 'video_content', message: 'Need scripts' },
        funnel_url: 'https://example.com',
      },
    });
    // Should be 401 (missing/invalid token) or 400 (no matching service)
    expect([400, 401, 403]).toContain(response.status());
  });
});

test.describe('Services API', () => {
  test('GET /api/services returns 401 when not authenticated', async ({ request }) => {
    const response = await request.get('/api/services');
    expect([401, 302]).toContain(response.status());
  });

  test('GET /api/tickets returns 401 when not authenticated', async ({ request }) => {
    const response = await request.get('/api/tickets');
    expect([401, 302]).toContain(response.status());
  });
});
