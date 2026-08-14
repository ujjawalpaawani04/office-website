import { lazy } from "react";

// Route-level code splitting, same rationale as website/routes/AppRoutes.jsx:
// each admin page becomes its own JS chunk, loaded on first visit instead of
// being bundled into the public site's initial chunk graph. Kept in its own
// file (rather than inline in AdminRoutes.jsx) because that file's export is
// the non-component `adminRoute` route object - eslint-plugin-react-refresh
// requires a file to export components-only for Fast Refresh to work, and
// this file does exactly that.
export const Login = lazy(() => import("../pages/Login/Login"));
export const ForgotPassword = lazy(() => import("../pages/ForgotPassword/ForgotPassword"));
export const VerifyOtp = lazy(() => import("../pages/VerifyOtp/VerifyOtp"));
export const ResetPassword = lazy(() => import("../pages/ResetPassword/ResetPassword"));
export const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
export const MediaLibrary = lazy(() => import("../pages/Media/MediaLibrary"));
export const TeamMembers = lazy(() => import("../pages/Team/TeamMembers"));
export const Testimonials = lazy(() => import("../pages/Testimonials/Testimonials"));
export const Awards = lazy(() => import("../pages/Awards/Awards"));
export const Certifications = lazy(() => import("../pages/Certifications/Certifications"));
export const FirmStats = lazy(() => import("../pages/FirmStats/FirmStats"));
export const BlogCategories = lazy(() => import("../pages/BlogTaxonomy/BlogCategories"));
export const BlogTags = lazy(() => import("../pages/BlogTaxonomy/BlogTags"));
export const BlogAuthors = lazy(() => import("../pages/BlogTaxonomy/BlogAuthors"));
export const BlogPosts = lazy(() => import("../pages/BlogPosts/BlogPosts"));
export const BlogPostEditor = lazy(() => import("../pages/BlogPosts/BlogPostEditor"));
export const Services = lazy(() => import("../pages/Services/Services"));
export const ServiceEditor = lazy(() => import("../pages/Services/ServiceEditor"));
export const SiteSettings = lazy(() => import("../pages/Settings/SiteSettings"));
export const JobOpenings = lazy(() => import("../pages/JobOpenings/JobOpenings"));
export const JobApplications = lazy(() => import("../pages/JobApplications/JobApplications"));
export const Enquiries = lazy(() => import("../pages/Enquiries/Enquiries"));
export const Appointments = lazy(() => import("../pages/Appointments/Appointments"));
export const Articles = lazy(() => import("../pages/Articles/Articles"));
export const Newsletter = lazy(() => import("../pages/Newsletter/Newsletter"));
export const Users = lazy(() => import("../pages/Users/Users"));
export const AuditLog = lazy(() => import("../pages/AuditLog/AuditLog"));
export const Profile = lazy(() => import("../pages/Profile/Profile"));
export const Security = lazy(() => import("../pages/Security/Security"));

// Plain, admin-shell-toned loading state (matches AdminLayout's own
// bg-secondary/[0.02] background) shown for the brief gap while a route's
// JS chunk downloads - not the public site's PageLoader, which is styled
// for the marketing site and would look out of place inside /admin/*.
export const AdminPageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-secondary/[0.02]" aria-busy="true">
    <p className="text-sm text-secondary/60">Loading...</p>
  </div>
);
