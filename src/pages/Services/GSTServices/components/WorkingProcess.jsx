import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: EASE },
  }),
};

const steps = [
  { title: "Business Understanding", description: "We learn how your business operates and where GST touches it." },
  { title: "Document Collection", description: "Gathering the records and details needed to get started." },
  { title: "GST Review", description: "Assessing your current registration, filings and standing." },
  { title: "Registration / Return Preparation", description: "Preparing whatever your business needs next, accurately." },
  { title: "Verification", description: "A careful check before anything is submitted on your behalf." },
  { title: "Submission & Ongoing Support", description: "Filed on time, with continued support after submission." },
];

export const WorkingProcess = () => {
  return (
    <section id="process" className="scroll-mt-0">
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
          Our Working <span className="text-brand-700">Process</span>
        </motion.h2>
      </motion.div>

      <div className="mt-10 divide-y divide-secondary/10 overflow-hidden rounded-2xl border border-secondary/10 bg-white shadow-sm">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            custom={i}
            className="group flex items-center gap-6 p-6 transition-colors duration-300 hover:bg-brand-50/40 sm:p-7"
          >
            <span className="font-display text-4xl font-bold text-brand-700/15 transition-colors duration-300 group-hover:text-brand-700/30 sm:text-5xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1 border-l border-secondary/10 pl-6">
              <span className="block text-base font-semibold text-black sm:text-lg">
                {step.title}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-black">
                {step.description}
              </span>
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
