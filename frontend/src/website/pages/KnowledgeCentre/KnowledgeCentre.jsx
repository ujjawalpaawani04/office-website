import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiCalendar,
  FiChevronRight,
  FiTool,
} from "react-icons/fi";
import { Container } from "../../components/common/Container";
import { Seo } from "../../components/common/Seo";
import { getBlogPosts } from "../../api/blog";
import { sortByNewest } from "../../utils/blog";
import { BlogCard } from "../Blog/components/BlogCard";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.12 * i, ease: EASE },
  }),
};

const RECENT_ARTICLES_LIMIT = 6;

// Planned utilities and their scope, listed here only as a roadmap - no
// calculation logic is built yet, so nothing here should look clickable.
const CALCULATORS = [
  "Income tax calculator (old vs new regime)",
  "HRA exemption calculator",
  "Capital gains indexation reference",
  "TDS rate chart",
  "GST rate finder",
  "EMI and loan amortisation calculator",
];

const DUE_DATE_TOPICS = [
  "TDS deposit and quarterly statements",
  "Advance tax instalments",
  "GSTR-1 and GSTR-3B",
  "PF and ESI",
  "ROC filings",
  "RERA quarterly updates",
  "Income tax and audit report due dates",
];

// Official portals only. Document checklists (e.g. "documents required for
// GST registration") can be added as a further subsection once the firm
// provides the underlying files - intentionally left out of this pass.
const USEFUL_LINKS = [
  { label: "Income-tax e-filing portal", href: "https://www.incometax.gov.in" },
  { label: "GST portal", href: "https://www.gst.gov.in" },
  { label: "MCA portal", href: "https://www.mca.gov.in" },
  { label: "TRACES", href: "https://www.tdscpc.gov.in" },
  { label: "Uttarakhand RERA", href: "https://rera.uk.gov.in" },
  { label: "ICAI", href: "https://www.icai.org" },
  { label: "CBIC", href: "https://www.cbic.gov.in" },
];

// Shared layout for the two "coming soon" placeholder sections below - keeps
// the due-date calendar and utilities blocks visually identical without
// pretending either is a working tool yet.
const ComingSoonCard = ({ icon: Icon, eyebrow, title, description, items }) => (
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-60px" }}
    variants={fadeUp}
    className="mx-auto max-w-3xl rounded-2xl border border-dashed border-brand-700/25 bg-white p-8 text-center shadow-[0_10px_36px_-18px_rgba(1,24,24,0.12)] sm:p-10"
  >
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-brand-700/10">
      <Icon className="h-7 w-7 text-brand-700" aria-hidden="true" />
    </div>
    <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-widest text-brand-700">
      {eyebrow}
    </span>
    <h2 className="mt-2 font-display text-2xl font-bold text-black sm:text-3xl">{title}</h2>
    <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-black/70 sm:text-base">
      {description}
    </p>
    <ul className="mx-auto mt-6 grid max-w-xl gap-2 text-left text-sm text-black/70 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span
            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-700/60"
            aria-hidden="true"
          />
          {item}
        </li>
      ))}
    </ul>
  </motion.div>
);

const KnowledgeCentre = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getBlogPosts()
      .then((data) => {
        if (!cancelled) setPosts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        // Leave empty on failure - this is a teaser on an otherwise mostly
        // static page, so it should never block the rest of the page.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const recentPosts = useMemo(
    () => sortByNewest(posts).slice(0, RECENT_ARTICLES_LIMIT),
    [posts]
  );

  return (
    <div>
      <Seo
        title="Knowledge Centre"
        description="Notes, updates and reference material on taxation, GST, audit and compliance from Singh Amit & Associates, prepared for general information."
        canonicalPath="/knowledge-centre"
      />

      {/* Hero */}
      <section className="relative isolate flex min-h-[55vh] w-full items-center overflow-hidden bg-secondary pb-16 pt-25 lg:min-h-0 lg:h-[55vh] lg:max-h-[560px]">
        <img
          src="/about-images/bg2.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/45" />
        <div className="absolute inset-0 -z-10 bg-secondary/25" />

        <Container className="relative">
          <div className="max-w-3xl">
            <motion.nav
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-white/50"
            >
              <Link to="/" className="transition-colors hover:text-highlight">
                Home
              </Link>
              <FiChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="text-white/80" aria-current="page">
                Blog
              </span>
            </motion.nav>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="mt-6 font-display text-hero-h1 font-bold leading-[1.1] text-white"
            >
              Blog
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-6 text-base leading-relaxed text-white/80 sm:text-lg"
            >
              Notes, updates and reference material prepared for general information. The
              material reflects the law as on the date of publication and should not be
              relied upon as professional advice on any specific matter.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/blogs"
                className="group inline-flex items-center gap-2 rounded-md bg-highlight px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-black shadow-lg shadow-highlight/20 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
              >
                View All Articles
                <FiArrowRight
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Recent articles teaser - real posts only, sourced from the same
          getBlogPosts() API the /blogs listing uses. */}
      <section className="bg-[#f5f5f5] py-16 lg:py-24">
        <Container>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="border-l-4 border-brand-700 pl-3 font-display text-xl font-bold text-black">
              Recent Articles
            </h2>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-700 hover:text-brand-800"
            >
              View all articles
              <FiArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {isLoading && (
            <p className="text-center text-sm text-black/60" aria-live="polite">
              Loading articles...
            </p>
          )}

          {!isLoading && recentPosts.length === 0 && (
            <p className="text-center text-sm text-black/60">
              Articles will appear here shortly.
            </p>
          )}

          {!isLoading && recentPosts.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {recentPosts.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Due Date Calendar - out of scope to build this pass, shown as a
          clearly-labelled placeholder. */}
      <section id="due-date-calendar" className="scroll-mt-28 bg-white py-16 lg:py-24">
        <Container>
          <ComingSoonCard
            icon={FiCalendar}
            eyebrow="Coming Soon"
            title="Due Date Calendar"
            description="A month-wise table of statutory due dates: TDS deposit and quarterly statements, advance tax instalments, GSTR-1 and GSTR-3B, PF and ESI, ROC filings, RERA quarterly updates, and income tax and audit report due dates."
            items={DUE_DATE_TOPICS}
          />
        </Container>
      </section>

      {/* Utilities & Calculators - also out of scope this pass, placeholder
          only, no calculation logic. */}
      <section className="bg-[#f5f5f5] py-16 lg:py-24">
        <Container>
          <ComingSoonCard
            icon={FiTool}
            eyebrow="Coming Soon"
            title="Utilities & Calculators"
            description="Simple reference tools to support day-to-day tax and compliance decisions."
            items={CALCULATORS}
          />
        </Container>
      </section>

      {/* Downloads & Useful Links - real, working external links to official
          portals. */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold text-black sm:text-3xl">
              Downloads &amp; Useful Links
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-black/70 sm:text-base">
              Direct links to the official government and regulatory portals referenced most
              often in our day-to-day work.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {USEFUL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-3 rounded-xl border border-brand-700/10 bg-white px-5 py-4 text-sm font-semibold text-secondary shadow-[0_4px_20px_-12px_rgba(1,24,24,0.15)] transition-all duration-300 hover:border-brand-700/30 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-16px_rgba(1,24,24,0.25)]"
              >
                {link.label}
                <FiArrowUpRight
                  className="h-4 w-4 shrink-0 text-brand-700 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default KnowledgeCentre;
