// Lightweight className combiner: joins truthy values, drops falsy ones.
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
