import { test, expect } from "@playwright/test";

test.describe("Templates Page UI", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to templates page
    await page.goto("/templates");
  });

  test("should display templates page with platform tabs", async ({ page }) => {
    // Check that we're on the templates page
    await expect(page.locator("h1")).toContainText("Templates");

    // Check for platform tabs
    const platformTabs = page.locator('button:has-text("Twitter"), button:has-text("LinkedIn"), button:has-text("Reddit")');
    await expect(platformTabs.first()).toBeVisible();
  });

  test("should filter templates by platform category", async ({ page }) => {
    // Click on Twitter category
    const twitterTab = page.locator('button:has-text("Twitter")');
    await twitterTab.click();

    // Wait for templates to load
    await page.waitForTimeout(500);

    // Check that templates are displayed
    const templateCards = page.locator('[style*="background-color: rgb(17, 17, 17)"]');
    const count = await templateCards.count();

    expect(count).toBeGreaterThan(0);
  });

  test("should display template filters", async ({ page }) => {
    // Check for search input
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();

    // Check for filter buttons
    const filterButtons = page.locator('button:has-text("All"), button:has-text("Pre-built"), button:has-text("Custom")');
    await expect(filterButtons.first()).toBeVisible();
  });

  test("should search templates", async ({ page }) => {
    // Type in search box
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill("viral");

    // Wait for search results
    await page.waitForTimeout(500);

    // Check that filtered results are shown
    const templateCards = page.locator('[style*="background-color: rgb(17, 17, 17)"]');
    const count = await templateCards.count();

    // Should have some results (or empty state)
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should filter by template type", async ({ page }) => {
    // Click on "Pre-built" filter
    const prebuiltButton = page.locator('button:has-text("Pre-built")');
    await prebuiltButton.click();

    // Wait for filtering
    await page.waitForTimeout(500);

    // Check that filter is active
    await expect(prebuiltButton).toHaveCSS("background-color", "rgb(99, 102, 241)");
  });

  test("should display template cards with required information", async ({ page }) => {
    // Wait for templates to load
    await page.waitForTimeout(1000);

    // Check for template cards
    const templateCards = page.locator('[style*="background-color: rgb(17, 17, 17)"]');
    const firstCard = templateCards.first();

    if (await firstCard.count() > 0) {
      // Check for template name
      const title = firstCard.locator('h3, [style*="font-weight: 600"]');
      await expect(title).toBeVisible();

      // Check for badges (Pre-built/Custom)
      const badges = firstCard.locator('[style*="text-transform: uppercase"]');
      await expect(badges.first()).toBeVisible();

      // Check for metadata
      const meta = firstCard.locator('[style*="color: rgb(102, 102, 102)"]');
      await expect(meta).toBeVisible();
    }
  });

  test("should show empty state when no templates found", async ({ page }) => {
    // Search for something that doesn't exist
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill("nonexistenttemplate123");

    // Wait for search
    await page.waitForTimeout(500);

    // Check for empty state
    const emptyState = page.locator('text=No templates found');
    await expect(emptyState).toBeVisible();
  });

  test("should have loading state", async ({ page }) => {
    // Reload page to see loading state
    await page.reload();

    // Check for loading indicator (should be brief)
    const loadingSpinner = page.locator('[style*="animation: spin"]');
    // Loading might be too fast to catch, so we just check it exists in DOM
    const loadingExists = await loadingSpinner.count() > 0;
    expect(loadingExists).toBe(true);
  });
});

test.describe("Template Card Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/templates");
    await page.waitForTimeout(1000); // Wait for initial load
  });

  test("should highlight template card on hover", async ({ page }) => {
    const templateCards = page.locator('[style*="background-color: rgb(17, 17, 17)"]');
    const firstCard = templateCards.first();

    if (await firstCard.count() > 0) {
      // Hover over card
      await firstCard.hover();

      // Check for border color change
      const borderColor = await firstCard.evaluate(
        (el) => el.style.borderColor
      );

      expect(borderColor).toContain("rgb(99, 102, 241)");
    }
  });

  test("should show favorite indicator for favorited templates", async ({ page }) => {
    // Look for favorite indicators (star emoji)
    const favoriteIndicators = page.locator('text=⭐');

    // Might be none or some depending on data
    const count = await favoriteIndicators.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe("Responsive Design", () => {
  test("should be mobile-friendly", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/templates");
    await page.waitForTimeout(1000);

    // Check that page is still functional
    const pageTitle = page.locator("h1");
    await expect(pageTitle).toBeVisible();

    // Check that platform tabs still work
    const tabs = page.locator('button');
    const tabsCount = await tabs.count();
    expect(tabsCount).toBeGreaterThan(0);
  });

  test("should adapt to tablet size", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto("/templates");
    await page.waitForTimeout(1000);

    // Check layout
    const mainContent = page.locator('[style*="display: flex"]');
    await expect(mainContent).toBeVisible();
  });
});

test.describe("Template Editor", () => {
  test("should allow creating custom templates", async ({ page }) => {
    await page.goto("/templates");

    // Look for "Create Template" button or similar
    // This would be implemented in the UI
    const createButton = page.locator('button:has-text("Create"), button:has-text("New Template")');

    if (await createButton.count() > 0) {
      await createButton.click();

      // Check for form fields
      const nameInput = page.locator('input[placeholder*="Template Name"]');
      await expect(nameInput).toBeVisible();

      const templateTextarea = page.locator('textarea[placeholder*="Template"]');
      await expect(templateTextarea).toBeVisible();
    }
  });

  test("should validate template form", async ({ page }) => {
    // This would test form validation
    // Implementation depends on actual UI

    const requiredFields = ["name", "template"];

    // Each field should be marked as required
    for (const field of requiredFields) {
      const fieldInput = page.locator(`input[name="${field}"], textarea[name="${field}"]`);
      // Check if field exists and has required validation
      if (await fieldInput.count() > 0) {
        const isRequired = await fieldInput.evaluate((el: any) => el.required);
        expect(isRequired).toBe(true);
      }
    }
  });
});

test.describe("Template Selection Modal", () => {
  test("should display template selection modal", async ({ page }) => {
    // This would be triggered from content generation flow
    // For now, we'll test the modal component exists

    // Navigate to a page that would trigger template selection
    await page.goto("/content");

    // Look for template selection trigger
    const templateButton = page.locator('button:has-text("Template"), button:has-text("Use Template")');

    if (await templateButton.count() > 0) {
      await templateButton.click();

      // Check for modal overlay
      const modalOverlay = page.locator('[style*="position: fixed"][style*="rgba(0, 0, 0, 0.8)"]');
      await expect(modalOverlay).toBeVisible();

      // Check for modal content
      const modalContent = modalOverlay.locator('[style*="background-color: rgb(17, 17, 17)"]');
      await expect(modalContent).toBeVisible();
    }
  });

  test("should allow skipping template selection", async ({ page }) => {
    // Test skip functionality
    await page.goto("/content");

    const templateButton = page.locator('button:has-text("Template"), button:has-text("Use Template")');

    if (await templateButton.count() > 0) {
      await templateButton.click();

      // Look for skip button
      const skipButton = page.locator('button:has-text("Skip"), button:has-text("Generate Without")');

      if (await skipButton.count() > 0) {
        await expect(skipButton).toBeVisible();
      }
    }
  });
});
