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
    <section className="py-5 lg:py-8 bg-gradient-to-b from-secondary to-brand-900 max-w-7xl -translate-y-[12%] sm:-translate-y-[25%] lg:-translate-y-[50%] mx-auto rounded-lg ">
      <Container>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className={`text-center group ${i === stats.length - 1 ? "" : "lg:border-r lg:border-white" }`}
            >
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-highlight/20 to-accent/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <p className="relative text-4xl sm:text-5xl font-bold text-highlight font-display">
                  {stat.value}
                </p>
              </div>
              <p className="text-base font-medium text-white/80">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
