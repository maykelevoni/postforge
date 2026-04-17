import LeadForm from "@/components/landing-pages/lead-form";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LandingPageVariables {
  title: string;
  subtitle: string;
  ctaText: string;
  features: string[];
  testimonials?: { name: string; text: string }[];
}

export interface LandingPageSections {
  hero: boolean;
  features: boolean;
  testimonials: boolean;
  cta: boolean;
}

interface SaasTemplateProps {
  variables: LandingPageVariables;
  sections: LandingPageSections;
  landingPageId: string;
  serviceName: string;
}

// ---------------------------------------------------------------------------
// Feature icon — CSS-only decorative circle with a check mark
// ---------------------------------------------------------------------------

function FeatureIcon() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M16.704 5.296a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L8 12.586l7.296-7.29a1 1 0 0 1 1.408.006Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Decorative background blobs — purely CSS, no images
// ---------------------------------------------------------------------------

function BackgroundBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Top-left blob */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      {/* Top-right blob */}
      <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
      {/* Center blob */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-900/20 blur-3xl" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero Section
// ---------------------------------------------------------------------------

function HeroSection({
  title,
  subtitle,
  ctaText,
}: {
  title: string;
  subtitle: string;
  ctaText: string;
}) {
  return (
    <section className="relative overflow-hidden pb-24 pt-20 sm:pb-32 sm:pt-32">
      <BackgroundBlobs />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          Now available
        </div>

        {/* Headline */}
        <h1 className="mx-auto mb-6 max-w-3xl bg-gradient-to-b from-white to-gray-400 bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
          {subtitle}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#cta"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            {ctaText}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800/50 px-7 py-3.5 text-sm font-semibold text-gray-200 transition-all hover:border-gray-600 hover:bg-gray-700/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
          >
            Learn more
          </a>
        </div>

        {/* Social proof strip */}
        <p className="mt-8 text-sm text-gray-500">
          Trusted by hundreds of teams worldwide &mdash; no credit card required
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Features Section
// ---------------------------------------------------------------------------

function FeaturesSection({ features }: { features: string[] }) {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      {/* Section header */}
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need
          </h2>
          <p className="mx-auto max-w-xl text-base text-gray-400">
            Packed with powerful features designed to help you move faster and
            deliver more value.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative flex flex-col gap-4 rounded-2xl border border-gray-700/60 bg-gray-800/40 p-6 backdrop-blur-sm transition-all hover:border-indigo-500/40 hover:bg-gray-800/70"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-inset ring-indigo-500/20 transition-opacity group-hover:opacity-100" />
              <FeatureIcon />
              <p className="text-sm font-medium leading-relaxed text-gray-200">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Testimonials Section
// ---------------------------------------------------------------------------

function TestimonialsSection({
  testimonials,
}: {
  testimonials: { name: string; text: string }[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-28">
      {/* Faint divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What people are saying
          </h2>
          <p className="text-base text-gray-400">
            Real feedback from real customers.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="relative flex flex-col justify-between gap-6 rounded-2xl border border-gray-700/60 bg-gray-800/40 p-6 backdrop-blur-sm"
            >
              {/* Quote mark */}
              <svg
                className="absolute right-6 top-6 h-8 w-8 text-indigo-500/20"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>

              {/* Quote text */}
              <p className="text-sm leading-relaxed text-gray-300">{t.text}</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Initials avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-semibold text-indigo-300">
                  {t.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CTA Section
// ---------------------------------------------------------------------------

function CTASection({
  ctaText,
  serviceName,
  landingPageId,
}: {
  ctaText: string;
  serviceName: string;
  landingPageId: string;
}) {
  return (
    <section id="cta" className="relative py-20 sm:py-28">
      {/* Top divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      <div className="relative mx-auto max-w-2xl px-6">
        {/* Glow behind the card */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-indigo-600/10 blur-2xl"
          aria-hidden="true"
        />

        <div className="rounded-3xl border border-indigo-500/20 bg-gray-900/80 p-8 text-center shadow-2xl backdrop-blur-sm sm:p-10">
          <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {ctaText}
          </h2>
          <p className="mb-8 text-base text-gray-400">
            Join {serviceName} today. Fill in your details and we&apos;ll be in
            touch shortly.
          </p>

          <LeadForm landingPageId={landingPageId} variant="dark" />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main template component (server component — no "use client")
// ---------------------------------------------------------------------------

export default function SaasTemplate({
  variables,
  sections,
  landingPageId,
  serviceName,
}: SaasTemplateProps) {
  const {
    title = "Build something amazing",
    subtitle = "The platform built for modern teams.",
    ctaText = "Get started for free",
    features = [],
    testimonials = [],
  } = variables;

  return (
    <div className="min-h-screen bg-gray-950 font-sans text-white antialiased">
      {/* Sticky nav */}
      <header className="sticky top-0 z-50 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-base font-semibold tracking-tight text-white">
            {serviceName}
          </span>
          {sections.cta && (
            <a
              href="#cta"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              {ctaText}
            </a>
          )}
        </div>
      </header>

      <main>
        {sections.hero && (
          <HeroSection
            title={title}
            subtitle={subtitle}
            ctaText={ctaText}
          />
        )}

        {sections.features && features.length > 0 && (
          <FeaturesSection features={features} />
        )}

        {sections.testimonials && testimonials.length > 0 && (
          <TestimonialsSection testimonials={testimonials} />
        )}

        {sections.cta && (
          <CTASection
            ctaText={ctaText}
            serviceName={serviceName}
            landingPageId={landingPageId}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/60 py-8 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} {serviceName}. All rights reserved.
      </footer>
    </div>
  );
}
