// Shared helpers for the blog module - kept framework-agnostic so both the
// listing and details pages can derive the same data (counts, related
// articles, pagination) from a single BLOG_POSTS array without duplicating logic.

export const POSTS_PER_PAGE = 6;

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// publishDate is stored as "YYYY-MM-DD" so it sorts correctly as a plain
// string; this formats it for display as "20 May 2026".
export function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTH_LABELS[month - 1]} ${year}`;
}

export function sortByNewest(posts) {
  return [...posts].sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
}

// Category -> post count, computed from the live post list rather than
// hardcoded so the sidebar never drifts out of sync with actual content.
export function getCategoryCounts(posts) {
  return posts.reduce((counts, post) => {
    counts[post.category] = (counts[post.category] ?? 0) + 1;
    return counts;
  }, {});
}

export function filterPosts(posts, { query = "", category = "All" } = {}) {
  const q = query.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesCategory = category === "All" || post.category === category;
    if (!matchesCategory) return false;
    if (!q) return true;

    return (
      post.title.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      post.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });
}

export function paginate(items, page, pageSize = POSTS_PER_PAGE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    totalPages,
    currentPage: safePage,
  };
}

// Related posts: prefer same category, then fall back to any other post so
// the section is never empty even for a lightly-populated category.
export function getRelatedPosts(post, allPosts, limit = 3) {
  const sameCategory = allPosts.filter(
    (p) => p.slug !== post.slug && p.category === post.category
  );
  const others = allPosts.filter(
    (p) => p.slug !== post.slug && p.category !== post.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}
