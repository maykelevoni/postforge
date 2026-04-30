import { test, expect } from "@playwright/test";

// The /setup page is only shown when DATABASE_URL is absent.
// In the dev environment DATABASE_URL is always set, so we test the page
// directly (it renders fine) and test that the configured API returns 403.

test.describe("Setup wizard page", () => {
  test("renders all form elements", async ({ page }) => {
    await page.goto("/setup");

    await expect(page.getByText("PostForge")).toBeVisible();
    await expect(page.getByText("Connect your database")).toBeVisible();

    const dbInput = page.getByPlaceholder(/postgresql:\/\//);
    await expect(dbInput).toBeVisible();

    const urlInput = page.getByPlaceholder(/https:\/\/yourdomain/);
    await expect(urlInput).toBeVisible();

    await expect(page.getByRole("link", { name: /Neon/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Save & Restart/i })).toBeVisible();
  });

  test("pre-fills App URL with window.location.origin", async ({ page }) => {
    await page.goto("/setup");
    const urlInput = page.getByPlaceholder(/https:\/\/yourdomain/);
    // After hydration, the field should be filled with the current origin
    await expect(urlInput).not.toHaveValue("");
  });

  test("validates DB URL format — rejects empty", async ({ page }) => {
    await page.goto("/setup");
    await page.getByRole("button", { name: /Save & Restart/i }).click();
    await expect(page.getByText(/postgresql:\/\//i)).toBeVisible();
  });

  test("validates DB URL format — rejects invalid string", async ({ page }) => {
    await page.goto("/setup");
    await page.getByPlaceholder(/postgresql:\/\//).fill("not-a-url");
    await page.getByRole("button", { name: /Save & Restart/i }).click();
    await expect(page.getByText(/postgresql:\/\//i)).toBeVisible();
  });

  test("clears validation error when user corrects input", async ({ page }) => {
    await page.goto("/setup");
    const dbInput = page.getByPlaceholder(/postgresql:\/\//);
    await dbInput.fill("bad");
    await page.getByRole("button", { name: /Save & Restart/i }).click();
    await expect(page.getByText(/postgresql:\/\//i)).toBeVisible();

    await dbInput.fill("postgresql://user:pass@host/db");
    await expect(page.getByText(/postgresql:\/\//i)).not.toBeVisible();
  });
});

test.describe("POST /api/setup — already configured", () => {
  test("returns 403 when DATABASE_URL is already set", async ({ request }) => {
    const res = await request.post("/api/setup", {
      data: {
        databaseUrl: "postgresql://user:pass@host/db",
        nextauthUrl: "http://localhost:3000",
      },
    });
    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body.error).toMatch(/already configured/i);
  });
});

test.describe("Middleware — configured server", () => {
  test("/setup is accessible and does not error when already configured", async ({ page }) => {
    await page.goto("/setup");
    // Page should render without crashing (form is visible)
    await expect(page.getByRole("button", { name: /Save & Restart/i })).toBeVisible();
    // Should NOT redirect to /setup in a loop
    await expect(page).toHaveURL(/\/setup/);
  });
});
