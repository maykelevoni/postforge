"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, ExternalLink, Copy, Check } from "lucide-react";
import { LandingPageData } from "./types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Testimonial {
  name: string;
  quote: string;
  role: string;
}

interface Step {
  title: string;
  description: string;
}

interface Faq {
  question: string;
  answer: string;
}

interface TemplateVariables {
  title: string;
  subtitle: string;
  features: string[];
  ctaText: string;
  testimonials: Testimonial[];
  steps: Step[];
  faqs: Faq[];
}

interface SectionToggles {
  hero: boolean;
  features: boolean;
  testimonial: boolean;
  cta: boolean;
  howItWorks: boolean;
  faq: boolean;
}

interface LandingPageModalProps {
  serviceId: string;
  serviceName: string;
  existingPage?: LandingPageData | null;
  onClose: () => void;
  onCreated: () => void;
  onDeleted: () => void;
}

// ─── Templates ───────────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: "saas",
    label: "SaaS",
    description: "Hero + features grid + testimonials + CTA. Best for software products.",
    icon: "⚡",
  },
  {
    id: "service",
    label: "Service",
    description: "Hero + benefits + How It Works + FAQ + CTA. Best for agencies.",
    icon: "🛠",
  },
  {
    id: "lead_magnet",
    label: "Lead Magnet",
    description: "Minimal hero + benefits + CTA. Best for freebies and lead-gen.",
    icon: "🎯",
  },
] as const;

type TemplateId = typeof TEMPLATES[number]["id"];

// ─── Styles ──────────────────────────────────────────────────────────────────

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.85)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "20px",
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "10px",
  width: "100%",
  maxWidth: "640px",
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const modalHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "24px 28px",
  borderBottom: "1px solid #1a1a1a",
  flexShrink: 0,
};

const modalTitleStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#f5f5f5",
};

const modalSubtitleStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#888",
  marginTop: "2px",
};

const closeButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#666",
  cursor: "pointer",
  padding: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
};

const modalBodyStyle: React.CSSProperties = {
  padding: "24px 28px",
  overflowY: "auto",
  flex: 1,
};

const modalFooterStyle: React.CSSProperties = {
  padding: "16px 28px",
  borderTop: "1px solid #1a1a1a",
  display: "flex",
  gap: "12px",
  justifyContent: "flex-end",
  flexShrink: 0,
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#888",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: "16px",
};

const subSectionLabelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#666",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "10px",
  marginTop: "4px",
};

const templateGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "12px",
  marginBottom: "28px",
};

const templateCardBase: React.CSSProperties = {
  padding: "16px",
  borderRadius: "8px",
  border: "2px solid #222",
  cursor: "pointer",
  transition: "all 0.15s ease",
  textAlign: "center",
};

const formGroupStyle: React.CSSProperties = {
  marginBottom: "18px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#ccc",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  fontSize: "14px",
  backgroundColor: "#0d0d0d",
  border: "1px solid #222",
  borderRadius: "6px",
  color: "#f5f5f5",
  boxSizing: "border-box",
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  fontFamily: "inherit",
  lineHeight: "1.5",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  marginBottom: "8px",
  alignItems: "flex-start",
};

const removeButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#666",
  cursor: "pointer",
  padding: "4px",
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  marginTop: "2px",
};

const addButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  background: "none",
  border: "1px dashed #333",
  borderRadius: "6px",
  color: "#888",
  fontSize: "13px",
  cursor: "pointer",
  padding: "8px 12px",
  width: "100%",
  justifyContent: "center",
  marginTop: "4px",
};

const dividerStyle: React.CSSProperties = {
  height: "1px",
  backgroundColor: "#1a1a1a",
  margin: "24px 0",
};

const togglesGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "8px",
};

const toggleItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px 12px",
  backgroundColor: "#0d0d0d",
  border: "1px solid #1f1f1f",
  borderRadius: "6px",
  cursor: "pointer",
};

const toggleLabelStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#ccc",
  userSelect: "none",
  cursor: "pointer",
};

const checkboxStyle: React.CSSProperties = {
  width: "16px",
  height: "16px",
  accentColor: "#6366f1",
  cursor: "pointer",
  flexShrink: 0,
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "10px 22px",
  fontSize: "14px",
  fontWeight: "600",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#6366f1",
  color: "white",
  cursor: "pointer",
  transition: "background-color 0.15s ease",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "10px 22px",
  fontSize: "14px",
  fontWeight: "600",
  borderRadius: "6px",
  border: "1px solid #333",
  backgroundColor: "transparent",
  color: "#999",
  cursor: "pointer",
};

const dangerButtonStyle: React.CSSProperties = {
  padding: "10px 22px",
  fontSize: "14px",
  fontWeight: "600",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#ef444420",
  color: "#ef4444",
  cursor: "pointer",
  marginRight: "auto",
};

const urlBoxStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 14px",
  backgroundColor: "#0d0d0d",
  border: "1px solid #222",
  borderRadius: "6px",
  marginBottom: "24px",
};

const urlTextStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#6366f1",
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const iconButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#888",
  cursor: "pointer",
  padding: "2px",
  display: "flex",
  alignItems: "center",
};

const errorStyle: React.CSSProperties = {
  color: "#ef4444",
  fontSize: "12px",
  marginTop: "8px",
};

const stepBadgeStyle: React.CSSProperties = {
  flexShrink: 0,
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  backgroundColor: "#1a1a2e",
  border: "1px solid #333",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "11px",
  fontWeight: "700",
  color: "#6366f1",
  marginTop: "9px",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DEFAULT_STEPS: Step[] = [
  { title: "", description: "" },
  { title: "", description: "" },
  { title: "", description: "" },
];

function defaultVariables(): TemplateVariables {
  return {
    title: "",
    subtitle: "",
    features: [""],
    ctaText: "Get Started",
    testimonials: [],
    steps: DEFAULT_STEPS,
    faqs: [],
  };
}

function defaultSections(): SectionToggles {
  return {
    hero: true,
    features: true,
    testimonial: false,
    cta: true,
    howItWorks: true,
    faq: false,
  };
}

function parseVariables(raw: string): TemplateVariables {
  try {
    const parsed = JSON.parse(raw);
    return {
      title: parsed.title ?? "",
      subtitle: parsed.subtitle ?? "",
      features: Array.isArray(parsed.features) && parsed.features.length > 0
        ? parsed.features
        : [""],
      ctaText: parsed.ctaText ?? "Get Started",
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : [],
      steps: Array.isArray(parsed.steps) && parsed.steps.length === 3
        ? parsed.steps
        : DEFAULT_STEPS,
      faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [],
    };
  } catch {
    return defaultVariables();
  }
}

function parseSections(raw: string): SectionToggles {
  try {
    const parsed = JSON.parse(raw);
    return {
      hero: parsed.hero ?? true,
      features: parsed.features ?? true,
      // support legacy "testimonials" (plural) key from old data
      testimonial: parsed.testimonial ?? parsed.testimonials ?? false,
      cta: parsed.cta ?? true,
      howItWorks: parsed.howItWorks ?? true,
      faq: parsed.faq ?? false,
    };
  } catch {
    return defaultSections();
  }
}

const SECTION_LABELS: Record<keyof SectionToggles, string> = {
  hero: "Hero",
  features: "Features",
  testimonial: "Testimonials",
  cta: "CTA Form",
  howItWorks: "How It Works",
  faq: "FAQ",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function LandingPageModal({
  serviceId,
  serviceName,
  existingPage,
  onClose,
  onCreated,
  onDeleted,
}: LandingPageModalProps) {
  const isEditMode = !!existingPage;

  const [step, setStep] = useState<"template" | "editor">(
    isEditMode ? "editor" : "template"
  );

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(
    (existingPage?.template as TemplateId) ?? "saas"
  );

  const [variables, setVariables] = useState<TemplateVariables>(
    isEditMode ? parseVariables(existingPage.variables) : defaultVariables()
  );

  const [sections, setSections] = useState<SectionToggles>(
    isEditMode ? parseSections(existingPage.sections) : defaultSections()
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isEditMode && variables.title === "") {
      setVariables((prev) => ({ ...prev, title: serviceName }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const publishedUrl = isEditMode
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/l/${existingPage.slug}`
    : null;

  // ── Variable helpers ──────────────────────────────────────────────────────

  const setVar = <K extends keyof TemplateVariables>(key: K, value: TemplateVariables[K]) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  // Features
  const setFeature = (index: number, value: string) => {
    const updated = [...variables.features];
    updated[index] = value;
    setVariables((prev) => ({ ...prev, features: updated }));
  };
  const addFeature = () => setVariables((prev) => ({ ...prev, features: [...prev.features, ""] }));
  const removeFeature = (index: number) => {
    const updated = variables.features.filter((_, i) => i !== index);
    setVariables((prev) => ({ ...prev, features: updated.length > 0 ? updated : [""] }));
  };

  // Testimonials
  const setTestimonial = (index: number, field: keyof Testimonial, value: string) => {
    const updated = variables.testimonials.map((t, i) =>
      i === index ? { ...t, [field]: value } : t
    );
    setVariables((prev) => ({ ...prev, testimonials: updated }));
  };
  const addTestimonial = () => {
    if (variables.testimonials.length >= 5) return;
    setVariables((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, { name: "", quote: "", role: "" }],
    }));
  };
  const removeTestimonial = (index: number) => {
    setVariables((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index),
    }));
  };

  // Steps (always exactly 3)
  const setStep_ = (index: number, field: keyof Step, value: string) => {
    const updated = variables.steps.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setVariables((prev) => ({ ...prev, steps: updated }));
  };

  // FAQs
  const setFaq = (index: number, field: keyof Faq, value: string) => {
    const updated = variables.faqs.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    setVariables((prev) => ({ ...prev, faqs: updated }));
  };
  const addFaq = () => setVariables((prev) => ({ ...prev, faqs: [...prev.faqs, { question: "", answer: "" }] }));
  const removeFaq = (index: number) => {
    setVariables((prev) => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));
  };

  const toggleSection = (key: keyof SectionToggles) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Actions ───────────────────────────────────────────────────────────────

  function buildPayloadVariables() {
    return {
      ...variables,
      features: variables.features.filter((f) => f.trim() !== ""),
      testimonials: variables.testimonials.filter((t) => t.name.trim() !== "" || t.quote.trim() !== ""),
      steps: variables.steps,
      faqs: variables.faqs.filter((f) => f.question.trim() !== ""),
    };
  }

  const handlePublish = async () => {
    if (!variables.title.trim()) { setError("Title is required."); return; }
    setError(null);
    setSaving(true);

    try {
      const res = await fetch("/api/landing-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          template: selectedTemplate,
          variables: buildPayloadVariables(),
          sections,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Failed to create landing page.");
        return;
      }

      onCreated();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!isEditMode) return;
    if (!variables.title.trim()) { setError("Title is required."); return; }
    setError(null);
    setSaving(true);

    try {
      const res = await fetch(`/api/landing-pages/${existingPage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variables: buildPayloadVariables(),
          sections,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Failed to save changes.");
        return;
      }

      onCreated();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode) return;
    if (!confirm("Delete this landing page? This cannot be undone.")) return;

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/landing-pages/${existingPage.id}`, { method: "DELETE" });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Failed to delete landing page.");
        return;
      }

      onDeleted();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handlePreview = () => {
    if (isEditMode && existingPage.slug) {
      window.open(`/l/${existingPage.slug}`, "_blank");
    }
  };

  const handleCopyUrl = async () => {
    if (!publishedUrl) return;
    try {
      await navigator.clipboard.writeText(publishedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={modalHeaderStyle}>
          <div>
            <div style={modalTitleStyle}>
              {isEditMode ? "Edit Landing Page" : "Generate Landing Page"}
            </div>
            <div style={modalSubtitleStyle}>{serviceName}</div>
          </div>
          <button style={closeButtonStyle} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={modalBodyStyle}>
          {/* ── Step 1: Template selector ── */}
          {step === "template" && (
            <>
              <div style={sectionLabelStyle}>Choose a template</div>
              <div style={templateGridStyle}>
                {TEMPLATES.map((tpl) => {
                  const isSelected = selectedTemplate === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      style={{
                        ...templateCardBase,
                        borderColor: isSelected ? "#6366f1" : "#222",
                        backgroundColor: isSelected ? "#6366f110" : "#0d0d0d",
                      }}
                      onClick={() => setSelectedTemplate(tpl.id)}
                    >
                      <div style={{ fontSize: "28px", marginBottom: "8px" }}>{tpl.icon}</div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#f5f5f5", marginBottom: "6px" }}>
                        {tpl.label}
                      </div>
                      <div style={{ fontSize: "12px", color: "#888", lineHeight: "1.4" }}>
                        {tpl.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── Step 2: Variable editor ── */}
          {step === "editor" && (
            <>
              {/* Published URL */}
              {isEditMode && publishedUrl && (
                <>
                  <div style={sectionLabelStyle}>Published URL</div>
                  <div style={urlBoxStyle}>
                    <span style={urlTextStyle}>{publishedUrl}</span>
                    <button style={iconButtonStyle} onClick={handleCopyUrl} title="Copy URL">
                      {copied ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
                    </button>
                    <button style={iconButtonStyle} onClick={handlePreview} title="Open in new tab">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </>
              )}

              {/* Title */}
              <div style={formGroupStyle}>
                <label style={labelStyle}>Title *</label>
                <input
                  type="text"
                  value={variables.title}
                  onChange={(e) => setVar("title", e.target.value)}
                  placeholder="e.g., Grow Your Audience Faster"
                  style={inputStyle}
                />
              </div>

              {/* Subtitle */}
              <div style={formGroupStyle}>
                <label style={labelStyle}>Subtitle</label>
                <textarea
                  value={variables.subtitle}
                  onChange={(e) => setVar("subtitle", e.target.value)}
                  placeholder="A short description that appears below the headline."
                  rows={3}
                  style={textareaStyle}
                />
              </div>

              {/* Features */}
              <div style={formGroupStyle}>
                <label style={labelStyle}>Features / Benefits</label>
                {variables.features.map((feature, idx) => (
                  <div key={idx} style={rowStyle}>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => setFeature(idx, e.target.value)}
                      placeholder={`Feature ${idx + 1}`}
                      style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                    />
                    <button style={removeButtonStyle} onClick={() => removeFeature(idx)} title="Remove">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                <button style={addButtonStyle} onClick={addFeature}>
                  <Plus size={14} /> Add feature
                </button>
              </div>

              {/* CTA Text */}
              <div style={formGroupStyle}>
                <label style={labelStyle}>CTA Button Text</label>
                <input
                  type="text"
                  value={variables.ctaText}
                  onChange={(e) => setVar("ctaText", e.target.value)}
                  placeholder="e.g., Get Started Free"
                  style={inputStyle}
                />
              </div>

              {/* ── How It Works ── */}
              <div style={dividerStyle} />
              <div style={{ ...sectionLabelStyle, marginBottom: "14px" }}>
                How It Works (3 steps)
              </div>
              {variables.steps.map((s, idx) => (
                <div key={idx} style={{ marginBottom: "16px" }}>
                  <div style={subSectionLabelStyle}>Step {idx + 1}</div>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                    <div style={stepBadgeStyle}>{idx + 1}</div>
                    <input
                      type="text"
                      value={s.title}
                      onChange={(e) => setStep_(idx, "title", e.target.value)}
                      placeholder={`Step ${idx + 1} title`}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                  </div>
                  <input
                    type="text"
                    value={s.description}
                    onChange={(e) => setStep_(idx, "description", e.target.value)}
                    placeholder="Brief description of this step"
                    style={{ ...inputStyle, marginLeft: "32px", width: "calc(100% - 32px)" }}
                  />
                </div>
              ))}

              {/* ── Testimonials ── */}
              <div style={dividerStyle} />
              <div style={{ ...sectionLabelStyle, marginBottom: "14px" }}>
                Testimonials (optional)
              </div>
              {variables.testimonials.map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#0d0d0d",
                    border: "1px solid #1f1f1f",
                    borderRadius: "6px",
                    padding: "12px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) => setTestimonial(idx, "name", e.target.value)}
                      placeholder="Name"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button style={{ ...removeButtonStyle, marginTop: "0" }} onClick={() => removeTestimonial(idx)} title="Remove">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <textarea
                    value={t.quote}
                    onChange={(e) => setTestimonial(idx, "quote", e.target.value)}
                    placeholder="Quote / testimonial text"
                    rows={2}
                    style={{ ...textareaStyle, marginBottom: "8px" }}
                  />
                  <input
                    type="text"
                    value={t.role}
                    onChange={(e) => setTestimonial(idx, "role", e.target.value)}
                    placeholder="Role / title (e.g. CEO, Acme Inc.) — optional"
                    style={inputStyle}
                  />
                </div>
              ))}
              {variables.testimonials.length < 5 && (
                <button style={addButtonStyle} onClick={addTestimonial}>
                  <Plus size={14} /> Add testimonial
                </button>
              )}

              {/* ── FAQ ── */}
              <div style={dividerStyle} />
              <div style={{ ...sectionLabelStyle, marginBottom: "14px" }}>
                FAQ (optional)
              </div>
              {variables.faqs.map((f, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#0d0d0d",
                    border: "1px solid #1f1f1f",
                    borderRadius: "6px",
                    padding: "12px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <input
                      type="text"
                      value={f.question}
                      onChange={(e) => setFaq(idx, "question", e.target.value)}
                      placeholder={`Question ${idx + 1}`}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button style={{ ...removeButtonStyle, marginTop: "0" }} onClick={() => removeFaq(idx)} title="Remove">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={f.answer}
                    onChange={(e) => setFaq(idx, "answer", e.target.value)}
                    placeholder="Answer"
                    style={inputStyle}
                  />
                </div>
              ))}
              <button style={addButtonStyle} onClick={addFaq}>
                <Plus size={14} /> Add question
              </button>

              {/* ── Section toggles ── */}
              <div style={dividerStyle} />
              <div style={{ ...sectionLabelStyle, marginBottom: "14px" }}>
                Sections to include
              </div>
              <div style={togglesGridStyle}>
                {(Object.keys(sections) as Array<keyof SectionToggles>).map((key) => (
                  <label key={key} style={toggleItemStyle}>
                    <input
                      type="checkbox"
                      checked={sections[key]}
                      onChange={() => toggleSection(key)}
                      style={checkboxStyle}
                    />
                    <span style={toggleLabelStyle}>{SECTION_LABELS[key]}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {error && <div style={errorStyle}>{error}</div>}
        </div>

        {/* Footer */}
        <div style={modalFooterStyle}>
          {isEditMode && (
            <button style={dangerButtonStyle} onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}

          {step === "template" && (
            <>
              <button style={secondaryButtonStyle} onClick={onClose}>Cancel</button>
              <button style={primaryButtonStyle} onClick={() => setStep("editor")}>Continue →</button>
            </>
          )}

          {step === "editor" && !isEditMode && (
            <>
              <button style={secondaryButtonStyle} onClick={() => setStep("template")}>← Back</button>
              <button style={primaryButtonStyle} onClick={handlePublish} disabled={saving}>
                {saving ? "Publishing..." : "Publish"}
              </button>
            </>
          )}

          {step === "editor" && isEditMode && (
            <>
              <button style={secondaryButtonStyle} onClick={onClose}>Cancel</button>
              <button style={secondaryButtonStyle} onClick={handlePreview}>
                <ExternalLink size={14} style={{ marginRight: "6px" }} />
                Preview
              </button>
              <button style={primaryButtonStyle} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
