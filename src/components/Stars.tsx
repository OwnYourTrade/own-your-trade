export default function Stars({
  rating,
  className = "",
  size = 16,
}: {
  rating: number;
  className?: string;
  size?: number;
}) {
  // Render 5 stars with partial fill for the fractional part.
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span
      className={`relative inline-block leading-none ${className}`}
      style={{ fontSize: size }}
      aria-label={`${rating} out of 5 stars`}
    >
      <span className="text-ink/15">★★★★★</span>
      <span
        className="absolute left-0 top-0 overflow-hidden text-gold"
        style={{ width: `${pct}%` }}
      >
        ★★★★★
      </span>
    </span>
  );
}
