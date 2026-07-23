import { motion } from "framer-motion";
import { FiClock, FiMapPin, FiBriefcase, FiArrowRight } from "react-icons/fi";
import { Container } from "../../../components/common/Container";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.1 * i, ease: EASE },
  }),
};

const JobCard = ({ position, index, onApply }) => {
  const Icon = position.icon;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      custom={index}
      className="group relative flex h-full flex-col rounded-2xl border border-brand-700/10 bg-white/80 p-7 shadow-[0_10px_36px_-18px_rgba(1,24,24,0.22)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-highlight/40 hover:shadow-[0_28px_56px_-20px_rgba(1,24,24,0.3)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 w-[97%] m-auto top-0 h-1 rounded-t-2xl bg-gradient-to-r from-brand-700 via-highlight to-gold-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700/10 to-accent/10 transition-all duration-300 group-hover:from-brand-700 group-hover:to-brand-600">
        <Icon className="h-7 w-7 text-brand-700 transition-colors duration-300 group-hover:text-white" aria-hidden="true" />
      </div>

      <h3 className="mt-5 font-display text-xl font-bold text-secondary">{position.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-secondary/70">
        {position.description}
      </p>

      <div className="mt-6 space-y-2 border-t border-secondary/10 pt-5">
        <p className="flex items-center gap-2 text-xs font-medium text-secondary/70">
          <FiClock className="h-3.5 w-3.5 shrink-0 text-brand-700" aria-hidden="true" />
          {position.experience}
        </p>
        <p className="flex items-center gap-2 text-xs font-medium text-secondary/70">
          <FiMapPin className="h-3.5 w-3.5 shrink-0 text-brand-700" aria-hidden="true" />
          {position.location}
        </p>
        <p className="flex items-center gap-2 text-xs font-medium text-secondary/70">
          <FiBriefcase className="h-3.5 w-3.5 shrink-0 text-brand-700" aria-hidden="true" />
          {position.type}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onApply(position.title)}
        className="group/btn mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-brand-700 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      >
        Apply Now
        <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true" />
      </button>
    </motion.div>
  );
};

export const CurrentOpenings = ({ positions, isLoading, error, onApply }) => {
  return (
    <section id="openings" className="scroll-mt-24 bg-gradient-to-b from-brand-50 to-white py-16 lg:py-24">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            Current Openings
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
          >
            Explore Opportunities <span className="text-brand-700">at SAA</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-base leading-relaxed text-secondary/70"
          >
            From articleship to leadership roles, find a position where your skills and ambitions
            can grow.
          </motion.p>
        </motion.div>

        {isLoading && (
          <p className="text-center text-sm text-secondary/60" aria-busy="true" aria-live="polite">
            Loading current openings...
          </p>
        )}

        {!isLoading && error && (
          <p className="text-center text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        )}

        {!isLoading && !error && positions.length === 0 && (
          <p className="text-center text-sm text-secondary/60">No open positions right now. Check back soon.</p>
        )}

        {!isLoading && !error && positions.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {positions.map((position, i) => (
              <JobCard key={position.title} position={position} index={i} onApply={onApply} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};
