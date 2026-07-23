import { EmptyState } from "./EmptyState";
import { Skeleton, SkeletonTableRows } from "./Skeleton";

// Generic Data Table (Document 6) - every list screen configures columns
// and gets consistent loading/empty rendering for free.
// columns: [{ key, label, render?(row) => node, className? }]
//
// Below the `sm` breakpoint, a wide table is replaced with a stacked card
// per row (same columns, rendered as label/value pairs) instead of forcing
// horizontal scroll - the standard responsive pattern for data tables on
// phones, and the single place every list page's mobile layout is fixed.
export function DataTable({ columns, rows, loading, getRowId = (row) => row.id, actions, emptyProps }) {
  const showEmpty = !loading && rows.length === 0;

  return (
    <div className="overflow-hidden rounded-xl border border-secondary/10 bg-white">
      {/* Desktop / tablet */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-secondary/10 bg-secondary/[0.02] text-xs font-semibold uppercase tracking-wide text-secondary/50">
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 ${col.className || ""}`}>
                  {col.label}
                </th>
              ))}
              {actions ? <th className="px-4 py-3 text-right">Actions</th> : null}
            </tr>
          </thead>
          {loading ? (
            <SkeletonTableRows rows={5} columns={columns.length + (actions ? 1 : 0)} />
          ) : (
            <tbody>
              {rows.map((row) => (
                <tr key={getRowId(row)} className="border-b border-secondary/5 last:border-0 hover:bg-secondary/[0.015]">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 align-middle text-secondary/80 ${col.className || ""}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {actions ? <td className="px-4 py-3 text-right">{actions(row)}</td> : null}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* Mobile: one card per row */}
      <div className="divide-y divide-secondary/5 sm:hidden">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 p-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))
        ) : (
          rows.map((row) => (
            <div key={getRowId(row)} className="space-y-2 p-4">
              {columns.map((col) => (
                <div key={col.key} className="flex items-start justify-between gap-3">
                  <span className="shrink-0 pt-0.5 text-xs font-semibold uppercase tracking-wide text-secondary/40">
                    {col.label}
                  </span>
                  <span className="text-right text-sm text-secondary/80">
                    {col.render ? col.render(row) : row[col.key]}
                  </span>
                </div>
              ))}
              {actions ? <div className="flex items-center justify-end gap-1 pt-1">{actions(row)}</div> : null}
            </div>
          ))
        )}
      </div>

      {showEmpty ? (
        <div className="border-t border-secondary/10">
          <EmptyState {...emptyProps} />
        </div>
      ) : null}
    </div>
  );
}
