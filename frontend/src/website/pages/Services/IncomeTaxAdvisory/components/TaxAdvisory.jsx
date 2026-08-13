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
    title: "Remuneration to Partners",
    description: "Advisory on remuneration and interest payable to partners of a firm.",
  },
  {
    title: "Set-off and Carry-Forward of Losses",
    description: "Advisory on the set-off and carry-forward of business and other losses under the Income-tax Act.",
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
            Advisory on partnership and loss-related matters that affect a taxpayer's overall
            tax position.
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

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={3 + items.length}
            className="mt-6 text-sm leading-relaxed text-black/60"
          >
            Advice is given within the framework of the Income-tax Act and the rules made
            thereunder.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
