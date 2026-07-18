import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "../../../../utils/cn";

const faqs = [
  {
    question: "Why is bookkeeping important?",
    answer:
      "Bookkeeping is the foundation of every financial decision your business makes. Accurate records keep you compliant, reveal your real financial position, and make tax time and audits far less stressful.",
  },
  {
    question: "How often should financial records be updated?",
    answer:
      "Ideally, transactions should be recorded as they happen, with a formal review monthly or quarterly. We tailor the frequency to your transaction volume and reporting needs.",
  },
  {
    question: "What financial reports do you prepare?",
    answer:
      "We prepare profit & loss statements, balance sheets, cash flow statements, and other reports such as accounts payable/receivable summaries and expense breakdowns.",
  },
  {
    question: "Can you manage accounting remotely?",
    answer:
      "Yes. We work with cloud-based accounting tools and secure document sharing, so your books can be maintained accurately regardless of where your business is located.",
  },
  {
    question: "Do you assist during audits?",
    answer:
      "Yes. We keep your records audit-ready throughout the year and support you directly during statutory, tax or internal audits with the documentation auditors need.",
  },
  {
    question: "What accounting software do you support?",
    answer:
      "We work with most major accounting platforms and can also adapt to the software your business already uses, so there's no disruptive migration required.",
  },
  {
    question: "How do you ensure data confidentiality?",
    answer:
      "Your financial data is handled under strict internal confidentiality protocols, with controlled access and secure storage at every stage of the engagement.",
  },
  {
    question: "Do you provide monthly accounting services?",
    answer:
      "Yes. We offer monthly, quarterly and annual accounting packages, each including reconciliation, reporting and a review of your financial position.",
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
          const panelId = `accounting-faq-panel-${index}`;
          const buttonId = `accounting-faq-button-${index}`;

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
