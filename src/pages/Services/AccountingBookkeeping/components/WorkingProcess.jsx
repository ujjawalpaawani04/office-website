import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import {
  FiPhoneCall,
  FiClipboard,
  FiSearch,
  FiFileText,
  FiEye,
  FiSend,
  FiThumbsUp,
} from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.06 * i, ease: EASE },
  }),
};

const steps = [
  { icon: FiPhoneCall, title: "Understand Business Requirements", description: "We learn how your business operates and what your books need to capture." },
  { icon: FiClipboard, title: "Collect Financial Documents", description: "Gathering invoices, receipts, bank statements and existing records." },
  { icon: FiSearch, title: "Record & Organize Transactions", description: "Every transaction entered accurately and categorized systematically." },
  { icon: FiFileText, title: "Prepare Financial Statements", description: "Building reliable P&L, balance sheet and cash flow reports." },
  { icon: FiEye, title: "Review & Quality Check", description: "A careful check for accuracy before anything is finalized." },
  { icon: FiSend, title: "Submission", description: "Reports delivered on schedule, with acknowledgement shared with you." },
  { icon: FiThumbsUp, title: "Ongoing Support", description: "Continued support for questions or follow-up after handover." },
];

export const WorkingProcess = () => {
  const reduced = useReducedMotion();
  const railRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 80%", "end 60%"],
  });

  return (
    <section id="process" className="scroll-mt-28">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-2xl"
      >
        <motion.span
          variants={fadeUp}
          custom={0}
          className="text-sm font-semibold uppercase tracking-widest text-brand-700"
        >
          How It Works
        </motion.span>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
        >
          Our <span className="text-brand-700">Process</span>
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} className="mt-4 text-base leading-relaxed text-black">
          A structured, transparent path from your first conversation with us to support
          long after your books are handed over.
        </motion.p>
      </motion.div>

      {/* Vertical timeline for narrow columns (mobile, and the sidebar-constrained
          content column below lg) */}
      <div ref={railRef} className="relative mt-10 lg:hidden">
        <div aria-hidden="true" className="absolute top-2 bottom-2 left-6 w-px bg-secondary/10" />
        <motion.div
          aria-hidden="true"
          style={{ scaleY: reduced ? 1 : scrollYProgress }}
          className="absolute top-2 bottom-2 left-6 w-px origin-top bg-gradient-to-b from-brand-700 to-accent"
        />

        <div className="space-y-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                className="relative flex items-start gap-5"
              >
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white shadow-md shadow-brand-700/20">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="rounded-xl border border-secondary/10 bg-white p-5 shadow-sm">
                  <span className="block text-xs font-semibold uppercase tracking-widest text-brand-700/60">
                    Step {i + 1}
                  </span>
                  <h3 className="mt-1 text-base font-semibold text-black">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-black/60">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Horizontal-reading grid once the content column is wide enough for
          multiple cards per row (true single-row can't fit 7 detailed cards
          next to the sidebar, so this wraps 4-then-3 instead). */}
      <div className="mt-10 hidden gap-5 lg:grid lg:grid-cols-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              custom={i}
              className="group relative rounded-xl border border-secondary/10 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-700/30 hover:shadow-lg"
            >
              <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-white shadow-md shadow-brand-700/20">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="mt-3 block text-[11px] font-semibold uppercase tracking-widest text-brand-700/60">
                Step {i + 1}
              </span>
              <h3 className="mt-1 text-sm font-semibold text-black">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-black/60">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
