import { cn } from "../../utils/cn";

// Document 2 §0.4 Loading State building block - a plain pulsing bar.
// Compose into table-row/card shapes per screen rather than one rigid
// "TableSkeleton" component, since the shapes genuinely differ per module.
export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-md bg-secondary/10", className)} />;
}

export function SkeletonTableRows({ rows = 5, columns = 4 }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-secondary/5">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <td key={colIndex} className="px-4 py-3">
              <Skeleton className="h-4 w-full max-w-[10rem]" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
