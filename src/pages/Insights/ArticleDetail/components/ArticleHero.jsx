import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiUser } from "react-icons/fi";
import { Container } from "../../../../components/common/Container";
import { Breadcrumb } from "../../../../components/common/Breadcrumb";
import { getCategoryLabel } from "../../../../data/blogPosts";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

export const ArticleHero = ({ post }) => {
  return (
    <section className="relative isolate flex min-h-[52vh] w-full items-center overflow-hidden bg-secondary pb-16 pt-36 lg:pt-40">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-secondary via-[#03201f] to-brand-900" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-10 h-80 w-80 rounded-full bg-highlight/10 blur-3xl"
      />

      <Container className="relative">
        <div className="max-w-3xl">
          

          <Breadcrumb
            items={[
              { label: "Blog & Articles", to: "/insights" },
              { label: post.title },
            ]}
          />

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 font-display text-3xl font-bold leading-[1.2] text-white sm:text-4xl lg:text-[2.6rem]"
          >
            {post.title}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-5 text-base leading-relaxed text-white/80"
          >
            {post.excerpt}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-white/70"
          >
            <span className="flex items-center gap-2">
              <FiUser className="h-4 w-4 text-highlight" aria-hidden="true" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <FiCalendar className="h-4 w-4 text-highlight" aria-hidden="true" />
              <time dateTime={post.publishedDate}>{post.publishedDisplay}</time>
            </span>
            <span className="flex items-center gap-2">
              <FiClock className="h-4 w-4 text-highlight" aria-hidden="true" />
              {post.readTime}
            </span>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
