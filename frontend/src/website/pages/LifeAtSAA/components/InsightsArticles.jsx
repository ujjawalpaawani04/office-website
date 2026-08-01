import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "../../../components/common/Container";
import { insightsArticles } from "../../../data/insightsArticles";
import { ArticleContent } from "./ArticleContent";
import { VideoThumbnail } from "./VideoThumbnail";
import { VideoModal } from "./VideoModal";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.12 * i, ease: EASE },
  }),
};

// 2 articles per row - chunk the 9 into pairs, [9] ends up alone in the
// last row rather than forcing a 5th fake article to fill it.
const rows = [];
for (let i = 0; i < insightsArticles.length; i += 2) {
  rows.push(insightsArticles.slice(i, i + 2));
}

export const InsightsArticles = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section id="insights-articles" className="scroll-mt-24 py-16 lg:py-20 bg-gradient-to-b from-brand-50 to-white">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-12"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            Insights &amp; Articles
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
          >
            Insights &amp; <span className="text-brand-700">Articles</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-secondary/70"
          >
            Explore professional insights, informative perspectives and engaging content covering taxation,
            compliance, business and financial matters.
          </motion.p>
        </motion.div>

        {/* 2 articles per row; each article is its own content+video pair. */}
        <div className="space-y-6 lg:space-y-8">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
              {row.map((article) => {
                const i = article.id - 1;
                return (
                  <motion.div
                    key={article.id}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-60px" }}
                    custom={i}
                    className="grid grid-cols-1 items-stretch sm:grid-cols-2 sm:h-[480px]"
                  >
                    <ArticleContent article={article} index={i} />
                    <VideoThumbnail article={article} onPlay={setActiveVideo} />
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </Container>

      <VideoModal article={activeVideo} onClose={() => setActiveVideo(null)} />
    </section>
  );
};
