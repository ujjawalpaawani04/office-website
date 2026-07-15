import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "../../../../utils/cn";

const faqs = [
  {
    question: "Which tax regime is better for a salary of ₹15 lakhs?",
    answer:
      "It depends on how much you claim in deductions. As a general rule, if your eligible deductions cross roughly ₹3.75 lakhs, the old regime tends to work out better; below that, the new regime is usually more efficient. We run the exact numbers for your specific case rather than relying on a rule of thumb.",
  },
  {
    question: "What is the penalty for late filing of an ITR?",
    answer:
      "Filing after the due date — usually 31st July for individuals not subject to audit — attracts a late fee of up to ₹5,000, along with interest on any outstanding tax. Late filers also lose the right to carry forward certain business losses to future years.",
  },
  {
    question: "Can a company change its tax rate regime every year?",
    answer:
      "No. Once a company elects a concessional regime under Section 115BAA or 115BAB, that choice is generally irrevocable and applies to all subsequent years. We help you evaluate the decision carefully before you commit.",
  },
  {
    question: "What is the Annual Information Statement (AIS)?",
    answer:
      "The AIS is a comprehensive view of your financial transactions — salary, interest, dividends, mutual fund activity, property transactions and more — as reported to the Income Tax Department by banks, employers and other institutions. We reconcile it against your records before filing to avoid mismatches.",
  },
  {
    question: "Can you help with tax notices?",
    answer:
      "Yes. We provide dedicated support for income tax notices, scrutiny and assessments, helping you understand the notice, prepare the required response and represent your case where needed.",
  },
  {
    question: "Is my financial information confidential?",
    answer:
      "Yes. Every client engagement is handled with strict confidentiality, and your financial information is never shared with third parties.",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faqs" className="scroll-mt-32">
      <div className="mb-12 max-w-2xl">
        <span className="text-sm font-semibold uppercase tracking-widest text-brand-700">
          FAQs
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl">
          Frequently Asked Questions
        </h2>
      </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `income-tax-faq-panel-${index}`;
            const buttonId = `income-tax-faq-button-${index}`;

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
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-sm font-semibold text-secondary transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 sm:text-base"
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
                      <p className="px-6 pb-5 text-sm leading-relaxed text-secondary/65">
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
