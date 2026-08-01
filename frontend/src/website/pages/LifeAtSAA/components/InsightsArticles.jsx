import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "../../../components/common/Container";
import { getArticles } from "../../../api/articles";
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

// DB response is already published-only, ordered by displayOrder (see
// GET /api/articles) - mapped here to the {id, title, description, video,
// thumbnail} shape ArticleContent/VideoThumbnail/VideoModal already expect,
// so none of them need to know the API's field names.
const mapArticle = (a) => ({
  id: a.id,
  title: a.title,
  description: a.shortDescription,
  video: a.videoUrl,
  thumbnail: a.thumbnail,
});

export const InsightsArticles = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getArticles()
      .then((data) => {
        if (cancelled) return;
        setArticles(Array.isArray(data) ? data.map(mapArticle) : []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load articles:", err);
        setError("Unable to load articles right now. Please check back shortly.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // 2 articles per row - chunk into pairs, an odd one out ends up alone in
  // the last row rather than forcing a fake article to fill it.
  const rows = [];
  for (let i = 0; i < articles.length; i += 2) {
    rows.push(articles.slice(i, i + 2));
  }

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

        {isLoading && (
          <p className="text-center text-sm text-secondary/60" aria-busy="true" aria-live="polite">
            Loading articles...
          </p>
        )}

        {!isLoading && error && (
          <p className="text-center text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        )}

        {!isLoading && !error && articles.length === 0 && (
          <p className="text-center text-sm text-secondary/60">No articles to show yet.</p>
        )}

        {/* 2 articles per row; each article is its own content+video pair. */}
        {!isLoading && !error && articles.length > 0 && (
          <div className="space-y-6 lg:space-y-8">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                {row.map((article, colIndex) => {
                  const i = rowIndex * 2 + colIndex;
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
        )}
      </Container>

      <VideoModal article={activeVideo} onClose={() => setActiveVideo(null)} />
    </section>
  );
};
