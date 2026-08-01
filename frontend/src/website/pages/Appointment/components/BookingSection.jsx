import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
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
import { openCalendlyPopup, useCalendlyEventListener, useLockHtmlScroll } from "../../../utils/calendly";
import { ContactInfoCards } from "../../Contact/components/ContactInfoCards";
import { cn } from "../../../../shared/utils/cn";
import { createAppointmentFromBooking } from "../../../api/appointments";
import { getServices } from "../../../api/services";
import { contactFormRules, otherServiceRule } from "../../../validations/contactValidation";

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL;
const CALENDLY_URL_CONFIGURED = Boolean(CALENDLY_URL) && !CALENDLY_URL.includes("REPLACE-ME");

const EASE = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.1 * i, ease: EASE },
  }),
};

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

// Labels the two-step flow up front: step 1 happens inline in this card,
// step 2 happens in the Calendly popup that opens on submit - without this
// it isn't obvious the "Continue to Calendar" button leads to a second,
// separate step rather than submitting the booking directly.
const BOOKING_STEPS = [
  { number: 1, title: "Fill in your details", description: "Tell us who you are and what you'd like to discuss" },
  { number: 2, title: "Select and book your preferred date and time", description: "Pick a slot in the calendar that opens" },
];

function StepGuide() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-secondary/10 bg-secondary/[0.02] p-4 sm:flex-row sm:gap-5">
      {BOOKING_STEPS.map((s) => (
        <div key={s.number} className="flex flex-1 items-start gap-3">
          <span
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
              s.number === 1 ? "bg-brand-700 text-white" : "border-2 border-brand-700/30 text-brand-700"
            )}
          >
            {s.number}
          </span>
          <div>
            <p className="text-sm font-semibold text-black">
              Step {s.number}: {s.title}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-black/55">{s.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Not configured yet - a clearly-marked placeholder is still in .env. Shown
// instead of trying to pop open a broken/placeholder Calendly link (Phase
// 1's "Empty State" requirement).
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
  const [step, setStep] = useState("form"); // form | success
  const [details, setDetails] = useState(null);
  const [popupError, setPopupError] = useState(null);
  const [opening, setOpening] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const { services, loading: servicesLoading } = useServiceOptions();

  // Keeps the page behind the popup from scrolling while it's open - driven
  // by the popup's actual overlay element via onOverlayChange below, not a
  // guess about how long booking takes. See utils/calendly.js for why this
  // locks <html> rather than reusing useLockBodyScroll.
  useLockHtmlScroll(popupOpen);

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

  const handleScheduled = useCallback(
    ({ eventUri, inviteeUri }) => {
      setDetails((current) => {
        if (!current) return current;
        const notes = current.resolvedService
          ? `Service Required: ${current.resolvedService}${current.notes ? `\n\n${current.notes}` : ""}`
          : current.notes;
        createAppointmentFromBooking({
          name: current.name,
          email: current.email,
          phone: current.phone,
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
        return current;
      });
      setStep("success");
    },
    []
  );

  // Fires regardless of whether the popup is currently open - Calendly
  // posts `calendly.event_scheduled` to the whole window, not scoped to
  // whichever component opened the popup.
  useCalendlyEventListener(handleScheduled);

  const onSubmitDetails = async (data) => {
    const resolvedService = data.service === "Other" ? data.otherService : data.service;
    setDetails({ ...data, resolvedService });
    setPopupError(null);
    setOpening(true);
    try {
      await openCalendlyPopup(CALENDLY_URL, {
        prefill: { name: data.name, email: data.email },
        onOverlayChange: setPopupOpen,
      });
    } catch {
      setPopupError("We couldn't open the booking calendar. Please try again, or contact us directly below.");
    } finally {
      setOpening(false);
    }
  };

  return (
    <section id="book-now" className="scroll-mt-24 bg-gradient-to-b from-white to-brand-50 py-16 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Left: Intro + Info Cards - matches Contact Us page's left column */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.span
              variants={fadeUp}
              custom={0}
              className="inline-block rounded-full bg-brand-700 px-4 py-1.5 text-sm font-semibold text-white"
            >
              Book Now
            </motion.span>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
            >
              Choose a Time That <span className="text-brand-700">Works for You</span>
            </motion.h2>

            <motion.p variants={fadeUp} custom={2} className="mt-4 text-base leading-relaxed text-black">
              Share a few details and pick a slot that suits your schedule - our team confirms every consultation
              personally, and you're welcome to reach out directly using the details below.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="mt-5">
              <ContactInfoCards />
            </motion.div>
          </motion.div>

          {/* Right: Details Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-secondary/10 bg-white shadow-lg shadow-secondary/5"
          >
            {!CALENDLY_URL_CONFIGURED ? (
              <UnconfiguredState />
            ) : step === "success" ? (
              <SuccessState details={details} onBookAnother={() => setStep("form")} />
            ) : (
              <form noValidate onSubmit={handleSubmit(onSubmitDetails)} className="space-y-6 p-6 sm:p-8">
                <StepGuide />

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

                <div className="grid gap-6 sm:grid-cols-2">
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
                        transition={{ duration: 0.3, ease: EASE }}
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
                  disabled={opening}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {opening ? "Opening Calendar..." : "Continue to Calendar"}
                  <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </button>

                {popupError && (
                  <p className="flex items-center justify-center gap-2 text-sm font-medium text-red-600" role="alert">
                    <FiAlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {popupError}
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
