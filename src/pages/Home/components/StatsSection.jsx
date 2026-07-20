import { motion } from "framer-motion";
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

const stats = [
  { value: "12+", label: "Years of Experience" },
  { value: "500+", label: "Happy Clients" },
  { value: "100+", label: "Team Members" },
  { value: "50+", label: "Cities Covered" },
];

export const StatsSection = () => {
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

        <div className="grid gap-4 lg:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
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
