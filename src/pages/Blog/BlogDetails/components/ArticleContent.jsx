// Renders an article's `content` field, a lightweight markdown-like format:
//   blank line   -> new block
//   "## Heading" -> <h2>
//   "- item"     -> list item (consecutive "- " lines become one <ul>)
//   "**bold**"   -> <strong> (inline, any block type)
// This keeps the blog data file as plain readable strings while still
// producing properly styled, semantic HTML - no dangerouslySetInnerHTML.

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
      if (block.startsWith("## ")) {
        return { type: "heading", text: block.slice(3).trim() };
      }

      const lines = block.split("\n").map((line) => line.trim());
      if (lines.every((line) => line.startsWith("- "))) {
        return { type: "list", items: lines.map((line) => line.slice(2).trim()) };
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

        return (
          <p key={index} className="mb-5 text-[15px] leading-[1.9] text-black/75 sm:text-base">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
};
