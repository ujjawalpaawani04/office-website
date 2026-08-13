
import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from '../layouts/Layout';
import NotFound from '../pages/NotFound/NotFound';
import AppErrorBoundary from '../pages/NotFound/AppErrorBoundary';
import { adminRoute } from '../../admin/routes/AdminRoutes';

// Route-level code splitting: each page becomes its own JS chunk, loaded on
// first visit instead of all being in the initial bundle. Layout.jsx wraps
// <Outlet/> in a single <Suspense>, so no per-route Suspense boundary is
// needed here. NotFound/AppErrorBoundary stay as regular imports - an error
// page shouldn't itself depend on a dynamic import succeeding.
const Home = lazy(() => import('../pages/Home/Home'));
const About = lazy(() => import('../pages/About/About'));
const ContactPage = lazy(() => import('../pages/Contact/ContactPage'));
const Appointment = lazy(() => import('../pages/Appointment/Appointment'));
const ServicesIndex = lazy(() => import('../pages/Services/ServicesIndex'));
const IncomeTaxAdvisory = lazy(() => import('../pages/Services/IncomeTaxAdvisory/IncomeTaxAdvisory'));
const GSTServices = lazy(() => import('../pages/Services/GSTServices/GSTServices'));
const TDSCompliance = lazy(() => import('../pages/Services/TDSCompliance/TDSCompliance'));
const DynamicServicePage = lazy(() => import('../pages/Services/DynamicServicePage'));
const LifeAtSAA = lazy(() => import('../pages/LifeAtSAA/LifeAtSAA'));
const Career = lazy(() => import('../pages/Career/Career'));
const BlogListing = lazy(() => import('../pages/Blog/BlogListing/BlogListing'));
const BlogDetails = lazy(() => import('../pages/Blog/BlogDetails/BlogDetails'));
const KnowledgeCentre = lazy(() => import('../pages/KnowledgeCentre/KnowledgeCentre'));
const InsightArticlePage = lazy(() => import('../pages/InsightArticle/InsightArticlePage'));
const NewsletterUnsubscribe = lazy(() => import('../pages/NewsletterUnsubscribe/NewsletterUnsubscribe'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy/PrivacyPolicy'));
const Terms = lazy(() => import('../pages/Terms/Terms'));
const Disclaimer = lazy(() => import('../pages/Disclaimer/Disclaimer'));

const router = createBrowserRouter([
    adminRoute,
    {
      path: "/",
      element: <Layout />,
      errorElement: <AppErrorBoundary />,
      children: [
        { index: true, element: <Home /> },
        { path: "about", element: <About /> },
        { path: "contact", element: <ContactPage /> },
        { path: "appointment", element: <Appointment /> },
        { path: "services", element: <ServicesIndex /> },
        { path: "services/income-tax-advisory", element: <IncomeTaxAdvisory /> },
        { path: "services/gst-services", element: <GSTServices /> },
        { path: "services/tds-compliance", element: <TDSCompliance /> },
        { path: "services/:slug", element: <DynamicServicePage /> },
        { path: "life-at-saa", element: <LifeAtSAA /> },
        { path: "career", element: <Career /> },
        { path: "blogs", element: <BlogListing /> },
        { path: "blog/:slug", element: <BlogDetails /> },
        { path: "knowledge-centre", element: <KnowledgeCentre /> },
        { path: "insights/:slug", element: <InsightArticlePage /> },
        { path: "newsletter/unsubscribe/:token", element: <NewsletterUnsubscribe /> },
        { path: "privacy-policy", element: <PrivacyPolicy /> },
        { path: "terms", element: <Terms /> },
        { path: "disclaimer", element: <Disclaimer /> },
        { path: "*", element: <NotFound /> },
      ],
    },
])


const Approutes = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default Approutes