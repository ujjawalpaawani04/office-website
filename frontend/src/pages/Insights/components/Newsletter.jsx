import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiMail, FiSend, FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
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

export const Newsletter = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    // Simulated network request - wire up to a real newsletter endpoint when available.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Newsletter subscription:", data);
    reset();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-16 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-highlight/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-10 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl"
      />

      <Container className="relative">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto max-w-xl text-center"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-display text-3xl font-bold leading-[1.2] text-white sm:text-4xl"
          >
            Stay Updated With Financial Insights
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={1}
            className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg"
          >
            Subscribe to receive the latest updates on taxation, GST, compliance, and business
            advisory.
          </motion.p>

          <motion.form
            variants={fadeUp}
            custom={2}
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/40" aria-hidden="true" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  aria-label="Email Address"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "newsletter-email-error" : undefined}
                  className={cn(
                    "w-full rounded-lg border bg-white py-3.5 pl-11 pr-4 text-sm text-secondary placeholder-secondary/40 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-highlight/40",
                    errors.email ? "border-red-300" : "border-transparent"
                  )}
                  {...register("email", {
                    required: "Please enter your email address.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address.",
                    },
                  })}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-highlight px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-secondary shadow-lg shadow-highlight/20 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <FiSend className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>

            {errors.email && (
              <p
                id="newsletter-email-error"
                className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-highlight-2"
                role="alert"
              >
                <FiAlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {errors.email.message}
              </p>
            )}

            {isSubmitSuccessful && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-white"
                role="status"
              >
                <FiCheckCircle className="h-4 w-4 text-highlight" aria-hidden="true" />
                Thanks for subscribing! Watch your inbox for our next update.
              </motion.p>
            )}
          </motion.form>
        </motion.div>
      </Container>
    </section>
  );
};
