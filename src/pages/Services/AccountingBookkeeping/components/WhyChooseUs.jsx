import { motion } from "framer-motion";
import { FiUserCheck, FiCheckCircle, FiClock, FiLock, FiShield, FiHeadphones, FiEye, FiTrendingUp } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.1 * i, ease: EASE },
  }),
};

const reasons = [
  { icon: FiUserCheck, title: "Experienced Accounting Professionals", description: "A team that understands bookkeeping and financial reporting inside out." },
  { icon: FiCheckCircle, title: "Accurate Financial Reporting", description: "Reports you can rely on, prepared with precision every time." },
  { icon: FiClock, title: "Timely Record Maintenance", description: "Books kept current, so nothing piles up at closing time." },
  { icon: FiLock, title: "Confidential Data Handling", description: "Your financial information handled with strict confidentiality." },
  { icon: FiShield, title: "Regulatory Compliance", description: "Records maintained in line with applicable accounting standards." },
  { icon: FiHeadphones, title: "Personalized Business Support", description: "A dedicated point of contact who actually knows your business." },
  { icon: FiEye, title: "Transparent Communication", description: "Clear visibility into your books and what's happening with them." },
  { icon: FiTrendingUp, title: "Reliable Financial Insights", description: "Numbers you can act on, not just numbers on a page." },
];

export const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="scroll-mt-32">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Left - image */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br from-brand-700/10 to-accent/10"
          />
          <div className="overflow-hidden rounded-2xl border border-brand-700/10 shadow-xl">
            <img
              src="/about-images/bg1.png"
              alt="Accounting professionals supporting a bookkeeping client"
              loading="lazy"
              decoding="async"
              className="h-full sm:h-[400px] w-full object-fill"
            />
          </div>
        </motion.div>

        {/* Right - checklist */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            Why Choose Us
          </motion.span>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
          >
            Why Businesses Choose <span className="text-brand-700">SAA</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={2}
            className="mt-4 text-base leading-relaxed text-secondary/70"
          >
            We keep your books current all year round -not just in the days before a
            filing or a review.
          </motion.p>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {reasons.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <motion.li
                  key={reason.title}
                  variants={fadeUp}
                  custom={3 + i}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-700/10 text-brand-700">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium leading-snug text-secondary/80">
                    <span className="block font-semibold text-secondary">{reason.title}</span>
                    <span className="mt-0.5 block text-secondary/70">{reason.description}</span>
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
};
