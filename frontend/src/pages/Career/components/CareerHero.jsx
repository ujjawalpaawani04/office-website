import { motion } from "framer-motion";
import { FiArrowRight, FiSend, FiTrendingUp } from "react-icons/fi";
import { Container } from "../../../components/common/Container";
import { Breadcrumb } from "../../../components/common/Breadcrumb";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

export const CareerHero = () => {
  return (
    <section className="relative isolate flex h-[70vh] max-h-[700px] w-full items-center overflow-hidden bg-gradient-to-br from-secondary via-[#03201f] to-brand-900 pb-20 pt-36 lg:pt-40">
      {/* Decorative glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-highlight/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl"
      />

      {/* Abstract growth-chart motif */}
      <svg
        aria-hidden="true"
        viewBox="0 0 600 400"
        className="pointer-events-none absolute -right-10 top-1/2 hidden h-[420px] w-[620px] -translate-y-1/2 opacity-[0.15] lg:block"
        fill="none"
      >
        <path
          d="M0 340 L100 260 L180 300 L260 160 L340 210 L420 80 L500 140 L600 20"
          stroke="url(#careerLineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[
          [0, 340],
          [100, 260],
          [180, 300],
          [260, 160],
          [340, 210],
          [420, 80],
          [500, 140],
          [600, 20],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6" fill="#00eae7" />
        ))}
        <defs>
          <linearGradient id="careerLineGradient" x1="0" y1="0" x2="600" y2="0">
            <stop offset="0%" stopColor="#00eae7" />
            <stop offset="100%" stopColor="#c9a227" />
          </linearGradient>
        </defs>
      </svg>

      <Container className="relative">
        <div className="max-w-2xl">
         

          <Breadcrumb items={[{ label: "Careers" }]} />

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-[3rem]"
          >
            Build Your Career <span className="text-highlight">with SAA</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 text-base leading-relaxed text-white/80 sm:text-lg"
          >
            Join our team of dedicated professionals and build a rewarding career in Audit,
            Taxation, GST, Advisory, and Compliance. At SAA, we provide opportunities to learn,
            grow, and make a meaningful impact.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#openings"
              className="group inline-flex items-center gap-2 rounded-md bg-highlight px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-secondary shadow-lg shadow-highlight/20 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
            >
              View Openings
              <FiArrowRight
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
            <a
              href="#apply-now"
              className="group inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <FiSend className="h-4 w-4" aria-hidden="true" />
              Apply Now
            </a>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
