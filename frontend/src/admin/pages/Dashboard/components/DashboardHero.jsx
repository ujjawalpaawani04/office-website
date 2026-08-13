import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../../auth/useAuth";

const TODAY_LABEL = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
});

// Dark contrast band (bg-secondary, the app's existing near-black token -
// same color the Topbar/Sidebar's active-nav state already uses, just
// applied to a whole section here for once) with the two metrics that
// actually need admin attention today - new, unactioned submissions -
// pulled out as "featured" glass cards, everything else lives in the
// plain light cards below. Same two summary fields as every other version
// of this dashboard (summary.newEnquiries / summary.newApplications).
export function DashboardHero({ summary, loading }) {
  const { admin } = useAuth();

  const featured = [
    { label: "New Enquiries", value: summary?.newEnquiries, to: "/admin/enquiries" },
    { label: "New Applications", value: summary?.newApplications, to: "/admin/job-applications" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl bg-secondary px-6 py-7 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-highlight">{TODAY_LABEL}</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-white">
            Welcome back{admin?.name ? `, ${admin.name}` : ""}
          </h1>
          <p className="mt-1 text-sm text-white/50">Here's what needs your attention today.</p>
        </div>

        <div className="grid w-full grid-cols-2 gap-3 sm:w-auto sm:min-w-[320px]">
          {featured.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="group rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 backdrop-blur-sm transition-colors hover:bg-white/[0.1]"
            >
              <p className="text-[11px] font-medium uppercase tracking-wide text-white/45">{item.label}</p>
              {loading ? (
                <div className="mt-2 h-6 w-10 animate-pulse rounded bg-white/15" />
              ) : (
                <p className="mt-1 flex items-center gap-1.5 font-display text-2xl font-bold text-white">
                  {item.value ?? 0}
                  <FiArrowRight
                    className="h-3.5 w-3.5 text-highlight opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
