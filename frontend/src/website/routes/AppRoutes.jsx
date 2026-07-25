
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from '../layouts/Layout';
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import ContactPage from '../pages/Contact/ContactPage';
import IncomeTaxAdvisory from '../pages/Services/IncomeTaxAdvisory/IncomeTaxAdvisory';
import GSTServices from '../pages/Services/GSTServices/GSTServices';
import TDSCompliance from '../pages/Services/TDSCompliance/TDSCompliance';
import DynamicServicePage from '../pages/Services/DynamicServicePage';
import LifeAtSAA from '../pages/LifeAtSAA/LifeAtSAA';
import Career from '../pages/Career/Career';
import BlogListing from '../pages/Blog/BlogListing/BlogListing';
import BlogDetails from '../pages/Blog/BlogDetails/BlogDetails';
import NewsletterUnsubscribe from '../pages/NewsletterUnsubscribe/NewsletterUnsubscribe';
import { adminRoute } from '../../admin/routes/AdminRoutes';

const router = createBrowserRouter([
    adminRoute,
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "about", element: <About /> },
        { path: "contact", element: <ContactPage /> },
        { path: "services/income-tax-advisory", element: <IncomeTaxAdvisory /> },
        { path: "services/gst-services", element: <GSTServices /> },
        { path: "services/tds-compliance", element: <TDSCompliance /> },
        { path: "services/:slug", element: <DynamicServicePage /> },
        { path: "life-at-saa", element: <LifeAtSAA /> },
        { path: "career", element: <Career /> },
        { path: "blogs", element: <BlogListing /> },
        { path: "blog/:slug", element: <BlogDetails /> },
        { path: "newsletter/unsubscribe/:token", element: <NewsletterUnsubscribe /> },
      ],
    },
])


const Approutes = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default Approutes