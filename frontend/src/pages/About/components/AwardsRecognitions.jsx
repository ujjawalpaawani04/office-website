import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Container } from "../../../components/common/Container";
import { cn } from "../../../utils/cn";
import { FiAward, FiStar, FiTrendingUp } from "react-icons/fi";
import { getAwards } from "../../../api/firmStats";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

// Awards have no dedicated icon field in the DB; cycle through this fixed set
// by index so the timeline keeps visual variety regardless of data source.
const ICONS_CYCLE = [FiAward, FiStar, FiTrendingUp];

// The DB only has a single `description` field; the seed data appends the
// issuing organization as a trailing "(...)" so it can be split back out here.
const mapAward = (a, i) => {
  const match = /^(.*)\(([^)]+)\)\.?\s*$/.exec(a.description ?? "");
  return {
    year: String(a.year ?? ""),
    title: a.title,
    organization: match ? match[2].trim() : "",
    description: (match ? match[1] : a.description ?? "").trim(),
    icon: ICONS_CYCLE[i % ICONS_CYCLE.length],
  };
};

/**
 * A single alternating timeline entry.
 * On desktop the card sits on the left or right of the centre line based on
 * `isLeft`; on mobile every card stacks in a single column beside a left rail.
 */
const TimelineItem = ({ award, index, isLeft, reduced }) => {
  const Icon = award.icon;

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: reduced ? 0 : isLeft ? -48 : 48,
      y: reduced ? 0 : 24,
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        delay: reduced ? 0 : 0.06 * (index % 3),
        ease: EASE,
      },
    },
  };

  return (
    <li className="relative pl-16 md:grid md:grid-cols-2 md:gap-x-16 md:pl-0">
      {/* Timeline dot / icon - centred on the rail (left on mobile, middle on desktop) */}
      <motion.span
        initial={reduced ? false : { scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, ease: EASE }}
        className="absolute top-6 left-6 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-brand-700/30 bg-white shadow-[0_0_0_6px_rgba(21,91,92,0.06)] md:top-1/2 md:left-1/2 md:-translate-y-1/2 md:-translate-x-1/2"
      >
        <span className="absolute inset-0 rounded-full bg-brand-700/0 transition-all duration-500 group-hover:bg-brand-700/5" />
        <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-brand-700/10 to-accent/10">
          <Icon className="h-5 w-5 text-brand-700" aria-hidden="true" />
        </span>
      </motion.span>

      {/* Card - alternates columns on desktop */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className={cn(
          "group py-2 md:py-8",
          isLeft
            ? "md:col-start-1 md:pr-8 md:text-right"
            : "md:col-start-2 md:pl-8 md:text-left",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-brand-700/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all duration-300",
            "hover:-translate-y-1 hover:border-brand-700/30 hover:shadow-xl hover:shadow-brand-700/10",
          )}
        >
          {/* Brand glow that reveals on hover */}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-50/60 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative">
            <span
              className={cn(
                "inline-flex items-center rounded-full bg-brand-700/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-700 ring-1 ring-inset ring-brand-700/15",
              )}
            >
              {award.year}
            </span>

            <h3 className="mt-3 font-display text-xl font-bold leading-snug text-black">
              {award.title}
            </h3>

            <p className="mt-1 text-sm font-medium text-brand-700/80">
              {award.organization}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-black">
              {award.description}
            </p>
          </div>
        </div>
      </motion.div>
    </li>
  );
};

export const AwardsRecognitions = () => {
  const reduced = useReducedMotion();
  const timelineRef = useRef(null);
  const [awards, setAwards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getAwards()
      .then((data) => {
        if (cancelled) return;
        setAwards(Array.isArray(data) ? data.map(mapAward) : []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load awards:", err);
        setError("Unable to load awards right now.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Draw the centre line progressively as the section scrolls into view.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 65%"],
  });

  return (
    <section className="relative overflow-hidden py-16 bg-gradient-to-b from-white via-white to-brand-50">
      {/* Decorative blurred shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-700/5 blur-3xl" />
        <div className="absolute top-1/3 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 -right-20 h-72 w-72 rounded-full bg-gold-500/5 blur-3xl" />
      </div>

      <Container className="relative">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            Recognition
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            Awards & <span className="text-brand-700">Recognitions</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-base leading-relaxed text-black max-w-2xl mx-auto"
          >
            Over the years, our commitment to excellence has been recognized by leading industry bodies and client testimonials. These accolades reinforce our dedication to delivering world-class services.
          </motion.p>
        </motion.div>

        {isLoading && (
          <p className="mb-16 text-center text-sm text-black/60" aria-busy="true" aria-live="polite">
            Loading awards...
          </p>
        )}

        {!isLoading && error && (
          <p className="mb-16 text-center text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        )}

        {!isLoading && !error && awards.length === 0 && (
          <p className="mb-16 text-center text-sm text-black/60">No awards to show yet.</p>
        )}

        {/* Awards Timeline */}
        {!isLoading && !error && awards.length > 0 && (
        <div ref={timelineRef} className="relative mb-16">
          {/* Rail track - left on mobile, centred on desktop */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-6 w-px -translate-x-1/2 bg-brand-700/10 md:left-1/2"
          />
          {/* Animated fill that draws as you scroll */}
          <motion.div
            aria-hidden="true"
            style={{ scaleY: reduced ? 1 : scrollYProgress }}
            className="absolute top-0 bottom-0 left-6 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-brand-700 via-brand-500 to-accent md:left-1/2"
          />

          <ol className="space-y-4 md:space-y-2">
            {awards.map((award, i) => (
              <TimelineItem
                key={award.year + award.title}
                award={award}
                index={i}
                isLeft={i % 2 === 0}
                reduced={reduced}
              />
            ))}
          </ol>
        </div>
        )}
      </Container>
    </section>
  );
};
