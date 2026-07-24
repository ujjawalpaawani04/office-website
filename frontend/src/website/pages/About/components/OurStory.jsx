import { motion } from "framer-motion";
import { Container } from "../../../components/common/Container";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

const highlights = [
  "Professional & Ethical Approach",
  "Timely and Reliable Service",
  "Practical, Client-Focused Solutions",
  "Comprehensive Compliance Support",
  "Long-Term Professional Relationships",
];

export const OurStory = () => {
  return (
    <section id="our-story" className="py-16 bg-white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
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
              WHO WE ARE
            </motion.span>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={1}
              className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
            >
              Singh Amit <span className="text-brand-700">& Associates</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={2}
              className="mt-6 text-base leading-relaxed text-black"
            >
              Singh Amit & Associates is a professional Chartered Accountancy firm led by CA Amit Singh, providing comprehensive taxation, accounting, audit, regulatory compliance and business advisory services.
            </motion.p>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={3}
              className="mt-4 text-base leading-relaxed text-black"
            >
              Based in Roorkee, Uttarakhand, the firm serves individuals, professionals, startups, businesses, companies, NGOs and other organisations with reliable and practical solutions tailored to their specific requirements.
            </motion.p>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={3}
              className="mt-4 text-base leading-relaxed text-black"
            >
              Our approach combines professional expertise, timely execution and a strong understanding of regulatory requirements. From routine tax compliance to specialised consultancy in RERA and Uttarakhand Land Laws (UPZLAR), we help clients manage complex financial and legal compliance matters with clarity and confidence.
            </motion.p>

            <motion.ul
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-8 space-y-3 sm:flex sm:flex-wrap"
            >
              {highlights.map((highlight, i) => (
                <motion.li
                  key={highlight}
                  variants={fadeUp}
                  custom={4 + i}
                  className="flex items-start gap-3 sm:w-[48%]"
                >
                  <IoCheckmarkDoneOutline className="h-5 w-5 shrink-0 text-brand-700 mt-0.5" aria-hidden="true" />
                  <span className="text-sm text-black/75">{highlight}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right side - Stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="grid grid-cols-2 gap-2 md:gap-6"
          >
            {[
              { value: "12+", label: "Years of Experience" },
              { value: "500+", label: "Happy Clients" },
              { value: "100+", label: "GST Registrations" },
              { value: "50+", label: "Cities Served" },
              { value: "300+", label: "Audits Completed" },
              { value: "1000+", label: "Tax Returns Filed" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-700/5 to-accent/5 rounded-lg blur transition-all group-hover:blur-md group-hover:from-brand-700/10 group-hover:to-accent/10" />
                <div className="relative p-6 rounded-lg border border-brand-700/10 bg-white min-h-[135px]">
                  <p className="text-3xl font-bold text-brand-700">{stat.value}</p>
                  <p className="mt-2 text-sm font-medium text-black">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
