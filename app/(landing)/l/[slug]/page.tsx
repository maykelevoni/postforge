import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import SaasTemplate from "@/components/landing-pages/templates/saas";
import ServiceTemplate from "@/components/landing-pages/templates/service";
import LeadMagnetTemplate from "@/components/landing-pages/templates/lead-magnet";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = await db.landingPage.findUnique({
    where: { slug: params.slug },
  });

  if (!page || page.status !== "published") {
    return { title: "Page Not Found" };
  }

  let title = "Landing Page";
  let description: string | undefined;

  try {
    const variables = JSON.parse(page.variables) as Record<string, unknown>;
    if (typeof variables.title === "string") title = variables.title;
    if (typeof variables.subtitle === "string")
      description = variables.subtitle;
  } catch {
    // Fall back to defaults
  }

  return {
    title,
    description,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function LandingPageRoute({
  params,
}: {
  params: { slug: string };
}) {
  const page = await db.landingPage.findUnique({
    where: { slug: params.slug },
    include: { service: true },
  });

  // Not found or not published → 404
  if (!page || page.status !== "published") {
    notFound();
  }

  // Parse JSON fields stored as text
  let variables: Record<string, unknown> = {};
  let sections: Record<string, boolean> = {};

  try {
    variables = JSON.parse(page.variables) as Record<string, unknown>;
  } catch {
    variables = {};
  }

  try {
    sections = JSON.parse(page.sections) as Record<string, boolean>;
  } catch {
    sections = {};
  }

  const serviceName = page.service?.name ?? "";

  const sharedProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables: variables as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sections: sections as any,
    landingPageId: page.id,
    serviceName,
  };

  if (page.template === "saas") {
    return <SaasTemplate {...sharedProps} />;
  }

  if (page.template === "service") {
    return <ServiceTemplate {...sharedProps} />;
  }

  if (page.template === "lead_magnet") {
    return <LeadMagnetTemplate {...sharedProps} />;
  }

  // Unknown template — treat as not found
  notFound();
}
