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
// Main template component (server component — no "use client")
// ---------------------------------------------------------------------------

export default function ServiceTemplate({
  variables,
  sections,
  landingPageId,
  serviceName,
}: ServiceTemplateProps) {
  const {
    title = "Transform Your Business",
    subtitle = "We deliver results-driven solutions so you can focus on what matters most.",
    ctaText = "Book a Free Call",
    serviceList = [],
    features = [],
  } = variables;

  const benefits = features.length > 0 ? features : serviceList;

  const testimonialName = (variables as any).testimonialName ?? "";
  const testimonialQuote = (variables as any).testimonialQuote ?? "";
  const testimonialRole = (variables as any).testimonialRole ?? "";

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      <style dangerouslySetInnerHTML={{ __html: `
        .orange-gradient-text {
          background: linear-gradient(to right, #f97316, #ef4444);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      ` }} />

      {/* Sticky Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <span className="text-base font-bold text-gray-900">{serviceName}</span>
          <a
            href="#cta"
            className="rounded-full bg-orange-500 px-6 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            {ctaText}
          </a>
        </div>
      </header>

      {/* Hero */}
      {sections.hero && (
        <section className="py-12 px-4 text-center bg-white sm:py-20 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-orange-500">
              {serviceName}
            </p>
            <h1 className="mb-6 text-3xl font-extrabold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="orange-gradient-text">{title.split(" ")[0]}</span>{" "}
              {title.split(" ").slice(1).join(" ")}
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-gray-500">
              {subtitle}
            </p>
            <a
              href="#cta"
              className="inline-block transform rounded-full bg-orange-500 px-10 py-4 text-lg font-bold text-white shadow-lg shadow-orange-200 transition hover:scale-105 hover:bg-orange-600"
            >
              {ctaText} →
            </a>
            <p className="mt-4 text-sm text-gray-400">
              <a href="#features" className="underline hover:text-gray-600">
                See how it works ↓
              </a>
            </p>
          </div>
        </section>
      )}

      {/* Social Proof Bar */}
      <div className="border-y border-gray-100 bg-gray-50 py-4 px-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-4 text-sm font-medium text-gray-600 sm:gap-8">
          <span>✓ 500+ clients served</span>
          <span className="text-amber-500">★★★★★ 4.9/5 rating</span>
          <span>🔒 100% Satisfaction guarantee</span>
        </div>
      </div>

      {/* Benefits */}
      {sections.features && benefits.length > 0 && (
        <section id="features" className="py-12 px-4 sm:py-20 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-3 text-center text-3xl font-bold text-gray-900">
              Why choose {serviceName}
            </h2>
            <p className="mb-12 text-center text-gray-500">
              Everything you need to grow — nothing you don&apos;t.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((item: string, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-3.5 w-3.5 text-green-600"
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
                  <p className="text-sm font-medium text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial (single) */}
      {testimonialName && testimonialQuote && (
        <section className="bg-gray-50 py-10 px-4 sm:py-16 sm:px-6">
          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-5 shadow-md sm:p-8">
            <div className="mb-3 text-amber-400">★★★★★</div>
            <p className="mb-5 text-base italic leading-relaxed text-gray-600">
              &ldquo;{testimonialQuote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                {testimonialName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{testimonialName}</p>
                {testimonialRole && (
                  <p className="text-xs text-gray-400">{testimonialRole}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {sections.cta && (
        <section
          id="cta"
          className="py-12 px-4 text-center text-white sm:py-20 sm:px-6"
          style={{ background: "linear-gradient(135deg, #f97316, #ef4444)" }}
        >
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-3 text-2xl font-extrabold sm:text-3xl md:text-4xl">{ctaText}</h2>
            <p className="mb-8 text-white/80">
              Ready to get started? Fill in your details below.
            </p>
            <div className="mx-auto max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-8">
              <LeadForm landingPageId={landingPageId} variant="light" />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} {serviceName}. All rights reserved.
      </footer>
    </div>
  );
}
