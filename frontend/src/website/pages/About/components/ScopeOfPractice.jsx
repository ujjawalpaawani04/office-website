import { motion } from "framer-motion";
import { Container } from "../../../components/common/Container";
import {
  FiFileText,
  FiCheckSquare,
  FiShield,
  FiActivity,
  FiPercent,
  FiRepeat,
  FiBriefcase,
  FiHome,
  FiMap,
  FiUsers,
  FiBookOpen,
} from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.06 * i, ease: EASE },
  }),
};

const scopeItems = [
  {
    icon: FiFileText,
    title: "Return Filing",
    description: "Filing of returns of income for individuals, professionals, firms, LLPs, companies and trusts.",
  },
  {
    icon: FiCheckSquare,
    title: "Tax Audits",
    description: "Tax audits under Section 44AB of the Income-tax Act, 1961.",
  },
  {
    icon: FiShield,
    title: "Statutory Audits",
    description: "Statutory audits of companies, LLPs and societies.",
  },
  {
    icon: FiActivity,
    title: "Internal Audits",
    description: "Internal audits of purchase, sales, inventory and payroll cycles for trading and service entities.",
  },
  {
    icon: FiPercent,
    title: "GST Compliance",
    description: "GST registration, monthly and quarterly returns, input tax credit reconciliation and annual return.",
  },
  {
    icon: FiRepeat,
    title: "TDS Compliance",
    description: "Quarterly TDS statements in Forms 24Q, 26Q and 27Q, and correction of defaults on TRACES.",
  },
  {
    icon: FiBriefcase,
    title: "Incorporation & ROC",
    description: "Incorporation of private limited companies, LLPs and one person companies, and annual ROC filings.",
  },
  {
    icon: FiHome,
    title: "RERA Compliance",
    description: "RERA registration of projects and promoters and the related periodic compliance.",
  },
  {
    icon: FiMap,
    title: "Land Law Consultancy",
    description: "Consultancy on matters arising under the Uttarakhand Zamindari Abolition and Land Reforms Act.",
  },
  {
    icon: FiUsers,
    title: "Trusts, Societies & NGOs",
    description: "Registration of trusts, societies and Section 8 companies, and compliance under Sections 12A and 80G.",
  },
  {
    icon: FiBookOpen,
    title: "Accounting & Bookkeeping",
    description: "Preparation of financial statements and ongoing bookkeeping support.",
  },
];

export const ScopeOfPractice = () => {
  return (
    <section id="scope-of-practice" className="bg-brand-50/40 py-16 sm:py-20">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block rounded-full bg-brand-700 px-4 py-1.5 text-sm font-semibold text-white"
          >
            What We Handle
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            Scope of <span className="text-brand-700">Practice</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-base leading-relaxed text-black"
          >
            Engagements the firm has handled across taxation, audit, corporate compliance and regulatory advisory.
          </motion.p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {scopeItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                className="group flex flex-col items-start gap-4 rounded-2xl border border-brand-700/10 bg-white p-6 shadow-[0_4px_20px_-12px_rgba(1,24,24,0.15)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-700/30 hover:shadow-xl hover:shadow-brand-700/10"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-700/10 text-brand-700 transition-colors duration-300 group-hover:bg-brand-700 group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/75">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
