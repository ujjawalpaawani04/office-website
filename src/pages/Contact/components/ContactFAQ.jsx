import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { Container } from "../../../components/common/Container";
import { cn } from "../../../utils/cn";

const faqs = [
  {
    question: "Do you provide online CA consultation?",
    answer:
      "Yes, we offer video and phone consultations so you can get expert guidance from anywhere, without needing to visit our office in person.",
  },
  {
    question: "Which documents are required for Income Tax Return filing?",
    answer:
      "Typically your PAN, Aadhaar, Form 16 or salary slips, bank statements, and investment proofs. Once you share your inquiry, we'll send a checklist tailored to your specific case.",
  },
  {
    question: "Can you help with GST registration and monthly GST returns?",
    answer:
      "Absolutely. We handle end-to-end GST registration as well as timely monthly, quarterly, and annual GST return filing for businesses of every size.",
  },
  {
    question: "Do you offer accounting and bookkeeping services for businesses?",
    answer:
      "Yes, we provide complete accounting and bookkeeping support, from day-to-day transaction recording to periodic financial statements.",
  },
  {
    question: "Can startups get company registration and compliance support?",
    answer:
      "Yes, we assist startups with company incorporation, Startup India registration, and ongoing statutory compliance from day one.",
  },
  {
    question: "How quickly can I expect a response after submitting the contact form?",
    answer:
      "We respond to every inquiry within one business day. For urgent matters, please call our office directly.",
  },
  {
    question: "Do you assist with ROC filing and annual compliance?",
    answer:
      "Yes, we manage ROC filings, annual returns, and other statutory compliance requirements for companies and LLPs.",
  },
  {
    question: "Are my financial documents kept confidential?",
    answer:
      "Yes. Every client engagement is handled with strict confidentiality, and your financial information is never shared with third parties.",
  },
];

export const ContactFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white py-16 lg:py-24">
      <Container className="max-w-3xl">
        <div className="text-center mb-12">
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
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

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
      </Container>
    </section>
  );
};
