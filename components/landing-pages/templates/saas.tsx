import Image from "next/image";
import LeadForm from "@/components/landing-pages/lead-form";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LandingPageVariables {
  title: string;
  subtitle: string;
  ctaText: string;
  features: string[];
  testimonials?: { name: string; quote: string; role?: string }[];
  steps?: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
}

export interface LandingPageSections {
  hero: boolean;
  features: boolean;
  testimonial: boolean;
  cta: boolean;
  howItWorks: boolean;
  faq: boolean;
}

interface SaasTemplateProps {
  variables: LandingPageVariables;
  sections: LandingPageSections;
  landingPageId: string;
  serviceName: string;
}

// ---------------------------------------------------------------------------
// Feature icons — verbatim from Cruip open-react-template/components/features.tsx
// ---------------------------------------------------------------------------

const FEATURE_ICONS = [
  <svg key={0} className="mb-3 fill-indigo-500" xmlns="http://www.w3.org/2000/svg" width={24} height={24}>
    <path d="M0 0h14v17H0V0Zm2 2v13h10V2H2Z" />
    <path fillOpacity=".48" d="m16.295 5.393 7.528 2.034-4.436 16.412L5.87 20.185l.522-1.93 11.585 3.132 3.392-12.55-5.597-1.514.522-1.93Z" />
  </svg>,
  <svg key={1} className="mb-3 fill-indigo-500" xmlns="http://www.w3.org/2000/svg" width={24} height={24}>
    <path fillOpacity=".48" d="M7 8V0H5v8h2Zm12 16v-4h-2v4h2Z" />
    <path d="M19 6H0v2h17v8H7v-6H5v8h19v-2h-5V6Z" />
  </svg>,
  <svg key={2} className="mb-3 fill-indigo-500" xmlns="http://www.w3.org/2000/svg" width={24} height={24}>
    <path d="M23.414 6 18 .586 16.586 2l3 3H7a6 6 0 0 0-6 6h2a4 4 0 0 1 4-4h12.586l-3 3L18 11.414 23.414 6Z" />
    <path fillOpacity=".48" d="M13.01 12.508a2.5 2.5 0 0 0-3.502.482L1.797 23.16.203 21.952l7.71-10.17a4.5 4.5 0 1 1 7.172 5.437l-4.84 6.386-1.594-1.209 4.841-6.385a2.5 2.5 0 0 0-.482-3.503Z" />
  </svg>,
  <svg key={3} className="mb-3 fill-indigo-500" xmlns="http://www.w3.org/2000/svg" width={24} height={24}>
    <path fillOpacity=".48" d="m3.031 9.05-.593-.805 1.609-1.187.594.804a6.966 6.966 0 0 1 0 8.276l-.594.805-1.61-1.188.594-.805a4.966 4.966 0 0 0 0-5.9Z" />
    <path d="m7.456 6.676-.535-.845 1.69-1.07.534.844a11.944 11.944 0 0 1 0 12.789l-.535.845-1.69-1.071.536-.845a9.944 9.944 0 0 0 0-10.647Z" />
    <path d="m11.888 4.35-.514-.858 1.717-1.027.513.858a16.9 16.9 0 0 1 2.4 8.677 16.9 16.9 0 0 1-2.4 8.676l-.513.859-1.717-1.028.514-.858A14.9 14.9 0 0 0 14.003 12a14.9 14.9 0 0 0-2.115-7.65Z" fillOpacity=".48" />
    <path d="m16.321 2-.5-.866 1.733-1 .5.866A22 22 0 0 1 21 12c0 3.852-1.017 7.636-2.948 10.97l-.502.865-1.73-1.003.501-.865A19.878 19.878 0 0 0 19 12a20 20 0 0 0-2.679-10Z" />
  </svg>,
  <svg key={4} className="mb-3 fill-indigo-500" xmlns="http://www.w3.org/2000/svg" width={24} height={24}>
    <path fillOpacity=".48" d="M12 8.8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" />
    <path d="m7.454 2.891.891-.454L7.437.655l-.891.454a12 12 0 0 0 0 21.382l.89.454.91-1.781-.892-.455a10 10 0 0 1 0-17.818ZM17.456 1.11l-.891-.454-.909 1.782.891.454a10 10 0 0 1 0 17.819l-.89.454.908 1.781.89-.454a12 12 0 0 0 0-21.382Z" />
  </svg>,
  <svg key={5} className="mb-3 fill-indigo-500" xmlns="http://www.w3.org/2000/svg" width={24} height={24}>
    <path fillOpacity=".48" d="M19 8h5v2h-5V8Zm-4 5h9v2h-9v-2Zm9 5H11v2h13v-2Z" />
    <path d="M19.406 3.844 6.083 20.497.586 15 2 13.586l3.917 3.917L17.844 2.595l1.562 1.25Z" />
  </svg>,
];

// ---------------------------------------------------------------------------
// Main — assembled from Cruip open-react-template (Hero + Features + Testimonials + CTA)
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
    steps = [],
    faqs = [],
  } = variables;

  const validSteps = steps.filter((s) => s.title.trim() !== "");

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-950 text-gray-200 antialiased">
      <style dangerouslySetInnerHTML={{ __html: `
        details summary { list-style: none; }
        details summary::-webkit-details-marker { display: none; }
        details[open] .saas-faq-chevron { transform: rotate(180deg); }
        .saas-faq-chevron { transition: transform 0.2s ease; display: inline-block; }
      ` }} />

      {/* ── Page illustration (verbatim from Cruip page-illustration.tsx) ── */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/4" aria-hidden="true">
        <Image
          className="max-w-none"
          src="/images/cruip/page-illustration.svg"
          width={846}
          height={594}
          alt=""
        />
      </div>

      {/* ── Nav ── */}
      <header className="sticky top-0 z-30 border-b border-gray-800/40 bg-gray-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-sm font-semibold text-gray-200">{serviceName}</span>
          {sections.cta && (
            <a href="#cta" className="cruip-btn cruip-btn-primary">
              <span className="relative inline-flex items-center">
                {ctaText}
                <span className="ml-1 tracking-normal text-white/50">→</span>
              </span>
            </a>
          )}
        </div>
      </header>

      <main>
        {/* ── Hero — verbatim from Cruip hero-home.tsx, static text → props ── */}
        {sections.hero && (
          <section>
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="py-12 md:py-20">
                <div className="pb-12 text-center md:pb-20">
                  <h1 className="cruip-gradient-text mx-auto mb-0 pb-5 text-3xl font-semibold sm:text-4xl md:text-5xl" style={{ letterSpacing: "-0.027em", lineHeight: 1.1 }}>
                    {title}
                  </h1>
                  <div className="mx-auto max-w-3xl">
                    <p className="mb-8 text-xl text-indigo-200/65">
                      {subtitle}
                    </p>
                    <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
                      <div>
                        <a
                          className="cruip-btn cruip-btn-primary mb-4 w-full sm:mb-0 sm:w-auto"
                          href="#cta"
                        >
                          <span className="relative inline-flex items-center">
                            {ctaText}
                            <span className="ml-1 tracking-normal text-white/50">→</span>
                          </span>
                        </a>
                      </div>
                      <div>
                        <a
                          className="cruip-btn cruip-btn-secondary relative w-full sm:ml-4 sm:w-auto"
                          href="#features"
                        >
                          Learn more
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Features — verbatim from Cruip features.tsx, static text → props ── */}
        {sections.features && features.length > 0 && (
          <section id="features" className="relative">
            <div
              className="pointer-events-none absolute left-1/2 top-0 -z-10 -mt-20 -translate-x-1/2"
              aria-hidden="true"
            >
              <Image
                className="max-w-none"
                src="/images/cruip/blurred-shape-gray.svg"
                width={760}
                height={668}
                alt=""
              />
            </div>
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-80 -translate-x-[120%] opacity-50"
              aria-hidden="true"
            >
              <Image
                className="max-w-none"
                src="/images/cruip/blurred-shape.svg"
                width={760}
                height={668}
                alt=""
              />
            </div>
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="border-t py-12 md:py-20" style={{ borderImage: "linear-gradient(to right, transparent, rgba(148,163,184,0.25), transparent) 1" }}>
                {/* Section header */}
                <div className="mx-auto max-w-3xl pb-4 text-center md:pb-12">
                  <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
                    <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                      Features
                    </span>
                  </div>
                  <h2 className="cruip-gradient-text pb-4 text-2xl font-semibold sm:text-3xl md:text-4xl" style={{ letterSpacing: "-0.027em" }}>
                    Everything you need
                  </h2>
                  <p className="text-lg text-indigo-200/65">
                    Packed with powerful features designed to help you move faster and deliver more value.
                  </p>
                </div>

                {/* Feature grid — verbatim article layout from Cruip */}
                <div className="mx-auto grid max-w-sm gap-12 sm:max-w-none sm:grid-cols-2 md:gap-x-14 md:gap-y-16 lg:grid-cols-3">
                  {features.map((feature: string, i: number) => {
                    const [label, desc] = feature.includes(":") ? feature.split(/:(.+)/) : [feature, "Designed to help your team move faster and smarter."];
                    return (
                      <article key={i}>
                        {FEATURE_ICONS[i % FEATURE_ICONS.length]}
                        <h3 className="mb-1 text-[1rem] font-semibold text-gray-200" style={{ fontFamily: "var(--font-nacelle, inherit)" }}>
                          {label.trim()}
                        </h3>
                        <p className="text-indigo-200/65">
                          {desc.trim()}
                        </p>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── How It Works ── */}
        {sections.howItWorks && validSteps.length > 0 && (
          <section id="how-it-works" className="relative">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="border-t py-12 md:py-20" style={{ borderImage: "linear-gradient(to right, transparent, rgba(148,163,184,0.25), transparent) 1" }}>
                <div className="mx-auto max-w-3xl pb-4 text-center md:pb-12">
                  <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
                    <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                      Process
                    </span>
                  </div>
                  <h2 className="cruip-gradient-text pb-4 text-2xl font-semibold sm:text-3xl md:text-4xl" style={{ letterSpacing: "-0.027em" }}>
                    How it works
                  </h2>
                  <p className="text-lg text-indigo-200/65">Simple steps to get you started.</p>
                </div>
                <div className="mx-auto grid max-w-sm gap-12 sm:max-w-none sm:grid-cols-3">
                  {steps.map((s, i) => {
                    if (!s.title.trim()) return null;
                    return (
                      <div key={i} className="flex flex-col items-center text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-indigo-300" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
                          {i + 1}
                        </div>
                        <h3 className="mb-1 text-[1rem] font-semibold text-gray-200">{s.title}</h3>
                        {s.description && <p className="text-indigo-200/65">{s.description}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Testimonials — verbatim from Cruip testimonials.tsx ── */}
        {sections.testimonial && testimonials.length > 0 && (
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="border-t py-12 md:py-20" style={{ borderImage: "linear-gradient(to right, transparent, rgba(148,163,184,0.25), transparent) 1" }}>
              <div className="mx-auto max-w-3xl pb-12 text-center">
                <h2 className="cruip-gradient-text pb-4 text-2xl font-semibold sm:text-3xl md:text-4xl" style={{ letterSpacing: "-0.027em" }}>
                  Don&apos;t take our word for it
                </h2>
                <p className="text-lg text-indigo-200/65">
                  Real feedback from real customers.
                </p>
              </div>

              <div className="mx-auto grid max-w-sm items-start gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((t: { name: string; quote: string; role?: string }, i: number) => (
                  <article
                    key={i}
                    className="relative rounded-2xl p-5 backdrop-blur-sm"
                    style={{
                      background: "linear-gradient(135deg, rgba(17,24,39,0.5), rgba(31,41,55,0.25), rgba(17,24,39,0.5))",
                      border: "1px solid rgba(55,65,81,0.6)",
                    }}
                  >
                    <div className="flex flex-col gap-4">
                      <p className="text-indigo-200/65">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-3">
                        <div
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                          style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}
                        >
                          {t.name.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-200">{t.name}</div>
                          {t.role && <div className="text-xs text-indigo-200/50">{t.role}</div>}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        {sections.faq && faqs.length > 0 && (
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="border-t py-12 md:py-20" style={{ borderImage: "linear-gradient(to right, transparent, rgba(148,163,184,0.25), transparent) 1" }}>
              <div className="mx-auto max-w-3xl pb-12 text-center">
                <h2 className="cruip-gradient-text pb-4 text-2xl font-semibold sm:text-3xl md:text-4xl" style={{ letterSpacing: "-0.027em" }}>
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-indigo-200/65">Everything you need to know.</p>
              </div>
              <div className="mx-auto max-w-3xl">
                {faqs.map((f, i) => (
                  <details
                    key={i}
                    style={{ borderBottom: "1px solid rgba(55,65,81,0.6)" }}
                  >
                    <summary className="flex cursor-pointer items-center justify-between py-4 font-medium text-gray-200 hover:text-indigo-300 transition-colors">
                      {f.question}
                      <span className="saas-faq-chevron ml-4 shrink-0 text-gray-600">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </summary>
                    <div className="pb-5 text-indigo-200/65">{f.answer}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CTA — verbatim from Cruip cta.tsx, buttons → LeadForm ── */}
        {sections.cta && (
          <section id="cta" className="relative overflow-hidden">
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-24 ml-20 -translate-x-1/2"
              aria-hidden="true"
            >
              <Image
                className="max-w-none"
                src="/images/cruip/blurred-shape.svg"
                width={760}
                height={668}
                alt=""
              />
            </div>
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="py-12 md:py-20" style={{ background: "linear-gradient(to right, transparent, rgba(31,41,55,0.5), transparent)" }}>
                <div className="mx-auto max-w-3xl text-center">
                  <h2
                    className="cruip-gradient-text pb-8 text-2xl font-semibold sm:text-3xl md:text-4xl"
                    style={{ letterSpacing: "-0.027em" }}
                  >
                    {ctaText}
                  </h2>
                  <div className="mx-auto max-w-sm">
                    <LeadForm landingPageId={landingPageId} variant="dark" ctaText={ctaText} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/40 py-8 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} {serviceName}. All rights reserved.
      </footer>
    </div>
  );
}
