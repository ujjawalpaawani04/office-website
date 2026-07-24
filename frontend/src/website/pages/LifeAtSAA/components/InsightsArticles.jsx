import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import { Container } from "../../../components/common/Container";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.12 * i, ease: EASE },
  }),
};

const articles = [
  {
    category: "Income Tax",
    title: "Latest Income Tax Updates",
    description:
      "Key changes to slab rates, deductions, and filing deadlines every taxpayer should know this year.",
    date: "10 Jul 2026",
    image: "/service-images/tax.png",
  },
  {
    category: "GST",
    title: "GST Compliance Tips for Businesses",
    description:
      "Practical guidance on return filing, reconciliation, and staying ahead of GST regulatory changes.",
    date: "02 Jul 2026",
    image: "/about-images/bg2.png",
  },
  {
    category: "Audit",
    title: "Audit & Financial Reporting Insights",
    description:
      "What businesses need to know about evolving audit standards and financial disclosure requirements.",
    date: "24 Jun 2026",
    image: "/about-images/bg.jpg",
  },
];

export const InsightsArticles = () => {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-brand-50 to-white">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-12"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            Insights &amp; Articles
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
          >
            Professional Insights, <span className="text-brand-700">Straight From Our Desk</span>
          </motion.h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <motion.article
              key={article.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              custom={i}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-700/10 bg-white shadow-[0_4px_20px_-12px_rgba(1,24,24,0.15)] transition-all duration-300 hover:border-brand-700/20 hover:shadow-[0_24px_48px_-20px_rgba(1,24,24,0.28)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-110"
                />
                <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-highlight px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-secondary shadow-md">
                  {article.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-1.5 text-xs font-medium text-secondary/50">
                  <FiCalendar className="h-3.5 w-3.5" aria-hidden="true" />
                  {article.date}
                </div>

                <h3 className="mt-3 font-display text-lg font-bold leading-snug text-secondary transition-colors duration-300 group-hover:text-brand-700">
                  {article.title}
                </h3>

                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-secondary/70">
                  {article.description}
                </p>

                <Link
                  to="/"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-all duration-300 hover:text-brand-600 group-hover:gap-3"
                >
                  Read More
                  <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
};
