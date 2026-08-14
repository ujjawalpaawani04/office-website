import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { Container } from "../../../components/common/Container";
import { getBlogPosts } from "../../../api/blog";
import { sortByNewest } from "../../../utils/blog";
import { BlogCard } from "../../Blog/components/BlogCard";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.1 * i, ease: EASE },
  }),
};

export const KnowledgeCentreTeaser = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getBlogPosts()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setPosts(sortByNewest(data).slice(0, 3));
      })
      .catch(() => {
        // Leave empty on failure - this is a homepage teaser, not the main
        // listing, so it should never surface an error state of its own.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-brand-50">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="lg:text-center mb-12"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            From the <span className="text-brand-700">Blog</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="mt-4 text-base leading-relaxed text-black/70 max-w-2xl lg:mx-auto"
          >
            Notes and updates on amendments in direct tax, GST, corporate law and RERA, prepared for general information.
          </motion.p>
        </motion.div>

        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        ) : null}

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-700 hover:text-brand-800"
          >
            View all articles
            <FiArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
};
