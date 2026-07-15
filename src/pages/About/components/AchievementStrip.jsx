import { motion, useReducedMotion } from "framer-motion";
import { FiAward, FiUsers, FiFileText, FiThumbsUp } from "react-icons/fi";
import { StatCounter } from "./StatCounter";

const EASE = [0.22, 1, 0.36, 1];

const ICONS = {
  award: FiAward,
  users: FiUsers,
  filings: FiFileText,
  satisfaction: FiThumbsUp,
};

export const AchievementStrip = ({ stats }) => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        delay: shouldReduceMotion ? 0 : 0.08 * i,
        ease: EASE,
      },
    }),
  };

  return (
    <div className="relative my-14 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 px-6 py-10 sm:px-10 sm:py-12 lg:my-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-highlight/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-gold-500/10 blur-3xl"
      />

      <dl className="relative grid grid-cols-2 gap-y-10 gap-x-6 sm:gap-x-10 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = ICONS[stat.icon];
          return (
            <motion.div
              key={stat.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              custom={i}
              className="group flex flex-col items-center text-center motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-1"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-highlight ring-1 ring-white/15 transition-colors duration-300 group-hover:bg-highlight group-hover:text-brand-900">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <dd
                className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl"
                aria-label={`${stat.value.toLocaleString("en-IN")}${stat.suffix} ${stat.label}`}
              >
                <StatCounter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mt-1.5 text-xs font-medium uppercase tracking-wide text-white/80 sm:text-sm">
                {stat.label}
              </dt>
            </motion.div>
          );
        })}
      </dl>
    </div>
  );
};
