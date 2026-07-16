import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCalendar, FiChevronRight, FiClock, FiUser } from "react-icons/fi";
import { Container } from "../../../../components/common/Container";
import { CategoryBadge } from "../../components/CategoryBadge";
import { formatDate } from "../../../../utils/blog";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.12 * i, ease: EASE },
  }),
};

export const ArticleHero = ({ post }) => {
  return (
    <section className="relative isolate overflow-hidden bg-secondary pb-14 pt-32 lg:pt-40">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-900 via-secondary to-secondary" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 right-[8%] h-72 w-72 rounded-full bg-highlight/10 blur-3xl" />
        <div className="absolute bottom-0 left-[6%] h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
      </div>

      <Container className="relative">
        <motion.nav
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-widest text-white/50"
        >
          <Link to="/" className="transition-colors hover:text-highlight">
            Home
          </Link>
          <FiChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <Link to="/blogs" className="transition-colors hover:text-highlight">
            Blog
          </Link>
          <FiChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="max-w-[240px] truncate text-white/80 sm:max-w-none" aria-current="page">
            {post.title}
          </span>
        </motion.nav>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="mt-6">
          <CategoryBadge category={post.category} />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mt-5 max-w-4xl font-display text-3xl font-bold leading-[1.15] text-white sm:text-4xl lg:text-[2.75rem]"
        >
          {post.title}
        </motion.h1>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70"
        >
          <span className="flex items-center gap-2">
            <FiUser className="h-4 w-4 text-highlight" aria-hidden="true" />
            {post.author}
          </span>
          <span className="flex items-center gap-2">
            <FiCalendar className="h-4 w-4 text-highlight" aria-hidden="true" />
            {formatDate(post.publishDate)}
          </span>
          <span className="flex items-center gap-2">
            <FiClock className="h-4 w-4 text-highlight" aria-hidden="true" />
            {post.readingTime} min read
          </span>
        </motion.div>
      </Container>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={4}
        className="mt-10"
      >
        <Container>
          <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        </Container>
      </motion.div>
    </section>
  );
};
