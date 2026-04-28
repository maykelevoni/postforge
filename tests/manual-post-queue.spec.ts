import { test, expect } from '@playwright/test';

async function signIn(page: any) {
  await page.goto('/sign-in', { timeout: 90000 });
  await page.getByLabel('Email').fill('test@postforge.dev');
  await page.getByLabel('Password').fill('testpassword123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('http://localhost:3002/', { timeout: 90000 });
}

// ─── Content page: platform filter ───────────────────────────────────────────

test.describe('Content page — platform filter', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test('YouTube option exists in platform filter', async ({ page }) => {
    await page.goto('/content');
    await expect(page.getByRole('heading', { name: 'Content' })).toBeVisible();

    const platformSelect = page.locator('select').filter({ hasText: 'All Platforms' });
    await expect(platformSelect).toBeVisible();

    // Use evaluate to read option values — Playwright nested option locators are unreliable
    const values = await platformSelect.evaluate(
      (el: HTMLSelectElement) => Array.from(el.options).map(o => o.value)
    );
    expect(values).toContain('youtube');
  });

  test('platform filter has all expected options', async ({ page }) => {
    await page.goto('/content');
    const platformSelect = page.locator('select').filter({ hasText: 'All Platforms' });
    await expect(platformSelect).toBeVisible();

    const values = await platformSelect.evaluate(
      (el: HTMLSelectElement) => Array.from(el.options).map(o => o.value)
    );
    expect(values).toContain('twitter');
    expect(values).toContain('linkedin');
    expect(values).toContain('reddit');
    expect(values).toContain('instagram');
    expect(values).toContain('tiktok');
    expect(values).toContain('youtube');
  });
});

// ─── Settings: YouTube schedule entry ────────────────────────────────────────

test.describe('Settings — YouTube schedule', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test('YouTube appears in the Schedule section', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Schedule' })).toBeVisible();
    // Schedule section renders platform rows — YouTube should be one of them
    await expect(page.getByText('youtube', { exact: false })).toBeVisible();
  });
});

// ─── ManualQueueCard intent buttons (via injected test piece) ─────────────────
// We test the card UI by injecting a fake piece into manualQueue state via
// page.evaluate, then asserting the rendered buttons and links.

test.describe('ManualQueueCard — intent buttons', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.goto('/content');
    await expect(page.getByRole('heading', { name: 'Content' })).toBeVisible();
  });

  async function injectQueuePiece(page: any, piece: object) {
    // addInitScript runs before React — mocks window.fetch for the manual queue call
    // More reliable than page.route() which can miss requests during reload timing
    await page.addInitScript((p: any) => {
      const orig = window.fetch.bind(window);
      (window as any).fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === 'string' ? input
          : input instanceof URL ? input.href
          : (input as Request).url;
        if (url.includes('needs_manual_post')) {
          return new Response(
            JSON.stringify({ items: [p], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }
        return orig(input, init);
      };
    }, piece);

    await page.goto('http://localhost:3002/content');
    await expect(page.getByRole('heading', { name: 'Ready to Post' })).toBeVisible({ timeout: 10000 });
  }

  test('Twitter card shows "Post on X" button with correct intent URL', async ({ page }) => {
    await injectQueuePiece(page, {
      id: 'test-twitter-1',
      platform: 'twitter',
      content: 'Hello from PostForge!',
      scheduledAt: null,
      videoUrl: null,
      imageUrl: null,
    });

    const link = page.getByRole('link', { name: 'Post on X' });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toContain('twitter.com/intent/tweet?text=');
    expect(href).toContain(encodeURIComponent('Hello from PostForge!'));
    expect(await link.getAttribute('target')).toBe('_blank');
    expect(await link.getAttribute('rel')).toContain('noopener');
  });

  test('Threads card shows "Post on Threads" button with correct intent URL', async ({ page }) => {
    await injectQueuePiece(page, {
      id: 'test-threads-1',
      platform: 'threads',
      content: 'Threads content here',
      scheduledAt: null,
      videoUrl: null,
      imageUrl: null,
    });

    const link = page.getByRole('link', { name: 'Post on Threads' });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toContain('threads.net/intent/post?text=');
    expect(href).toContain(encodeURIComponent('Threads content here'));
    expect(await link.getAttribute('target')).toBe('_blank');
  });

  test('Reddit card shows "Post on Reddit" button with correct submit URL', async ({ page }) => {
    await injectQueuePiece(page, {
      id: 'test-reddit-1',
      platform: 'reddit',
      content: 'Reddit title line\nBody content here',
      scheduledAt: null,
      videoUrl: null,
      imageUrl: null,
    });

    const link = page.getByRole('link', { name: 'Post on Reddit' });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toContain('reddit.com/submit');
    expect(href).toContain('selftext=true');
    expect(href).toContain('title=');
    expect(href).toContain('text=');
    expect(await link.getAttribute('target')).toBe('_blank');
  });

  test('YouTube card shows "Open YouTube" button pointing to YouTube Studio', async ({ page }) => {
    await injectQueuePiece(page, {
      id: 'test-youtube-1',
      platform: 'youtube',
      content: 'Hook: Watch this!\nValue: Learn how to...\nCTA: Subscribe now',
      scheduledAt: null,
      videoUrl: null,
      imageUrl: null,
    });

    const link = page.getByRole('link', { name: 'Open YouTube' });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toBe('https://studio.youtube.com');
    expect(await link.getAttribute('target')).toBe('_blank');
  });

  test('Card with videoUrl shows "Download Video" button', async ({ page }) => {
    await injectQueuePiece(page, {
      id: 'test-video-1',
      platform: 'youtube',
      content: 'Some content',
      scheduledAt: null,
      videoUrl: 'https://fal.ai/video/test.mp4',
      imageUrl: 'https://fal.ai/image/test.jpg',
    });

    const link = page.getByRole('link', { name: 'Download Video' });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toBe('https://fal.ai/video/test.mp4');
    // Download Image should NOT appear when videoUrl is present
    await expect(page.getByRole('link', { name: 'Download Image' })).not.toBeVisible();
  });

  test('Card with imageUrl only shows "Download Image" button', async ({ page }) => {
    await injectQueuePiece(page, {
      id: 'test-image-1',
      platform: 'instagram',
      content: 'Image only content',
      scheduledAt: null,
      videoUrl: null,
      imageUrl: 'https://fal.ai/image/test.jpg',
    });

    const link = page.getByRole('link', { name: 'Download Image' });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toBe('https://fal.ai/image/test.jpg');
    await expect(page.getByRole('link', { name: 'Download Video' })).not.toBeVisible();
  });

  test('Twitter card does NOT show Threads or Reddit intent buttons', async ({ page }) => {
    await injectQueuePiece(page, {
      id: 'test-twitter-2',
      platform: 'twitter',
      content: 'Just a tweet',
      scheduledAt: null,
      videoUrl: null,
      imageUrl: null,
    });

    await expect(page.getByRole('link', { name: 'Post on X' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Post on Threads' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Post on Reddit' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Open YouTube' })).not.toBeVisible();
  });

  test('Copy button copies content and changes label temporarily', async ({ page }) => {
    await injectQueuePiece(page, {
      id: 'test-copy-1',
      platform: 'twitter',
      content: 'Content to copy',
      scheduledAt: null,
      videoUrl: null,
      imageUrl: null,
    });

    const copyBtn = page.getByRole('button', { name: 'Copy' });
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();
    await expect(page.getByRole('button', { name: 'Copied ✓' })).toBeVisible({ timeout: 2000 });
    // Resets back after 2 seconds
    await expect(page.getByRole('button', { name: 'Copy' })).toBeVisible({ timeout: 5000 });
  });

  test('Mark as Posted removes card from UI optimistically', async ({ page }) => {
    await page.route('**/api/content/test-mark-1', async (route: any) => {
      if (route.request().method() === 'PATCH') {
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
      } else {
        await route.continue();
      }
    });

    await injectQueuePiece(page, {
      id: 'test-mark-1',
      platform: 'reddit',
      content: 'Post to mark',
      scheduledAt: null,
      videoUrl: null,
      imageUrl: null,
    });

    await expect(page.getByText('Post to mark')).toBeVisible();
    await page.getByRole('button', { name: 'Mark as Posted' }).click();
    await expect(page.getByText('Post to mark')).not.toBeVisible({ timeout: 3000 });
  });
});
