import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { Container } from "../../../components/common/Container";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.12 * i, ease: EASE },
  }),
};

const gridContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09 },
  },
};

const tileVariant = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

// office.png must anchor the layout as the large featured tile; the rest of
// the mosaic fills in around it in reading order.
const featuredMoment = {
  image: "/gallery/office.png",
  category: "Our Office",
  title: "Where It All Happens",
  description: "A modern workspace designed for focus, comfort, and collaboration.",
};

const topSquares = [
  {
    image: "/gallery/team1.png",
    category: "Team Collaboration",
    title: "Working Together",
    description: "Great outcomes start with a team that supports each other.",
  },
  {
    image: "/gallery/team2.png",
    category: "Office Workspace",
    title: "Focused & Productive",
    description: "A calm, organised environment built for everyday excellence.",
  },
  {
    image: "/gallery/main.png",
    category: "Professional Excellence",
    title: "Leading With Purpose",
    description: "Every client interaction handled with precision, care, and integrity.",
  },
  {
    image: "/gallery/team3.png",
    category: "Our Workspace",
    title: "Designed With Intention",
    description: "Every corner of our office reflects our commitment to quality.",
  },
];

const bottomRow = [
  {
    image: "/gallery/team4.png",
    category: "Knowledge Sharing",
    title: "A Space That Inspires",
    description: "Thoughtful design that brings calm and clarity to our workday.",
    size: "small",
  },
  {
    image: "/gallery/team5.png",
    category: "Training Session",
    title: "Always Learning",
    description: "Continuous learning keeps our team sharp and client-ready.",
    size: "medium",
  },
  {
    image: "/gallery/team6.png",
    category: "Precision & Care",
    title: "Every Detail Matters",
    description: "From documentation to compliance, accuracy defines our work.",
    size: "wide",
  },
];

const bottomSpanClasses = {
  small: "lg:col-span-3",
  medium: "lg:col-span-4",
  wide: "sm:col-span-2 lg:col-span-5",
};

const bottomAspectClasses = {
  small: "aspect-square",
  medium: "aspect-square",
  wide: "aspect-[16/9] sm:aspect-[16/9]",
};

const MomentTile = ({ moment, className = "", imgClassName = "", eager = false }) => (
  <motion.figure
    variants={tileVariant}
    tabIndex={0}
    className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-brand-900 shadow-[0_20px_45px_-18px_rgba(0,0,0,0.6)] outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-secondary ${className}`}
  >
    <img
      src={moment.image}
      alt={moment.title}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-105 ${imgClassName}`}
    />

    {/* Hover overlay: dark gradient slides top -> bottom (transform only) */}
    <figcaption
      className="pointer-events-none absolute inset-0 flex -translate-y-full flex-col justify-between bg-[#22606269] p-5 transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0 sm:p-6"
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-highlight sm:text-[11px]">
        {moment.category}
      </span>

      <h3 className="px-1 text-center font-display text-lg font-bold leading-snug text-white sm:text-xl">
        {moment.title}
      </h3>

      <div className="flex items-end justify-between gap-3">
        <p className="text-xs leading-relaxed text-white/80 sm:text-sm">{moment.description}</p>
        
      </div>
    </figcaption>
  </motion.figure>
);

export const MomentsGallery = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary via-[#03201f] to-secondary py-16 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-highlight/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl"
      />

      <Container className="relative">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-highlight"
          >
            Moments At SAA
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-white sm:text-4xl"
          >
            Glimpses of <span className="text-highlight">Life at SAA</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-base leading-relaxed text-white/70"
          >
            Every moment at SAA reflects our commitment to professionalism, collaboration,
            learning, and excellence. Here are a few snapshots that showcase our workplace
            culture and memorable moments.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={gridContainer}
          className="space-y-5"
        >
          {/* Top block: large featured tile (left, wider) + 2x2 medium squares (right) */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
            <MomentTile
              moment={featuredMoment}
              eager
              className="aspect-[4/3] sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:aspect-auto"
            />
            {topSquares.map((moment) => (
              <MomentTile key={moment.title} moment={moment} className="aspect-square" />
            ))}
          </div>

          {/* Bottom row: small square, medium square, large horizontal */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">
            {bottomRow.map((moment) => (
              <MomentTile
                key={moment.title}
                moment={moment}
                className={`${bottomAspectClasses[moment.size]} ${bottomSpanClasses[moment.size]}`}
              />
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
