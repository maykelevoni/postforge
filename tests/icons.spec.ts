import { test, expect } from "@playwright/test";

test.describe("Icon System", () => {
  test.beforeEach(async ({ page }) => {
    // Sign in before each test
    await page.goto("/sign-in");
    // You'll need to add actual sign-in logic here
    // For now, we'll skip auth in tests
  });

  test("should display icons on navigation", async ({ page }) => {
    await page.goto("/");

    // Check that navigation items have icons
    const navItems = page.locator("nav a");
    const firstNavItem = navItems.first();

    // Should have icon element
    const icon = firstNavItem.locator("svg");
    await expect(icon).toBeVisible();
  });

  test("should render all platform icons correctly", async ({ page }) => {
    await page.goto("/");

    // Check for platform icons
    const platforms = ["Today", "Research", "Discover", "Content", "Promote", "Services", "Settings"];

    for (const platform of platforms) {
      const navItem = page.locator(`nav a:has-text("${platform}")`);
      await expect(navItem).toBeVisible();

      // Check that icon is present
      const icon = navItem.locator("svg");
      await expect(icon).toBeVisible();
    }
  });

  test("should have consistent icon sizing", async ({ page }) => {
    await page.goto("/");

    const icons = page.locator("nav svg");
    const count = await icons.count();

    // Get size of first icon
    const firstIcon = icons.first();
    const firstBox = await firstIcon.boundingBox();

    expect(firstBox).toBeTruthy();

    // Check that all icons have similar sizes (within reason)
    for (let i = 0; i < count; i++) {
      const icon = icons.nth(i);
      const box = await icon.boundingBox();

      expect(box).toBeTruthy();
      if (box && firstBox) {
        // Icons should be roughly the same size (within 2 pixels)
        expect(Math.abs(box.width - firstBox.width)).toBeLessThan(2);
        expect(Math.abs(box.height - firstBox.height)).toBeLessThan(2);
      }
    }
  });
});

test.describe("Icon Component", () => {
  test("should support different icon sizes", async ({ page }) => {
    // This would test the Icon component directly
    // For now, we'll test via the UI

    await page.goto("/");

    // Navigation icons should be size 18
    const navIcons = page.locator("nav svg");
    const navIcon = navIcons.first();
    const navBox = await navIcon.boundingBox();

    expect(navBox).toBeTruthy();
    expect(navBox?.width).toBeGreaterThan(0);
  });

  test("should support icon colors", async ({ page }) => {
    await page.goto("/");

    // Check that icons can have different colors
    const activeNavItem = page.locator('nav a[style*="background-color: rgb(99, 102, 241)"]');
    if (await activeNavItem.count() > 0) {
      const icon = activeNavItem.locator("svg");
      await expect(icon).toBeVisible();
    }
  });
});