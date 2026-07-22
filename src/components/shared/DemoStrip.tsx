import Link from "next/link";
import { site } from "@/config/site";

/**
 * Slim bar shown above every live demo so it reads as another page of the same
 * site, not a separate project. Carries the OWN·YOUR·TRADE wordmark (top-left,
 * always), a "live demo" tag, and links back to the pitch + owner view.
 * Also the "Built by Own Your Trade" back-link the brief asks each demo to have.
 */
export default function DemoStrip({
  slug,
  label,
  dashboardPath,
  dashboardLabel = "Owner's view",
}: {
  slug: string;
  label: string;
  dashboardPath?: string;
  dashboardLabel?: string;
}) {
  const parts = site.wordmark.split("·");
  return (
    <div className="bg-ink text-paper">
      <div className="container-x flex h-11 items-center justify-between gap-3 text-xs">
        <Link href={`/${slug}`} className="group inline-flex items-center gap-2 text-paper/80 hover:text-paper">
          <span aria-hidden>←</span>
          <span className="wordmark text-[12px] leading-none">
            {parts.map((p, i) => (
              <span key={p}>
                {i > 0 && <span className="mx-[2px] text-stamp-light">·</span>}
                {p}
              </span>
            ))}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="stamp-badge !border-paper/40 !text-paper/80">Live demo · {label}</span>
          {dashboardPath && (
            <Link href={dashboardPath} className="hidden font-mono uppercase tracking-[0.12em] text-paper/80 underline-offset-4 hover:text-paper hover:underline sm:inline">
              {dashboardLabel} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
