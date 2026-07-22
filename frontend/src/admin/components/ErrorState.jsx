import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

// Document 2 §0.4 Error State: never a silent failure - always a retry.
export function ErrorState({ message = "Something went wrong while loading this data.", onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center"
    >
      <FiAlertTriangle className="mb-3 h-8 w-8 text-red-500" aria-hidden="true" />
      <p className="font-medium text-red-700">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
        >
          <FiRefreshCw className="h-4 w-4" aria-hidden="true" />
          Retry
        </button>
      ) : null}
    </div>
  );
}
