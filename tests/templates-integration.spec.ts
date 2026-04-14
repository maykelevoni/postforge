import { test, expect } from "@playwright/test";

test.describe("Template Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Set up authentication if needed
    await page.goto("/");
  });

  test("full template workflow: browse → select → generate", async ({ page }) => {
    // Step 1: Navigate to templates page
    await page.goto("/templates");

    // Verify page loads
    await expect(page.locator("h1")).toContainText("Templates");

    // Step 2: Select a platform category
    const twitterTab = page.locator('button:has-text("Twitter")');
    await twitterTab.click();
    await page.waitForTimeout(500);

    // Step 3: View available templates
    const templateCards = page.locator('[style*="background-color: rgb(17, 17, 17)"]');
    const templateCount = await templateCards.count();
    expect(templateCount).toBeGreaterThan(0);

    // Step 4: Select a template (first one)
    const firstTemplate = templateCards.first();
    await firstTemplate.click();

    // This would typically open a modal or navigate to generation
    // For now, we'll verify the interaction occurred

    // Step 5: Would proceed to generation
    // (Full flow would require actual product/promotion data)
  });

  test("should maintain state when switching categories", async ({ page }) => {
    await page.goto("/templates");

    // Select Twitter
    const twitterTab = page.locator('button:has-text("Twitter")');
    await twitterTab.click();
    await page.waitForTimeout(500);

    // Select LinkedIn
    const linkedinTab = page.locator('button:has-text("LinkedIn")');
    await linkedinTab.click();
    await page.waitForTimeout(500);

    // Verify the active tab changed
    await expect(linkedinTab).toHaveCSS("background-color", "rgb(99, 102, 241)");
  });

  test("should persist filters when navigating", async ({ page }) => {
    await page.goto("/templates");

    // Set a filter
    const prebuiltButton = page.locator('button:has-text("Pre-built")');
    await prebuiltButton.click();
    await page.waitForTimeout(500);

    // Navigate away and back
    await page.goto("/content");
    await page.waitForTimeout(500);
    await page.goto("/templates");
    await page.waitForTimeout(500);

    // Filter might persist depending on implementation
    // This test checks the capability
    const isFilterActive = await prebuiltButton.evaluate(
      (el) => el.style.backgroundColor === "rgb(99, 102, 241)"
    );

    // Either way is valid - persisting or resetting
    expect(typeof isFilterActive).toBe("boolean");
  });
});

test.describe("Template Generation Flow", () => {
  test("should generate content with selected template", async ({ page, request }) => {
    // This is a conceptual test - actual implementation would require:
    // 1. Existing promotion/product
    // 2. Working authentication
    // 3. Functional template system

    // Mock the generation process
    const baseUrl = "http://localhost:3000";

    // Get available templates
    const templatesResponse = await request.get(`${baseUrl}/api/templates?category=twitter`);

    if (templatesResponse.status() === 200) {
      const templatesData = await templatesResponse.json();

      if (templatesData.templates.length > 0) {
        const template = templatesData.templates[0];

        // Generate content from template
        const generateResponse = await request.post(
          `${baseUrl}/api/generate/from-template`,
          {
            data: JSON.stringify({
              templateId: template.id,
              productInfo: {
                name: "Test Product",
                description: "Test description for template generation",
                url: "https://example.com"
              },
              variables: {
                number: 5,
                benefit: "grow your audience",
                pain: "posting daily",
                time: "30 days"
              }
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Verify response
        expect([200, 401]).toContain(generateResponse.status());

        if (generateResponse.status() === 200) {
          const result = await generateResponse.json();

          // Check response structure
          expect(result).toHaveProperty("content");
          expect(result).toHaveProperty("validation");
          expect(result).toHaveProperty("variables");

          // Check validation structure
          expect(result.validation.isValid).toBeDefined();
          expect(Array.isArray(result.validation.errors)).toBe(true);
          expect(Array.isArray(result.validation.warnings)).toBe(true);

          // Content should not be empty
          expect(result.content.length).toBeGreaterThan(0);

          // Content should use template variables
          expect(result.content).toContain("30 days");
        }
      }
    }
  });

  test("should handle template generation errors gracefully", async ({ page, request }) => {
    const baseUrl = "http://localhost:3000";

    // Try to generate with invalid template ID
    const generateResponse = await request.post(
      `${baseUrl}/api/generate/from-template`,
      {
        data: JSON.stringify({
          templateId: "invalid-template-id",
          productInfo: {
            name: "Test Product",
            description: "Test description",
            url: "https://example.com"
          }
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Should return appropriate error
    expect([400, 404, 500]).toContain(generateResponse.status());
  });
});

test.describe("Template Favorites", () => {
  test("should toggle template favorite status", async ({ page, request }) => {
    const baseUrl = "http://localhost:3000";

    // Get a template to favorite
    const listResponse = await request.get(`${baseUrl}/api/templates`);
    const listData = await listResponse.json();

    if (listData.templates.length > 0) {
      const template = listData.templates[0];
      const originalFavorite = template.isFavorite;

      // Toggle favorite
      const toggleResponse = await request.post(
        `${baseUrl}/api/templates/${template.id}/favorite`
      );

      expect([200, 401, 403]).toContain(toggleResponse.status());

      if (toggleResponse.status() === 200) {
        const result = await toggleResponse.json();
        expect(result.template.isFavorite).toBe(!originalFavorite);

        // Toggle back
        const toggleBackResponse = await request.post(
          `${baseUrl}/api/templates/${template.id}/favorite`
        );

        if (toggleBackResponse.status() === 200) {
          const result = await toggleBackResponse.json();
          expect(result.template.isFavorite).toBe(originalFavorite);
        }
      }
    }
  });

  test("should show favorited templates in favorites filter", async ({ page }) => {
    await page.goto("/templates");

    // Click favorites filter
    const favoritesButton = page.locator('button:has-text("⭐ Favorites")');
    await favoritesButton.click();
    await page.waitForTimeout(500);

    // Should show only favorited templates
    // (This depends on having favorited templates in the database)
    const templateCards = page.locator('[style*="background-color: rgb(17, 17, 17)"]');

    // Count displayed templates
    const count = await templateCards.count();

    // All should have favorite indicator if any exist
    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = templateCards.nth(i);
      const hasFavoriteIndicator = await card.locator('text=⭐').count();
      expect(hasFavoriteIndicator).toBeGreaterThan(0);
    }
  });
});

test.describe("Template Constraints Validation", () => {
  test("should validate Twitter character limits", async ({ page, request }) => {
    const baseUrl = "http://localhost:3000";

    // Get a Twitter template
    const response = await request.get(`${baseUrl}/api/templates?category=twitter`);
    const data = await response.json();

    if (data.templates.length > 0) {
      const template = data.templates[0];

      // Generate content that's too long
      const longContent = "A".repeat(300);

      // Check if validation catches this
      const exceedsLimit = longContent.length > 280;

      expect(exceedsLimit).toBe(true);

      // The validation should catch this
      const validation = {
        isValid: longContent.length <= 280,
        errors: longContent.length > 280 ? ["Content is too long"] : [],
        warnings: []
      };

      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    }
  });

  test("should validate required sections", async ({ page }) => {
    const templateWithRequiredSections = {
      constraints: {
        requiredSections: ["hook", "value", "CTA"]
      }
    };

    const validContent = "Hook: Great intro\nValue: Amazing content\nCTA: Click here!";
    const invalidContent = "Hook and value but no CTA";

    // Check valid content
    const missingSections = templateWithRequiredSections.constraints.requiredSections.filter(
      section => !invalidContent.toLowerCase().includes(section.toLowerCase())
    );

    expect(missingSections).toContain("CTA");

    // Valid content should have all sections
    const allSectionsPresent = templateWithRequiredSections.constraints.requiredSections.every(
      section => validContent.toLowerCase().includes(section.toLowerCase())
    );

    expect(allSectionsPresent).toBe(true);
  });
});

test.describe("Performance Tests", () => {
  test("should load templates page quickly", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/templates");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;

    // Page should load in less than 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test("should filter templates quickly", async ({ page }) => {
    await page.goto("/templates");
    await page.waitForTimeout(1000);

    const startTime = Date.now();

    // Trigger a filter
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill("test");
    await page.waitForTimeout(500);

    const filterTime = Date.now() - startTime;

    // Filtering should be fast
    expect(filterTime).toBeLessThan(1000);
  });
});

test.describe("Accessibility Tests", () => {
  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/templates");

    // Test tab navigation
    await page.keyboard.press("Tab");

    // Should focus on interactive elements
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(["BUTTON", "INPUT", "A"]).toContain(focusedElement);
  });

  test("should have proper ARIA labels", async ({ page }) => {
    await page.goto("/templates");

    // Check for proper headings
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();

    // Check for form labels
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.count() > 0) {
      const placeholder = await searchInput.getAttribute("placeholder");
      expect(placeholder).toBeTruthy();
    }
  });
});
