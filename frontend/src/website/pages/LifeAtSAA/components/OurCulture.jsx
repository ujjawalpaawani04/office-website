import { motion } from "framer-motion";
import { FiUsers, FiBookOpen, FiTrendingUp } from "react-icons/fi";
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

const cultureValues = [
  {
    icon: FiUsers,
    title: "Collaborative Teamwork",
    description:
      "Work together, share ideas, and solve challenges through teamwork and mutual respect.",
  },
  {
    icon: FiBookOpen,
    title: "Continuous Learning",
    description:
      "Stay updated with taxation, GST, audit standards, compliance, and emerging regulations through continuous learning.",
  },
  {
    icon: FiTrendingUp,
    title: "Professional Growth",
    description:
      "Gain practical exposure, mentorship, and opportunities that support long-term professional development.",
  },
];

export const OurCulture = () => {
  return (
    <section className="relative py-16 lg:py-20 bg-gradient-to-b from-white to-brand-50">
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
            Our Culture
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
          >
            What Makes SAA <span className="text-brand-700">Feel Like Home</span>
          </motion.h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cultureValues.map((value, i) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
                className="group relative"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-700/10 to-highlight/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative h-full rounded-2xl border border-white/60 bg-white/70 p-8 shadow-[0_10px_36px_-18px_rgba(1,24,24,0.18)] backdrop-blur-md transition-all duration-300 motion-safe:group-hover:-translate-y-1.5 group-hover:border-highlight/40 group-hover:shadow-[0_24px_48px_-20px_rgba(1,24,24,0.28)]">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700/10 to-accent/10 transition-all duration-300 group-hover:from-brand-700 group-hover:to-brand-600">
                    <Icon className="h-7 w-7 text-brand-700 transition-colors duration-300 group-hover:text-white" />
                  </div>

                  <h3 className="mt-5 font-display text-xl font-bold text-secondary">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-secondary/70">
                    {value.description}
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
