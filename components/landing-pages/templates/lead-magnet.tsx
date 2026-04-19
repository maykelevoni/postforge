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
  features?: string[];
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
// Main template component (server component — no "use client")
// ---------------------------------------------------------------------------

export default function LeadMagnetTemplate({
  variables,
  sections,
  landingPageId,
  serviceName,
}: LeadMagnetTemplateProps) {
  const {
    title = "Get Your Free Guide",
    subtitle = "Download our step-by-step guide and start seeing results today.",
    ctaText = "Send me the guide",
    benefits = [],
    features = [],
  } = variables;

  // Support both `features` and `benefits` as the bullet list source
  const bulletItems = features.length > 0 ? features : benefits;

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white font-sans antialiased">
      <style dangerouslySetInnerHTML={{ __html: `
        .rose-gradient-text {
          background: linear-gradient(to right, #fb7185, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      ` }} />

      {/* Nav */}
      <header className="border-b border-white/5 bg-[#0d0d14]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <span className="text-base font-semibold text-white">{serviceName}</span>
        </div>
      </header>

      {/* Hero */}
      {sections.hero && (
        <section className="relative overflow-hidden py-14 px-4 text-center sm:py-24 sm:px-6">
          {/* Background glows */}
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-rose-600/20 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl" />
          </div>

          <div className="mx-auto max-w-3xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-rose-300">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              Free Download
            </div>

            {/* Headline */}
            <h1 className="rose-gradient-text mb-6 text-3xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-10 max-w-xl text-xl leading-relaxed text-gray-400">
              {subtitle}
            </p>

            {/* Scroll-down arrow */}
            <a
              href="#cta"
              className="inline-flex items-center gap-2 text-sm text-rose-400 transition hover:text-rose-300"
            >
              <span>Get instant access</span>
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a.75.75 0 0 1 .75.75v10.19l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3.75A.75.75 0 0 1 10 3Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </section>
      )}

      {/* Benefits */}
      {bulletItems.length > 0 && (
        <section className="py-10 px-4 sm:py-16 sm:px-6">
          <div className="mx-auto max-w-xl">
            <h2 className="mb-10 text-center text-2xl font-bold text-white">
              What you&apos;ll get
            </h2>
            <div className="flex flex-col gap-4">
              {bulletItems.map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/20">
                    <svg
                      className="h-3.5 w-3.5 text-rose-400"
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
                  <p className="text-sm leading-relaxed text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Form */}
      {sections.cta && (
        <section id="cta" className="py-10 px-4 sm:py-16 sm:px-6">
          <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <h3 className="mb-2 text-2xl font-bold text-gray-900">Get instant access</h3>
            <p className="mb-6 text-sm text-gray-500">
              Free. No spam. Unsubscribe anytime.
            </p>
            <LeadForm landingPageId={landingPageId} variant="light" />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-950 py-6 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} {serviceName}. All rights reserved.
      </footer>
    </div>
  );
}
