import { useMemo, useState } from "react";
import { Container } from "../../../components/common/Container";
import { BLOG_POSTS } from "../../../data/blog/posts";
import {
  filterPosts,
  getCategoryCounts,
  paginate,
  sortByNewest,
} from "../../../utils/blog";
import { BlogHero } from "./components/BlogHero";
import { BlogSidebar } from "./components/BlogSidebar";
import { FeaturedArticle } from "./components/FeaturedArticle";
import { LatestArticles } from "./components/LatestArticles";
import { NewsletterSection } from "./components/NewsletterSection";
// import { BlogCTA } from "../components/BlogCTA";

const BlogListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const allPosts = useMemo(() => sortByNewest(BLOG_POSTS), []);
  const categoryCounts = useMemo(() => getCategoryCounts(allPosts), [allPosts]);
  const recentPosts = useMemo(() => allPosts.slice(0, 3), [allPosts]);
  const isFiltering = searchQuery.trim() !== "" || activeCategory !== "All";

  const featuredPost = useMemo(
    () => (isFiltering ? null : allPosts.find((post) => post.featured) ?? allPosts[0]),
    [allPosts, isFiltering]
  );

  const filteredPosts = useMemo(() => {
    const results = filterPosts(allPosts, { query: searchQuery, category: activeCategory });
    return featuredPost ? results.filter((post) => post.slug !== featuredPost.slug) : results;
  }, [allPosts, searchQuery, activeCategory, featuredPost]);

  const { items: pagedPosts, totalPages, currentPage: safePage } = useMemo(
    () => paginate(filteredPosts, currentPage),
    [filteredPosts, currentPage]
  );

  const updateSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const updateCategory = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleTagClick = (tag) => {
    updateSearch(tag);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    document.getElementById("articles")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <BlogHero />

      <section className="bg-[#f5f5f5] py-16 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-start">


            <main className="space-y-14">
              {featuredPost && <FeaturedArticle post={featuredPost} />}

              <LatestArticles
                heading={isFiltering ? "Search Results" : "Latest Articles"}
                posts={pagedPosts}
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </main>
                        <BlogSidebar
              searchQuery={searchQuery}
              onSearchChange={updateSearch}
              categoryCounts={categoryCounts}
              totalCount={allPosts.length}
              activeCategory={activeCategory}
              onCategoryChange={updateCategory}
              onTagClick={handleTagClick}
              recentPosts={recentPosts}
            />
          </div>
        </Container>
      </section>

      <NewsletterSection />
      {/* <BlogCTA /> */}
    </div>
  );
};

export default BlogListing;
