import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "../../../../../shared/utils/cn";

export const ArticleFAQs = ({ faqs, slug }) => {
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs?.length) return null;

  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl font-bold text-black">Frequently Asked Questions</h2>

      <div className="mt-6 space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const panelId = `${slug}-faq-panel-${index}`;
          const buttonId = `${slug}-faq-button-${index}`;

          return (
            <div key={faq.question} className="overflow-hidden rounded-xl border border-secondary/10 bg-white">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-black transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 sm:text-base"
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
                    <p className="px-5 pb-4 text-sm leading-relaxed text-black/65">{faq.answer}</p>
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
