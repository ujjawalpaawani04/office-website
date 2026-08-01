import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiPhone, FiMail, FiArrowRight } from "react-icons/fi";
import { Container } from "../../../components/common/Container";
import { cn } from "../../../../shared/utils/cn";
import { formatPhoneDisplay, mailHref, splitLines, telHref, useSiteSettings } from "../../../context/SiteSettingsContext";

const EASE = [0.22, 1, 0.36, 1];
const VISIBLE_COUNT = 5;

const faqs = [
  {
    question: "How do I schedule an appointment?",
    answer:
      "Select the consultation type that best matches your requirement, then choose an available date and time in the scheduling calendar. You'll receive an email confirmation once your appointment is booked.",
  },
  {
    question: "Can I reschedule or cancel my appointment?",
    answer:
      "Yes. The confirmation email from Calendly includes links to reschedule or cancel your appointment if your plans change.",
  },
  {
    question: "Is there a consultation fee?",
    answer:
      "Any fee depends on the consultation type you select. Where a fee applies, it is shown during the Calendly booking step before you confirm your slot.",
  },
  {
    question: "Can I choose between online and in-person consultation?",
    answer:
      "Where a phone, video or office option has been configured for the selected consultation type, you'll be able to choose it while scheduling.",
  },
  {
    question: "What should I prepare before the consultation?",
    answer:
      "Please keep any documents relevant to your query on hand, and a brief note of what you'd like to discuss, so we can make the best use of the scheduled time.",
  },
  {
    question: "How long does a consultation take?",
    answer:
      "Duration depends on the consultation type you select, and is shown on the scheduling calendar before you confirm a time.",
  },
  {
    question: "What information should I provide when booking?",
    answer:
      "Please provide your name, email address and phone number in the Calendly booking form, along with a brief note on your requirement.",
  },
  {
    question: "What happens after I schedule an appointment?",
    answer:
      "You'll receive an email confirmation with your appointment details, along with any further instructions where applicable.",
  },
];

export const AppointmentFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const { phone, contactEmail } = useSiteSettings();

  const visibleFaqs = showAll ? faqs : faqs.slice(0, VISIBLE_COUNT);
  const firstPhone = splitLines(phone)[0];
  const firstEmail = splitLines(contactEmail)[0];

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-display text-2xl font-bold text-black sm:text-3xl">
              Frequently Asked Questions
            </h2>

            <div className="mt-6 space-y-3">
              {visibleFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                const panelId = `appointment-faq-panel-${index}`;
                const buttonId = `appointment-faq-button-${index}`;

                return (
                  <div key={faq.question} className="overflow-hidden rounded-xl border border-secondary/10 bg-white">
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
                          transition={{ duration: 0.25, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-5 text-sm leading-relaxed text-black/65">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {!showAll && faqs.length > VISIBLE_COUNT && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-600"
              >
                View More FAQs
                <FiArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="h-fit rounded-2xl border border-brand-700/10 bg-brand-50/60 p-6">
            <h3 className="font-display text-lg font-bold text-black">Need Immediate Assistance?</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/70">
              For urgent matters or quick queries, our team is here to help.
            </p>

            <div className="mt-5 space-y-3">
              {firstPhone && (
                <a
                  href={telHref(firstPhone)}
                  className="flex items-center gap-3 rounded-lg border border-brand-700/15 bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:border-brand-700/40"
                >
                  <FiPhone className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                  {formatPhoneDisplay(firstPhone)}
                </a>
              )}
              {firstEmail && (
                <a
                  href={mailHref(firstEmail)}
                  className="flex items-center gap-3 rounded-lg border border-brand-700/15 bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:border-brand-700/40"
                >
                  <FiMail className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                  {firstEmail}
                </a>
              )}
            </div>

            <Link
              to="/contact"
              className="mt-5 flex items-center justify-center gap-2 rounded-md bg-brand-700 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-600"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};
