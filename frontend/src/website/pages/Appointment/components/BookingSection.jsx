import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiAlertCircle,
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiEdit3,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import { Container } from "../../../components/common/Container";
import { CalendlyEmbed } from "../../../components/common/CalendlyEmbed";
import { ContactInfoCards } from "../../Contact/components/ContactInfoCards";
import { cn } from "../../../../shared/utils/cn";
import { createAppointmentFromBooking } from "../../../api/appointments";
import { getServices } from "../../../api/services";
import { contactFormRules, otherServiceRule } from "../../../validations/contactValidation";

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL;
const CALENDLY_URL_CONFIGURED = Boolean(CALENDLY_URL) && !CALENDLY_URL.includes("REPLACE-ME");

const inputBaseClasses =
  "w-full rounded-lg border bg-white py-3 pl-11 pr-4 text-sm text-black placeholder-secondary/40 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-700/10";

const fieldBorder = (hasError) =>
  hasError ? "border-red-300 focus:border-red-400" : "border-secondary/15 focus:border-brand-700";

const ErrorMessage = ({ id, children }) => (
  <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600" role="alert">
    <FiAlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    {children}
  </p>
);

// Sourced live from GET /api/services (admin-managed, see admin/pages/Services)
// instead of a hardcoded list - adding/renaming/removing a service in the
// Admin Panel shows up here on next page load with no frontend change.
// Same "fetch once, fail silently" pattern as useServicesMenu() in
// website/constants/navigation.js.
function useServiceOptions() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getServices()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setServices(data);
      })
      .catch(() => {
        // Leave the list empty on failure - the "Other" option still lets
        // the visitor proceed, this must never block booking a slot.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { services, loading };
}

// Two-step progress + heading shown above the form and the calendar - gives
// the booking flow a clear sense of place instead of the calendar just
// appearing with no context, and lets the visitor step back to fix a typo
// in their details without losing the calendar entirely.
function StepHeader({ step, onBack }) {
  const isEmbed = step === "embed";
  return (
    <div className="bg-gradient-to-r from-secondary to-brand-700 px-6 py-5 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-highlight">
            {isEmbed ? <FiCalendar className="h-5 w-5" aria-hidden="true" /> : <FiUser className="h-5 w-5" aria-hidden="true" />}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-highlight">
              Step {isEmbed ? "2" : "1"} of 2
            </p>
            <p className="text-base font-semibold text-white sm:text-lg">
              {isEmbed ? "Pick a Date & Time" : "Your Details"}
            </p>
          </div>
        </div>

        {isEmbed && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            <FiArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Edit Details</span>
          </button>
        )}
      </div>

      <div className="mt-4 flex gap-1.5" role="presentation">
        <div className="h-1 flex-1 rounded-full bg-highlight" />
        <div className={cn("h-1 flex-1 rounded-full transition-colors duration-500", isEmbed ? "bg-highlight" : "bg-white/20")} />
      </div>
    </div>
  );
}

// Not configured yet - a clearly-marked placeholder is still in .env. Shown
// instead of trying to embed a broken/placeholder Calendly link (Phase 1's
// "Empty State" requirement).
function UnconfiguredState() {
  return (
    <div className="p-10 text-center">
      <FiCalendar className="mx-auto h-9 w-9 text-secondary/30" aria-hidden="true" />
      <p className="mt-4 text-base font-semibold text-black">Online booking is being set up</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-black/60">
        Our scheduling calendar isn't connected yet. In the meantime, please reach out to us directly and we'll set
        up a time that works for you.
      </p>
    </div>
  );
}

function SuccessState({ details, onBookAnother }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-b from-green-50 to-white p-10 text-center"
      role="status"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <FiCheckCircle className="h-8 w-8 text-green-600" aria-hidden="true" />
      </div>
      <p className="mt-5 text-lg font-semibold text-black">You're all set, {details?.name?.split(" ")[0] || "there"}!</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-black/65">
        Calendly has emailed a confirmation with your meeting time and joining link to <strong>{details?.email}</strong>.
        Our team will also reach out ahead of the call if we need anything from you.
      </p>
      <button
        type="button"
        onClick={onBookAnother}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-green-300 bg-white px-5 py-2.5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50"
      >
        Book another slot
      </button>
    </motion.div>
  );
}

export const BookingSection = () => {
  const [step, setStep] = useState("form"); // form | embed | success
  const [details, setDetails] = useState(null);
  const { services, loading: servicesLoading } = useServiceOptions();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const selectedService = watch("service");
  const isOtherService = selectedService === "Other";

  useEffect(() => {
    if (!isOtherService) {
      setValue("otherService", "");
      clearErrors("otherService");
    }
  }, [isOtherService, setValue, clearErrors]);

  const onSubmitDetails = (data) => {
    const resolvedService = data.service === "Other" ? data.otherService : data.service;
    setDetails({ ...data, resolvedService });
    setStep("embed");
  };

  const handleScheduled = useCallback(
    ({ eventUri, inviteeUri }) => {
      if (!details) return;
      const notes = details.resolvedService
        ? `Service Required: ${details.resolvedService}${details.notes ? `\n\n${details.notes}` : ""}`
        : details.notes;
      createAppointmentFromBooking({
        name: details.name,
        email: details.email,
        phone: details.phone,
        notes,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        calendlyEventUri: eventUri,
        calendlyInviteeUri: inviteeUri,
      }).catch((err) => {
        // The booking already exists on Calendly's calendar and the visitor
        // already has Calendly's own confirmation email - a failure here
        // only affects our internal record, so it must never block the
        // success screen. Logged for follow-up, not surfaced as an error.
        console.error("Failed to sync appointment to backend:", err);
      });
      setStep("success");
    },
    [details]
  );

  return (
    <section id="book-now" className="scroll-mt-24 bg-gradient-to-b from-white to-brand-50 py-16 lg:py-24">
      <Container>
        <div className="mb-10 max-w-2xl">
          <span className="inline-block rounded-full bg-brand-700 px-4 py-1.5 text-sm font-semibold text-white">
            Book Now
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl">
            Choose a Time That Works for You
          </h2>
        </div>

        {CALENDLY_URL_CONFIGURED && step === "embed" ? (
          // Full width for the calendar step - Calendly's month/time-slot
          // layout needs real room to breathe; squeezed into the same
          // narrower column the details form uses left it feeling cramped.
          <div className="overflow-hidden rounded-2xl border border-secondary/10 bg-white shadow-xl shadow-secondary/10">
            <StepHeader step={step} onBack={() => setStep("form")} />
            <div className="p-3 sm:p-6">
              <CalendlyEmbed
                url={CALENDLY_URL}
                prefill={{ name: details?.name, email: details?.email }}
                onScheduled={handleScheduled}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <ContactInfoCards />
            </div>

            <div className="overflow-hidden rounded-2xl border border-secondary/10 bg-white shadow-xl shadow-secondary/10">
              {CALENDLY_URL_CONFIGURED && step !== "success" && <StepHeader step={step} onBack={() => setStep("form")} />}

              {!CALENDLY_URL_CONFIGURED ? (
                <UnconfiguredState />
              ) : step === "success" ? (
                <SuccessState details={details} onBookAnother={() => setStep("form")} />
              ) : (
                <form noValidate onSubmit={handleSubmit(onSubmitDetails)} className="space-y-5 p-6 sm:p-8">
                <p className="text-sm text-black/60">
                  Share a few details first so we're prepared for the call - you'll pick your slot on the next step.
                </p>

                <div>
                  <label htmlFor="ap-name" className="mb-2 block text-sm font-semibold text-black">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" aria-hidden="true" />
                    <input
                      id="ap-name"
                      type="text"
                      placeholder="Your name"
                      aria-invalid={errors.name ? "true" : "false"}
                      aria-describedby={errors.name ? "ap-name-error" : undefined}
                      className={cn(inputBaseClasses, fieldBorder(errors.name))}
                      {...register("name", contactFormRules.fullName)}
                    />
                  </div>
                  {errors.name && <ErrorMessage id="ap-name-error">{errors.name.message}</ErrorMessage>}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="ap-email" className="mb-2 block text-sm font-semibold text-black">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" aria-hidden="true" />
                      <input
                        id="ap-email"
                        type="email"
                        placeholder="you@example.com"
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={errors.email ? "ap-email-error" : undefined}
                        className={cn(inputBaseClasses, fieldBorder(errors.email))}
                        {...register("email", contactFormRules.email)}
                      />
                    </div>
                    {errors.email && <ErrorMessage id="ap-email-error">{errors.email.message}</ErrorMessage>}
                  </div>

                  <div>
                    <label htmlFor="ap-phone" className="mb-2 block text-sm font-semibold text-black">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiPhone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" aria-hidden="true" />
                      <input
                        id="ap-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        aria-invalid={errors.phone ? "true" : "false"}
                        aria-describedby={errors.phone ? "ap-phone-error" : undefined}
                        className={cn(inputBaseClasses, fieldBorder(errors.phone))}
                        {...register("phone", contactFormRules.phone)}
                      />
                    </div>
                    {errors.phone && <ErrorMessage id="ap-phone-error">{errors.phone.message}</ErrorMessage>}
                  </div>
                </div>

                <div>
                  <label htmlFor="ap-service" className="mb-2 block text-sm font-semibold text-black">
                    Service Required <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiBriefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" aria-hidden="true" />
                    <select
                      id="ap-service"
                      defaultValue=""
                      disabled={servicesLoading}
                      aria-invalid={errors.service ? "true" : "false"}
                      aria-describedby={errors.service ? "ap-service-error" : undefined}
                      className={cn(
                        "w-full appearance-none rounded-lg border bg-white py-3 pl-11 pr-4 text-sm text-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-700/10 disabled:cursor-not-allowed disabled:opacity-60",
                        fieldBorder(errors.service)
                      )}
                      {...register("service", contactFormRules.service)}
                    >
                      <option value="" disabled>
                        {servicesLoading ? "Loading services..." : "Select a service"}
                      </option>
                      {services.map((service) => (
                        <option key={service.id} value={service.name}>
                          {service.name}
                        </option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {errors.service && <ErrorMessage id="ap-service-error">{errors.service.message}</ErrorMessage>}

                  <AnimatePresence>
                    {isOtherService && (
                      <motion.div
                        key="ap-otherService"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <label htmlFor="ap-otherService" className="mb-2 block text-sm font-semibold text-black">
                          Please Specify the Service <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FiEdit3 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" aria-hidden="true" />
                          <input
                            id="ap-otherService"
                            type="text"
                            placeholder="Enter the service you are looking for"
                            aria-invalid={errors.otherService ? "true" : "false"}
                            aria-describedby={errors.otherService ? "ap-otherService-error" : undefined}
                            className={cn(inputBaseClasses, fieldBorder(errors.otherService))}
                            {...register("otherService", otherServiceRule(isOtherService))}
                          />
                        </div>
                        {errors.otherService && (
                          <ErrorMessage id="ap-otherService-error">{errors.otherService.message}</ErrorMessage>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label htmlFor="ap-notes" className="mb-2 block text-sm font-semibold text-black">
                    What would you like to discuss?
                  </label>
                  <div className="relative">
                    <FiMessageSquare className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-black/40" aria-hidden="true" />
                    <textarea
                      id="ap-notes"
                      rows="3"
                      placeholder="Optional - helps us prepare for the call"
                      className={cn(inputBaseClasses, "resize-none", fieldBorder(false))}
                      {...register("notes")}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
                >
                  Continue to Calendar
                  <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </button>
              </form>
              )}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};
