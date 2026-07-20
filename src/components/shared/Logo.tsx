/**
 * Own Your Trade logo mark — a flat, single-colour stamp/seal: a rounded-square
 * with a doorway knocked out of it ("your own place"). No gradients, no shadows,
 * no 3D. Colour comes from `currentColor`, so set it via a text-* class; the
 * doorway is transparent (cut out with evenodd), so it works on any background.
 */
export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" role="img">
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2h12a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8V10a8 8 0 0 1 8-8Zm2 24v-7a4 4 0 0 1 8 0v7Z"
      />
    </svg>
  );
}
