"use client";

import { useState } from "react";

interface LeadFormProps {
  landingPageId: string;
  onSuccess?: () => void;
  variant?: "light" | "dark";
  ctaText?: string;
}

type FormState = "idle" | "loading" | "success" | "error" | "duplicate";

export default function LeadForm({
  landingPageId,
  onSuccess,
  variant = "dark",
  ctaText,
}: LeadFormProps) {
  const buttonLabel = ctaText?.trim() || "Get Started";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isDark = variant === "dark";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) return;

    setFormState("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/webhooks/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), landingPageId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.duplicate === true) {
          setFormState("duplicate");
          return;
        }
        throw new Error(data?.error || "Submission failed");
      }

      if (data?.duplicate === true) {
        setFormState("duplicate");
        return;
      }

      setFormState("success");
      onSuccess?.();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setFormState("error");
    }
  }

  if (formState === "success") {
    return (
      <div
        className={`rounded-2xl px-8 py-10 text-center ${
          isDark ? "bg-gray-800/60 border border-gray-700" : "bg-white border border-gray-200"
        }`}
      >
        <div className="mb-4 flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-2xl">
            ✓
          </span>
        </div>
        <h3
          className={`mb-2 text-xl font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          You&apos;re in!
        </h3>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Thank you! We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  if (formState === "duplicate") {
    return (
      <div
        className={`rounded-2xl px-8 py-10 text-center ${
          isDark ? "bg-gray-800/60 border border-gray-700" : "bg-white border border-gray-200"
        }`}
      >
        <div className="mb-4 flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 text-2xl">
            ℹ
          </span>
        </div>
        <h3
          className={`mb-2 text-xl font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Already subscribed
        </h3>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          You&apos;ve already submitted! We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="lead-name"
            className={`mb-1.5 block text-sm font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Name
          </label>
          <input
            id="lead-name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            disabled={formState === "loading"}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2 disabled:opacity-60 ${
              isDark
                ? "border-gray-600 bg-gray-700/50 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/30"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/30"
            }`}
          />
        </div>

        <div>
          <label
            htmlFor="lead-email"
            className={`mb-1.5 block text-sm font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Email
          </label>
          <input
            id="lead-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={formState === "loading"}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2 disabled:opacity-60 ${
              isDark
                ? "border-gray-600 bg-gray-700/50 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/30"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/30"
            }`}
          />
        </div>

        {formState === "error" && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={formState === "loading" || !name.trim() || !email.trim()}
          className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:bg-indigo-700"
        >
          {formState === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Submitting…
            </span>
          ) : (
            buttonLabel
          )}
        </button>
      </div>
    </form>
  );
}
