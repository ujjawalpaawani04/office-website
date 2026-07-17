import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Container } from "../../../components/common/Container";
import { Seo } from "../../../components/common/Seo";
import { getPostBySlug } from "../../../data/blogPosts";
import { ArticleHero } from "./components/ArticleHero";
import { TableOfContents } from "./components/TableOfContents";
import { ArticleBody } from "./components/ArticleBody";
import { KeyTakeaways } from "./components/KeyTakeaways";
import { AuthorCard } from "./components/AuthorCard";
import { RelatedArticlesSection } from "./components/RelatedArticlesSection";
import { InsightsCTA } from "../components/InsightsCTA";

// Sits on a dark section (like every other hero on the site) rather than
// plain white - the header stays transparent with white text until the
// user scrolls, so a white background here would make the nav unreadable.
const ArticleNotFound = () => (
  <div className="flex min-h-[70vh] items-center bg-gradient-to-br from-secondary via-[#03201f] to-brand-900 pt-24 pb-16 text-center">
    <Container>
      <h1 className="font-display text-3xl font-bold text-white">Article Not Found</h1>
      <p className="mt-4 text-white/70">
        The article you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/insights"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-highlight px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-secondary shadow-lg shadow-highlight/20 transition-all duration-300 hover:-translate-y-0.5"
      >
        <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Blog &amp; Articles
      </Link>
    </Container>
  </div>
);

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  const articleSchema = useMemo(() => {
    if (!post) return null;
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription,
      image: post.image,
      author: { "@type": "Person", name: post.author },
      publisher: { "@type": "Organization", name: "Singh Amit & Associates" },
      datePublished: post.publishedDate,
      mainEntityOfPage: `/insights/${post.slug}`,
    };
  }, [post]);

  if (!post) {
    return (
      <>
        <Seo title="Article Not Found" description="This article could not be found." />
        <ArticleNotFound />
      </>
    );
  }

  return (
    <div className="bg-white">
      <Seo
        title={post.title}
        description={post.metaDescription}
        canonicalPath={`/insights/${post.slug}`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <ArticleHero post={post} />

      <section className="bg-white py-12 lg:py-16">
        <Container>
          

          <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:items-start">
            <TableOfContents sections={post.content} />

            <article>
              <ArticleBody sections={post.content} />
              <KeyTakeaways items={post.keyTakeaways} />
              <AuthorCard post={post} />
            </article>
          </div>
        </Container>
      </section>

      <RelatedArticlesSection post={post} />
      <InsightsCTA />
    </div>
  );
};

export default ArticleDetailPage;
