import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiMapPin,
  FiMessageSquare,
  FiEdit3,
  FiSend,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { Container } from "../../../components/common/Container";
import { ContactInfoCards } from "./ContactInfoCards";
import { cn } from "../../../utils/cn";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.1 * i, ease: EASE },
  }),
};

const serviceOptions = [
  "Loans",
  "Consumer Law",
  "Business Law",
  "Tax Law",
  "Trademark Law",
  "Real Estate",
  "Tax Preparation",
  "Tax Advisory",
  "Personal Tax Planning",
  "Small Business Tax",
  "Other",
];

const inputBaseClasses =
  "w-full rounded-lg border bg-white py-3 pl-11 pr-4 text-sm text-black placeholder-secondary/40 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-700/10";

const fieldBorder = (hasError) =>
  hasError
    ? "border-red-300 focus:border-red-400"
    : "border-secondary/15 focus:border-brand-700";

const ErrorMessage = ({ id, children }) => (
  <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600" role="alert">
    <FiAlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    {children}
  </p>
);

export const ContactForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm({ mode: "onBlur" });

  const selectedService = watch("service");
  const isOtherService = selectedService === "Other";

  useEffect(() => {
    if (!isOtherService) {
      setValue("otherService", "");
      clearErrors("otherService");
    }
  }, [isOtherService, setValue, clearErrors]);

  const onSubmit = async (data) => {
    // Simulated network request - wire up to a real endpoint when available.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    console.log("Contact form submitted:", data);
    reset();
  };

  return (
    <section id="contact-form" className="bg-gradient-to-b from-white to-brand-50 py-16 lg:py-24 scroll-mt-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Left: Intro + Info Cards */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="inline-block rounded-full bg-brand-700 px-4 py-1.5 text-sm font-semibold text-white"
            >
              Get in Touch
            </motion.span>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
            >
              Let's Start a <span className="text-brand-700">Conversation</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-4 text-base leading-relaxed text-black"
            >
              We're committed to providing timely and professional financial assistance. Feel
              free to reach out for consultations, compliance support, taxation, or business
              advisory services.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="mt-5">
              <ContactInfoCards />
            </motion.div>
          </motion.div>

          {/* Right: Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-lg shadow-secondary/5 sm:p-8"
          >
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-black">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" aria-hidden="true" />
                    <input
                      id="fullName"
                      type="text"
                      placeholder="Your name"
                      aria-invalid={errors.fullName ? "true" : "false"}
                      aria-describedby={errors.fullName ? "fullName-error" : undefined}
                      className={cn(inputBaseClasses, fieldBorder(errors.fullName))}
                      {...register("fullName", {
                        required: "Please enter your full name.",
                        minLength: { value: 3, message: "Name must be at least 3 characters." },
                      })}
                    />
                  </div>
                  {errors.fullName && <ErrorMessage id="fullName-error">{errors.fullName.message}</ErrorMessage>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-black">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" aria-hidden="true" />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
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
                  {errors.email && <ErrorMessage id="email-error">{errors.email.message}</ErrorMessage>}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Mobile Number */}
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-black">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiPhone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" aria-hidden="true" />
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      aria-invalid={errors.phone ? "true" : "false"}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      className={cn(inputBaseClasses, fieldBorder(errors.phone))}
                      {...register("phone", {
                        required: "Please enter your mobile number.",
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: "Enter a valid 10-digit Indian mobile number.",
                        },
                      })}
                    />
                  </div>
                  {errors.phone && <ErrorMessage id="phone-error">{errors.phone.message}</ErrorMessage>}
                </div>

                {/* Company / Business Name */}
                <div>
                  <label htmlFor="company" className="mb-2 block text-sm font-semibold text-black">
                    Company / Business Name
                  </label>
                  <div className="relative">
                    <FiBriefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" aria-hidden="true" />
                    <input
                      id="company"
                      type="text"
                      placeholder="Optional"
                      className={cn(inputBaseClasses, fieldBorder(false))}
                      {...register("company")}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* City */}
                <div>
                  <label htmlFor="city" className="mb-2 block text-sm font-semibold text-black">
                    City
                  </label>
                  <div className="relative">
                    <FiMapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" aria-hidden="true" />
                    <input
                      id="city"
                      type="text"
                      placeholder="Your city"
                      className={cn(inputBaseClasses, fieldBorder(false))}
                      {...register("city")}
                    />
                  </div>
                </div>

                {/* Service Required */}
                <div>
                  <label htmlFor="service" className="mb-2 block text-sm font-semibold text-black">
                    Service Required <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="service"
                    defaultValue=""
                    aria-invalid={errors.service ? "true" : "false"}
                    aria-describedby={errors.service ? "service-error" : undefined}
                    className={cn(
                      "w-full rounded-lg border bg-white px-4 py-3 text-sm text-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-700/10",
                      fieldBorder(errors.service)
                    )}
                    {...register("service", { required: "Please select a service." })}
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {serviceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.service && <ErrorMessage id="service-error">{errors.service.message}</ErrorMessage>}

                  <AnimatePresence>
                    {isOtherService && (
                      <motion.div
                        key="otherService"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <label htmlFor="otherService" className="mb-2 block text-sm font-semibold text-black">
                          Please Specify Your Required Service <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FiEdit3 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" aria-hidden="true" />
                          <input
                            id="otherService"
                            type="text"
                            placeholder="Enter the service you are looking for"
                            aria-invalid={errors.otherService ? "true" : "false"}
                            aria-describedby={errors.otherService ? "otherService-error" : undefined}
                            className={cn(inputBaseClasses, fieldBorder(errors.otherService))}
                            {...register("otherService", {
                              required: isOtherService ? "Please specify your required service." : false,
                            })}
                          />
                        </div>
                        {errors.otherService && (
                          <ErrorMessage id="otherService-error">{errors.otherService.message}</ErrorMessage>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold text-black">
                  Message <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMessageSquare className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-black/40" aria-hidden="true" />
                  <textarea
                    id="message"
                    rows="5"
                    placeholder="Tell us about your inquiry or requirement..."
                    aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={cn(inputBaseClasses, "resize-none", fieldBorder(errors.message))}
                    {...register("message", {
                      required: "Please enter a message.",
                      minLength: { value: 20, message: "Message must be at least 20 characters." },
                    })}
                  />
                </div>
                {errors.message && <ErrorMessage id="message-error">{errors.message.message}</ErrorMessage>}
              </div>

              {/* Privacy Checkbox */}
              <div>
                <label htmlFor="privacy" className="flex cursor-pointer items-start gap-3">
                  <input
                    id="privacy"
                    type="checkbox"
                    aria-invalid={errors.privacy ? "true" : "false"}
                    aria-describedby={errors.privacy ? "privacy-error" : undefined}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-secondary/30 text-brand-700 focus:ring-2 focus:ring-brand-700/20"
                    {...register("privacy", { required: "You must agree to the Privacy Policy." })}
                  />
                  <span className="text-sm text-black">
                    I agree to the{" "}
                    <a href="/" className="font-semibold text-brand-700 hover:underline">
                      Privacy Policy
                    </a>
                    . <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.privacy && <ErrorMessage id="privacy-error">{errors.privacy.message}</ErrorMessage>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  <>
                    Request Consultation
                    <FiSend className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </>
                )}
              </button>

              {isSubmitSuccessful && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 text-sm font-medium text-green-600"
                  role="status"
                >
                  <FiCheckCircle className="h-4 w-4" aria-hidden="true" />
                  Thank you! We'll get back to you within one business day.
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
