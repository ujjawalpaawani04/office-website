import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Container } from "../../../components/common/Container";
import { BLOG_POSTS } from "../../../data/blog/posts";
import { getRelatedPosts } from "../../../utils/blog";
import { ArticleHero } from "./components/ArticleHero";
import { ArticleContent } from "./components/ArticleContent";
import { KeyTakeaways } from "./components/KeyTakeaways";
import { ArticleFAQs } from "./components/ArticleFAQs";
import { RelatedArticles } from "./components/RelatedArticles";
import { BlogCTA } from "../components/BlogCTA";

const BlogDetails = () => {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  if (!post) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f5f5f5] py-24">
        <Container className="text-center">
          <h1 className="font-display text-3xl font-bold text-black">Article Not Found</h1>
          <p className="mt-3 text-black/60">
            The article you're looking for doesn't exist or may have been moved.
          </p>
          <Link
            to="/blogs"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand-700 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:bg-brand-600"
          >
            <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Blog
          </Link>
        </Container>
      </div>
    );
  }

  const relatedPosts = getRelatedPosts(post, BLOG_POSTS, 3);

  return (
    <div>
      <ArticleHero post={post} />

      <section className="bg-[#f5f5f5] py-14 lg:py-20">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-secondary/10 bg-white p-6 sm:p-10 lg:p-12">
            <ArticleContent content={post.content} />
            <KeyTakeaways points={post.keyTakeaways} />
            <ArticleFAQs faqs={post.faqs} slug={post.slug} />
          </div>
        </Container>
      </section>

      <RelatedArticles posts={relatedPosts} />
      <BlogCTA />
    </div>
  );
};

export default BlogDetails;
