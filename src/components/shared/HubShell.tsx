import OwnYourTradeNav from "./OwnYourTradeNav";
import OwnYourTradeFooter from "./OwnYourTradeFooter";

/**
 * Chrome for the marketing hub and the vertical pitch pages.
 * `heroTone` tells the (transparent-at-top) nav whether it sits over a dark
 * hero ("dark" → light nav text) or a light one ("light" → ink nav text).
 * The nav is fixed, so each page's first section owns its own top padding.
 */
export default function HubShell({
  children,
  heroTone = "light",
}: {
  children: React.ReactNode;
  heroTone?: "light" | "dark";
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <OwnYourTradeNav heroTone={heroTone} />
      <main className="flex-1">{children}</main>
      <OwnYourTradeFooter />
    </div>
  );
}
