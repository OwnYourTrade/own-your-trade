import type { VerticalSlug } from "@/config/verticals";

/** Simple line icons per trade — no emoji, no filled clip-art. */
export default function TradeIcon({
  name,
  className = "h-6 w-6",
}: {
  name: VerticalSlug;
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    className,
  };
  switch (name) {
    case "takeaway":
      return (
        <svg {...common}>
          <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" />
          <path d="M8.5 8 10 4h4l1.5 4" />
          <path d="M9.5 12v4M14.5 12v4" />
        </svg>
      );
    case "driving":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="2.5" />
          <path d="M12 3.5v6M4.2 15.5l5.2-2.2M19.8 15.5l-5.2-2.2" />
        </svg>
      );
    case "barber":
      return (
        <svg {...common}>
          <circle cx="6" cy="6.5" r="2.5" />
          <circle cx="6" cy="17.5" r="2.5" />
          <path d="M8.2 7.8 20 16M8.2 16.2 20 8" />
        </svg>
      );
    case "tutor":
      return (
        <svg {...common}>
          <path d="M3 6.5 12 3l9 3.5-9 3.5-9-3.5Z" />
          <path d="M6.5 8.2V13c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6V8.2" />
          <path d="M21 6.8v5" />
        </svg>
      );
    case "pt":
      return (
        <svg {...common}>
          <path d="M4 9v6M7 7.5v9M17 7.5v9M20 9v6M7 12h10" />
        </svg>
      );
  }
}
