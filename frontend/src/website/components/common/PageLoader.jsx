import { Container } from "./Container";

// Suspense fallback for lazy-loaded routes (see routes/AppRoutes.jsx) -
// reuses the same "Loading..." treatment already used for in-page data
// fetches on BlogDetails.jsx/DynamicServicePage.jsx, so a route's JS chunk
// loading looks like every other loading state already on this site
// instead of introducing a new one.
export const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center bg-[#f5f5f5] py-24" aria-busy="true">
    <Container className="text-center">
      <p className="text-black/60">Loading...</p>
    </Container>
  </div>
);
