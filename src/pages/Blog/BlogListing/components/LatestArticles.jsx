import { motion } from "framer-motion";
import { BlogCard } from "../../components/BlogCard";
import { Pagination } from "./Pagination";

const EASE = [0.22, 1, 0.36, 1];

export const LatestArticles = ({ posts, currentPage, totalPages, onPageChange, heading }) => {
  return (
    <section id="articles" className="scroll-mt-28">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="border-l-4 border-brand-700 pl-3 font-display text-xl font-bold text-black">
          {heading}
        </h2>
      </div>

      {posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="rounded-2xl border border-dashed border-secondary/20 bg-white px-6 py-16 text-center"
        >
          <p className="font-display text-lg font-bold text-black">No articles found</p>
          <p className="mt-2 text-sm text-black/60">
            Try a different search term or browse another category.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </section>
  );
};
