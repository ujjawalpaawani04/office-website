import { motion } from "framer-motion";
import { FiCheckCircle, FiFileText, FiClock } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: EASE },
  }),
};

const benefits = [
  "Accurate computation across all income heads",
  "Every eligible deduction and exemption claimed",
  "Avoids late fees, interest and notices",
  "Filed and acknowledged well before deadlines",
];

const documents = [
  "PAN & Aadhaar",
  "Form 16 / Salary Slips",
  "Form 26AS & AIS",
  "Bank Statements",
  "Investment & Deduction Proofs",
];

export const ITRFiling = () => {
  return (
    <section id="itr-filing" className="scroll-mt-0">
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
          
        </motion.span>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
        >
          Income Tax <span className="text-brand-700">Return Filing</span>
        </motion.h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-10 rounded-2xl border border-secondary/10 bg-white p-8 shadow-sm sm:p-10"
      >
        <p className="text-base leading-relaxed text-black">
          Accurate and timely filing of income tax returns for salaried individuals,
          professionals, businesses and companies -covering ITR-1 through ITR-7, with
          every figure reconciled against your Form 26AS and AIS before submission.
        </p>

        <div className="mt-8 grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-black">
              
              Key Benefits
            </h3>
            <ul className="mt-4 space-y-3">
              {benefits.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-black">
                  <FiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-black">
              
              Documents Required
            </h3>
            <ul className="mt-4 space-y-3">
              {documents.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-black">
                  <FiFileText className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 rounded-xl border border-brand-700/15 bg-brand-50 px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
            <FiClock className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-black">
            <span className="font-semibold text-brand-700">Typical turnaround: </span>
            3–5 business days from the date we receive complete documents.
          </p>
        </div>
      </motion.div>
    </section>
  );
};
