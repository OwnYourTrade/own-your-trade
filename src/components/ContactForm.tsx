"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  if (sent) {
    return (
      <div className="card flex flex-col items-center p-8 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-jade text-cream">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="mt-4 font-display text-2xl text-ink">Thanks, {form.name.split(" ")[0] || "there"}!</h3>
        <p className="mt-2 text-sm text-ink-soft">
          Your message has been noted — we&apos;ll be in touch shortly. For
          anything urgent, please give us a call.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="card p-6 sm:p-8"
    >
      <h2 className="font-display text-2xl text-ink">Send us a message</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Questions, feedback or a booking enquiry — drop us a line.
      </p>

      <div className="mt-6 space-y-4">
        <Field label="Your name" value={form.name} onChange={(v) => update("name", v)} placeholder="Your name" required />
        <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="you@example.com" required />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Message <span className="text-lacquer">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="How can we help?"
            className="w-full rounded-xl border border-ink/15 bg-cream/50 px-4 py-2.5 text-sm outline-none focus:border-lacquer focus:ring-2 focus:ring-lacquer/20"
          />
        </div>
      </div>

      <button type="submit" className="btn-primary mt-6 w-full">
        Send message
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label} {required && <span className="text-lacquer">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-ink/15 bg-cream/50 px-4 py-2.5 text-sm outline-none focus:border-lacquer focus:ring-2 focus:ring-lacquer/20"
      />
    </div>
  );
}
