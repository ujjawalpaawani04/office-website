import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Container } from "../../../components/common/Container";
import { getBlogPostBySlug, getBlogPosts } from "../../../api/blog";
import { getCategoryCounts, getRelatedPosts, sortByNewest } from "../../../utils/blog";
import { BlogSidebar } from "../BlogListing/components/BlogSidebar";
import { ArticleHero } from "./components/ArticleHero";
import { ArticleMeta } from "./components/ArticleMeta";
import { ArticleContent } from "./components/ArticleContent";
import { KeyTakeaways } from "./components/KeyTakeaways";
import { ArticleFAQs } from "./components/ArticleFAQs";
import { AuthorCard } from "./components/AuthorCard";
import { PostNavigation } from "./components/PostNavigation";
import { RelatedArticles } from "./components/RelatedArticles";
import { BlogCTA } from "../components/BlogCTA";

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [allPosts, setAllPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const orderedPosts = useMemo(() => sortByNewest(allPosts), [allPosts]);
  const categoryCounts = useMemo(() => getCategoryCounts(allPosts), [allPosts]);
  const recentPosts = useMemo(
    () => orderedPosts.filter((p) => p.slug !== slug).slice(0, 3),
    [orderedPosts, slug]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([getBlogPostBySlug(slug), getBlogPosts()]).then(([postResult, listResult]) => {
      if (cancelled) return;

      const listOk = listResult.status === "fulfilled" && Array.isArray(listResult.value);
      const postOk = postResult.status === "fulfilled" && postResult.value;

      if (listOk) setAllPosts(listResult.value);

      if (postOk) {
        setPost(postResult.value);
      } else if (listOk) {
        setPost(listResult.value.find((p) => p.slug === slug) ?? null);
      } else {
        setPost(null);
      }

      if (!listOk && !postOk) {
        console.error("Failed to load article:", postResult.reason ?? listResult.reason);
        setError("Unable to load this article right now. Please check back shortly.");
      }

      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Sidebar search has no submit affordance of its own (reused as-is from the
  // listing page), so debounce keystrokes and hand off to the listing page.
  useEffect(() => {
    if (!searchQuery.trim()) return undefined;
    const timeout = setTimeout(() => {
      navigate("/blogs", { state: { search: searchQuery } });
    }, 600);
    return () => clearTimeout(timeout);
  }, [searchQuery, navigate]);

  if (!post && isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f5f5f5] py-24" aria-busy="true">
        <Container className="text-center">
          <p className="text-black/60">Loading article...</p>
        </Container>
      </div>
    );
  }

  if (!post && error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f5f5f5] py-24">
        <Container className="text-center">
          <h1 className="font-display text-3xl font-bold text-black">Something Went Wrong</h1>
          <p className="mt-3 text-black/60" role="alert">
            {error}
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

  const relatedPosts = getRelatedPosts(post, allPosts, 3);
  const postIndex = orderedPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = orderedPosts[postIndex + 1] ?? null;
  const nextPost = postIndex > 0 ? orderedPosts[postIndex - 1] : null;

  return (
    <div>
      <ArticleHero post={post} />

      <section className="bg-[#f5f5f5] py-14 lg:py-20">
        <div className="mx-auto w-full max-w-[1400px] px-4 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[7fr_3fr] lg:items-start">
            <main className="min-w-0">
              <ArticleMeta post={post} />

              <div className="mt-8 overflow-hidden rounded-2xl shadow-[0_20px_50px_-20px_rgba(1,24,24,0.35)]">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="aspect-[21/9] w-full object-cover"
                />
              </div>

              <div className="mx-auto mt-10  rounded-2xl border border-secondary/10 bg-white p-6 sm:p-10 lg:p-12">
                <ArticleContent content={post.content} />
                <KeyTakeaways points={post.keyTakeaways} />
                <ArticleFAQs faqs={post.faqs} slug={post.slug} />
              </div>

              {/* <div className="mx-auto max-w-3xl">
                <AuthorCard post={post} />
                <PostNavigation prev={prevPost} next={nextPost} />
              </div> */}
            </main>

            <BlogSidebar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categoryCounts={categoryCounts}
              totalCount={allPosts.length}
              activeCategory={post.category}
              onCategoryChange={(category) => navigate("/blogs", { state: { category } })}
              onTagClick={(tag) => navigate("/blogs", { state: { search: tag } })}
              recentPosts={recentPosts}
            />
          </div>
        </div>
      </section>

      <RelatedArticles posts={relatedPosts} />
      <BlogCTA />
    </div>
  );
};

export default BlogDetails;
