import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCalendar } from "react-icons/fi";
import { Container } from "../../components/common/Container";
import { Breadcrumb } from "../../components/common/Breadcrumb";
import { Seo } from "../../components/common/Seo";
import { getArticleBySlug, getRelatedArticles } from "../../data/insightsArticles";
import { ArticleContent } from "../LifeAtSAA/components/ArticleContent";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

const ArticleNotFound = () => (
  <div className="flex min-h-[70vh] items-center bg-gradient-to-br from-secondary via-[#03201f] to-brand-900 pt-24 pb-16 text-center">
    <Container>
      <h1 className="font-display text-3xl font-bold text-white">Article Not Found</h1>
      <p className="mt-4 text-white/70">The article you're looking for doesn't exist or may have been moved.</p>
      <Link
        to="/life-at-saa#insights-articles"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-highlight px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-secondary shadow-lg shadow-highlight/20 transition-all duration-300 hover:-translate-y-0.5"
      >
        <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Insights
      </Link>
    </Container>
  </div>
);

const InsightArticlePage = () => {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);
  const relatedArticles = useMemo(() => (article ? getRelatedArticles(article) : []), [article]);

  const articleSchema = useMemo(() => {
    if (!article) return null;
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      datePublished: article.publishedDate,
      author: { "@type": "Organization", name: "Singh Amit & Associates" },
      publisher: { "@type": "Organization", name: "Singh Amit & Associates" },
      mainEntityOfPage: `/insights/${article.slug}`,
      ...(article.video
        ? {
            video: {
              "@type": "VideoObject",
              name: article.title,
              description: article.description,
              uploadDate: article.publishedDate,
              contentUrl: article.video,
            },
          }
        : {}),
    };
  }, [article]);

  if (!article) {
    return (
      <>
        <Seo title="Article Not Found" description="This article could not be found." />
        <ArticleNotFound />
      </>
    );
  }

  return (
    <div className="bg-white">
      <Seo title={article.title} description={article.description} canonicalPath={`/insights/${article.slug}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="relative isolate flex min-h-[46vh] w-full items-center overflow-hidden bg-secondary pb-16 pt-36 lg:pt-40">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-secondary via-[#03201f] to-brand-900" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 top-10 h-80 w-80 rounded-full bg-highlight/10 blur-3xl" />

        <Container className="relative">
          <div className="max-w-3xl">
            <Breadcrumb items={[{ label: "Life@SAA", to: "/life-at-saa" }, { label: article.title }]} />

            <motion.span
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.5}
              className="inline-block rounded-full bg-highlight px-4 py-1.5 text-sm font-semibold text-black"
            >
              {article.category}
            </motion.span>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="mt-3 font-display text-3xl font-bold leading-[1.2] text-white sm:text-4xl lg:text-[2.6rem]"
            >
              {article.title}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-5 text-base leading-relaxed text-white/80"
            >
              {article.description}
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-white/70"
            >
              <span className="flex items-center gap-2">
                <FiCalendar className="h-4 w-4 text-highlight" aria-hidden="true" />
                <time dateTime={article.publishedDate}>{article.publishedDisplay}</time>
              </span>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <Container className="max-w-3xl">
          {article.video && (
            <div className="overflow-hidden rounded-2xl border border-brand-700/10 bg-secondary shadow-lg">
              <video src={article.video} controls playsInline preload="metadata" className="aspect-video w-full">
                <track kind="captions" />
              </video>
            </div>
          )}

          <article className={article.video ? "mt-10" : ""}>
            {(article.content.length > 0 ? article.content : [article.description]).map((paragraph, i) => (
              <p key={i} className="mb-5 text-base leading-relaxed text-secondary/80">
                {paragraph}
              </p>
            ))}
          </article>

          <Link
            to="/life-at-saa#insights-articles"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-600"
          >
            <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Insights
          </Link>
        </Container>
      </section>

      {relatedArticles.length > 0 && (
        <section className="bg-gradient-to-b from-brand-50 to-white py-16 lg:py-20">
          <Container>
            <h2 className="mb-10 text-center font-display text-2xl font-bold text-secondary sm:text-3xl">
              Related <span className="text-brand-700">Articles</span>
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedArticles.map((related) => (
                <ArticleContent key={related.id} article={related} index={related.id - 1} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
};

export default InsightArticlePage;
