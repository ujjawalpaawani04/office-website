import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "../../../../utils/cn";

const faqs = [
  {
    question: "Who is required to deduct TDS?",
    answer:
      "Any business, organisation or individual (above the applicable audit threshold) making specified payments -such as salary, rent, professional fees or contract payments -above the prescribed limits must deduct TDS before payment.",
  },
  {
    question: "What happens if TDS is deducted but not deposited on time?",
    answer:
      "Late deposit attracts interest for every month of delay, and repeated defaults can lead to penalties and prosecution in serious cases. We track due dates closely to keep this from happening.",
  },
  {
    question: "Which TDS return should I file?",
    answer:
      "It depends on the type of payment -Form 24Q covers salary deductions, Form 26Q covers non-salary domestic payments, and Form 27Q covers payments to non-residents. We'll confirm exactly what applies to you.",
  },
  {
    question: "What is the difference between Form 16 and Form 16A?",
    answer:
      "Form 16 is the annual TDS certificate issued to employees for salary deductions. Form 16A is issued quarterly for TDS deducted on non-salary payments, such as professional fees, rent or contract payments.",
  },
  {
    question: "Can you help with TDS notices or correction statements?",
    answer:
      "Yes. We help you understand what a notice or mismatch is flagging, prepare an accurate correction statement, and represent you where needed with the department.",
  },
  {
    question: "How often are TDS returns filed?",
    answer:
      "TDS returns are filed quarterly, with Form 16 issued annually after year-end and Form 16A issued each quarter. We manage the full cycle so nothing is missed.",
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
            const panelId = `tds-faq-panel-${index}`;
            const buttonId = `tds-faq-button-${index}`;

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
