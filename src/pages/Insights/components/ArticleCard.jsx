import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiClock, FiUser } from "react-icons/fi";
import { getCategoryLabel } from "../../../data/blogPosts";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: EASE },
  }),
};

/**
 * Shared article card used in the Latest Articles grid and Related Articles.
 */
export const ArticleCard = ({ post, index = 0 }) => {
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      custom={index}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-700/10 bg-white shadow-[0_4px_20px_-12px_rgba(1,24,24,0.15)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-700/20 hover:shadow-[0_24px_48px_-20px_rgba(1,24,24,0.28)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out "
        />
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-highlight px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-secondary shadow-md">
          {getCategoryLabel(post.category)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-secondary/50">
          <span className="flex items-center gap-1.5">
            <FiUser className="h-3.5 w-3.5" aria-hidden="true" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <FiCalendar className="h-3.5 w-3.5" aria-hidden="true" />
            <time dateTime={post.publishedDate}>{post.publishedDisplay}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <FiClock className="h-3.5 w-3.5" aria-hidden="true" />
            {post.readTime}
          </span>
        </div>

        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-secondary transition-colors duration-300 group-hover:text-brand-700">
          <Link to={`/insights/${post.slug}`} className="focus-visible:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {post.title}
          </Link>
        </h3>

        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-secondary/70">{post.excerpt}</p>

        <span className="relative z-10 mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-brand-700 transition-all duration-300 group-hover:gap-3">
          Read More
          <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </motion.article>
  );
};
