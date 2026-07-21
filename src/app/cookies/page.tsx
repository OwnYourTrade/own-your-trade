import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/shared/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Own Your Trade uses cookies and similar technologies, and how you can manage your choices.",
};

const UPDATED = "22 July 2026";

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="What cookies are, which ones we use, and how to manage your choices."
      updated={UPDATED}
    >
      <p>
        This Cookie Policy explains how <strong>Own Your Trade</strong> uses cookies and similar
        technologies on our website. It should be read alongside our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files that a website stores on your device when you visit. They are
        widely used to make websites work, to remember your choices, and to provide information to the
        site&rsquo;s owners. Similar technologies (such as local storage) work in a comparable way.
      </p>

      <h2>2. The cookies we use</h2>
      <h3>Strictly necessary cookies</h3>
      <p>
        These are essential for the website to function and cannot be switched off. They are usually
        set in response to actions you take. They include:
      </p>
      <ul>
        <li>Remembering your cookie-consent choice, so we don&rsquo;t ask you on every visit;</li>
        <li>Keeping you signed in to owner or admin areas (session/login cookies);</li>
        <li>Remembering the contents of a basket while you place an order in a demo.</li>
      </ul>
      <p>Because these cookies are strictly necessary, they do not require consent under the rules.</p>

      <h3>Non-essential cookies</h3>
      <p>
        Non-essential cookies — for example, analytics that help us understand how the site is used —
        are only set <strong>with your consent</strong>. We do not currently load third-party
        analytics or advertising cookies. If we introduce any in future, we will only do so after you
        accept them via our cookie banner, and we will update this policy.
      </p>

      <h3>Payment cookies</h3>
      <p>
        When you make a payment, our payment provider <strong>Stripe</strong> may set cookies on their
        own checkout pages to process the payment securely and to help prevent fraud. These are
        governed by Stripe&rsquo;s own cookie and privacy notices.
      </p>

      <h2>3. Managing your choices</h2>
      <p>
        When you first visit our site, you can <strong>accept</strong> or{" "}
        <strong>decline non-essential</strong> cookies using the banner. You can change your mind at
        any time by clearing this site&rsquo;s data in your browser, which will make the banner appear
        again.
      </p>
      <p>
        You can also control cookies through your browser settings — including blocking or deleting
        them. Please note that blocking strictly necessary cookies may stop parts of the site from
        working properly. Most browsers explain how to manage cookies in their help pages.
      </p>

      <h2>4. Changes to this policy</h2>
      <p>
        We may update this Cookie Policy from time to time. Any changes will be posted on this page
        with a revised &ldquo;last updated&rdquo; date.
      </p>

      <h2>5. Contact</h2>
      <p>
        Any questions about our use of cookies? Email{" "}
        <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a>.
      </p>
    </LegalPage>
  );
}
