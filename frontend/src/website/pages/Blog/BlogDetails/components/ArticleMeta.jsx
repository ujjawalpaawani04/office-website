import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiUser } from "react-icons/fi";
import { CategoryBadge } from "../../components/CategoryBadge";
import { formatDate } from "../../../../utils/blog";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.1 * i, ease: EASE },
  }),
};

export const ArticleMeta = ({ post }) => (
  <motion.div initial="hidden" animate="show">
    <motion.div variants={fadeUp} custom={0}>
      <CategoryBadge category={post.category} />
    </motion.div>

    <motion.h1
      variants={fadeUp}
      custom={1}
      className="mt-4 font-display text-3xl font-bold leading-[1.15] text-black sm:text-4xl lg:text-[2.6rem]"
    >
      {post.title}
    </motion.h1>

    <motion.div
      variants={fadeUp}
      custom={2}
      className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-black/55"
    >
      <span className="flex items-center gap-2">
        <FiUser className="h-4 w-4 text-brand-700" aria-hidden="true" />
        {post.author}
      </span>
      <span className="flex items-center gap-2">
        <FiCalendar className="h-4 w-4 text-brand-700" aria-hidden="true" />
        {formatDate(post.publishDate)}
      </span>
      <span className="flex items-center gap-2">
        <FiClock className="h-4 w-4 text-brand-700" aria-hidden="true" />
        {post.readingTime} min read
      </span>
    </motion.div>
  </motion.div>
);
