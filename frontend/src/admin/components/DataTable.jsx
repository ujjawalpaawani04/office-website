import { EmptyState } from "./EmptyState";
import { SkeletonTableRows } from "./Skeleton";

// Generic Data Table (Document 6) - every list screen configures columns
// and gets consistent loading/empty rendering for free.
// columns: [{ key, label, render?(row) => node, className? }]
export function DataTable({ columns, rows, loading, getRowId = (row) => row.id, actions, emptyProps }) {
  const showEmpty = !loading && rows.length === 0;

  return (
    <div className="overflow-x-auto rounded-xl border border-secondary/10 bg-white">
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
      {showEmpty ? (
        <div className="border-t border-secondary/10">
          <EmptyState {...emptyProps} />
        </div>
      ) : null}
    </div>
  );
}
