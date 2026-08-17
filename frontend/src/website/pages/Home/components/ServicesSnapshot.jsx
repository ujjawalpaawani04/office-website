import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiFileText, FiHome, FiPercent, FiBookOpen, FiCheckSquare, FiBriefcase } from "react-icons/fi";
import { Container } from "../../../components/common/Container";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.1 * i, ease: EASE },
  }),
};

const services = [
  {
    icon: FiPercent,
    title: "Income Tax & Tax Advisory",
    description:
      "Return filing for individuals, professionals, firms and companies, TDS-related compliance, assessment support and advisory on tax planning within the framework of the Income-tax Act, 1961.",
    to: "/services/income-tax-advisory",
  },
  {
    icon: FiFileText,
    title: "GST Services",
    description:
      "New registration, monthly and quarterly return filing, input tax credit reconciliation, annual return and ongoing compliance support.",
    to: "/services/gst-services",
  },
  {
    icon: FiCheckSquare,
    title: "Audit & Assurance",
    description:
      "Statutory audit, tax audit under Section 44AB, and internal audit of business processes and controls.",
    to: "/services/audit-assurance",
  },
  {
    icon: FiBookOpen,
    title: "Accounting & Bookkeeping",
    description:
      "Maintenance of books of account, ledger and bank reconciliation, and preparation of financial statements.",
    to: "/services/accounting-bookkeeping",
  },
  {
    icon: FiBriefcase,
    title: "Company & LLP Registration (ROC)",
    description:
      "Incorporation of private limited companies, LLPs and one person companies, ROC annual filings and event-based compliance.",
    to: "/services/company-llp-registration",
  },
  {
    icon: FiHome,
    title: "RERA & Land Laws (UPZLAR)",
    description:
      "RERA registration and periodic compliance for projects and promoters, and consultancy under the Uttarakhand Zamindari Abolition and Land Reforms Act.",
    to: "/services/rera-registration",
  },
];

export const ServicesSnapshot = () => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="lg:text-center mb-16"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            Our <span className="text-brand-700">Services</span>
          </motion.h2>
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
              >
                <Link
                  to={service.to}
                  className="group relative flex h-full flex-col rounded-lg border border-brand-700/10 bg-white p-8 transition-all duration-300 hover:border-brand-700/30 hover:shadow-lg"
                >
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-brand-700/10 to-accent/10 transition-all group-hover:from-brand-700/20 group-hover:to-accent/20">
                    <Icon className="h-7 w-7 text-brand-700" aria-hidden="true" />
                  </div>
                  <h3 className="mb-3 font-semibold text-lg text-black">{service.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-black/70">{service.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                    Learn more
                    <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-700 hover:text-brand-800"
          >
            View all services
            <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
};
