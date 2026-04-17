import LeadForm from "@/components/landing-pages/lead-form";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LandingPageVariables {
  title: string;
  subtitle: string;
  ctaText: string;
  serviceList?: string[];
  trustLogos?: string[];
  features?: string[];
}

export interface LandingPageSections {
  hero: boolean;
  features: boolean;
  logoGrid: boolean;
  cta: boolean;
}

interface ServiceTemplateProps {
  variables: LandingPageVariables;
  sections: LandingPageSections;
  landingPageId: string;
  serviceName: string;
}

// ---------------------------------------------------------------------------
// Decorative background
// ---------------------------------------------------------------------------

function BackgroundBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-700/20 blur-3xl" />
      <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-violet-700/15 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-96 w-[700px] -translate-x-1/2 rounded-full bg-indigo-900/15 blur-3xl" />
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
  serviceName,
}: {
  title: string;
  subtitle: string;
  ctaText: string;
  serviceName: string;
}) {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-24">
      <BackgroundBlobs />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Professional Services
          </div>

          {/* Headline */}
          <h1 className="mb-5 max-w-3xl bg-gradient-to-b from-white to-gray-400 bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
            {subtitle}
          </p>

          {/* CTA row */}
          <div className="flex flex-col items-center gap-4 sm:flex-row lg:items-start">
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
              See what&apos;s included
            </a>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            {serviceName} &mdash; trusted by clients worldwide
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Service Features / Details Section
// ---------------------------------------------------------------------------

function ServiceIcon({ index }: { index: number }) {
  // Rotate through a few simple icons for variety
  const icons = [
    // Star / quality
    <svg key="star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
    </svg>,
    // Shield / trust
    <svg key="shield" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path fillRule="evenodd" d="M9.661 2.237a.531.531 0 0 1 .678 0 11.947 11.947 0 0 0 7.078 2.749.5.5 0 0 1 .479.425c.069.52.104 1.05.104 1.589 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 0 1-.332 0C5.26 16.563 2 12.162 2 7c0-.538.035-1.069.104-1.589a.5.5 0 0 1 .48-.425 11.947 11.947 0 0 0 7.077-2.749Z" clipRule="evenodd" />
    </svg>,
    // Bolt / speed
    <svg key="bolt" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
    </svg>,
    // Chart / results
    <svg key="chart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2ZM9.5 6A1.5 1.5 0 0 0 8 7.5v9a1.5 1.5 0 0 0 3 0v-9A1.5 1.5 0 0 0 9.5 6ZM3.5 10A1.5 1.5 0 0 0 2 11.5v5a1.5 1.5 0 0 0 3 0v-5A1.5 1.5 0 0 0 3.5 10Z" />
    </svg>,
    // Users / team
    <svg key="users" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
    </svg>,
    // Sparkles / creativity
    <svg key="sparkles" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
    </svg>,
  ];
  return icons[index % icons.length];
}

function ServiceFeaturesSection({ serviceList }: { serviceList: string[] }) {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      {/* Top divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What&apos;s included
          </h2>
          <p className="mx-auto max-w-xl text-base text-gray-400">
            A comprehensive service built around your goals and delivered with
            precision.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {serviceList.map((item, index) => (
            <div
              key={index}
              className="group relative flex items-start gap-4 rounded-2xl border border-gray-700/60 bg-gray-800/40 p-5 backdrop-blur-sm transition-all hover:border-indigo-500/40 hover:bg-gray-800/70"
            >
              {/* Hover ring */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-inset ring-indigo-500/20 transition-opacity group-hover:opacity-100" />

              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                <ServiceIcon index={index} />
              </div>

              <p className="pt-1.5 text-sm font-medium leading-relaxed text-gray-200">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Trust / Logo Grid Section (text-based placeholder logos)
// ---------------------------------------------------------------------------

function LogoGridSection({ trustLogos }: { trustLogos: string[] }) {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="mb-10 text-sm font-medium uppercase tracking-widest text-gray-500">
          Trusted by
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {trustLogos.map((logo, index) => (
            <span
              key={index}
              className="text-base font-semibold tracking-tight text-gray-500 transition-colors hover:text-gray-300"
            >
              {logo}
            </span>
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
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      <div className="relative mx-auto max-w-2xl px-6">
        {/* Glow */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-indigo-600/10 blur-2xl"
          aria-hidden="true"
        />

        <div className="rounded-3xl border border-indigo-500/20 bg-gray-900/80 p-8 text-center shadow-2xl backdrop-blur-sm sm:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Accepting new clients
          </div>

          <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {ctaText}
          </h2>
          <p className="mb-8 text-base text-gray-400">
            Get in touch with {serviceName} today. Fill in your details and
            we&apos;ll respond within 24 hours.
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

export default function ServiceTemplate({
  variables,
  sections,
  landingPageId,
  serviceName,
}: ServiceTemplateProps) {
  const {
    title = "Professional Services Tailored for You",
    subtitle = "We deliver results-driven solutions so you can focus on what matters most.",
    ctaText = "Work with us",
    serviceList = [],
    trustLogos = [],
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
            serviceName={serviceName}
          />
        )}

        {sections.features && serviceList.length > 0 && (
          <ServiceFeaturesSection serviceList={serviceList} />
        )}

        {sections.logoGrid && trustLogos.length > 0 && (
          <LogoGridSection trustLogos={trustLogos} />
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
