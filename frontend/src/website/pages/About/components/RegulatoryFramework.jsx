import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { Container } from "../../../components/common/Container";
import { cn } from "../../../../shared/utils/cn";
import { FiFileText, FiPercent, FiBriefcase, FiHome, FiMap, FiBookOpen } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

const framework = [
  {
    tag: "1961",
    title: "Income-tax Act, 1961",
    description: "Governs return filing, tax audits under Section 44AB, and assessment matters.",
    icon: FiFileText,
  },
  {
    tag: "2017",
    title: "Central Goods and Services Tax Act, 2017",
    description: "Governs GST registration, periodic returns and input tax credit compliance.",
    icon: FiPercent,
  },
  {
    tag: "2013",
    title: "Companies Act, 2013",
    description: "Governs incorporation, ROC filings and statutory audit requirements for companies and LLPs.",
    icon: FiBriefcase,
  },
  {
    tag: "2016",
    title: "Real Estate (Regulation and Development) Act, 2016",
    description: "Governs RERA registration of projects and promoters and the related periodic compliance.",
    icon: FiHome,
  },
  {
    tag: "UPZLAR",
    title: "Uttarakhand Land Law Matters",
    description: "Consultancy on matters arising under the Uttarakhand Zamindari Abolition and Land Reforms Act.",
    icon: FiMap,
  },
  {
    tag: "ICAI",
    title: "ICAI Standards and Guidance Notes",
    description: "Standards on Auditing, Accounting Standards and Guidance Notes issued by the Institute of Chartered Accountants of India.",
    icon: FiBookOpen,
  },
];

const TimelineItem = ({ item, index, isLeft, reduced }) => {
  const Icon = item.icon;

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: reduced ? 0 : isLeft ? -48 : 48,
      y: reduced ? 0 : 24,
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        delay: reduced ? 0 : 0.06 * (index % 3),
        ease: EASE,
      },
    },
  };

  return (
    <li className="relative pl-16 md:grid md:grid-cols-2 md:gap-x-16 md:pl-0">
      <motion.span
        initial={reduced ? false : { scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, ease: EASE }}
        className="absolute top-6 left-6 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-brand-700/30 bg-white shadow-[0_0_0_6px_rgba(21,91,92,0.06)] md:top-1/2 md:left-1/2 md:-translate-y-1/2 md:-translate-x-1/2"
      >
        <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-brand-700/10 to-accent/10">
          <Icon className="h-5 w-5 text-brand-700" aria-hidden="true" />
        </span>
      </motion.span>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className={cn(
          "group py-2 md:py-8",
          isLeft
            ? "md:col-start-1 md:pr-8 md:text-right"
            : "md:col-start-2 md:pl-8 md:text-left",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-brand-700/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all duration-300",
            "hover:-translate-y-1 hover:border-brand-700/30 hover:shadow-xl hover:shadow-brand-700/10",
          )}
        >
          <div className="relative">
            <span className="inline-flex items-center rounded-full bg-brand-700/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-700 ring-1 ring-inset ring-brand-700/15">
              {item.tag}
            </span>

            <h3 className="mt-3 font-display text-xl font-bold leading-snug text-black">
              {item.title}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-black">
              {item.description}
            </p>
          </div>
        </div>
      </motion.div>
    </li>
  );
};

export const RegulatoryFramework = () => {
  const reduced = useReducedMotion();
  const timelineRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 65%"],
  });

  return (
    <section className="relative overflow-hidden py-16 bg-gradient-to-b from-white via-white to-brand-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-700/5 blur-3xl" />
        <div className="absolute top-1/3 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 -right-20 h-72 w-72 rounded-full bg-gold-500/5 blur-3xl" />
      </div>

      <Container className="relative">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block rounded-full bg-brand-700 px-4 py-1.5 text-sm font-semibold text-white"
          >
            Compliance Framework
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            Regulatory <span className="text-brand-700">Framework</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-base leading-relaxed text-black max-w-2xl mx-auto"
          >
            The statutes and standards under which the firm's engagements are conducted.
          </motion.p>
        </motion.div>

        <div ref={timelineRef} className="relative mb-16">
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-6 w-px -translate-x-1/2 bg-brand-700/10 md:left-1/2"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: reduced ? 1 : scrollYProgress }}
            className="absolute top-0 bottom-0 left-6 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-brand-700 via-brand-500 to-accent md:left-1/2"
          />

          <ol className="space-y-4 md:space-y-2">
            {framework.map((item, i) => (
              <TimelineItem
                key={item.title}
                item={item}
                index={i}
                isLeft={i % 2 === 0}
                reduced={reduced}
              />
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
};
