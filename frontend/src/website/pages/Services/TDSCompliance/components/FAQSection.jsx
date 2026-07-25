import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "../../../../../shared/utils/cn";
import { getServiceBySlug } from "../../../../api/services";

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getServiceBySlug("tds-compliance")
      .then((service) => {
        if (cancelled) return;
        setFaqs(Array.isArray(service?.faqs) ? service.faqs : []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load TDS service FAQs:", err);
        setError("Unable to load FAQs right now.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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

        {isLoading && (
          <p className="text-sm text-black/60" aria-busy="true" aria-live="polite">
            Loading FAQs...
          </p>
        )}

        {!isLoading && error && (
          <p className="text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        )}

        {!isLoading && !error && faqs.length === 0 && (
          <p className="text-sm text-black/60">No FAQs to show yet.</p>
        )}

        {!isLoading && !error && faqs.length > 0 && (
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
        )}
    </section>
  );
};
