import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Container } from "../../components/common/Container";
import { Seo } from "../../components/common/Seo";

// Catch-all for any unmatched URL (typo, stale bookmark, old search-engine
// link) - styled identically to the "Article Not Found" / "Service Not
// Found" states already used on BlogDetails/DynamicServicePage, so a
// visitor gets the same branded treatment everywhere something doesn't
// exist, rather than react-router's bare default error screen.
const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#145b5c] py-24">
      <Seo title="Page Not Found" description="The page you're looking for doesn't exist or may have been moved." />
      <meta name="robots" content="noindex" />
      <Container className="text-center">
        <h1 className="font-display text-3xl font-bold text-white">Page Not Found</h1>
        <p className="mt-3 text-white">The page you're looking for doesn't exist or may have been moved.</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all duration-300 group"
        >
          <FiArrowLeft className="transition-transform transform duration-300 h-4 w-4 group-hover:-translate-x-1" aria-hidden="true" />
          Back to Home
        </Link>
      </Container>
    </div>
  );
};

export default NotFound;
