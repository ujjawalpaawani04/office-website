import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.06 * i, ease: EASE },
  }),
};

const benefits = [
  "Better financial transparency",
  "Strong internal controls",
  "Improved compliance",
  "Reduced business risks",
  "Reliable financial reporting",
  "Better operational efficiency",
  "Increased stakeholder confidence",
  "Practical business recommendations",
];

export const Benefits = () => {
  return (
    <section id="benefits" className="scroll-mt-28">
      <div className="grid gap-12 lg:grid-cols-1 lg:items-center lg:gap-16">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}>
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            The Payoff
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            Benefits of a Professional <span className="text-brand-700">Audit</span>
          </motion.h2>

          <motion.p variants={fadeUp} custom={2} className="mt-4 text-base leading-relaxed text-black">
            A well-run audit does more than satisfy a statutory requirement -it gives you a
            clear, trustworthy picture of your business at every stage.
          </motion.p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                variants={fadeUp}
                custom={3 + i}
                className="flex items-center gap-3 rounded-xl border border-secondary/10 bg-white px-4 py-3.5 shadow-sm"
              >
                <FiCheckCircle className="h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
                <span className="text-sm font-medium text-black/80">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
