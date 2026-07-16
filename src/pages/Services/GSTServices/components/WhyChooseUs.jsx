import { motion } from "framer-motion";
import { FiUserCheck, FiClock, FiRepeat, FiHeadphones, FiShield, FiEye } from "react-icons/fi";
import { cn } from "../../../../utils/cn";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: EASE },
  }),
};

const rows = [
  {
    imageSide: "left",
    reasons: [
      { icon: FiUserCheck, title: "Expert GST Professionals", description: "A team that lives and breathes GST compliance." },
      { icon: FiClock, title: "Timely Filing", description: "Every deadline met, without last-minute scrambles." },
      { icon: FiRepeat, title: "Accurate Reconciliation", description: "Books and returns kept in sync, month after month." },
    ],
  },
  {
    imageSide: "right",
    reasons: [
      { icon: FiHeadphones, title: "Dedicated Support", description: "A point of contact who actually knows your business." },
      { icon: FiShield, title: "Regulatory Compliance", description: "Filings that hold up to scrutiny, every single time." },
      { icon: FiEye, title: "Transparent Process", description: "Clear visibility into what's filed and what's pending." },
    ],
  },
];

export const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="scroll-mt-0 space-y-16">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-2xl"
      >
        <motion.span
          variants={fadeUp}
          custom={0}
          className="text-sm font-semibold uppercase tracking-widest text-brand-700"
        >
          Why Choose Us
        </motion.span>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
        >
          Why Businesses Choose <span className="text-brand-700">Our GST Services</span>
        </motion.h2>
      </motion.div>

      {rows.map((row) => (
        <div
          key={row.imageSide}
          className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14"
        >
          <motion.div
            initial={{ opacity: 0, x: row.imageSide === "left" ? -24 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className={cn(
              "overflow-hidden rounded-2xl border border-brand-700/10 shadow-xl",
              row.imageSide === "left" ? "lg:order-1" : "lg:order-2"
            )}
          >
            <img
              src="/about-images/bg1.png"
              alt="Chartered accountancy team supporting a GST client"
              loading="lazy"
              decoding="async"
              className="h-64 w-full object-cover sm:h-80"
            />
          </motion.div>

          <div className={cn("space-y-5", row.imageSide === "left" ? "lg:order-2" : "lg:order-1")}>
            {row.reasons.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={reason.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={i}
                  className="flex items-start gap-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-700/10 text-brand-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-base font-semibold text-black">
                      {reason.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-black">
                      {reason.description}
                    </span>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
};
