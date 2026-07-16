import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";
import { Container } from "../../../../components/common/Container";

const EASE = [0.22, 1, 0.36, 1];

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="bg-gradient-to-r from-secondary via-brand-900 to-secondary py-10">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col items-center justify-between gap-6 lg:flex-row"
        >
          <div className="flex items-center gap-4 text-center lg:text-left">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 sm:flex">
              <FiMail className="h-5 w-5 text-highlight" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
                Never Miss Important Tax &amp; Financial Updates
              </h2>
              <p className="mt-1 text-sm text-white/60">
                Subscribe to receive the latest articles, tax updates, compliance reminders and
                financial insights directly in your inbox.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full max-w-md shrink-0 flex-col gap-2 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-highlight focus:outline-none focus:ring-2 focus:ring-highlight/20"
            />
            <button
              type="submit"
              className="shrink-0 rounded-md bg-highlight px-6 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all duration-300 hover:-translate-y-0.5"
            >
              Subscribe Now
            </button>
          </form>
        </motion.div>
        <p className="mt-3 text-center text-xs text-white/40 lg:text-right">
          {submitted ? "Thanks for subscribing! " : ""}We respect your privacy. Unsubscribe at any time.
        </p>
      </Container>
    </section>
  );
};
