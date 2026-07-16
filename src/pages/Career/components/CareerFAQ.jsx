import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { Container } from "../../../components/common/Container";
import { cn } from "../../../utils/cn";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.12 * i, ease: EASE },
  }),
};

const faqs = [
  {
    question: "Do you hire freshers?",
    answer:
      "Yes, we welcome freshers for roles like Article Assistant and other entry-level positions. We provide structured training and mentorship to help you build a strong foundation.",
  },
  {
    question: "Is Articleship available?",
    answer:
      "Yes, we regularly offer CA Articleship opportunities with hands-on exposure to audit, taxation, GST, and advisory assignments under experienced mentors.",
  },
  {
    question: "How can I apply?",
    answer:
      "You can apply directly through the Apply Now form on this page by sharing your details and resume, or reach out to us via our Contact page.",
  },
  {
    question: "What is the recruitment process?",
    answer:
      "Our process typically includes an application review, followed by an interview and, where applicable, a short assessment. Shortlisted candidates are contacted directly by our team.",
  },
];

export const CareerFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white py-16 lg:py-20">
      <Container className="max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12 text-center"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            FAQs
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
          >
            Frequently Asked <span className="text-brand-700">Questions</span>
          </motion.h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `career-faq-panel-${index}`;
            const buttonId = `career-faq-button-${index}`;

            return (
              <motion.div
                key={faq.question}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                custom={index}
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
                      transition={{ duration: 0.25, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-secondary/65">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
