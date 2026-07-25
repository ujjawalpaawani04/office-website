import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "../../../../../shared/utils/cn";

const faqs = [
  {
    question: "What is a statutory audit?",
    answer:
      "A statutory audit is an independent examination of a company's financial statements, required by law for companies and certain other entities, to confirm that the accounts present a true and fair view and comply with applicable accounting standards.",
  },
  {
    question: "Who requires a tax audit?",
    answer:
      "Businesses and professionals whose turnover or gross receipts cross the prescribed threshold under the Income Tax Act are required to get a tax audit done. We assess whether your business falls within scope and manage the audit end to end.",
  },
  {
    question: "Why is an internal audit important?",
    answer:
      "An internal audit reviews your processes and controls from the inside, catching inefficiencies, control gaps and risks before they become costly problems -it's a proactive check, not just a compliance exercise.",
  },
  {
    question: "How long does an audit take?",
    answer:
      "Timelines vary with the size and complexity of the business, but most statutory and tax audits are completed within a few weeks once records are made available. We agree a clear timeline with you at the planning stage.",
  },
  {
    question: "What documents are required?",
    answer:
      "Typically we need your books of account, bank statements, invoices, prior audit reports, statutory registers and supporting schedules. We share a detailed checklist tailored to your specific audit at the start of the engagement.",
  },
  {
    question: "Can you assist with audit compliance?",
    answer:
      "Yes. Beyond conducting the audit, we help you act on the findings -closing gaps, tightening controls and meeting every applicable statutory or regulatory requirement flagged in the report.",
  },
  {
    question: "Do you provide audit reports with recommendations?",
    answer:
      "Yes. Every audit we deliver includes clear management observations alongside the formal report, with practical, prioritised recommendations rather than just a list of findings.",
  },
  {
    question: "How often should internal audits be conducted?",
    answer:
      "It depends on the size and risk profile of the business, but most organisations benefit from an internal audit cycle of once or twice a year. We help you decide a cadence that fits your operations.",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faqs" className="mt-20 lg:w-[80%] mx-auto">
      <div className="mb-12 max-w-2xl">
        <span className="text-sm font-semibold uppercase tracking-widest text-brand-700">
          FAQs
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const panelId = `audit-faq-panel-${index}`;
          const buttonId = `audit-faq-button-${index}`;

          return (
            <div
              key={faq.question}
              className="overflow-hidden rounded-xl border border-secondary/10 bg-white"
            >
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-sm font-semibold text-black transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 sm:text-base"
                >
                  {faq.question}
                  <FiChevronDown
                    aria-hidden="true"
                    className={cn(
                      "h-5 w-5 shrink-0 text-brand-700 transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-black/65">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
