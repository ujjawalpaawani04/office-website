import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
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

const fadeUpFast = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.45 + 0.08 * i, ease: EASE },
  }),
};

const features = [
  {
    number: "01",
    title: "ICAI Registered",
    description: "Officially registered with the Institute of Chartered Accountants of India",
  },
  {
    number: "02",
    title: "Pan-India Presence",
    description: "Operations across 50+ cities ensuring seamless service delivery",
  },
  {
    number: "03",
    title: "Expert Team",
    description: "100+ highly qualified professionals with specialized expertise",
  },
  {
    number: "04",
    title: "Client-Centric",
    description: "Dedicated to understanding and achieving your business objectives",
  },
];

export const AboutUsSnippet = () => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-12 items-center">
          {/* left side - Photo collage */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="order-2"
          >
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              <div className="flex flex-col gap-4 sm:gap-5">
                <div className="group h-36 overflow-hidden rounded-2xl shadow-lg shadow-black/10 sm:h-44 lg:h-60">
                  <img
                    src="/gallery/team1.png"
                    alt="Our team at work in the office"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="group h-56 overflow-hidden rounded-2xl shadow-lg shadow-black/10 sm:h-64 lg:h-80">
                  <img
                    src="/gallery/main.png"
                    alt="Chartered Accountant reviewing client documents"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:gap-5">
                <div className="group h-56 overflow-hidden rounded-2xl shadow-lg shadow-black/10 sm:h-64 lg:h-80">
                  <img
                    src="/gallery/team4.png"
                    alt="Our modern, welcoming office space"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="group h-36 overflow-hidden rounded-2xl shadow-lg shadow-black/10 sm:h-44 lg:h-60">
                  <img
                    src="/gallery/team3.png"
                    alt="Office interior at Singh Amit & Associates"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </motion.div>

         
      


 {/* Right side - Content */}
              <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="order-1"
          >
            <motion.span
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={0}
              className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
            >
              About Our Firm
            </motion.span>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={1}
              className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
            >
              Two Decades of <span className="text-brand-700">Financial Excellence</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={2}
              className="mt-6 text-base leading-relaxed text-black/75"
            >
              Since 2004, Singh Amit & Associates has been India's trusted partner for comprehensive chartered accountancy services. Our team of 100+ professionals combines deep expertise with innovative thinking to deliver transformative financial solutions.
            </motion.p>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={3}
              className="mt-4 text-base leading-relaxed text-black/75"
            >
              From startups to established enterprises, we've helped 500+ clients across 50+ cities navigate complex financial challenges and achieve their business goals with confidence.
            </motion.p>

            <div className="mt-10 space-y-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.number}
                  variants={fadeUpFast}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={i}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-brand-700/10 to-accent/10">
                      <span className="text-lg font-bold text-brand-700">{feature.number}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">{feature.title}</h3>
                    <p className="text-sm text-black mt-1">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={fadeUpFast}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={features.length}
              className="mt-10"
            >
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 rounded-md bg-brand-700 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-700/20 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
              >
                Read Our Full Story
                <FiArrowRight
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

