import * as FiIcons from "react-icons/fi";

// Every icon anywhere in the Services module is a Feather icon (react-icons/fi)
// - confirmed across every existing service page. Content is stored in the
// database as a bare icon name (e.g. "FiFileText"); this resolves that name
// back to the actual component for rendering. Falls back to a generic icon
// so a stale/unknown name never crashes the page.
export function getIcon(name) {
  return FiIcons[name] || FiIcons.FiCircle;
}
