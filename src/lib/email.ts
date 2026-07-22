import { site, type Tier } from "@/config/site";
import type { Signup } from "./signups";
import type { Lead } from "./leads";

// ===========================================================================
//  Transactional email via Resend (https://resend.com).
//
//  Fires for real "Get started" signups that complete Stripe payment (customer
//  confirmation + owner notification) and for contact-form enquiries (owner
//  notification only). The demo/takeaway ordering flow and the booking demos
//  never call anything in this module — those are sample data.
//
//  Config comes entirely from env vars (never hardcode the key):
//    RESEND_API_KEY            required to send; when absent, this module is a
//                              no-op so local/demo runs never crash.
//    EMAIL_FROM                sender, e.g. "Own Your Trade <hello@yourdomain>".
//                              Defaults to Resend's shared test sender, which
//                              only delivers to your own Resend account email
//                              until you verify a domain.
//    OWNER_NOTIFICATION_EMAIL  where new-signup alerts are sent.
// ===========================================================================

const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM || "Own Your Trade <onboarding@resend.dev>";
const OWNER_EMAIL = process.env.OWNER_NOTIFICATION_EMAIL || "ownyourtrade.co.uk@gmail.com";

export const emailConfigured = Boolean(API_KEY);

type SendResult = { ok: boolean; id?: string; error?: string };

/** Low-level single send against the Resend REST API. Never throws. */
async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendResult> {
  if (!API_KEY) return { ok: false, error: "RESEND_API_KEY not set" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
    };
    if (!res.ok) {
      return { ok: false, error: data.message || `HTTP ${res.status}` };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "send failed" };
  }
}

// --------------------------------------------------------------------------
// Content
// --------------------------------------------------------------------------

const money = (n: number) => `${site.currency}${n}`;

/** Escape user-supplied text before putting it into email HTML. */
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function shell(bodyInner: string): string {
  return `<!doctype html><html><body style="margin:0;background:#EDEAE2;padding:24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1C2321;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
    <tr><td style="background:#1C2321;padding:20px 28px;">
      <span style="color:#EDEAE2;font-weight:800;letter-spacing:0.12em;font-size:15px;">OWN·YOUR·TRADE</span>
    </td></tr>
    <tr><td style="padding:28px;">${bodyInner}</td></tr>
    <tr><td style="padding:0 28px 28px;">
      <p style="font-size:12px;color:#6b716e;line-height:1.5;margin:16px 0 0;border-top:1px solid #e4e1d9;padding-top:16px;">
        Own Your Trade — your own ordering &amp; booking system, no commission.<br/>
        Reply to this email and it comes straight to us.
      </p>
    </td></tr>
  </table></body></html>`;
}

function detailRow(k: string, v: string): string {
  return `<tr>
    <td style="padding:6px 0;color:#6b716e;font-size:14px;">${k}</td>
    <td style="padding:6px 0;text-align:right;font-weight:600;font-size:14px;">${v}</td>
  </tr>`;
}

function priceLine(signup: Signup, tier: Tier | undefined): string {
  if (!tier) return money(signup.payment.amount);
  const parts: string[] = [];
  if (tier.setup > 0) parts.push(`${money(tier.setup)} one-off setup`);
  parts.push(`${money(tier.monthly)}/month`);
  return parts.join(" + ");
}

function customerEmail(signup: Signup, tier: Tier | undefined): { subject: string; html: string } {
  const first = signup.name.split(" ")[0] || "there";
  const planName = tier ? tier.name : signup.tier;
  const inner = `
    <h1 style="font-size:24px;margin:0 0 4px;">Thanks, ${first} — you're in.</h1>
    <p style="font-size:15px;line-height:1.6;color:#3a403d;margin:0 0 20px;">
      We've received your <strong>${planName}</strong> signup for <strong>${signup.business}</strong> and your
      first payment. Welcome aboard.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="background:#f4f2ec;border-radius:12px;padding:16px 18px;margin:0 0 20px;">
      ${detailRow("Reference", signup.id)}
      ${detailRow("Business", signup.business)}
      ${detailRow("Trade", signup.trade)}
      ${detailRow("Plan", planName)}
      ${detailRow("Price", priceLine(signup, tier))}
      ${detailRow("Paid today", money(signup.payment.amount))}
    </table>
    <p style="font-size:15px;line-height:1.6;color:#3a403d;margin:0 0 8px;">
      <strong>What happens next:</strong> we'll be in touch <strong>within 24 hours</strong> to collect your
      menu or service details and any branding (logo, colours, photos), so we can get your site built and live.
    </p>
    <p style="font-size:15px;line-height:1.6;color:#3a403d;margin:16px 0 0;">
      Nothing you need to do right now — just keep an eye on your inbox.
    </p>
    <p style="font-size:13px;line-height:1.6;color:#6b716e;margin:14px 0 0;">
      Your plan renews monthly and you can update your card or cancel any time — use the
      &ldquo;Manage billing&rdquo; link on your confirmation page, or just reply to this email.
    </p>`;
  return { subject: `You're in — ${signup.business} on ${planName} ✓`, html: shell(inner) };
}

function ownerEmail(signup: Signup, tier: Tier | undefined): { subject: string; html: string } {
  const planName = tier ? tier.name : signup.tier;
  const inner = `
    <h1 style="font-size:22px;margin:0 0 4px;">New signup 🎉</h1>
    <p style="font-size:15px;line-height:1.6;color:#3a403d;margin:0 0 20px;">
      <strong>${signup.business}</strong> just signed up and paid on the <strong>${planName}</strong> plan.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="background:#f4f2ec;border-radius:12px;padding:16px 18px;margin:0 0 20px;">
      ${detailRow("Reference", signup.id)}
      ${detailRow("Business", signup.business)}
      ${detailRow("Contact", signup.name)}
      ${detailRow("Email", signup.email)}
      ${detailRow("Phone", signup.phone)}
      ${detailRow("Trade", signup.trade)}
      ${detailRow("Area", signup.area)}
      ${detailRow("Plan", planName)}
      ${detailRow("Paid today", money(signup.payment.amount))}
      ${detailRow("Recurring", tier ? `${money(tier.monthly)}/month` : "—")}
      ${signup.domain ? detailRow("Wants domain", signup.domain) : ""}
      ${signup.website ? detailRow("Current site", signup.website) : ""}
    </table>
    ${
      signup.notes
        ? `<p style="font-size:14px;line-height:1.6;color:#3a403d;margin:0 0 16px;"><strong>Notes:</strong> ${signup.notes}</p>`
        : ""
    }
    <p style="font-size:14px;line-height:1.6;color:#6b716e;margin:0;">
      Reach out within 24 hours to collect their menu/services and branding.
      Reply to this email to go straight to ${signup.name.split(" ")[0]}.
    </p>`;
  return { subject: `New signup: ${signup.business} (${planName})`, html: shell(inner) };
}

// --------------------------------------------------------------------------
// Public entry point — send both emails for a paid signup.
// --------------------------------------------------------------------------

export async function sendSignupNotifications(
  signup: Signup,
  tier: Tier | undefined
): Promise<{ ok: boolean; customer: SendResult; owner: SendResult }> {
  const c = customerEmail(signup, tier);
  const o = ownerEmail(signup, tier);

  const [customer, owner] = await Promise.all([
    sendEmail({ to: signup.email, subject: c.subject, html: c.html, replyTo: OWNER_EMAIL }),
    sendEmail({ to: OWNER_EMAIL, subject: o.subject, html: o.html, replyTo: signup.email }),
  ]);

  if (!customer.ok) console.error("[email] customer confirmation failed:", customer.error);
  if (!owner.ok) console.error("[email] owner notification failed:", owner.error);
  if (customer.ok || owner.ok) {
    console.log(
      `[email] signup ${signup.id} — customer:${customer.ok ? customer.id : "FAIL"} owner:${owner.ok ? owner.id : "FAIL"}`
    );
  }

  return { ok: customer.ok && owner.ok, customer, owner };
}

// --------------------------------------------------------------------------
// Public entry point — notify the owner of a contact-form enquiry (no
// customer email; an enquiry isn't a paid signup). Never throws.
// --------------------------------------------------------------------------

export async function sendLeadNotification(lead: Lead): Promise<SendResult> {
  const first = (lead.name.split(" ")[0] || "there").trim();
  const rows = [
    detailRow("Reference", esc(lead.id)),
    detailRow("Name", esc(lead.name)),
    detailRow("Email", esc(lead.email)),
    lead.phone ? detailRow("Phone", esc(lead.phone)) : "",
    lead.business ? detailRow("Business", esc(lead.business)) : "",
    lead.trade ? detailRow("Trade", esc(lead.trade)) : "",
    detailRow("Came from", esc(lead.source)),
  ].join("");

  const inner = `
    <h1 style="font-size:22px;margin:0 0 4px;">New enquiry ✉️</h1>
    <p style="font-size:15px;line-height:1.6;color:#3a403d;margin:0 0 20px;">
      <strong>${esc(lead.name)}</strong> sent a message through the contact form.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="background:#f4f2ec;border-radius:12px;padding:16px 18px;margin:0 0 20px;">
      ${rows}
    </table>
    ${
      lead.message
        ? `<p style="font-size:14px;line-height:1.6;color:#3a403d;margin:0 0 16px;"><strong>Message:</strong><br/>${esc(lead.message).replace(/\n/g, "<br/>")}</p>`
        : `<p style="font-size:14px;line-height:1.6;color:#6b716e;margin:0 0 16px;">(No message left.)</p>`
    }
    <p style="font-size:14px;line-height:1.6;color:#6b716e;margin:0;">
      Reply to this email to go straight to ${esc(first)}.
    </p>`;

  const subject = `New enquiry: ${lead.name}${lead.business ? ` (${lead.business})` : ""}`;
  const res = await sendEmail({
    to: OWNER_EMAIL,
    subject,
    html: shell(inner),
    replyTo: lead.email,
  });

  if (!res.ok) console.error("[email] lead notification failed:", res.error);
  else console.log(`[email] lead ${lead.id} — owner notified:${res.id}`);
  return res;
}
