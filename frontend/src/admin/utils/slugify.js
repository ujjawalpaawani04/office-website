// Matches the backend's slug validation (app/validators/content_validator.py
// SLUG_PATTERN: lowercase letters, numbers, hyphens only).
export function slugify(text) {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
