import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/shared/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Own Your Trade collects, uses and protects your personal data, in line with UK GDPR and the Data Protection Act 2018.",
};

const UPDATED = "22 July 2026";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="How we collect, use and protect your personal data, and the rights you have over it."
      updated={UPDATED}
    >
      <p>
        This Privacy Policy explains how <strong>Own Your Trade</strong> (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects and uses your personal data when you visit our
        website or enquire about or purchase our services. We are committed to protecting your
        privacy and handling your data in line with the UK General Data Protection Regulation (UK
        GDPR) and the Data Protection Act 2018.
      </p>

      <h2>1. Who we are</h2>
      <p>
        Own Your Trade provides ordering and booking systems and websites for independent local
        trades. For the purposes of data protection law, we are the <strong>data controller</strong>{" "}
        of the personal data described in this policy.
      </p>
      <ul>
        <li><strong>Trading name:</strong> Own Your Trade</li>
        <li><strong>Company registration number:</strong> <span className="placeholder">[to be added]</span></li>
        <li><strong>Registered address:</strong> <span className="placeholder">[to be added]</span></li>
        <li><strong>Contact email:</strong> <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a></li>
      </ul>

      <h2>2. The personal data we collect</h2>
      <p>When you use our &ldquo;Get started&rdquo; or enquiry forms, we collect the details you provide, which may include:</p>
      <ul>
        <li>Your name;</li>
        <li>Your email address;</li>
        <li>Your phone number;</li>
        <li>Your business name, trade, business address or area, and any preferred domain or existing website;</li>
        <li>Any message, notes or other information you choose to send us.</li>
      </ul>
      <p>
        When you make a payment, your card details are collected and processed directly by our
        payment provider (see section 5). We do not receive or store your full card number.
      </p>
      <p>
        We also collect limited technical information automatically through cookies and similar
        technologies — see our <Link href="/cookies">Cookie Policy</Link> for details.
      </p>

      <h2>3. How and why we use your data</h2>
      <p>We use your personal data to:</p>
      <ul>
        <li>Respond to your enquiry and provide the information or quote you asked for;</li>
        <li>Set up, build, deliver and support the service you sign up for;</li>
        <li>Take payment and manage billing;</li>
        <li>Send you service-related emails (for example, a signup confirmation and updates about your build);</li>
        <li>Keep records, meet our legal obligations, and prevent fraud or misuse of our forms.</li>
      </ul>
      <p>We rely on the following lawful bases under UK GDPR:</p>
      <ul>
        <li><strong>Contract</strong> — where we need your data to provide a service you have requested or purchased;</li>
        <li><strong>Legitimate interests</strong> — to respond to enquiries, run and improve our business, and keep our forms secure, in a way that does not override your rights;</li>
        <li><strong>Consent</strong> — for any non-essential cookies, which you can accept or decline; and</li>
        <li><strong>Legal obligation</strong> — where we must keep records (for example, for tax and accounting).</li>
      </ul>

      <h2>4. Marketing</h2>
      <p>
        We will only send you marketing communications where we have a lawful basis to do so. You
        can ask us to stop at any time by emailing{" "}
        <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a>.
      </p>

      <h2>5. Sharing your data &amp; third-party processors</h2>
      <p>
        We do not sell your personal data. We share it only with trusted service providers who
        process it on our behalf under appropriate agreements, including:
      </p>
      <ul>
        <li><strong>Stripe</strong> — processes card payments securely. Your payment details are handled by Stripe under their own privacy policy.</li>
        <li><strong>Resend</strong> — sends our transactional emails (such as your signup confirmation), using your name and email address.</li>
        <li><strong>Vercel</strong> — hosts our website and stores form submissions on our behalf.</li>
      </ul>
      <p>
        Some of these providers may process data outside the UK or European Economic Area. Where
        they do, we rely on appropriate safeguards (such as UK-approved standard contractual clauses
        or an adequacy decision) to keep your data protected.
      </p>

      <h2>6. How long we keep your data</h2>
      <p>
        We keep your personal data only for as long as necessary for the purposes described above.
        Enquiry details are typically kept for up to 24 months from your last contact with us, unless
        you become a customer. Customer and billing records are kept for the duration of our
        relationship and for at least 6 years afterwards to meet legal and accounting requirements.
        We delete or anonymise data when it is no longer needed.
      </p>

      <h2>7. Your rights</h2>
      <p>Under UK GDPR you have the right to:</p>
      <ul>
        <li><strong>Access</strong> the personal data we hold about you;</li>
        <li>Ask us to <strong>correct</strong> inaccurate or incomplete data;</li>
        <li>Ask us to <strong>delete</strong> your data (the &ldquo;right to erasure&rdquo;);</li>
        <li><strong>Restrict</strong> or <strong>object</strong> to our processing in certain circumstances;</li>
        <li>Request <strong>portability</strong> of data you provided to us;</li>
        <li><strong>Withdraw consent</strong> at any time, where we rely on consent.</li>
      </ul>
      <p>
        To exercise any of these rights, email us at{" "}
        <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a>. We will respond within one
        month. There is normally no charge.
      </p>

      <h2>8. Security</h2>
      <p>
        We take appropriate technical and organisational measures to protect your data against
        unauthorised access, loss or misuse. Payments are processed over encrypted connections by
        Stripe. No method of transmission or storage is completely secure, but we work to protect
        your data at all times.
      </p>

      <h2>9. Complaints</h2>
      <p>
        If you are unhappy with how we have handled your data, please contact us first so we can try
        to put it right. You also have the right to complain to the UK&rsquo;s data protection
        regulator, the Information Commissioner&rsquo;s Office (ICO), at{" "}
        <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page
        with a revised &ldquo;last updated&rdquo; date.
      </p>

      <h2>11. Contact us</h2>
      <p>
        For any questions about this policy or your personal data, email{" "}
        <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a>.
      </p>
    </LegalPage>
  );
}
