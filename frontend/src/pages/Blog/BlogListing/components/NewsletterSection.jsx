import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiAward,
  FiBell,
  FiBookOpen,
  FiCheckCircle,
  FiDollarSign,
  FiFileText,
  FiLoader,
  FiLock,
  FiMail,
  FiPercent,
  FiSend,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import { Container } from "../../../../components/common/Container";
import { cn } from "../../../../utils/cn";
import { useNewsletterSubscribe } from "../../../../hooks/useNewsletterSubscribe";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.12 * i, ease: EASE },
  }),
};

const PILLARS = [
  { icon: FiFileText, label: "Tax Updates" },
  { icon: FiPercent, label: "GST Updates" },
  { icon: FiBell, label: "Compliance Alerts" },
  { icon: FiDollarSign, label: "Financial Planning" },
  { icon: FiTrendingUp, label: "Business Insights" },
  { icon: FiBookOpen, label: "Accounting Tips" },
];

const TRUST_INDICATORS = [
  { icon: FiShield, label: "No Spam, Ever" },
  { icon: FiAward, label: "Curated by CA Experts" },
  { icon: FiLock, label: "100% Secure & Private" },
];

const inputBaseClasses =
  "w-full rounded-lg border bg-white py-3.5 pl-11 pr-4 text-sm text-black placeholder-secondary/40 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-700/10";

const fieldBorder = (hasError) =>
  hasError ? "border-red-300 focus:border-red-400" : "border-secondary/15 focus:border-brand-700";

const ErrorMessage = ({ id, children }) => (
  <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600" role="alert">
    <FiAlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    {children}
  </p>
);

export const NewsletterSection = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ mode: "onBlur" });
  const { status, error: submitError, submit } = useNewsletterSubscribe();

  const onSubmit = async (data) => {
    try {
      await submit(data.email);
      reset();
    } catch {
      // status/error are already surfaced by useNewsletterSubscribe
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-brand-50/60 to-white py-20 lg:py-20">
      {/* Decorative glows - extends the blurred gradient-orb language used across KeyServices / StatsSection */}
      <div className="pointer-events-none absolute -top-16 right-0 h-72 w-72 rounded-full bg-gradient-to-br from-brand-700/10 to-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-gradient-to-br from-highlight/10 to-accent/10 blur-3xl" />

      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:items-center">
          {/* Left column */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.span
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-4 py-1.5 text-sm font-semibold text-white"
            >
              <FiMail className="h-3.5 w-3.5" aria-hidden="true" />
              Newsletter
            </motion.span>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="mt-5 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
            >
              Tax &amp; Financial Intelligence, <span className="text-brand-700">Delivered Monthly</span>
            </motion.h2>

            <motion.p variants={fadeUp} custom={2} className="mt-4  text-base leading-relaxed text-black/70">
              Join business owners and professionals who rely on our newsletter for timely tax
              updates, GST changes, compliance deadlines, and practical financial strategies —
              curated by our CA experts, straight to your inbox.
            </motion.p>
{/* 
            <motion.ul variants={fadeUp} custom={3} className="mt-6 flex flex-wrap gap-2.5">
              {PILLARS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-700/15 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700"
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </motion.ul> */}
{/* 
            <motion.div variants={fadeUp} custom={4} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              {TRUST_INDICATORS.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-2 text-sm font-medium text-black/60">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-700/10 to-accent/10 text-brand-700">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {label}
                </span>
              ))}
            </motion.div> */}
          </motion.div>

          {/* Right column: elevated form card, matching ContactForm's card DNA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative rounded-2xl border border-secondary/10 bg-white p-7 shadow-lg shadow-secondary/5 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-700/10 to-accent/10">
                <FiMail className="h-6 w-6 text-brand-700" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-black">Weekly Insight Digest</h3>
                <p className="text-xs text-black/50">Straight from our CA desk, every week.</p>
              </div>
            </div>

            <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label htmlFor="newsletter-email" className="mb-2 block text-sm font-semibold text-black">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40"
                    aria-hidden="true"
                  />
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="you@example.com"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "newsletter-email-error" : undefined}
                    className={cn(inputBaseClasses, fieldBorder(errors.email))}
                    {...register("email", {
                      required: "Please enter your email address.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address.",
                      },
                    })}
                  />
                </div>
                {errors.email && <ErrorMessage id="newsletter-email-error">{errors.email.message}</ErrorMessage>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe Now
                    <FiSend className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            {status === "success" && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-green-600"
                role="status"
              >
                <FiCheckCircle className="h-4 w-4" aria-hidden="true" />
                You're subscribed! Watch your inbox for our next update.
              </motion.p>
            )}

            {status === "already" && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-brand-700"
                role="status"
              >
                <FiCheckCircle className="h-4 w-4" aria-hidden="true" />
                You are already subscribed to our newsletter.
              </motion.p>
            )}

            {submitError && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-red-600"
                role="alert"
              >
                <FiAlertCircle className="h-4 w-4" aria-hidden="true" />
                {submitError}
              </motion.p>
            )}
{/*
            <p className="mt-4 text-center text-xs text-black/40">
              Free forever. Unsubscribe anytime with one click.
            </p> */}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
