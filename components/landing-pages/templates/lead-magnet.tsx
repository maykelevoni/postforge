import LeadForm from "@/components/landing-pages/lead-form";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LandingPageVariables {
  title: string;
  subtitle: string;
  ctaText: string;
  benefits?: string[];
  urgencyText?: string;
}

export interface LandingPageSections {
  hero: boolean;
  benefits: boolean;
  cta: boolean;
}

interface LeadMagnetTemplateProps {
  variables: LandingPageVariables;
  sections: LandingPageSections;
  landingPageId: string;
  serviceName: string;
}

// ---------------------------------------------------------------------------
// Check icon for benefit bullets
// ---------------------------------------------------------------------------

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5 shrink-0 text-indigo-400"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Decorative background
// ---------------------------------------------------------------------------

function BackgroundBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-40 -top-20 h-72 w-72 rounded-full bg-indigo-600/25 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-900/15 blur-3xl" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero Section — includes the lead form inline (above the fold)
// ---------------------------------------------------------------------------

function HeroSection({
  title,
  subtitle,
  ctaText,
  urgencyText,
  landingPageId,
}: {
  title: string;
  subtitle: string;
  ctaText: string;
  urgencyText: string;
  landingPageId: string;
}) {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-24">
      <BackgroundBlobs />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Left — copy */}
          <div className="flex flex-col items-center text-center lg:items-start lg:pt-4 lg:text-left">
            {/* Urgency badge */}
            {urgencyText && (
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-semibold text-amber-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                {urgencyText}
              </div>
            )}

            {/* Headline */}
            <h1 className="mb-5 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="mb-0 max-w-lg text-lg leading-relaxed text-gray-400 sm:text-xl">
              {subtitle}
            </p>
          </div>

          {/* Right — form card */}
          <div className="relative">
            {/* Glow behind card */}
            <div
              className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-indigo-600/10 blur-2xl"
              aria-hidden="true"
            />

            <div className="rounded-3xl border border-indigo-500/20 bg-gray-900/80 p-7 shadow-2xl backdrop-blur-sm sm:p-8">
              <p className="mb-1 text-lg font-bold text-white">
                Get instant access
              </p>
              <p className="mb-6 text-sm text-gray-400">
                {ctaText}
              </p>

              <LeadForm landingPageId={landingPageId} variant="dark" />

              <p className="mt-4 text-center text-xs text-gray-600">
                No spam, ever. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Benefits Section
// ---------------------------------------------------------------------------

function BenefitsSection({ benefits }: { benefits: string[] }) {
  return (
    <section id="benefits" className="relative py-16 sm:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            What you&apos;ll get
          </h2>
          <p className="text-base text-gray-400">
            Everything you need to get started — delivered instantly.
          </p>
        </div>

        <ul className="space-y-4">
          {benefits.map((benefit, index) => (
            <li
              key={index}
              className="flex items-start gap-4 rounded-2xl border border-gray-700/60 bg-gray-800/40 px-5 py-4 backdrop-blur-sm transition-colors hover:border-indigo-500/30 hover:bg-gray-800/70"
            >
              <CheckIcon />
              <span className="text-sm font-medium leading-relaxed text-gray-200">
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Bottom CTA Section
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
    <section id="cta" className="relative py-16 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      <div className="relative mx-auto max-w-lg px-6 text-center">
        {/* Glow */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-indigo-600/10 blur-2xl"
          aria-hidden="true"
        />

        <div className="rounded-3xl border border-indigo-500/20 bg-gray-900/80 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Ready to get started?
          </h2>
          <p className="mb-7 text-sm text-gray-400">
            {ctaText} — from {serviceName}.
          </p>

          <LeadForm landingPageId={landingPageId} variant="dark" />

          <p className="mt-4 text-xs text-gray-600">
            Free. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main template component (server component — no "use client")
// ---------------------------------------------------------------------------

export default function LeadMagnetTemplate({
  variables,
  sections,
  landingPageId,
  serviceName,
}: LeadMagnetTemplateProps) {
  const {
    title = "Get the Free Guide",
    subtitle = "Download our step-by-step guide and start seeing results today.",
    ctaText = "Send me the free guide",
    benefits = [],
    urgencyText = "",
  } = variables;

  return (
    <div className="min-h-screen bg-gray-950 font-sans text-white antialiased">
      {/* Minimal nav — no distractions */}
      <header className="border-b border-gray-800/60 bg-gray-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-base font-semibold tracking-tight text-white">
            {serviceName}
          </span>
          {sections.cta && !sections.hero && (
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
            urgencyText={urgencyText}
            landingPageId={landingPageId}
          />
        )}

        {sections.benefits && benefits.length > 0 && (
          <BenefitsSection benefits={benefits} />
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
