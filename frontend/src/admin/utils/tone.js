// Shared bg/text color pairs for the small set of accent tones used across
// stat cards, badges, and avatars - one place to keep them visually
// consistent with each other and with StatusBadge's existing status colors,
// rather than each component picking its own bg-*-50/text-*-700 pairing.
export const TONE_STYLES = {
  brand: { bg: "bg-brand-50", text: "text-brand-700" },
  green: { bg: "bg-green-50", text: "text-green-700" },
  amber: { bg: "bg-amber-50", text: "text-amber-700" },
  red: { bg: "bg-red-50", text: "text-red-700" },
  violet: { bg: "bg-violet-50", text: "text-violet-700" },
  blue: { bg: "bg-blue-50", text: "text-blue-700" },
};

// Rotation used to give each distinct name (e.g. a client's initials
// avatar) a deterministic, visually-varied tone instead of every row
// looking identical.
const TONE_ROTATION = ["brand", "violet", "blue", "amber", "green", "red"];

export function toneForKey(key) {
  let hash = 0;
  const value = key || "";
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) | 0;
  return TONE_ROTATION[Math.abs(hash) % TONE_ROTATION.length];
}
