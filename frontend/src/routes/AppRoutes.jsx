
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from '../components/layout/Layout';
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import ContactPage from '../pages/Contact/ContactPage';
import IncomeTaxAdvisory from '../pages/Services/IncomeTaxAdvisory/IncomeTaxAdvisory';
import GSTServices from '../pages/Services/GSTServices/GSTServices';
import TDSCompliance from '../pages/Services/TDSCompliance/TDSCompliance';
import AccountingBookkeeping from '../pages/Services/AccountingBookkeeping/AccountingBookkeeping';
import AuditAssurance from '../pages/Services/AuditAssurance/AuditAssurance';
import CompanyLLPRegistration from '../pages/Services/CompanyLLPRegistration/CompanyLLPRegistration';
import RERARegistration from '../pages/Services/RERARegistration/RERARegistration';
import LandLawsConsultancy from '../pages/Services/LandLawsConsultancy/LandLawsConsultancy';
import TrustNGORegistration from '../pages/Services/TrustNGORegistration/TrustNGORegistration';
import DigitalSignatureCertificate from '../pages/Services/DigitalSignatureCertificate/DigitalSignatureCertificate';
import BusinessAdvisory from '../pages/Services/BusinessAdvisory/BusinessAdvisory';
import GenericServicePage from '../pages/Services/GenericServicePage';
import LifeAtSAA from '../pages/LifeAtSAA/LifeAtSAA';
import Career from '../pages/Career/Career';
import BlogListing from '../pages/Blog/BlogListing/BlogListing';
import BlogDetails from '../pages/Blog/BlogDetails/BlogDetails';
import NewsletterUnsubscribe from '../pages/NewsletterUnsubscribe/NewsletterUnsubscribe';
import { adminRoute } from '../admin/routes/AdminRoutes';

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
        { path: "services/accounting-bookkeeping", element: <AccountingBookkeeping /> },
        { path: "services/audit-assurance", element: <AuditAssurance /> },
        { path: "services/company-llp-registration", element: <CompanyLLPRegistration /> },
        { path: "services/rera-registration", element: <RERARegistration /> },
        { path: "services/land-laws-consultancy", element: <LandLawsConsultancy /> },
        { path: "services/trust-ngo-registration", element: <TrustNGORegistration /> },
        { path: "services/digital-signature-certificate", element: <DigitalSignatureCertificate /> },
        { path: "services/business-advisory", element: <BusinessAdvisory /> },
        { path: "services/:slug", element: <GenericServicePage /> },
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