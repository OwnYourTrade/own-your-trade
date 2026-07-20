import Link from "next/link";
import { site } from "@/config/site";

/** Slim footer for demo pages — the "Built by Own Your Trade" back-link. */
export default function DemoBackFooter({ slug }: { slug: string }) {
  return (
    <footer className="mt-16 bg-ink text-paper">
      <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-paper/60 sm:flex-row">
        <span>This is a live demo — a real, working booking system.</span>
        <Link href={`/${slug}`} className="wordmark text-[12px] text-paper hover:text-stamp-light">
          Built by {site.wordmark} →
        </Link>
      </div>
    </footer>
  );
}
