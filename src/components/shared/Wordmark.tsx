import Link from "next/link";
import Logo from "./Logo";
import { site } from "@/config/site";

/**
 * Logo mark + OWN·YOUR·TRADE wordmark (Space Mono, dot separators). Always
 * top-left. `tone` picks legible colours for dark vs light backgrounds; the
 * icon is stamp-red on light, paper on dark.
 */
export default function Wordmark({
  tone = "dark",
  size = "md",
  href = "/",
  className = "",
}: {
  tone?: "dark" | "light";
  size?: "sm" | "md";
  href?: string;
  className?: string;
}) {
  const parts = site.wordmark.split("·");
  const text = tone === "light" ? "text-paper" : "text-ink";
  const dot = tone === "light" ? "text-stamp-light" : "text-stamp";
  const icon = tone === "light" ? "text-paper" : "text-stamp";
  const iconSize = size === "md" ? "h-7 w-7" : "h-5 w-5";
  const textSize = size === "md" ? "text-[17px]" : "text-[13px]";

  return (
    <Link
      href={href}
      aria-label={site.name}
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <Logo className={`${iconSize} ${icon} shrink-0`} />
      <span className={`wordmark inline-flex items-baseline leading-none ${textSize} ${text}`}>
        {parts.map((p, i) => (
          <span key={p} className="inline-flex items-baseline">
            {i > 0 && <span className={`mx-[3px] ${dot}`}>·</span>}
            <span>{p}</span>
          </span>
        ))}
      </span>
    </Link>
  );
}
