import { motion } from "framer-motion";
import { Container } from "../../../components/common/Container";
import { FiShield, FiClock, FiFileText, FiLayers, FiRefreshCw, FiBookOpen, FiCheckCircle } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

const commitments = [
  {
    icon: FiShield,
    title: "Professional & Ethical Conduct",
    description: "Engagements are accepted and carried out in accordance with the ICAI Code of Ethics.",
  },
  {
    icon: FiClock,
    title: "Statutory Timeline Discipline",
    description: "Due dates are tracked and filings are made within the time allowed by law.",
  },
  {
    icon: FiFileText,
    title: "Scope Agreed in Writing",
    description: "The scope, deliverables and timelines of each engagement are confirmed with the client before work begins.",
  },
  {
    icon: FiLayers,
    title: "Multi-Statute Support",
    description: "Direct tax, indirect tax, corporate law and, where applicable, RERA and state land laws are handled within one office.",
  },
  {
    icon: FiRefreshCw,
    title: "Continuing Professional Education",
    description: "The firm invests in continuing professional education so that advice reflects current law.",
  },
];

const standards = [
  {
    icon: FiBookOpen,
    title: "ICAI Standards",
    description: "Engagements are conducted in accordance with the Standards on Auditing, Accounting Standards and Guidance Notes issued by ICAI.",
  },
  {
    icon: FiFileText,
    title: "Applicable Statutes",
    description: "Work is carried out under the applicable provisions of the Income-tax Act, 1961, the Central Goods and Services Tax Act, 2017, the Companies Act, 2013 and the Real Estate (Regulation and Development) Act, 2016.",
  },
  {
    icon: FiCheckCircle,
    title: "UDIN Authentication",
    description: "Every certificate and audit report issued carries a Unique Document Identification Number (UDIN) as required by ICAI.",
  },
];

export const CommitmentStandards = () => {
  return (
    <section className="py-16 bg-white">
      <Container>
        {/* Our Commitment */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            How We Work
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            Our <span className="text-brand-700">Commitment</span>
          </motion.h2>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {commitments.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="text-center"
              >
                <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-700/10 to-accent/10 transition-all group hover:from-brand-700/20 hover:to-accent/20">
                  <Icon className="h-8 w-8 text-brand-700" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-black">{item.title}</h3>
                <p className="leading-relaxed text-black">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Professional Standards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-20 border-t border-brand-700/10 pt-20"
        >
          <div className="mb-12 text-center">
            <motion.span
              variants={fadeUp}
              custom={0}
              className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
            >
              Governance
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
            >
              Professional <span className="text-brand-700">Standards</span>
            </motion.h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {standards.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  custom={i + 1}
                  className="relative rounded-lg border border-brand-700/10 bg-white p-8"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-700/10">
                    <Icon className="h-6 w-6 text-brand-700" aria-hidden="true" />
                  </div>
                  <h3 className="mb-3 font-display text-xl font-bold text-black">{item.title}</h3>
                  <p className="leading-relaxed text-black">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
