import { Link, useRouteError } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Header } from "../../layouts/Header/Header";
import { Footer } from "../../layouts/Footer/Footer";
import { Container } from "../../components/common/Container";
import { Seo } from "../../components/common/Seo";

// react-router renders this in place of the whole "/" route (Layout +
// Outlet) when a render error bubbles up from anywhere in the tree, so it
// re-renders Header/Footer itself rather than relying on Layout - the point
// of an error boundary is to still look like the site even when something
// inside it broke. Header has no external data dependency; Footer's
// useSiteSettings() falls back to DEFAULT_SITE_SETTINGS when there's no
// SiteSettingsProvider ancestor (see SiteSettingsContext.jsx), so both
// render safely without Layout's provider.
const AppErrorBoundary = () => {
  const error = useRouteError();

  if (import.meta.env.DEV) {
    console.error("Unhandled route error:", error);
  }

  return (
    <>
      <Header />
      <main>
        <div className="flex min-h-[60vh] items-center justify-center bg-[#f5f5f5] py-24">
          <Seo title="Something Went Wrong" description="An unexpected error occurred." />
          <meta name="robots" content="noindex" />
          <Container className="text-center">
            <h1 className="font-display text-3xl font-bold text-black">Something Went Wrong</h1>
            <p className="mt-3 text-black/60">
              We hit an unexpected error loading this page. Please try again, or head back to the homepage.
            </p>
            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand-700 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:bg-brand-600"
            >
              <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Home
            </Link>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AppErrorBoundary;
