import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiClock } from "react-icons/fi";
import { CategoryBadge } from "./CategoryBadge";
import { formatDate } from "../../../utils/blog";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: EASE },
  }),
};

export const BlogCard = ({ post, index = 0 }) => {
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      custom={index}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-700/10 bg-white shadow-[0_4px_20px_-12px_rgba(1,24,24,0.15)] transition-all duration-300 hover:border-brand-700/20 hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgba(1,24,24,0.28)]"
    >
      <Link to={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        <img
          src={post.featuredImage}
          alt={post.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-110"
        />
        <CategoryBadge category={post.category} className="absolute left-4 top-4" />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-4 text-xs font-medium text-secondary/50">
          <span className="flex items-center gap-1.5">
            <FiCalendar className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(post.publishDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <FiClock className="h-3.5 w-3.5" aria-hidden="true" />
            {post.readingTime} min read
          </span>
        </div>

        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-secondary transition-colors duration-300 group-hover:text-brand-700">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="mt-2.5 line-clamp-2 flex-1 text-sm leading-relaxed text-secondary/70">
          {post.summary}
        </p>

        <Link
          to={`/blog/${post.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-all duration-300 hover:text-brand-600 group-hover:gap-3"
        >
          Read More
          <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  );
};
