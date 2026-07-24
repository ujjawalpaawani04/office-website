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

export const Benefits = ({ tagline = "The Payoff", headingPre, headingHighlight, intro, benefits }) => {
  return (
    <section id="benefits" className="scroll-mt-28">
      <div className="grid gap-12 lg:grid-cols-1 lg:items-center lg:gap-16">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}>
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            {tagline}
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            {headingPre} <span className="text-brand-700">{headingHighlight}</span>
          </motion.h2>

          <motion.p variants={fadeUp} custom={2} className="mt-4 text-base leading-relaxed text-black">
            {intro}
          </motion.p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit, i) => {
              // Accepts either a plain string (legacy shape) or an
              // {icon,title,description} object - defaults reproduce the
              // original plain-string rendering exactly when icon/description
              // aren't set, so existing content looks unchanged.
              const item = typeof benefit === "string" ? { title: benefit } : benefit;
              const Icon = item.icon || FiCheckCircle;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  custom={3 + i}
                  className="flex items-start gap-3 rounded-xl border border-secondary/10 bg-white px-4 py-3.5 shadow-sm"
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
                  <span className="text-sm font-medium text-black/80">
                    <span className="block">{item.title}</span>
                    {item.description ? (
                      <span className="mt-0.5 block font-normal text-black/60">{item.description}</span>
                    ) : null}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
