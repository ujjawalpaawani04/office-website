// Renders an article's `content` field, a lightweight markdown-like format:
//   blank line     -> new block
//   "## Heading"   -> <h2>
//   "### Heading"  -> <h3>
//   "- item"       -> bullet list item (consecutive "- " lines become one <ul>)
//   "1. item"      -> numbered list item (consecutive "N. " lines become one <ol>)
//   "> quote"      -> blockquote (consecutive "> " lines become one pull-quote)
//   "!!! text"     -> highlight/callout box
//   "**bold**"     -> <strong> (inline, any block type)
// This keeps the blog data file as plain readable strings while still
// producing properly styled, semantic HTML - no dangerouslySetInnerHTML.
import { FiInfo } from "react-icons/fi";

const renderInline = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-black">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const parseBlocks = (content) =>
  content
    .trim()
    .split(/\n\s*\n/)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith("### ")) {
        return { type: "subheading", text: block.slice(4).trim() };
      }
      if (block.startsWith("## ")) {
        return { type: "heading", text: block.slice(3).trim() };
      }
      if (block.startsWith("!!! ")) {
        return { type: "highlight", text: block.slice(4).trim() };
      }

      const lines = block.split("\n").map((line) => line.trim());

      if (lines.every((line) => line.startsWith("> "))) {
        return { type: "quote", text: lines.map((line) => line.slice(2).trim()).join(" ") };
      }
      if (lines.every((line) => line.startsWith("- "))) {
        return { type: "list", items: lines.map((line) => line.slice(2).trim()) };
      }
      if (lines.every((line) => /^\d+\.\s/.test(line))) {
        return { type: "orderedList", items: lines.map((line) => line.replace(/^\d+\.\s/, "").trim()) };
      }

      return { type: "paragraph", text: lines.join(" ") };
    });

export const ArticleContent = ({ content }) => {
  const blocks = parseBlocks(content);

  return (
    <div className="article-content">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h2
              key={index}
              className="mt-10 mb-4 font-display text-2xl font-bold leading-snug text-black first:mt-0 sm:text-[1.7rem]"
            >
              {renderInline(block.text)}
            </h2>
          );
        }

        if (block.type === "subheading") {
          return (
            <h3
              key={index}
              className="mt-8 mb-3 font-display text-xl font-bold leading-snug text-black sm:text-[1.35rem]"
            >
              {renderInline(block.text)}
            </h3>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={index} className="my-5 space-y-2.5">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-black/75">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-700"
                  />
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "orderedList") {
          return (
            <ol key={index} className="my-5 space-y-3">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-black/75">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-700/10 text-xs font-bold text-brand-700"
                  >
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{renderInline(item)}</span>
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={index}
              className="my-8 rounded-r-xl border-l-4 border-brand-700 bg-brand-50/60 py-5 pl-6 pr-5"
            >
              <p className="font-display text-lg italic leading-relaxed text-black/80 sm:text-xl">
                &ldquo;{block.text}&rdquo;
              </p>
            </blockquote>
          );
        }

        if (block.type === "highlight") {
          return (
            <div
              key={index}
              className="my-8 flex gap-3.5 rounded-xl border border-highlight/30 bg-highlight/10 p-5"
            >
              <FiInfo className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
              <p className="text-[15px] leading-relaxed text-black/80">{renderInline(block.text)}</p>
            </div>
          );
        }

        return (
          <p key={index} className="mb-5 text-[15px] leading-[1.9] text-black/75 sm:text-base">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
};
