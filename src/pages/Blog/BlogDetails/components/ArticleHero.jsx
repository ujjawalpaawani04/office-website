import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { Container } from "../../../../components/common/Container";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.1 * i, ease: EASE },
  }),
};

export const ArticleHero = ({ post }) => {
  return (
    <section className="relative isolate flex h-[440px] w-full items-center justify-center overflow-hidden bg-secondary pb-10 lg:h-[480px] lg:pb-12">
      <img
        src={post.featuredImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover pointer-events-none"
      />

      {/* Dark gradient overlay - darkest at the bottom where the breadcrumb sits */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-secondary via-secondary/85 to-secondary/35" />
      <div className="absolute inset-0 -z-10 bg-secondary/30" />

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
          className="flex flex-wrap items-center gap-2  font-medium uppercase tracking-widest text-white/60 justify-center"
        >
          <Link to="/" className="transition-colors hover:text-highlight">
            Home
          </Link>
          <FiChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <Link to="/blogs" className="transition-colors hover:text-highlight">
            Blog
          </Link>
          <FiChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span
            className="max-w-[240px] truncate normal-case tracking-normal text-white sm:max-w-md lg:max-w-xl"
            aria-current="page"
          >
            {post.title}
          </span>
        </motion.nav>
      </Container>
    </section>
  );
};
