const STATUS_STYLES = {
  new: "bg-amber-50 text-amber-700",
  in_progress: "bg-blue-50 text-blue-700",
  reviewed: "bg-blue-50 text-blue-700",
  shortlisted: "bg-violet-50 text-violet-700",
  resolved: "bg-green-50 text-green-700",
  hired: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  subscribed: "bg-green-50 text-green-700",
  unsubscribed: "bg-secondary/10 text-secondary/60",
  published: "bg-green-50 text-green-700",
  draft: "bg-secondary/10 text-secondary/60",
  archived: "bg-amber-50 text-amber-700",
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
        STATUS_STYLES[status] || "bg-secondary/5 text-secondary/60"
      }`}
    >
      {status?.replace(/_/g, " ")}
    </span>
  );
}

export function ActiveBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        active ? "bg-green-50 text-green-700" : "bg-secondary/10 text-secondary/50"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}
