import { db } from "@/lib/db";
import { generateText } from "@/lib/ai";

// ========================================
// TypeScript Interfaces
// ========================================

export interface TemplateVariable {
  type: 'text' | 'number' | 'ai_generated';
  required: boolean;
  default?: string | number;
  description?: string;
  placeholder?: string;
}

export interface TemplateConstraints {
  maxLength?: number;
  minLength?: number;
  requiredSections?: string[];
  hashtagCount?: string;
  mentionCount?: string;
  customRules?: string[];
}

export interface Template {
  id: string;
  name: string;
  category: string;
  type: 'prebuilt' | 'custom';
  template: string;
  variables: Record<string, TemplateVariable>;
  constraints: TemplateConstraints;
  example?: string;
  isFavorite?: boolean;
  usageCount?: number;
}

// ========================================
// CRUD Operations
// ========================================

export async function getTemplates(
  userId: string,
  filters?: {
    category?: string;
    type?: 'prebuilt' | 'custom';
    favorites?: boolean;
  }
): Promise<Template[]> {
  const where: any = {
    OR: [
      { userId: null }, // Pre-built templates (available to all)
      { userId }, // User's custom templates
    ],
  };

  if (filters?.category) {
    where.category = filters.category;
  }

  if (filters?.type) {
    where.type = filters.type;
  }

  if (filters?.favorites) {
    where.isFavorite = true;
  }

  const templates = await db.template.findMany({
    where,
    orderBy: [
      { isFavorite: 'desc' },
      { usageCount: 'desc' },
      { name: 'asc' },
    ],
  });

  return templates.map(mapDbToTemplate);
}

export async function getTemplateById(
  id: string,
  userId?: string
): Promise<Template | null> {
  const template = await db.template.findUnique({
    where: { id },
  });

  if (!template) {
    return null;
  }

  // Check access: user must own it or it must be a prebuilt template
  if (template.userId && template.userId !== userId) {
    return null;
  }

  return mapDbToTemplate(template);
}

export async function createTemplate(
  userId: string,
  template: Omit<Template, 'id'>
): Promise<Template> {
  const created = await db.template.create({
    data: {
      userId,
      name: template.name,
      category: template.category,
      type: template.type,
      template: template.template,
      variables: JSON.stringify(template.variables),
      constraints: JSON.stringify(template.constraints),
      example: template.example,
      isFavorite: template.isFavorite || false,
      usageCount: template.usageCount || 0,
    },
  });

  return mapDbToTemplate(created);
}

export async function updateTemplate(
  id: string,
  userId: string,
  updates: Partial<Template>
): Promise<Template> {
  const template = await db.template.findUnique({
    where: { id },
  });

  if (!template || template.userId !== userId) {
    throw new Error('Template not found or access denied');
  }

  const updated = await db.template.update({
    where: { id },
    data: {
      ...(updates.name && { name: updates.name }),
      ...(updates.category && { category: updates.category }),
      ...(updates.template && { template: updates.template }),
      ...(updates.variables && { variables: JSON.stringify(updates.variables) }),
      ...(updates.constraints && { constraints: JSON.stringify(updates.constraints) }),
      ...(updates.example !== undefined && { example: updates.example }),
      ...(updates.isFavorite !== undefined && { isFavorite: updates.isFavorite }),
    },
  });

  return mapDbToTemplate(updated);
}

export async function deleteTemplate(id: string, userId: string): Promise<void> {
  const template = await db.template.findUnique({
    where: { id },
  });

  if (!template || template.userId !== userId) {
    throw new Error('Template not found or access denied');
  }

  await db.template.delete({
    where: { id },
  });
}

export async function toggleTemplateFavorite(
  id: string,
  userId: string
): Promise<Template> {
  const template = await db.template.findUnique({
    where: { id },
  });

  if (!template) {
    throw new Error('Template not found');
  }

  // Users can only favorite their own templates or prebuilt templates
  if (template.userId && template.userId !== userId) {
    throw new Error('Access denied');
  }

  const updated = await db.template.update({
    where: { id },
    data: {
      isFavorite: !template.isFavorite,
    },
  });

  return mapDbToTemplate(updated);
}

// ========================================
// Template Generation Functions
// ========================================

export async function generateFromTemplate(
  template: Template,
  variables: Record<string, string>,
  productInfo: {
    name: string;
    description: string;
    url: string;
  },
  userId: string
): Promise<{
  content: string;
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}> {
  // Fill template with variables
  let filledTemplate = template.template;
  Object.entries(variables).forEach(([key, value]) => {
    filledTemplate = filledTemplate.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });

  // Generate prompt from filled template
  const prompt = `Generate content following this exact template structure:

Template: ${filledTemplate}

Product: ${productInfo.name}
Description: ${productInfo.description}
URL: ${productInfo.url}

Requirements:
- Follow the template structure EXACTLY
- Do not deviate from the template format
- Fill in any remaining placeholders with high-quality content
${template.constraints.maxLength ? `- Maximum length: ${template.constraints.maxLength} characters` : ''}
${template.constraints.requiredSections ? `- Must include: ${template.constraints.requiredSections.join(', ')}` : ''}`;

  const system = "You are a content generation expert. Follow the template structure exactly.";

  try {
    const content = await generateText({
      prompt,
      system,
      userId,
    });

    // Validate the generated content
    const validation = await validateTemplateConstraints(content, template);

    return {
      content,
      validation,
    };
  } catch (error) {
    throw new Error(`Template generation failed: ${error}`);
  }
}

export async function fillTemplateVariables(
  template: Template,
  productInfo: {
    name: string;
    description: string;
    url: string;
  },
  userId: string
): Promise<Record<string, string>> {
  const filledVariables: Record<string, string> = {};

  for (const [key, variable] of Object.entries(template.variables)) {
    if (variable.type === 'ai_generated') {
      // Generate variable value using AI
      const prompt = `Generate a ${variable.description || key} for: ${productInfo.name} - ${productInfo.description}

Keep it ${variable.required ? 'essential' : 'optional'} and make it compelling.`;

      try {
        const value = await generateText({
          prompt,
          system: "You are a content generation expert. Generate high-quality content variables.",
          userId,
        });

        filledVariables[key] = value.trim().substring(0, 100); // Limit length
      } catch (error) {
        // Fallback to default or empty string
        filledVariables[key] = String(variable.default || '');
      }
    } else {
      // Use default value for non-AI variables
      filledVariables[key] = String(variable.default || '');
    }
  }

  return filledVariables;
}

export async function validateTemplateConstraints(
  content: string,
  template: Template
): Promise<{
  isValid: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check length constraints
  if (template.constraints.minLength && content.length < template.constraints.minLength) {
    errors.push(`Content is too short (${content.length} chars, minimum ${template.constraints.minLength})`);
  }

  if (template.constraints.maxLength && content.length > template.constraints.maxLength) {
    errors.push(`Content is too long (${content.length} chars, maximum ${template.constraints.maxLength})`);
  } else if (template.constraints.maxLength && content.length > template.constraints.maxLength * 0.9) {
    warnings.push(`Content is approaching maximum length (${content.length}/${template.constraints.maxLength})`);
  }

  // Check required sections
  if (template.constraints.requiredSections) {
    const missingSections = template.constraints.requiredSections.filter(section => {
      const regex = new RegExp(section, 'i');
      return !regex.test(content);
    });

    if (missingSections.length > 0) {
      errors.push(`Missing required sections: ${missingSections.join(', ')}`);
    }
  }

  // Check hashtag count
  if (template.constraints.hashtagCount) {
    const hashtagRegex = /#/g;
    const hashtagCount = (content.match(hashtagRegex) || []).length;

    const [min, max] = template.constraints.hashtagCount.split('-').map(Number);
    if (min && hashtagCount < min) {
      warnings.push(`Hashtag count is low (${hashtagCount}, minimum ${min})`);
    }
    if (max && hashtagCount > max) {
      errors.push(`Too many hashtags (${hashtagCount}, maximum ${max})`);
    }
  }

  // Check custom rules
  if (template.constraints.customRules) {
    template.constraints.customRules.forEach(rule => {
      // Basic custom rule validation (can be extended)
      if (rule.includes('no http') && /https?:\/\//.test(content)) {
        warnings.push('Content contains HTTP links');
      }
      if (rule.includes('no emoji') && /[\uD800-\uDFFF]/.test(content)) {
        warnings.push('Content contains emojis');
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ========================================
// Helper Functions
// ========================================

function mapDbToTemplate(dbTemplate: any): Template {
  return {
    id: dbTemplate.id,
    name: dbTemplate.name,
    category: dbTemplate.category,
    type: dbTemplate.type,
    template: dbTemplate.template,
    variables: JSON.parse(dbTemplate.variables),
    constraints: JSON.parse(dbTemplate.constraints),
    example: dbTemplate.example || undefined,
    isFavorite: dbTemplate.isFavorite,
    usageCount: dbTemplate.usageCount,
  };
}

export async function trackTemplateUsage(templateId: string): Promise<void> {
  await db.template.update({
    where: { id: templateId },
    data: {
      usageCount: {
        increment: 1,
      },
    },
  });
}