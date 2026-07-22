import { useState } from "react";
import { FiX } from "react-icons/fi";

// Simple multi-select for blog tags: options = [{id, name}], value = [id,...].
export function TagMultiSelect({ label, options, value, onChange }) {
  const [query, setQuery] = useState("");
  const selected = options.filter((o) => value.includes(o.id));
  const available = options.filter((o) => !value.includes(o.id) && o.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      {label ? <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-secondary/70">{label}</p> : null}
      {selected.length > 0 ? (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selected.map((tag) => (
            <span key={tag.id} className="flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
              {tag.name}
              <button type="button" onClick={() => onChange(value.filter((id) => id !== tag.id))} aria-label={`Remove ${tag.name}`}>
                <FiX className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tags..."
        className="w-full rounded-lg border border-secondary/15 bg-white px-3 py-2 text-sm text-secondary placeholder-secondary/40 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
      />
      {query && available.length > 0 ? (
        <div className="mt-1 max-h-32 overflow-y-auto rounded-lg border border-secondary/10">
          {available.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => { onChange([...value, tag.id]); setQuery(""); }}
              className="block w-full px-3 py-1.5 text-left text-sm text-secondary hover:bg-secondary/5"
            >
              {tag.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
