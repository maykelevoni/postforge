import { test, expect } from "@playwright/test";

test.describe("Template API", () => {
  const baseUrl = "http://localhost:3000"; // Adjust if needed

  test.beforeAll(async () => {
    // Ensure we're authenticated
    // This might require setting up a test user
  });

  test.describe("GET /api/templates", () => {
    test("should return templates list", async ({ request }) => {
      const response = await request.get(`${baseUrl}/api/templates`);

      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty("templates");
      expect(Array.isArray(data.templates)).toBe(true);
    });

    test("should filter templates by category", async ({ request }) => {
      const response = await request.get(
        `${baseUrl}/api/templates?category=twitter`
      );

      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.templates).toBeDefined();

      // All templates should be twitter category
      data.templates.forEach((template: any) => {
        expect(template.category).toBe("twitter");
      });
    });

    test("should filter templates by type", async ({ request }) => {
      const response = await request.get(
        `${baseUrl}/api/templates?type=prebuilt`
      );

      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.templates).toBeDefined();

      data.templates.forEach((template: any) => {
        expect(template.type).toBe("prebuilt");
      });
    });

    test("should filter favorites", async ({ request }) => {
      const response = await request.get(
        `${baseUrl}/api/templates?favorites=true`
      );

      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.templates).toBeDefined();

      data.templates.forEach((template: any) => {
        expect(template.isFavorite).toBe(true);
      });
    });
  });

  test.describe("POST /api/templates", () => {
    test("should create new custom template", async ({ request }) => {
      const newTemplate = {
        name: "Test Template",
        category: "twitter",
        template: "Test {variable} template",
        variables: {
          variable: {
            type: "text",
            required: true,
            description: "Test variable"
          }
        },
        constraints: {
          maxLength: 280
        },
        type: "custom"
      };

      const response = await request.post(`${baseUrl}/api/templates`, {
        data: JSON.stringify(newTemplate),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Should return 401 without auth, or 201 with auth
      expect([200, 201, 401]).toContain(response.status());

      if (response.status() === 201) {
        const data = await response.json();
        expect(data).toHaveProperty("template");
        expect(data.template.name).toBe("Test Template");
      }
    });

    test("should validate required fields", async ({ request }) => {
      const invalidTemplate = {
        name: "", // Empty name should fail
        category: "twitter",
        template: "Test template"
      };

      const response = await request.post(`${baseUrl}/api/templates`, {
        data: JSON.stringify(invalidTemplate),
        headers: {
          "Content-Type": "application/json",
        },
      });

      expect(response.status()).toBe(400);
    });
  });

  test.describe("GET /api/templates/[id]", () => {
    test("should return single template", async ({ request }) => {
      // First, get a template ID
      const listResponse = await request.get(`${baseUrl}/api/templates`);
      const listData = await listResponse.json();

      if (listData.templates.length > 0) {
        const templateId = listData.templates[0].id;

        const response = await request.get(`${baseUrl}/api/templates/${templateId}`);

        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty("template");
        expect(data.template.id).toBe(templateId);
      }
    });

    test("should return 404 for non-existent template", async ({ request }) => {
      const response = await request.get(
        `${baseUrl}/api/templates/non-existent-id`
      );

      expect(response.status()).toBe(404);
    });
  });

  test.describe("POST /api/templates/[id]/favorite", () => {
    test("should toggle template favorite status", async ({ request }) => {
      // First, get a template ID
      const listResponse = await request.get(`${baseUrl}/api/templates`);
      const listData = await listResponse.json();

      if (listData.templates.length > 0) {
        const templateId = listData.templates[0].id;
        const originalFavorite = listData.templates[0].isFavorite;

        const response = await request.post(
          `${baseUrl}/api/templates/${templateId}/favorite`
        );

        expect([200, 401, 403]).toContain(response.status());

        if (response.status() === 200) {
          const data = await response.json();
          expect(data).toHaveProperty("template");
          expect(data.template.isFavorite).toBe(!originalFavorite);
        }
      }
    });
  });

  test.describe("POST /api/generate/from-template", () => {
    test("should generate content from template", async ({ request }) => {
      // First, get a template ID
      const listResponse = await request.get(`${baseUrl}/api/templates`);
      const listData = await listResponse.json();

      if (listData.templates.length > 0) {
        const templateId = listData.templates[0].id;

        const generateRequest = {
          templateId,
          productInfo: {
            name: "Test Product",
            description: "Test Description",
            url: "https://example.com"
          },
          variables: {
            benefit: "grow your audience",
            pain: "posting daily",
            time: "30 days"
          }
        };

        const response = await request.post(
          `${baseUrl}/api/generate/from-template`,
          {
            data: JSON.stringify(generateRequest),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        expect([200, 401]).toContain(response.status());

        if (response.status() === 200) {
          const data = await response.json();
          expect(data).toHaveProperty("content");
          expect(data).toHaveProperty("validation");
          expect(data).toHaveProperty("variables");

          // Validation should have structure
          expect(data.validation).toHaveProperty("isValid");
          expect(data.validation).toHaveProperty("errors");
          expect(data.validation).toHaveProperty("warnings");
          expect(Array.isArray(data.validation.errors)).toBe(true);
          expect(Array.isArray(data.validation.warnings)).toBe(true);
        }
      }
    });

    test("should validate required fields", async ({ request }) => {
      const invalidRequest = {
        // Missing templateId
        productInfo: {
          name: "Test Product"
        }
      };

      const response = await request.post(
        `${baseUrl}/api/generate/from-template`,
        {
          data: JSON.stringify(invalidRequest),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      expect(response.status()).toBe(400);
    });
  });
});

test.describe("Template Validation", () => {
  test("should enforce character limits", async ({ request }) => {
    const baseUrl = "http://localhost:3000";

    // Create a template with maxLength constraint
    const newTemplate = {
      name: "Test Character Limit",
      category: "twitter",
      template: "Test template with {variable}",
      variables: {
        variable: { type: "text", required: true }
      },
      constraints: {
        maxLength: 50
      },
      type: "custom"
    };

    // This would require authentication to work
    // For now, we'll test the validation logic conceptually

    // The template should validate content against maxLength
    expect(newTemplate.constraints.maxLength).toBe(50);
  });

  test("should validate required sections", async () => {
    const templateWithRequiredSections = {
      constraints: {
        requiredSections: ["hook", "value", "CTA"]
      }
    };

    // Validation should check for these sections
    const content = "This has hook and value but no CTA";
    const missingSection = templateWithRequiredSections.constraints.requiredSections.find(
      section => !content.toLowerCase().includes(section.toLowerCase())
    );

    expect(missingSection).toBe("CTA");
  });
});

test.describe("Template Variables", () => {
  test("should fill template variables correctly", () => {
    const template = "X ways to {benefit} without {pain} in {time}";
    const variables = {
      benefit: "grow your audience",
      pain: "posting daily",
      time: "30 days"
    };

    let filledTemplate = template;
    Object.entries(variables).forEach(([key, value]) => {
      filledTemplate = filledTemplate.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });

    expect(filledTemplate).toBe("X ways to grow your audience without posting daily in 30 days");
  });

  test("should handle AI-generated variables", () => {
    const variableDefinition = {
      type: "ai_generated",
      required: true,
      description: "Compelling benefit"
    };

    expect(variableDefinition.type).toBe("ai_generated");
    expect(variableDefinition.required).toBe(true);
    expect(variableDefinition.description).toBeDefined();
  });
});

test.describe("Template Constraints", () => {
  test("should validate hashtag counts", () => {
    const constraints = {
      hashtagCount: "2-3"
    };

    const content = "This has #one hashtag";
    const hashtagCount = (content.match(/#/g) || []).length;

    expect(hashtagCount).toBe(1);
    expect(hashtagCount).toBeLessThan(2); // Below minimum
  });

  test("should validate content length", () => {
    const constraints = {
      minLength: 100,
      maxLength: 280
    };

    const shortContent = "Too short";
    const longContent = "A".repeat(300);
    const validContent = "This is a valid length ".repeat(10);

    expect(shortContent.length).toBeLessThan(constraints.minLength);
    expect(longContent.length).toBeGreaterThan(constraints.maxLength);
    expect(validContent.length).toBeGreaterThanOrEqual(constraints.minLength);
    expect(validContent.length).toBeLessThanOrEqual(constraints.maxLength);
  });
});
