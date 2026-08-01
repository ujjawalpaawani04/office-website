import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { Container } from "../../../components/common/Container";

const EASE = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.06 * i, ease: EASE } }),
};

const benefits = [
  "Personalised tax-saving strategies for your income bracket",
  "GST registration and filing guidance tailored to your business",
  "Clarity on compliance deadlines relevant to your entity type",
  "Company / LLP registration and structuring advice",
  "Audit readiness review and documentation checklist",
  "A written summary of recommendations after the call",
];

export const Benefits = () => {
  return (
    <section className="bg-secondary py-16 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-sm font-semibold uppercase tracking-widest text-highlight"
            >
              What You Get
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="mt-3 font-display text-3xl font-bold leading-[1.2] text-white sm:text-4xl"
            >
              Real Value in Every Session
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-4 text-base leading-relaxed text-white/70">
              We keep consultations practical - grounded in the latest regulations and your actual numbers, not
              generic advice.
            </motion.p>
          </motion.div>

          <motion.ul initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-3">
            {benefits.map((benefit, i) => (
              <motion.li
                key={benefit}
                variants={fadeUp}
                custom={i}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-highlight text-black">
                  <FiCheck className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="text-sm leading-relaxed text-white/85">{benefit}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </Container>
    </section>
  );
};
