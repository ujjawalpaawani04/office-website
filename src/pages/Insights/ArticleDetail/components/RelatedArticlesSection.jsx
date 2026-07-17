import { motion } from "framer-motion";
import { Container } from "../../../../components/common/Container";
import { getRelatedPosts } from "../../../../data/blogPosts";
import { ArticleCard } from "../../components/ArticleCard";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.12 * i, ease: EASE },
  }),
};

export const RelatedArticlesSection = ({ post }) => {
  const related = getRelatedPosts(post);
  if (related.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-brand-50 to-white py-16 lg:py-20">
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
            Keep Reading
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
          >
            Related <span className="text-brand-700">Articles</span>
          </motion.h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((relatedPost, i) => (
            <ArticleCard key={relatedPost.slug} post={relatedPost} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
};
