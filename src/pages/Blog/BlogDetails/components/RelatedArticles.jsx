import { Container } from "../../../../components/common/Container";
import { BlogCard } from "../../components/BlogCard";

export const RelatedArticles = ({ posts }) => {
  if (!posts?.length) return null;

  return (
    <section className="bg-[#f5f5f5] py-16 lg:py-20">
      <Container>
        <h2 className="border-l-4 border-brand-700 pl-3 font-display text-xl font-bold text-black">
          Related Articles
        </h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
};
