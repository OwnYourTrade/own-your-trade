"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { BookingConfig } from "@/config/demos/booking";
import { useDemoName } from "@/components/shared/useDemoName";

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function isoDate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

type DayOpt = { iso: string; weekday: string; date: string; isToday: boolean };

export default function BookingDemo({ config }: { config: BookingConfig }) {
  const businessName = useDemoName(config.businessName);

  const [serviceId, setServiceId] = useState(
    config.services.find((s) => s.popular)?.id ?? config.services[0].id
  );
  const [staff, setStaff] = useState<string>(""); // "" = any
  const [day, setDay] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<null | { id: string }>(null);

  // Compute upcoming open days after mount (avoids SSR/CSR date mismatch).
  const [days, setDays] = useState<DayOpt[]>([]);
  useEffect(() => {
    const out: DayOpt[] = [];
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    for (let i = 0; out.length < config.days && i < 90; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      if (!config.openWeekdays.includes(d.getDay())) continue;
      out.push({
        iso: isoDate(d),
        weekday: d.toLocaleDateString("en-GB", { weekday: "short" }),
        date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        isToday: i === 0,
      });
    }
    setDays(out);
    setDay((prev) => prev || out[0]?.iso || "");
  }, [config]);

  const service = config.services.find((s) => s.id === serviceId)!;
  const ready = Boolean(serviceId && day && time && form.name.trim() && form.phone.trim());

  const dayLabel = useMemo(() => {
    const d = days.find((x) => x.iso === day);
    return d ? `${d.weekday} ${d.date}` : "";
  }, [days, day]);

  async function submit() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vertical: config.slug,
          serviceId,
          staff: staff || undefined,
          day,
          time,
          customer: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setBusy(false);
        return;
      }
      setDone({ id: data.booking.id });
    } catch {
      setError("Network error. Please try again.");
    }
    setBusy(false);
  }

  const money = (n: number) => (n === 0 ? "Free" : `£${n.toFixed(2)}`);

  // ---------------------------------------------------------------- Confirmed
  if (done) {
    return (
      <div className="container-x py-14">
        <div className="mx-auto max-w-lg ticket p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ledger text-paper">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <p className="eyebrow mt-5">Booking confirmed</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-ink">
            You&apos;re booked in, {form.name.split(" ")[0]}.
          </h1>
          <p className="mt-3 text-ink-soft">
            Reference <span className="font-mono font-semibold text-ink">{done.id}</span> —
            {" "}{service.name} on {dayLabel} at {time}
            {staff ? `, with ${staff}` : ""}.
          </p>
          <div className="mt-6 rounded-lg bg-paper p-4 text-left text-sm">
            <Row k={config.bookVerb.replace(/^Book a?n? /i, "")} v={service.name} />
            <Row k="When" v={`${dayLabel} · ${time}`} />
            {staff && <Row k={config.staffLabel} v={staff} />}
            <Row k="Price" v={money(service.price)} />
          </div>
          <p className="mx-auto mt-6 max-w-sm text-sm text-ink-soft">
            That booking just landed on the owner&apos;s live dashboard in real time — take a look
            at the view {config.businessName} would run their day from.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button onClick={() => { setDone(null); setTime(""); }} className="btn-outline">
              Book another
            </button>
            <Link href={`/${config.slug}/demo/dashboard`} className="btn-primary">
              See it on the owner&apos;s dashboard →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Business hero */}
      <section className="relative bg-ink text-paper">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${config.heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/50" />
        <div className="container-x relative py-12">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-stamp font-display text-2xl font-extrabold text-paper">
            {config.monogram}
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">{businessName}</h1>
          <p className="mt-2 max-w-xl text-paper/80">{config.tagline}</p>
        </div>
      </section>

      <div className="container-x grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Flow — min-w-0 lets the day strip's overflow-x-auto actually
            scroll inside the column instead of stretching the page wide */}
        <div className="min-w-0 space-y-8">
          <Step n={1} title="Choose a service">
            <div className="grid gap-3 sm:grid-cols-2">
              {config.services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setServiceId(s.id)}
                  className={`rounded-lg border-2 p-4 text-left transition ${
                    serviceId === s.id ? "border-stamp bg-stamp/5" : "border-ink/10 hover:border-ink/25"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-ink">{s.name}</span>
                    <span className="tnum font-mono font-bold text-ink">{money(s.price)}</span>
                  </div>
                  {s.desc && <p className="mt-1 text-xs text-ink-soft">{s.desc}</p>}
                  <p className="mt-2 mono-label text-ink-soft/70">{s.duration} min</p>
                </button>
              ))}
            </div>
          </Step>

          {config.staff.length > 1 && (
            <Step n={2} title={`Pick your ${config.staffLabel.toLowerCase()}`}>
              <div className="flex flex-wrap gap-2">
                <Chip on={staff === ""} onClick={() => setStaff("")}>Any {config.staffLabel.toLowerCase()}</Chip>
                {config.staff.map((m) => (
                  <Chip key={m.id} on={staff === m.name} onClick={() => setStaff(m.name)}>
                    <span className="font-semibold">{m.name}</span>
                    <span className="ml-1.5 text-xs opacity-70">{m.role}</span>
                  </Chip>
                ))}
              </div>
            </Step>
          )}

          <Step n={config.staff.length > 1 ? 3 : 2} title="Pick a day">
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {days.map((d) => (
                <button
                  key={d.iso}
                  onClick={() => { setDay(d.iso); setTime(""); }}
                  className={`shrink-0 rounded-lg border-2 px-4 py-2.5 text-center transition ${
                    day === d.iso ? "border-stamp bg-stamp/5" : "border-ink/10 hover:border-ink/25"
                  }`}
                >
                  <span className="block mono-label text-ink-soft">{d.isToday ? "Today" : d.weekday}</span>
                  <span className="block text-sm font-bold text-ink">{d.date}</span>
                </button>
              ))}
            </div>
          </Step>

          <Step n={config.staff.length > 1 ? 4 : 3} title="Pick a time">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {config.slots.map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={`tnum rounded-lg border-2 py-2.5 font-mono text-sm font-semibold transition ${
                    time === t ? "border-stamp bg-stamp text-paper" : "border-ink/10 text-ink hover:border-ink/25"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Step>

          <Step n={config.staff.length > 1 ? 5 : 4} title="Your details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
              <Field label="Phone" type="tel" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} required />
              <Field label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} placeholder="Optional" />
              <Field label="Anything we should know?" value={form.notes} onChange={(v) => setForm((f) => ({ ...f, notes: v }))} placeholder="Optional" />
            </div>
          </Step>
        </div>

        {/* Summary */}
        <div>
          <div className="ticket sticky top-20 p-5">
            <p className="mono-label text-ink-soft">Your {config.bookedNoun}</p>
            <div className="mt-3 space-y-2 text-sm">
              <Row k="Service" v={service.name} />
              <Row k="When" v={day && time ? `${dayLabel} · ${time}` : "Not chosen yet"} />
              {config.staff.length > 1 && <Row k={config.staffLabel} v={staff || "Any"} />}
            </div>
            <div className="my-4 rule-dashed" />
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink">Price</span>
              <span className="tnum font-mono text-xl font-bold text-ink">{money(service.price)}</span>
            </div>
            {error && <p className="mt-3 rounded-md bg-stamp/10 px-3 py-2 text-sm text-stamp">{error}</p>}
            <button onClick={submit} disabled={!ready || busy} className="btn-primary mt-4 w-full">
              {busy ? "Confirming…" : `Confirm ${config.bookedNoun}`}
            </button>
            <p className="mt-2 text-center text-xs text-ink-soft">
              No payment needed to hold your spot in this demo.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile: sticky confirm bar so the CTA is always in reach */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white px-4 pb-4 pt-3 shadow-lift lg:hidden">
        <button onClick={submit} disabled={!ready || busy} className="btn-primary w-full">
          {busy
            ? "Confirming…"
            : ready
              ? `Confirm ${config.bookedNoun} · ${money(service.price)}`
              : "Pick a time & add your details"}
        </button>
      </div>
      <div className="h-20 lg:hidden" />
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-ink font-mono text-xs font-bold text-paper">{n}</span>
        <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border-2 px-4 py-2 text-sm transition ${
        on ? "border-stamp bg-stamp/5 text-ink" : "border-ink/10 text-ink-soft hover:border-ink/25"
      }`}
    >
      {children}
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-ink-soft">{k}</span>
      <span className="text-right font-medium text-ink">{v}</span>
    </div>
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
        {label} {required && <span className="text-stamp">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-stamp focus:ring-2 focus:ring-stamp/20"
      />
    </div>
  );
}
