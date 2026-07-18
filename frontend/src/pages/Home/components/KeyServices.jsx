import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiFileText,
  FiTrendingUp,
  FiBarChart,
  FiShield,
  FiCheckCircle,
  FiDollarSign,
  FiArrowRight,
} from "react-icons/fi";
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

const services = [
  {
    icon: FiFileText,
    title: "Taxation & Compliance",
    description:
      "Expert guidance on direct and indirect taxation, GST compliance, and regulatory requirements to optimize your tax position.",
    link: "/",
  },
  {
    icon: FiBarChart,
    title: "Audit & Assurance",
    description:
      "Comprehensive internal and statutory audits ensuring financial accuracy, compliance, and strengthened internal controls.",
    link: "/",
  },
  {
    icon: FiTrendingUp,
    title: "Business Advisory",
    description:
      "Strategic financial planning and advisory services to drive business growth, M&A support, and performance optimization.",
    link: "/",
  },
  {
    icon: FiShield,
    title: "Risk Management",
    description:
      "Identify, assess, and mitigate financial and operational risks with our comprehensive risk management solutions.",
    link: "/",
  },
  {
    icon: FiCheckCircle,
    title: "Corporate Compliance",
    description:
      "Seamless management of corporate compliance, secretarial functions, and statutory filings to keep you ahead of regulations.",
    link: "/",
  },
  {
    icon: FiDollarSign,
    title: "Financial Planning",
    description:
      "Tailored financial strategies and planning services to maximize profitability and ensure sustainable business growth.",
    link: "/",
  },
];

export const KeyServices = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-brand-50 to-white">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            Our Expertise
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            Comprehensive Financial <span className="text-brand-700">Services</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-base leading-relaxed text-black max-w-2xl mx-auto"
          >
            From taxation and compliance to strategic advisory, we offer a complete suite of services designed to support your business at every stage of growth.
          </motion.p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="group relative"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-700/5 to-accent/5 rounded-lg blur-xl transition-all group-hover:blur-2xl group-hover:from-brand-700/10 group-hover:to-accent/10 " />

                {/* Card */}
                <div className="relative p-8 rounded-lg border border-brand-700/10 bg-white h-full flex flex-col transition-all duration-300 group-hover:border-brand-700/30 group-hover:shadow-lg">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-lg bg-gradient-to-br from-brand-700/10 to-accent/10 mb-5 group-hover:from-brand-700/20 group-hover:to-accent/20 transition-all">
                    <Icon className="h-7 w-7 text-brand-700 group-hover:text-brand-600" />
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-lg text-black mb-3">
                    {service.title}
                  </h3>
                  <p className="text-black text-sm leading-relaxed flex-1">
                    {service.description}
                  </p>

                  {/* Link */}
                  <Link
                    to={service.link}
                    className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-brand-700 hover:text-brand-600  group-hover:gap-3 transition-all duration-300"
                  >
                    Learn More
                    <FiArrowRight className="h-4 w-4 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          className="text-center mt-12"
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-md bg-brand-700 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-700/20 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            Explore All Services
            <FiArrowRight
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
};
