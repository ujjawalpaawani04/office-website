// Document 2 §0.4 Empty State: centered message + optional primary action,
// reused by every list screen instead of each module rolling its own.
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-secondary/15 px-6 py-16 text-center">
      {Icon ? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/5 text-secondary/40">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      ) : null}
      <p className="font-medium text-secondary">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-sm text-secondary/60">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
