// Consistent "title + primary action" header used at the top of every
// module's list screen.
export function PageHeader({ title, description, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="font-display text-lg font-semibold text-secondary">{title}</h1>
        {description ? <p className="mt-0.5 text-sm text-secondary/60">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
