import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "../../../components/common/Container";
import { getFirmStats } from "../../../api/firmStats";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

// GET /firm-stats already returns only active stats, sorted by sort_order
// (see backend firm/routes.py) - so this strip just takes the data as
// given and shows the real label/value from the database. The Homepage
// only has room for 4, so only the first 4 by display order are shown;
// the rest stay in the Admin Panel, editable/deletable as usual.
const MAX_HOME_STATS = 4;

const mapStats = (data) =>
  data.slice(0, MAX_HOME_STATS).map((s) => ({
    id: s.id,
    value: `${s.value}${s.suffix ?? ""}`,
    label: s.label,
  }));

export const StatsSection = () => {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getFirmStats()
      .then((data) => {
        if (cancelled) return;
        setStats(Array.isArray(data) ? mapStats(data) : []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load firm stats:", err);
        setError("Unable to load stats right now.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-10 lg:py-8 bg-[#eff4f4] lg:bg-gradient-to-b lg:from-secondary lg:to-brand-900 max-w-7xl mx-auto rounded-lg lg:-translate-y-[50%]">
      <Container>
        {/* Heading/subheading are a mobile & tablet-only addition - desktop
            keeps the original stats-only design untouched. */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-10 text-start lg:hidden"
        >
          <h2 className="font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl">
            Our Success at a <span className="text-brand-700">Glance</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-secondary/70">
            From satisfied clients to successfully completed projects, our statistics showcase
            the experience and excellence we bring to every service.
          </p>
        </motion.div>

        {isLoading && (
          <p className="text-center text-sm text-secondary/60" aria-busy="true" aria-live="polite">
            Loading stats...
          </p>
        )}

        {!isLoading && error && (
          <p className="text-center text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="grid gap-4 lg:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {!isLoading && !error && stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className={`text-center group p-3 rounded-lg lg:rounded-none bg-white lg:bg-transparent ${i === stats.length - 1 ? "" : "lg:border-r lg:border-white" }`}
            >
              <div className="relative inline-block mb-1">
                <div className="absolute inset-0 bg-gradient-to-br from-highlight/20 to-accent/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <p className="relative text-4xl sm:text-5xl font-bold text-brand-700 lg:text-highlight font-display">
                  {stat.value}
                </p>
              </div>
              <p className="text-base font-medium text-secondary/70 lg:text-white/80">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
