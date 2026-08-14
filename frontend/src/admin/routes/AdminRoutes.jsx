import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { AuthProvider } from "../auth/AuthProvider";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { RoleGuard } from "../auth/RoleGuard";
import { AdminLayout } from "../layouts/AdminLayout";
import { ErrorState } from "../components/ErrorState";
import { ToastProvider } from "../toast/ToastProvider";
import {
  AdminPageLoader,
  AuditLog,
  Appointments,
  Articles,
  Awards,
  BlogAuthors,
  BlogCategories,
  BlogPostEditor,
  BlogPosts,
  BlogTags,
  Certifications,
  Dashboard,
  Enquiries,
  FirmStats,
  ForgotPassword,
  JobApplications,
  JobOpenings,
  Login,
  MediaLibrary,
  Newsletter,
  Profile,
  ResetPassword,
  Security,
  ServiceEditor,
  Services,
  SiteSettings,
  Testimonials,
  TeamMembers,
  Users,
  VerifyOtp,
} from "./adminLazyPages";

// Mounted as one top-level branch of the existing single router in
// routes/AppRoutes.jsx (react-router v7 supports exactly one Router per
// app, so this is a route-object subtree, not a second RouterProvider).
// AuthProvider wraps the whole /admin/* branch, including /admin/login,
// since the login screen also needs useAuth()'s login() method. ToastProvider
// wraps AuthProvider (not the other way around) so any page - including
// Login and AuthProvider itself - can surface a toast, e.g. the
// idle-timeout warning fired from inside AuthProvider before it logs the
// user out.
//
// Every authenticated page is a child of AdminLayout below - add new
// modules here as they're built, keeping this list in lockstep with
// constants/navigation.js (a nav entry should never point at a route that
// isn't registered here, and vice versa).
export const adminRoute = {
  path: "/admin",
  element: (
    <ToastProvider>
      <AuthProvider>
        <Suspense fallback={<AdminPageLoader />}>
          <Outlet />
        </Suspense>
      </AuthProvider>
    </ToastProvider>
  ),
  children: [
    { path: "login", element: <Login /> },
    { path: "forgot-password", element: <ForgotPassword /> },
    { path: "verify-otp", element: <VerifyOtp /> },
    { path: "reset-password", element: <ResetPassword /> },
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { index: true, element: <Dashboard /> },
            { path: "media", element: <MediaLibrary /> },
            { path: "team", element: <TeamMembers /> },
            { path: "testimonials", element: <Testimonials /> },
            { path: "awards", element: <Awards /> },
            { path: "certifications", element: <Certifications /> },
            { path: "firm-stats", element: <FirmStats /> },
            { path: "blog/categories", element: <BlogCategories /> },
            { path: "blog/tags", element: <BlogTags /> },
            { path: "blog/authors", element: <BlogAuthors /> },
            { path: "blog/posts", element: <BlogPosts /> },
            { path: "blog/posts/:id", element: <BlogPostEditor /> },
            { path: "articles", element: <Articles /> },
            { path: "services", element: <Services /> },
            { path: "services/:id", element: <ServiceEditor /> },
            { path: "job-openings", element: <JobOpenings /> },
            { path: "job-applications", element: <JobApplications /> },
            { path: "enquiries", element: <Enquiries /> },
            { path: "appointments", element: <Appointments /> },
            { path: "newsletter", element: <Newsletter /> },
            { path: "profile", element: <Profile /> },
            {
              // Users, Audit Log, Security, and Settings are admin-only -
              // the backend already enforces this on every request
              // (require_role("admin") on each endpoint), this just stops
              // an editor who navigates here directly from landing on a
              // broken/empty page instead of a clear explanation.
              element: (
                <RoleGuard
                  allow={["admin"]}
                  fallback={
                    <ErrorState message="You don't have permission to view this page. Contact an administrator if you believe this is a mistake." />
                  }
                >
                  <Outlet />
                </RoleGuard>
              ),
              children: [
                { path: "users", element: <Users /> },
                { path: "audit-log", element: <AuditLog /> },
                { path: "security", element: <Security /> },
                { path: "settings", element: <SiteSettings /> },
              ],
            },
          ],
        },
      ],
    },
  ],
};
