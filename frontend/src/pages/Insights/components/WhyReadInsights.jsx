import { motion } from "framer-motion";
import { FiAward, FiRefreshCw, FiCheckSquare, FiShield } from "react-icons/fi";
import { Container } from "../../../components/common/Container";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

const reasons = [
  {
    icon: FiAward,
    title: "Expert Knowledge",
    description: "Content prepared by experienced CA professionals.",
  },
  {
    icon: FiRefreshCw,
    title: "Latest Updates",
    description: "Stay informed about changing tax laws and compliance requirements.",
  },
  {
    icon: FiCheckSquare,
    title: "Practical Guidance",
    description: "Actionable insights to help businesses and individuals.",
  },
  {
    icon: FiShield,
    title: "Trusted Advisory",
    description: "Reliable financial knowledge from SAA experts.",
  },
];

export const WhyReadInsights = () => {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            Why Read SAA Insights
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
          >
            Knowledge You Can <span className="text-brand-700">Trust</span>
          </motion.h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
                className="group relative"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-700/10 to-highlight/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative h-full rounded-2xl border border-white/60 bg-white/70 p-7 shadow-[0_10px_36px_-18px_rgba(1,24,24,0.18)] backdrop-blur-md transition-all duration-300 motion-safe:group-hover:-translate-y-1.5 group-hover:border-highlight/40 group-hover:shadow-[0_24px_48px_-20px_rgba(1,24,24,0.28)]">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700/10 to-accent/10 transition-all duration-300 group-hover:from-brand-700 group-hover:to-brand-600">
                    <Icon className="h-7 w-7 text-brand-700 transition-colors duration-300 group-hover:text-white" aria-hidden="true" />
                  </div>

                  <h3 className="mt-5 font-display text-lg font-bold leading-snug text-secondary">
                    {reason.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-secondary/70">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
