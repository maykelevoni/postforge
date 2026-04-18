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
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/20">
      <svg
        className="h-5 w-5 text-indigo-400"
        viewBox="0 0 20 20"
        fill="currentColor"
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
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans antialiased">
      {/* Gradient animation keyframes */}
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-text {
          background: linear-gradient(to right, #e2e8f0, #a5b4fc, #f8fafc, #c4b5fd, #e2e8f0);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 6s linear infinite;
        }
      `}</style>

      {/* Sticky Nav */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-base font-semibold text-white">{serviceName}</span>
          {sections.cta && (
            <a
              href="#cta"
              className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              {ctaText}
            </a>
          )}
        </div>
      </header>

      <main>
        {/* Hero */}
        {sections.hero && (
          <section className="relative overflow-hidden py-24 px-6 text-center">
            {/* Glow blobs */}
            <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
              <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/25 blur-3xl" />
              <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
              <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-900/15 blur-3xl" />
            </div>

            <div className="mx-auto max-w-4xl">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Now available
              </div>

              {/* Headline */}
              <h1 className="gradient-text mx-auto mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
                {title}
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-400">
                {subtitle}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="#cta"
                  className="rounded-xl bg-indigo-600 px-8 py-4 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 hover:scale-105 transform"
                >
                  {ctaText}
                </a>
                <a
                  href="#features"
                  className="rounded-xl border border-gray-700 bg-gray-800/50 px-8 py-4 font-semibold text-gray-200 transition hover:bg-gray-700"
                >
                  Learn more
                </a>
              </div>

              {/* Social proof */}
              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
                <span className="text-amber-400">★★★★★</span>
                <span>Trusted by 2,000+ creators worldwide</span>
              </div>
            </div>
          </section>
        )}

        {/* Features */}
        {sections.features && features.length > 0 && (
          <section id="features" className="py-20 px-6">
            <div className="mx-auto max-w-6xl">
              <div className="mb-14 text-center">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  Everything you need
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-gray-400">
                  Packed with powerful features designed to help you move faster
                  and deliver more value.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature: string, i: number) => (
                  <div
                    key={i}
                    className="group rounded-2xl border border-gray-800 bg-gray-900/50 p-6 transition hover:border-indigo-500/30 hover:bg-gray-900"
                  >
                    <div className="mb-4">
                      <FeatureIcon />
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-gray-300">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        {sections.testimonials && testimonials.length > 0 && (
          <section className="relative py-20 px-6">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
            <div className="mx-auto max-w-6xl">
              <div className="mb-14 text-center">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  What people are saying
                </h2>
                <p className="mt-4 text-gray-400">
                  Real feedback from real customers.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map(
                  (t: { name: string; text: string }, i: number) => (
                    <div
                      key={i}
                      className="relative rounded-2xl border border-gray-800 bg-gray-900 p-6"
                    >
                      <div className="mb-3 text-amber-400">★★★★★</div>
                      <p className="mb-5 text-sm italic leading-relaxed text-gray-300">
                        {t.text}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-semibold text-indigo-300">
                          {t.name
                            .split(" ")
                            .slice(0, 2)
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <p className="text-sm font-semibold text-white">
                          {t.name}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        {sections.cta && (
          <section id="cta" className="py-20 px-6">
            <div
              className="mx-auto max-w-2xl rounded-3xl border border-indigo-500/20 p-10 text-center"
              style={{
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              }}
            >
              <h2 className="mb-3 text-4xl font-extrabold text-white">
                {ctaText}
              </h2>
              <p className="mb-8 text-white/70">
                Join {serviceName} today. Fill in your details and we will be in
                touch.
              </p>
              <LeadForm landingPageId={landingPageId} variant="dark" />
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950 py-8 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} {serviceName}. All rights reserved.
      </footer>
    </div>
  );
}
