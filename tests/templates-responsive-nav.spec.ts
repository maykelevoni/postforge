import { test, expect } from "@playwright/test";

// The breakpoint in page.tsx: window.innerWidth < 1024 → mobile (topbar)
// Desktop ≥ 1024px → sidebar variant
// Mobile  < 1024px → topbar variant

async function signIn(page: any) {
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill("test@postforge.dev");
  await page.getByLabel("Password").fill("testpassword123");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL(
    (url: URL) => !url.pathname.startsWith("/sign-in"),
    { timeout: 30000 }
  );
}

test.describe("Templates Responsive Navigation", () => {
  test.describe("Desktop layout (≥ 1024px)", () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test.beforeEach(async ({ page }) => {
      await signIn(page);
      await page.goto("/templates");
      await page.waitForLoadState("networkidle");
    });

    test("should show 240px left sidebar with platform list", async ({
      page,
    }) => {
      // The sidebar container is a flex column with fixed 240px width
      const sidebar = page
        .locator('[style*="width: 240px"]')
        .or(page.locator('[style*="width:240px"]'));
      await expect(sidebar.first()).toBeVisible();
    });

    test("should display vertical platform buttons in sidebar", async ({
      page,
    }) => {
      // Sidebar variant renders buttons with full width + text-align left
      const twitterBtn = page.locator('button:has-text("Twitter")').first();
      await expect(twitterBtn).toBeVisible();

      const linkedinBtn = page.locator('button:has-text("LinkedIn")').first();
      await expect(linkedinBtn).toBeVisible();
    });

    test("should highlight active platform tab", async ({ page }) => {
      const twitterBtn = page.locator('button:has-text("Twitter")').first();
      await twitterBtn.click();

      // Active button gets backgroundColor: #6366f1
      const bgColor = await twitterBtn.evaluate(
        (el: HTMLElement) => el.style.backgroundColor
      );
      expect(bgColor).toBe("rgb(99, 102, 241)");
    });

    test("should switch active tab when another platform is clicked", async ({
      page,
    }) => {
      const linkedinBtn = page.locator('button:has-text("LinkedIn")').first();
      await linkedinBtn.click();

      const bgColor = await linkedinBtn.evaluate(
        (el: HTMLElement) => el.style.backgroundColor
      );
      expect(bgColor).toBe("rgb(99, 102, 241)");
    });

    test("should show content area next to sidebar (flex row)", async ({
      page,
    }) => {
      const layout = page.locator('[style*="display: flex"]').first();
      await expect(layout).toBeVisible();

      // Layout should be row (flex default) — sidebar + content side by side
      const displayValue = await layout.evaluate(
        (el: HTMLElement) => window.getComputedStyle(el).flexDirection
      );
      expect(displayValue).toBe("row");
    });

    test("should show page title in content area", async ({ page }) => {
      const h1 = page.locator("h1").first();
      await expect(h1).toContainText("Templates");
    });
  });

  test.describe("Mobile layout (< 1024px)", () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test.beforeEach(async ({ page }) => {
      await signIn(page);
      await page.goto("/templates");
      await page.waitForLoadState("networkidle");
    });

    test("should NOT show 240px sidebar on narrow screens", async ({
      page,
    }) => {
      // No sidebar with width:240px at this breakpoint
      const sidebar = page.locator('[style*="width: 240px"]');
      const count = await sidebar.count();
      expect(count).toBe(0);
    });

    test("should show horizontal scrollable tab strip at top", async ({
      page,
    }) => {
      // Topbar variant wraps buttons in an overflowX:auto container
      const topbar = page.locator(".platform-topbar");
      await expect(topbar).toBeVisible();
    });

    test("should display all 9 platform icon buttons in the strip", async ({
      page,
    }) => {
      // Topbar variant shows icon-only buttons with title attribute for accessibility
      const topbar = page.locator(".platform-topbar");
      const buttons = topbar.locator("button");
      await expect(buttons).toHaveCount(9);
    });

    test("should layout content below the tab strip (flex column)", async ({
      page,
    }) => {
      // Mobile layout root uses flexDirection: column
      const layout = page.locator('[style*="flex-direction: column"]').first();
      await expect(layout).toBeVisible();
    });

    test("should highlight active tab in topbar", async ({ page }) => {
      const twitterBtn = page.locator('button:has-text("Twitter")').first();
      await twitterBtn.click();

      const bgColor = await twitterBtn.evaluate(
        (el: HTMLElement) => el.style.backgroundColor
      );
      expect(bgColor).toBe("rgb(99, 102, 241)");
    });

    test("should switch active tab when another platform is clicked", async ({
      page,
    }) => {
      const instagramBtn = page
        .locator('button:has-text("Instagram")')
        .first();
      await instagramBtn.click();

      const bgColor = await instagramBtn.evaluate(
        (el: HTMLElement) => el.style.backgroundColor
      );
      expect(bgColor).toBe("rgb(99, 102, 241)");
    });

    test("should show page title below tab strip", async ({ page }) => {
      const h1 = page.locator("h1").first();
      await expect(h1).toContainText("Templates");
    });
  });

  test.describe("Small mobile layout (375px)", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test.beforeEach(async ({ page }) => {
      await signIn(page);
      await page.goto("/templates");
      await page.waitForLoadState("networkidle");
    });

    test("should render topbar on phone-width screen", async ({ page }) => {
      const topbar = page.locator(".platform-topbar");
      await expect(topbar).toBeVisible();
    });

    test("should not overflow horizontally", async ({ page }) => {
      const bodyWidth = await page.evaluate(
        () => document.body.scrollWidth
      );
      const viewportWidth = 375;
      // Allow a small tolerance for scrollbars
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
    });
  });

  test.describe("Responsive breakpoint transition", () => {
    test("sidebar visible at 1024px, hidden at 1023px", async ({ page }) => {
      await signIn(page);
      // Start wide
      await page.setViewportSize({ width: 1024, height: 800 });
      await page.goto("/templates");
      await page.waitForLoadState("networkidle");

      const sidebarWide = page.locator('[style*="width: 240px"]');
      await expect(sidebarWide.first()).toBeVisible();

      // Shrink below breakpoint
      await page.setViewportSize({ width: 1023, height: 800 });
      // Page uses a resize event listener — wait for re-render
      await page.waitForTimeout(300);

      const sidebarNarrow = page.locator('[style*="width: 240px"]');
      expect(await sidebarNarrow.count()).toBe(0);

      // Topbar should appear
      const topbar = page.locator(".platform-topbar");
      await expect(topbar).toBeVisible();
    });
  });

  test.describe("Hover & active transitions", () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test("sidebar button hover changes background on desktop", async ({
      page,
    }) => {
      await signIn(page);
      await page.goto("/templates");
      await page.waitForLoadState("networkidle");

      // Pick a non-active button (LinkedIn, default active is Twitter)
      const linkedinBtn = page.locator('button:has-text("LinkedIn")').first();
      await linkedinBtn.hover();

      const bgColor = await linkedinBtn.evaluate(
        (el: HTMLElement) => el.style.backgroundColor
      );
      expect(bgColor).toBe("rgb(34, 34, 34)"); // #222
    });
  });
});
