import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/shared/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms and conditions that govern your use of Own Your Trade and the services we provide.",
};

const UPDATED = "22 July 2026";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms &amp; Conditions"
      intro="The terms that govern your use of our website and the services we provide. Please read them carefully."
      updated={UPDATED}
    >
      <p>
        These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the Own
        Your Trade website and services (the &ldquo;Service&rdquo;). By using our website, or by
        signing up for or purchasing our Service, you agree to these Terms. If you do not agree,
        please do not use the Service.
      </p>

      <h2>1. Who we are</h2>
      <ul>
        <li><strong>Trading name:</strong> Own Your Trade</li>
        <li><strong>Company registration number:</strong> <span className="placeholder">[to be added]</span></li>
        <li><strong>Registered address:</strong> <span className="placeholder">[to be added]</span></li>
        <li><strong>Contact email:</strong> <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a></li>
      </ul>

      <h2>2. The Service</h2>
      <p>
        Own Your Trade provides online ordering and booking systems, and associated websites, for
        independent local businesses. The exact scope depends on the plan you choose. Demonstrations
        on our website use sample data and are provided for illustration only. We may improve, change
        or withdraw parts of the Service from time to time.
      </p>

      <h2>3. Signing up</h2>
      <p>
        When you sign up, you agree to provide accurate and complete information and to keep it up to
        date. You are responsible for keeping any account credentials secure and for activity that
        takes place under your account.
      </p>

      <h2>4. Plans, pricing &amp; billing</h2>
      <p>
        Our plans and prices are shown on our website and were correct at the time of publication. In
        summary:
      </p>
      <ul>
        <li>Plans are charged as a recurring <strong>monthly fee</strong>, and some plans include a one-off <strong>setup and build fee</strong>.</li>
        <li>Your first payment (any setup fee plus your first month) is due when you sign up.</li>
        <li>The monthly fee then recurs each month until you cancel.</li>
        <li>All prices are in pounds sterling (GBP). We will tell you if prices are exclusive of any applicable taxes.</li>
      </ul>
      <p>
        We may change our prices from time to time. Any change to your recurring fee will be notified
        to you in advance and will not affect the period you have already paid for.
      </p>

      <h2>5. Payment terms</h2>
      <p>
        Payments are processed securely by our payment provider, <strong>Stripe</strong>. By
        submitting a payment you authorise us (via Stripe) to charge the amounts due. If a payment
        fails or is not made when due, we may suspend or withdraw the Service until payment is
        received. Card details are handled by Stripe and are subject to their terms.
      </p>

      <h2>6. Cancellation</h2>
      <p>
        You may cancel your recurring plan at any time; cancellation stops future monthly charges.
        Unless required by law, fees already paid (including setup fees and the current month) are
        non-refundable. Where you have a statutory right to cancel, that right is unaffected by this
        clause.
      </p>

      <h2>7. Your responsibilities &amp; acceptable use</h2>
      <p>You agree that you will not, and will not allow others to:</p>
      <ul>
        <li>Use the Service for any unlawful, fraudulent or harmful purpose;</li>
        <li>Upload or publish content that is illegal, infringing, defamatory, or that you do not have the right to use;</li>
        <li>Attempt to gain unauthorised access to, disrupt, or interfere with the Service or its security;</li>
        <li>Misuse our forms, including submitting automated, spam or false submissions;</li>
        <li>Use the Service in a way that breaches any applicable law or third-party rights.</li>
      </ul>
      <p>
        You are responsible for the content and information you provide for your site, and for
        ensuring it is accurate and lawful.
      </p>

      <h2>8. Intellectual property</h2>
      <p>
        We (and our licensors) retain all intellectual property rights in the underlying system,
        software, templates and our own branding. You retain ownership of the content and branding you
        provide to us, and you grant us the licence needed to use it to build and run your site. On a
        paid plan, you receive a licence to use your site and system for as long as your plan is
        active.
      </p>

      <h2>9. Availability</h2>
      <p>
        We aim to keep the Service available and running smoothly, but we do not guarantee that it
        will be uninterrupted or error-free. The Service may occasionally be unavailable for
        maintenance, updates, or reasons beyond our reasonable control.
      </p>

      <h2>10. Liability</h2>
      <p>
        Nothing in these Terms limits or excludes our liability for death or personal injury caused by
        our negligence, for fraud or fraudulent misrepresentation, or for any other liability that
        cannot be limited or excluded by law.
      </p>
      <p>Subject to that:</p>
      <ul>
        <li>We are not liable for any indirect or consequential loss, or for loss of profits, revenue, data, or business, arising out of or in connection with the Service;</li>
        <li>Our total liability to you in connection with the Service is limited to the total fees you paid to us in the 12 months before the event giving rise to the claim.</li>
      </ul>
      <p>
        We provide the Service with reasonable care and skill but otherwise on an &ldquo;as is&rdquo;
        basis, and we do not make any guarantees about specific results, sales or bookings.
      </p>

      <h2>11. Termination</h2>
      <p>
        We may suspend or end your access to the Service if you materially breach these Terms
        (including non-payment) or use the Service unlawfully. You may stop using the Service and
        cancel at any time as set out above.
      </p>

      <h2>12. Data protection</h2>
      <p>
        We process personal data in accordance with our{" "}
        <Link href="/privacy">Privacy Policy</Link>, which forms part of these Terms.
      </p>

      <h2>13. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. The version published on this page applies to
        your use of the Service. Significant changes affecting existing customers will be notified to
        you.
      </p>

      <h2>14. Governing law</h2>
      <p>
        These Terms are governed by the laws of England and Wales, and any disputes will be subject to
        the exclusive jurisdiction of the courts of England and Wales.
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions about these Terms? Email{" "}
        <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a>.
      </p>
    </LegalPage>
  );
}
