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
  testimonials?: { name: string; quote: string; role?: string }[];
  steps?: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
}

export interface LandingPageSections {
  hero: boolean;
  features: boolean;
  logoGrid: boolean;
  cta: boolean;
  testimonial: boolean;
  howItWorks: boolean;
  faq: boolean;
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
    testimonials = [],
    steps = [],
    faqs = [],
  } = variables;

  const benefits = features.length > 0 ? features : serviceList;
  const validSteps = steps.filter((s) => s.title.trim() !== "");

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      <style dangerouslySetInnerHTML={{ __html: `
        .orange-gradient-text {
          background: linear-gradient(to right, #f97316, #ef4444);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        details summary { list-style: none; }
        details summary::-webkit-details-marker { display: none; }
        details[open] summary .faq-chevron { transform: rotate(180deg); }
        .faq-chevron { transition: transform 0.2s ease; display: inline-block; }
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
              <a href="#how-it-works" className="underline hover:text-gray-600">
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
                    <svg className="h-3.5 w-3.5 text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 5.296a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L8 12.586l7.296-7.29a1 1 0 0 1 1.408.006Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      {sections.howItWorks && validSteps.length > 0 && (
        <section id="how-it-works" className="bg-orange-50 py-12 px-4 sm:py-20 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-3 text-center text-3xl font-bold text-gray-900">
              How it works
            </h2>
            <p className="mb-12 text-center text-gray-500">Simple. Fast. Effective.</p>
            <div className="grid gap-8 sm:grid-cols-3">
              {steps.map((s, i) => {
                if (!s.title.trim()) return null;
                return (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-lg font-extrabold text-white shadow-md shadow-orange-200">
                      {i + 1}
                    </div>
                    <h3 className="mb-2 text-base font-bold text-gray-900">{s.title}</h3>
                    {s.description && (
                      <p className="text-sm leading-relaxed text-gray-500">{s.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {sections.testimonial && testimonials.length > 0 && (
        <section className="bg-gray-50 py-10 px-4 sm:py-16 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
              What our clients say
            </h2>
            <div className={`grid gap-6 ${testimonials.length === 1 ? "max-w-2xl mx-auto" : "sm:grid-cols-2"}`}>
              {testimonials.map((t, i) => (
                <div key={i} className="rounded-2xl bg-white p-5 shadow-md sm:p-8">
                  <div className="mb-3 text-amber-400">★★★★★</div>
                  <p className="mb-5 text-base italic leading-relaxed text-gray-600">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                      {t.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{t.name}</p>
                      {t.role && <p className="text-xs text-gray-400">{t.role}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {sections.faq && faqs.length > 0 && (
        <section className="py-12 px-4 sm:py-20 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-3 text-center text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mb-10 text-center text-gray-500">Everything you need to know.</p>
            <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white overflow-hidden">
              {faqs.map((f, i) => (
                <details key={i} className="group">
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-semibold text-gray-900 hover:text-orange-600 transition-colors">
                    {f.question}
                    <span className="faq-chevron ml-4 shrink-0 text-gray-400">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-sm leading-relaxed text-gray-600">{f.answer}</div>
                </details>
              ))}
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
              <LeadForm landingPageId={landingPageId} variant="light" ctaText={ctaText} />
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
