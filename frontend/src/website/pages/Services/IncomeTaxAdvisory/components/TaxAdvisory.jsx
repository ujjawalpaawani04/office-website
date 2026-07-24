import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: EASE },
  }),
};

const items = [
  {
    title: "Financial Planning",
    description: "Tax-aware financial planning built around your income, investments and long-term goals -not a standalone filing exercise.",
  },
  {
    title: "Tax Consultation",
    description: "One-on-one consultations where your specific tax questions are answered in plain language, backed by practical experience.",
  },
  {
    title: "Compliance Advisory",
    description: "Keeping you ahead of filing, disclosure and reporting obligations as tax rules and thresholds change.",
  },
  {
    title: "Corporate Tax Advisory",
    description: "Structuring and advisory support built around your company's tax position, from entity structure to related-party transactions.",
  },
];

export const TaxAdvisory = () => {
  return (
    <section id="tax-advisory" className="scroll-mt-28">
      <div className="grid gap-12 lg:grid-cols-1 lg:items-center lg:gap-16">
        {/* <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative order-2 lg:order-1"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br from-brand-700/10 to-accent/10"
          />
          <div className="overflow-hidden rounded-2xl border border-brand-700/10 shadow-xl">
            <img
              src="/about-images/bg.jpg"
              alt="Chartered accountant providing tax advisory to a client"
              loading="lazy"
              decoding="async"
              className="h-full sm:h-[450px] w-full object-cover"
            />
          </div>
        </motion.div> */}

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="order-1 lg:order-2"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
           
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            Tax <span className="text-brand-700">Advisory</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-base leading-relaxed text-black"
          >
            Advisory that looks beyond this year's return -helping you take tax-efficient
            decisions before they need to be corrected later.
          </motion.p>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8 space-y-4"
          >
            {items.map((item, i) => (
              <motion.li
                key={item.title}
                variants={fadeUp}
                custom={3 + i}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-brand-700">
                  <FiCheckCircle className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-black">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-black">
                    {item.description}
                  </span>
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
};
