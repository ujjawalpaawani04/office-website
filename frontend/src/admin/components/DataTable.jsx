import { FiCheck } from "react-icons/fi";
import { cn } from "../../shared/utils/cn";
import { EmptyState } from "./EmptyState";
import { Skeleton, SkeletonTableRows } from "./Skeleton";

// Small custom-styled checkbox (native browser checkboxes clash with the
// rest of the admin panel's design system) - only rendered at all when
// `selection` is passed to DataTable, so list pages stay checkbox-free
// until they actually enter a selection/delete mode (see Appointments.jsx).
function SelectCheckbox({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={cn(
        "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-colors duration-150",
        checked ? "border-brand-700 bg-brand-700" : "border-secondary/25 bg-white hover:border-brand-700/50"
      )}
    >
      {checked ? <FiCheck className="h-3 w-3 text-white" aria-hidden="true" /> : null}
    </button>
  );
}

// Generic Data Table (Document 6) - every list screen configures columns
// and gets consistent loading/empty rendering for free.
// columns: [{ key, label, render?(row) => node, className? }]
//
// selection (optional): { selectedIds: Set, onToggle(id), onToggleAll(),
// allSelected: bool } - adds a checkbox column and makes each row
// clickable to toggle it. Omitted entirely by every page that hasn't
// opted into a bulk-select mode, so this is purely additive.
//
// Below the `sm` breakpoint, a wide table is replaced with a stacked card
// per row (same columns, rendered as label/value pairs) instead of forcing
// horizontal scroll - the standard responsive pattern for data tables on
// phones, and the single place every list page's mobile layout is fixed.
export function DataTable({ columns, rows, loading, getRowId = (row) => row.id, actions, emptyProps, selection }) {
  const showEmpty = !loading && rows.length === 0;
  const extraCols = (actions ? 1 : 0) + (selection ? 1 : 0);

  return (
    <div className="overflow-hidden rounded-xl border border-secondary/10 bg-white">
      {/* Desktop / tablet */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-secondary/10 bg-secondary/[0.02] text-xs font-semibold uppercase tracking-wide text-secondary/50">
              {selection ? (
                <th className="w-10 px-4 py-3">
                  <SelectCheckbox checked={selection.allSelected} onChange={selection.onToggleAll} label="Select all rows on this page" />
                </th>
              ) : null}
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 ${col.className || ""}`}>
                  {col.label}
                </th>
              ))}
              {actions ? <th className="px-4 py-3 text-right">Actions</th> : null}
            </tr>
          </thead>
          {loading ? (
            <SkeletonTableRows rows={5} columns={columns.length + extraCols} />
          ) : (
            <tbody>
              {rows.map((row) => {
                const rowId = getRowId(row);
                const isSelected = selection?.selectedIds.has(rowId);
                return (
                  <tr
                    key={rowId}
                    onClick={selection ? () => selection.onToggle(rowId) : undefined}
                    className={cn(
                      "border-b border-secondary/5 last:border-0 transition-colors duration-100",
                      selection ? "cursor-pointer" : "",
                      isSelected ? "bg-brand-50/60 hover:bg-brand-50" : "hover:bg-secondary/[0.015]"
                    )}
                  >
                    {selection ? (
                      <td className="px-4 py-3 align-middle">
                        <SelectCheckbox checked={isSelected} onChange={() => selection.onToggle(rowId)} label={`Select row ${rowId}`} />
                      </td>
                    ) : null}
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3 align-middle text-secondary/80 ${col.className || ""}`}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                    {actions ? (
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        {actions(row)}
                      </td>
                    ) : null}
                  </tr>
                );
              })}
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
          rows.map((row) => {
            const rowId = getRowId(row);
            const isSelected = selection?.selectedIds.has(rowId);
            return (
              <div
                key={rowId}
                onClick={selection ? () => selection.onToggle(rowId) : undefined}
                className={cn("space-y-2 p-4", selection ? "cursor-pointer" : "", isSelected ? "bg-brand-50/60" : "")}
              >
                {selection ? (
                  <div className="flex justify-end">
                    <SelectCheckbox checked={isSelected} onChange={() => selection.onToggle(rowId)} label={`Select row ${rowId}`} />
                  </div>
                ) : null}
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
                {actions ? (
                  <div className="flex items-center justify-end gap-1 pt-1" onClick={(e) => e.stopPropagation()}>
                    {actions(row)}
                  </div>
                ) : null}
              </div>
            );
          })
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
