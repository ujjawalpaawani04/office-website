import { FiLinkedin, FiMail, FiTwitter } from "react-icons/fi";

const initials = (name) =>
  name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const socialLinkClass =
  "flex h-9 w-9 items-center justify-center rounded-full border border-secondary/10 bg-white text-brand-700 shadow-sm transition-colors duration-300 hover:border-brand-700 hover:bg-brand-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

export const AuthorCard = ({ post }) => (
  <div className="mt-12 flex flex-col gap-5 rounded-2xl border border-secondary/10 bg-white p-6 sm:flex-row sm:items-start sm:p-8">
    <div className="rounded-full bg-gradient-to-br from-brand-700 via-highlight to-gold-500 p-[3px]">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-brand-700 font-display text-lg font-bold text-white">
        {initials(post.author)}
      </span>
    </div>

    <div className="min-w-0">
      <p className="font-display text-lg font-bold text-black">{post.author}</p>
      <p className="mt-0.5 text-sm font-semibold uppercase tracking-wide text-brand-700">
        {post.authorRole}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-black/65">
        {post.author} is part of the team at Singh Amit &amp; Associates, helping clients
        navigate taxation, compliance and financial planning with clear, practical advice.
      </p>

      <div className="mt-4 flex items-center gap-2.5">
        <a href="#" aria-label={`${post.author} on LinkedIn`} className={socialLinkClass}>
          <FiLinkedin className="h-4 w-4" aria-hidden="true" />
        </a>
        <a href="#" aria-label={`${post.author} on Twitter`} className={socialLinkClass}>
          <FiTwitter className="h-4 w-4" aria-hidden="true" />
        </a>
        <a
          href="mailto:info@singhamitassociates.com"
          aria-label={`Email ${post.author}`}
          className={socialLinkClass}
        >
          <FiMail className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  </div>
);
