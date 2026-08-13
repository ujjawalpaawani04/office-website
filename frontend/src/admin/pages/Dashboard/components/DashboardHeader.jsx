import { useAuth } from "../../../auth/useAuth";

const TODAY_LABEL = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function DashboardHeader() {
  const { admin } = useAuth();

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">Dashboard</p>
        <h1 className="mt-1 font-display text-[26px] font-bold leading-tight text-secondary">
          Welcome back{admin?.name ? `, ${admin.name}` : ""}
        </h1>
        <p className="mt-1.5 text-sm text-secondary/50">Here's what's happening with your website today.</p>
      </div>
      <p className="pb-1 text-sm font-medium text-secondary/40">{TODAY_LABEL}</p>
    </div>
  );
}
