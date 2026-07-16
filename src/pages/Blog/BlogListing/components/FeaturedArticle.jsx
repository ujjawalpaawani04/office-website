import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiClock, FiUser } from "react-icons/fi";
import { CategoryBadge } from "../../components/CategoryBadge";
import { formatDate } from "../../../../utils/blog";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.1 * i, ease: EASE },
  }),
};

export const FeaturedArticle = ({ post }) => {
  if (!post) return null;

  return (
    <section>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mb-6 flex items-center justify-between"
      >
        <motion.h2 variants={fadeUp} custom={0} className="border-l-4 border-brand-700 pl-3 font-display text-xl font-bold text-black">
          Featured Article
        </motion.h2>
      </motion.div>

      <motion.article
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        custom={1}
        className="grid overflow-hidden rounded-2xl border border-brand-700/10 bg-white shadow-[0_10px_36px_-18px_rgba(1,24,24,0.22)] lg:grid-cols-2"
      >
        <Link to={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden lg:aspect-auto">
          <img
            src={post.featuredImage}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
          />
        </Link>

        <div className="flex flex-col justify-center p-7 sm:p-10">
          <CategoryBadge category={post.category} className="w-fit" />

          <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-black sm:text-3xl">
            <Link to={`/blog/${post.slug}`} className="transition-colors hover:text-brand-700">
              {post.title}
            </Link>
          </h3>

          <p className="mt-4 text-[15px] leading-relaxed text-black/65">{post.summary}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-black/50">
            <span className="flex items-center gap-1.5">
              <FiUser className="h-3.5 w-3.5" aria-hidden="true" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <FiCalendar className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDate(post.publishDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock className="h-3.5 w-3.5" aria-hidden="true" />
              {post.readingTime} min read
            </span>
          </div>

          <Link
            to={`/blog/${post.slug}`}
            className="group mt-8 inline-flex w-fit items-center gap-2 rounded-md bg-brand-700 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-md shadow-brand-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            Read More
            <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </motion.article>
    </section>
  );
};
