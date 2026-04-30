import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function signIn(page: any) {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill('test@postforge.dev');
  await page.getByLabel('Password').fill('testpassword123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('http://localhost:3002/');
}

// ---------------------------------------------------------------------------
// HoverDeleteButton UI behaviour (isolated component test via Research page)
// We mock the DELETE /api/research/[id] call so no real DB data is required.
// ---------------------------------------------------------------------------

test.describe('HoverDeleteButton UX', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test('trash icon is visible and clicking shows inline confirm state', async ({ page }) => {
    // Intercept the list fetch so we always have one topic regardless of DB state.
    await page.route('**/api/research?**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'test-topic-001',
            title: 'Playwright Test Topic',
            summary: 'A test research topic for Playwright.',
            source: 'YouTube',
            url: 'https://example.com',
            status: 'new',
            score: 8,
            createdAt: new Date().toISOString(),
            views: 1000,
            likes: 50,
            comments: 10,
            upvotes: null,
            upvoteRatio: null,
          },
        ]),
      });
    });

    // Stub the DELETE so it succeeds without hitting the DB.
    await page.route('**/api/research/test-topic-001', async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/research');
    await expect(page.getByRole('heading', { name: 'Research' })).toBeVisible();

    // Wait for loading to finish.
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 });

    // The topic card should be rendered.
    await expect(page.getByText('Playwright Test Topic')).toBeVisible();

    // The HoverDeleteButton renders a Trash2 SVG inside a <span>.
    // Hover over the topic card area to make the delete button accessible.
    const topicCard = page.locator('text=Playwright Test Topic').first();
    await topicCard.hover();

    // The trash icon span should be present (it's always in the DOM, just low-opacity).
    // We locate it by the SVG inside it (lucide Trash2 uses a specific path).
    const trashBtn = page.locator('span').filter({ has: page.locator('svg') }).last();
    await expect(trashBtn).toBeVisible();

    // Click the trash icon → confirm state should appear.
    await trashBtn.click();

    // The confirm state shows "Delete?" text and Cancel / Delete buttons.
    await expect(page.getByText('Delete?')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
  });

  test('Cancel button resets to trash icon state', async ({ page }) => {
    await page.route('**/api/research?**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'test-topic-002',
            title: 'Cancel Test Topic',
            summary: 'Testing cancel behaviour.',
            source: 'Reddit',
            url: 'https://reddit.com/r/test',
            status: 'new',
            score: 5,
            createdAt: new Date().toISOString(),
            views: null,
            likes: null,
            comments: null,
            upvotes: 200,
            upvoteRatio: 0.95,
          },
        ]),
      });
    });

    await page.goto('/research');
    await expect(page.getByRole('heading', { name: 'Research' })).toBeVisible();
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Cancel Test Topic')).toBeVisible();

    const topicCard = page.locator('text=Cancel Test Topic').first();
    await topicCard.hover();

    const trashBtn = page.locator('span').filter({ has: page.locator('svg') }).last();
    await trashBtn.click();

    // Confirm state is showing.
    await expect(page.getByText('Delete?')).toBeVisible();

    // Click Cancel.
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Confirm state should disappear; "Delete?" text gone.
    await expect(page.getByText('Delete?')).not.toBeVisible();

    // Topic card still present.
    await expect(page.getByText('Cancel Test Topic')).toBeVisible();
  });

  test('Delete button calls API and removes the item', async ({ page }) => {
    let deleteWasCalled = false;

    await page.route('**/api/research?**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'test-topic-003',
            title: 'Delete Me Topic',
            summary: 'This topic should be deleted.',
            source: 'News',
            url: 'https://news.example.com',
            status: 'new',
            score: 3,
            createdAt: new Date().toISOString(),
            views: null,
            likes: null,
            comments: null,
            upvotes: null,
            upvoteRatio: null,
          },
        ]),
      });
    });

    await page.route('**/api/research/test-topic-003', async (route) => {
      if (route.request().method() === 'DELETE') {
        deleteWasCalled = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/research');
    await expect(page.getByRole('heading', { name: 'Research' })).toBeVisible();
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Delete Me Topic')).toBeVisible();

    // Hover and click trash icon.
    const topicCard = page.locator('text=Delete Me Topic').first();
    await topicCard.hover();

    const trashBtn = page.locator('span').filter({ has: page.locator('svg') }).last();
    await trashBtn.click();

    await expect(page.getByText('Delete?')).toBeVisible();

    // Confirm deletion.
    await page.getByRole('button', { name: 'Delete' }).click();

    // The API call should have been made.
    await expect(async () => {
      expect(deleteWasCalled).toBe(true);
    }).toPass({ timeout: 5000 });

    // The card should be removed from the list.
    await expect(page.getByText('Delete Me Topic')).not.toBeVisible({ timeout: 5000 });
  });
});

// ---------------------------------------------------------------------------
// DELETE API endpoints — unauthenticated (401) checks
// These hit the real server without a session cookie, so no DB needed.
// ---------------------------------------------------------------------------

test.describe('DELETE /api/research/[id] — unauthenticated', () => {
  test('returns 401 when no session', async ({ request }) => {
    const response = await request.delete('/api/research/nonexistent-id');
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});

test.describe('DELETE /api/content/[id] — unauthenticated', () => {
  test('returns 401 when no session', async ({ request }) => {
    const response = await request.delete('/api/content/nonexistent-id');
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});

test.describe('DELETE /api/subscribers/[id] — unauthenticated', () => {
  test('returns 401 when no session', async ({ request }) => {
    const response = await request.delete('/api/subscribers/nonexistent-id');
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});

test.describe('DELETE /api/tickets/[id] — unauthenticated', () => {
  test('returns 401 when no session', async ({ request }) => {
    const response = await request.delete('/api/tickets/nonexistent-id');
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});
