import { useRef, useState } from "react";
import { FiBold, FiEye, FiEdit3, FiList, FiMessageSquare, FiAlertCircle } from "react-icons/fi";

import { ArticleContent } from "../../pages/Blog/BlogDetails/components/ArticleContent";

// The public site's blog posts are NOT HTML - ArticleContent.jsx parses a
// bespoke lightweight markdown-like format (## / ### / - / 1. / > / !!! /
// **bold**, blank-line-separated blocks). A generic HTML rich-text editor
// (Quill/TinyMCE/etc.) would output content the public parser can't read,
// so this is a plain textarea with a toolbar that inserts that exact
// syntax, plus a live preview that reuses the real public-site renderer -
// what an admin sees in Preview is pixel-identical to what ships live.
const TOOLBAR = [
  { label: "Heading", icon: FiEdit3, insert: (sel) => `## ${sel || "Heading"}` },
  { label: "Subheading", icon: FiEdit3, insert: (sel) => `### ${sel || "Subheading"}` },
  { label: "Bold", icon: FiBold, insert: (sel) => `**${sel || "bold text"}**` },
  { label: "Bullet List", icon: FiList, insert: (sel) => (sel || "List item").split("\n").map((l) => `- ${l}`).join("\n") },
  { label: "Quote", icon: FiMessageSquare, insert: (sel) => `> ${sel || "Quoted text"}` },
  { label: "Callout", icon: FiAlertCircle, insert: (sel) => `!!! ${sel || "Important note"}` },
];

export function MarkdownEditor({ id, label, value, onChange, error, rows = 16 }) {
  const [mode, setMode] = useState("write");
  const textareaRef = useRef(null);

  const applyInsert = (insertFn) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const selected = value.slice(selectionStart, selectionEnd);
    const inserted = insertFn(selected);
    const next = value.slice(0, selectionStart) + inserted + value.slice(selectionEnd);
    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(selectionStart + inserted.length, selectionStart + inserted.length);
    });
  };

  return (
    <div>
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary/70">
          {label} <span className="text-red-500">*</span>
        </label>
      ) : null}
      <div className="rounded-lg border border-secondary/15 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-secondary/10 px-2 py-1.5">
          <div className="flex flex-wrap items-center gap-1">
            {TOOLBAR.map((tool) => (
              <button
                key={tool.label}
                type="button"
                onClick={() => applyInsert(tool.insert)}
                aria-label={tool.label}
                title={tool.label}
                className="rounded p-1.5 text-secondary/60 hover:bg-secondary/5 hover:text-secondary"
              >
                <tool.icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          <div className="flex overflow-hidden rounded-md border border-secondary/15 text-xs">
            <button
              type="button"
              onClick={() => setMode("write")}
              className={`flex items-center gap-1 px-2.5 py-1 ${mode === "write" ? "bg-brand-700 text-white" : "text-secondary/60"}`}
            >
              <FiEdit3 className="h-3 w-3" /> Write
            </button>
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={`flex items-center gap-1 px-2.5 py-1 ${mode === "preview" ? "bg-brand-700 text-white" : "text-secondary/60"}`}
            >
              <FiEye className="h-3 w-3" /> Preview
            </button>
          </div>
        </div>
        {mode === "write" ? (
          <textarea
            id={id}
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full resize-y rounded-b-lg px-3.5 py-2.5 font-mono text-sm text-secondary focus:outline-none"
          />
        ) : (
          <div className="max-h-[28rem] overflow-y-auto px-3.5 py-3">
            {value ? <ArticleContent content={value} /> : <p className="text-sm text-secondary/40">Nothing to preview yet.</p>}
          </div>
        )}
      </div>
      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
