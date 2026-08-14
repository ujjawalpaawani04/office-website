import { motion } from "framer-motion";
import { FiAward, FiLock, FiTrendingUp, FiUserCheck } from "react-icons/fi";
import { Container } from "../../../components/common/Container";

const EASE = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.08 * i, ease: EASE } }),
};

const reasons = [
  {
    icon: FiAward,
    title: "Qualified & Practicing CAs",
    description: "You speak directly with a licensed Chartered Accountant, never a sales representative.",
  },
  {
    icon: FiTrendingUp,
    title: "Cross-Industry Experience",
    description: "From startups to established enterprises, across taxation, audit, and corporate advisory.",
  },
  {
    icon: FiLock,
    title: "Confidential by Default",
    description: "Your financial information and business details are handled under strict confidentiality.",
  },
  {
    icon: FiUserCheck,
    title: "No-Obligation Advice",
    description: "The first consultation is about understanding your situation - there's no pressure to sign up.",
  },
];

export const WhyBookWithUs = () => {
  return (
    <section className="bg-secondary/[0.03] py-16 lg:py-24">
      <Container>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-2xl">
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block rounded-full bg-brand-700 px-4 py-1.5 text-sm font-semibold text-white"
          >
            Why Book With Us
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            Advice You Can Actually Rely On
          </motion.h2>
        </motion.div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {reasons.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="group flex items-start gap-4 rounded-xl border border-secondary/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-700/30 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-700 group-hover:text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-base font-semibold text-black">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-black/65">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
