import { FiLinkedin } from "react-icons/fi";
import { partners } from "../../../../data/partners";

export const AuthorCard = ({ post }) => {
  const partner = partners.find((p) => p.name === post.author);

  return (
    <div className="mt-12 flex items-center gap-4 rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm">
      {partner?.image ? (
        <img
          src={partner.image}
          alt={post.author}
          loading="lazy"
          decoding="async"
          className="h-14 w-14 shrink-0 rounded-full object-cover object-top ring-2 ring-brand-700/10"
        />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-700/10 font-display text-lg font-bold text-brand-700">
          {post.author.charAt(0)}
        </div>
      )}

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Written by</p>
        <p className="mt-0.5 truncate font-display text-base font-bold text-secondary">{post.author}</p>
        <p className="text-sm text-secondary/60">{post.authorRole}</p>
      </div>

      {partner?.social?.linkedin && (
        <a
          href={partner.social.linkedin}
          aria-label={`${post.author} on LinkedIn`}
          className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-secondary/10 text-brand-700 transition-colors duration-300 hover:border-brand-700 hover:bg-brand-700 hover:text-white"
        >
          <FiLinkedin className="h-4 w-4" aria-hidden="true" />
        </a>
      )}
    </div>
  );
};
