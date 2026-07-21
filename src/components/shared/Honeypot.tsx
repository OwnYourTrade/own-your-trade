/**
 * Spam honeypot field. A real, visually-hidden text input that humans never
 * see or fill, but bots that auto-complete every field will. If the paired
 * server route receives a non-empty value for this field, it silently drops
 * the submission. Hidden off-screen (not display:none) with tabIndex -1 and
 * autoComplete off so it stays invisible to people and assistive tech.
 *
 * Keep the field NAME in sync with the server check: `company_url`.
 */
export const HONEYPOT_FIELD = "company_url";

export default function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "auto",
        width: 1,
        height: 1,
        overflow: "hidden",
      }}
    >
      <label htmlFor={HONEYPOT_FIELD}>Company URL (leave this field blank)</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
