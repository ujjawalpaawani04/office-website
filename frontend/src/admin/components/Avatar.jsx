import { toneForKey, TONE_STYLES } from "../utils/tone";

function initialsOf(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join("");
}

// Deterministic per-name colored initials circle - the same client always
// gets the same tone across renders/pages (not randomized on every mount),
// used by the Appointments table's Client column.
export function Avatar({ name, size = "h-8 w-8" }) {
  const { bg, text } = TONE_STYLES[toneForKey(name)];
  return (
    <span className={`inline-flex ${size} shrink-0 items-center justify-center rounded-full ${bg} ${text} text-xs font-semibold`}>
      {initialsOf(name)}
    </span>
  );
}
