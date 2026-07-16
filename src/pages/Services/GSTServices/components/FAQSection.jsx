import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "../../../../utils/cn";

const faqs = [
  {
    question: "Is GST registration mandatory?",
    answer:
      "It's mandatory once your turnover crosses the prescribed threshold, or if you fall into certain specified categories regardless of turnover. We can assess whether your business needs to register.",
  },
  {
    question: "Which GST return should I file?",
    answer:
      "It depends on your registration type and turnover -most businesses file GSTR-1 and GSTR-3B, with GSTR-9 as an annual return. We'll confirm exactly what applies to you.",
  },
  {
    question: "What is Input Tax Credit?",
    answer:
      "Input Tax Credit lets you reduce the GST you owe on sales by the GST you've already paid on eligible business purchases, provided the claim is properly documented and matched.",
  },
  {
    question: "Can you handle GST notices?",
    answer:
      "Yes. We help you understand what a notice is asking for, prepare an accurate response, and represent you where needed with the department.",
  },
  {
    question: "How often should GST returns be filed?",
    answer:
      "Most businesses file monthly, though smaller taxpayers can opt into quarterly filing under the QRMP scheme. An annual return is also required on top of the periodic ones.",
  },
  {
    question: "Can you help with GST cancellation?",
    answer:
      "Yes. If a registration is no longer needed, we manage the cancellation process end to end so it's closed out compliantly.",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faqs" className="scroll-mt-28">
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
            const panelId = `gst-faq-panel-${index}`;
            const buttonId = `gst-faq-button-${index}`;

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
