import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../../../components/common/Container";
import { blogPosts } from "../../../data/blogPosts";
import { ArticleCard } from "./ArticleCard";
import { CategoryFilter } from "./CategoryFilter";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.12 * i, ease: EASE },
  }),
};

export const LatestArticles = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPosts = useMemo(
    () =>
      activeCategory === "all"
        ? blogPosts
        : blogPosts.filter((post) => post.category === activeCategory),
    [activeCategory]
  );

  return (
    <section id="articles" className="scroll-mt-24 bg-gradient-to-b from-brand-50 to-white py-16 lg:py-20">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            Latest Articles
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
          >
            Explore Our <span className="text-brand-700">Knowledge Base</span>
          </motion.h2>
        </motion.div>

        <div className="mb-10 flex justify-center">
          <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {filteredPosts.length === 0 ? (
              <p className="py-16 text-center text-secondary/60">
                No articles in this category yet - check back soon.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post, i) => (
                  <ArticleCard key={post.slug} post={post} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
};
