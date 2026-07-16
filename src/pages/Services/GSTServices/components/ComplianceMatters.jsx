import { motion } from "framer-motion";
import { FiShield, FiTrendingUp, FiAlertTriangle, FiPieChart } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: EASE },
  }),
};

const benefits = [
  { icon: FiShield, label: "Legal Protection" },
  { icon: FiTrendingUp, label: "Business Benefits" },
  { icon: FiAlertTriangle, label: "Avoid Penalties" },
  { icon: FiPieChart, label: "Better Financial Management" },
];

export const ComplianceMatters = () => {
  return (
    <section id="overview" className="scroll-mt-0 overflow-hidden">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_1fr] lg:items-center lg:gap-14">
        {/* Left - image with floating stat badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative"
        >
          <div className="overflow-hidden rounded-3xl border border-brand-700/10 shadow-xl">
            <img
              src="/about-images/bg1.png"
              alt="Business owner reviewing GST compliance records"
              loading="lazy"
              decoding="async"
              className="h-full sm:h-[420px] w-full object-cover"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="absolute -bottom-6 -right-4 flex items-center gap-4 rounded-2xl border border-brand-700/10 bg-white p-5 shadow-xl sm:-right-8"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-accent text-white">
              <FiShield className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-brand-700">100%</p>
              <p className="text-xs font-medium uppercase tracking-wide text-black/60">
                Compliance Focus
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right - content */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            Why It Matters
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            Why GST Compliance <span className="text-brand-700">Matters</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-5 text-base leading-relaxed text-black"
          >
            GST compliance isn't just a legal obligation -it's a foundation for how smoothly
            your business runs. Staying compliant protects you from penalties, keeps your
            input tax credit flowing, and gives you a clear, accurate picture of your
            finances at every stage.
          </motion.p>

          <motion.p
            variants={fadeUp}
            custom={3}
            className="mt-4 text-base leading-relaxed text-black"
          >
            Businesses that treat GST as an ongoing discipline -not a once-a-month scramble
            -spend less time firefighting notices and more time growing.
          </motion.p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {benefits.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  custom={4 + i}
                  className="flex items-center gap-3 rounded-xl border border-secondary/10 bg-white px-4 py-3.5 shadow-sm"
                >
                  <Icon className="h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
                  <span className="text-sm font-medium text-black/80">{item.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
