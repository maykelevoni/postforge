import { test, expect } from '@playwright/test';

async function signIn(page: any) {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill('test@postforge.dev');
  await page.getByLabel('Password').fill('testpassword123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL((url: URL) => !url.pathname.startsWith('/sign-in'), { timeout: 30000 });
}

// ─── Page Structure ───────────────────────────────────────────────────────────

test.describe('Documents page structure', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.goto('/documents');
  });

  test('page loads with correct heading and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Documents' })).toBeVisible();
    await expect(page.getByText('Generate AI-powered PDFs')).toBeVisible();
  });

  test('Documents nav item is visible in sidebar', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Documents' })).toBeVisible();
  });

  test('Documents nav item navigates to /documents', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Documents' }).click();
    await expect(page).toHaveURL(/\/documents/);
    await expect(page.getByRole('heading', { name: 'Documents' })).toBeVisible();
  });

  test('type selector shows Lead Magnet and Quote buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Lead Magnet' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Quote' })).toBeVisible();
  });

  test('Lead Magnet is selected by default', async ({ page }) => {
    const textarea = page.locator('textarea');
    await expect(textarea).toHaveAttribute('placeholder', /5 ways AI/i);
  });

  test('switching to Quote changes textarea placeholder', async ({ page }) => {
    await page.getByRole('button', { name: 'Quote' }).click();
    const textarea = page.locator('textarea');
    await expect(textarea).toHaveAttribute('placeholder', /AI chatbot/i);
  });

  test('Generate Document button is visible and enabled initially', async ({ page }) => {
    const btn = page.getByRole('button', { name: 'Generate Document' });
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test('right panel shows placeholder text when no content generated', async ({ page }) => {
    await expect(page.getByText('Your document will appear here')).toBeVisible();
  });

  test('Download PDF button is not visible before generation', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Download PDF' })).not.toBeVisible();
  });
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

test.describe('Documents auth protection', () => {
  test('unauthenticated access to /documents redirects to sign-in', async ({ page }) => {
    await page.goto('/documents');
    await page.waitForURL(/sign-in/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });
});

// ─── API ──────────────────────────────────────────────────────────────────────

test.describe('Documents API', () => {
  test('POST /api/documents/generate returns 401 when unauthenticated', async ({ request }) => {
    const response = await request.post('/api/documents/generate', {
      data: { type: 'lead_magnet', prompt: 'test' },
    });
    expect(response.status()).toBe(401);
  });

  test('POST /api/documents/generate returns 400 when type is missing', async ({ request, page }) => {
    // Sign in via browser to get session cookie, then use that context
    await signIn(page);
    const context = page.context();
    const apiRequest = await context.request.post('/api/documents/generate', {
      data: { prompt: 'test prompt' },
    });
    expect(apiRequest.status()).toBe(400);
  });

  test('POST /api/documents/generate returns 400 when prompt is missing', async ({ request, page }) => {
    await signIn(page);
    const context = page.context();
    const apiRequest = await context.request.post('/api/documents/generate', {
      data: { type: 'lead_magnet' },
    });
    expect(apiRequest.status()).toBe(400);
  });
});

// ─── Generation Flow (mocked) ─────────────────────────────────────────────────

test.describe('Documents generation flow', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.goto('/documents');
  });

  test('shows loading state while generating', async ({ page }) => {
    // Intercept to delay response
    await page.route('/api/documents/generate', async (route) => {
      await new Promise((r) => setTimeout(r, 500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          type: 'lead_magnet',
          title: 'Test Lead Magnet',
          subtitle: 'A test subtitle',
          introduction: 'This is the introduction.',
          sections: [{ heading: 'Section 1', body: 'Body of section 1.' }],
          cta: 'Download your free guide now!',
        }),
      });
    });

    await page.locator('textarea').fill('test prompt');
    await page.getByRole('button', { name: 'Generate Document' }).click();

    // Loading state appears
    await expect(page.getByRole('button', { name: 'Generating...' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Generating...' })).toBeDisabled();

    // Wait for completion
    await expect(page.getByRole('button', { name: 'Generate Document' })).toBeVisible({ timeout: 5000 });
  });

  test('renders lead magnet preview after successful generation', async ({ page }) => {
    await page.route('/api/documents/generate', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          type: 'lead_magnet',
          title: '5 Ways AI Saves You Time',
          subtitle: 'A free guide for entrepreneurs',
          introduction: 'AI is changing the way we work.',
          sections: [
            { heading: 'Automate emails', body: 'Use AI to draft emails instantly.' },
            { heading: 'Generate content', body: 'Create posts in seconds.' },
          ],
          cta: 'Start saving time today — download now!',
        }),
      })
    );

    await page.locator('textarea').fill('5 ways AI saves time');
    await page.getByRole('button', { name: 'Generate Document' }).click();

    // Preview appears
    await expect(page.getByText('5 Ways AI Saves You Time')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('A free guide for entrepreneurs')).toBeVisible();
    await expect(page.getByText('Automate emails')).toBeVisible();

    // Download button appears
    await expect(page.getByRole('button', { name: 'Download PDF' })).toBeVisible();
    await expect(page.getByText('Preview')).toBeVisible();
  });

  test('renders quote preview after successful generation', async ({ page }) => {
    await page.route('/api/documents/generate', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          type: 'quote',
          title: 'AI Chatbot for Dental Clinic',
          serviceDescription: 'A custom AI chatbot to handle patient enquiries 24/7.',
          scopeOfWork: ['Requirements gathering', 'Chatbot design', 'Integration'],
          deliverables: ['Deployed chatbot', 'Admin dashboard', 'Training docs'],
          timeline: '2 weeks',
          investment: '$1,200',
          terms: 'Payment 50% upfront, 50% on delivery.',
        }),
      })
    );

    await page.getByRole('button', { name: 'Quote' }).click();
    await page.locator('textarea').fill('AI chatbot for dental clinic');
    await page.getByRole('button', { name: 'Generate Document' }).click();

    // Quote preview appears
    await expect(page.getByText('PROPOSAL')).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('heading', { name: 'AI Chatbot for Dental Clinic' })).toBeVisible();
    await expect(page.getByText('$1,200')).toBeVisible();
    await expect(page.getByText('2 weeks')).toBeVisible();

    // Download button appears
    await expect(page.getByRole('button', { name: 'Download PDF' })).toBeVisible();
  });

  test('shows error message when API returns an error', async ({ page }) => {
    await page.route('/api/documents/generate', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'OpenRouter API key not configured. Please add it in settings.' }),
      })
    );

    await page.locator('textarea').fill('test');
    await page.getByRole('button', { name: 'Generate Document' }).click();

    await expect(
      page.getByText(/OpenRouter API key not configured/i)
    ).toBeVisible({ timeout: 5000 });

    // Download button should NOT appear on error
    await expect(page.getByRole('button', { name: 'Download PDF' })).not.toBeVisible();
  });

  test('clears previous content when generating again', async ({ page }) => {
    // First generation
    await page.route('/api/documents/generate', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          type: 'lead_magnet',
          title: 'First Document',
          subtitle: 'Subtitle',
          introduction: 'Intro.',
          sections: [{ heading: 'Section', body: 'Body.' }],
          cta: 'CTA text',
        }),
      })
    );

    await page.locator('textarea').fill('first prompt');
    await page.getByRole('button', { name: 'Generate Document' }).click();
    await expect(page.getByText('First Document')).toBeVisible({ timeout: 5000 });

    // Second generation — placeholder should reappear during loading
    await page.route('/api/documents/generate', async (route) => {
      await new Promise((r) => setTimeout(r, 300));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          type: 'lead_magnet',
          title: 'Second Document',
          subtitle: 'Subtitle 2',
          introduction: 'Intro 2.',
          sections: [{ heading: 'Section 2', body: 'Body 2.' }],
          cta: 'CTA 2',
        }),
      });
    });

    await page.locator('textarea').fill('second prompt');
    await page.getByRole('button', { name: 'Generate Document' }).click();
    await expect(page.getByText('Second Document')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('First Document')).not.toBeVisible();
  });
});
