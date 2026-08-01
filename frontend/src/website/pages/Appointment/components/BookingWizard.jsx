import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../../../components/common/Container";
import { ApiError } from "../../../../shared/api/client";
import { submitAppointment } from "../../../api/appointments";
import { StepIndicator } from "./StepIndicator";
import { ServiceStep } from "./ServiceStep";
import { DateTimeStep } from "./DateTimeStep";
import { DetailsStep } from "./DetailsStep";
import { SummaryStep } from "./SummaryStep";
import { CalendlyHandoff } from "./CalendlyHandoff";

const EASE = [0.22, 1, 0.36, 1];
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const PHONE_PATTERN = /^[6-9]\d{9}$/;

const initialDetails = {
  name: "",
  phone: "",
  email: "",
  businessName: "",
  isExistingClient: "",
  alternateContact: "",
  requirementDescription: "",
  document: null,
  consentGiven: false,
};

function validateDetails(values) {
  const errors = {};
  if (!values.name.trim() || values.name.trim().length < 3) errors.name = "Please enter your full name.";
  if (!PHONE_PATTERN.test(values.phone.trim())) errors.phone = "Enter a valid 10-digit Indian mobile number.";
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (values.alternateContact && !PHONE_PATTERN.test(values.alternateContact.trim())) {
    errors.alternateContact = "Enter a valid 10-digit mobile number.";
  }
  if (!values.requirementDescription.trim() || values.requirementDescription.trim().length < 10) {
    errors.requirementDescription = "Please briefly describe your requirement (at least 10 characters).";
  }
  if (!values.consentGiven) errors.consentGiven = "Please confirm you agree to be contacted about this request.";
  return errors;
}

export const BookingWizard = () => {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({ service: null, mode: null, date: null, time: null });
  const [details, setDetails] = useState(initialDetails);
  const [detailErrors, setDetailErrors] = useState({});
  const [submission, setSubmission] = useState({ status: "idle", appointmentId: null, schedulingUrl: null, error: null });

  const goTo = (n) => {
    setStep(n);
    document.getElementById("booking-wizard")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSelectService = (key) => {
    setSelection((prev) => ({ ...prev, service: key }));
    goTo(2);
  };

  const handleDetailsChange = (name, value) => setDetails((prev) => ({ ...prev, [name]: value }));
  const handleFileChange = (file, error) => {
    setDetails((prev) => ({ ...prev, document: file }));
    setDetailErrors((prev) => ({ ...prev, document: error || undefined }));
  };

  const handleContinueFromDetails = () => {
    const errors = validateDetails(details);
    setDetailErrors((prev) => ({ ...errors, document: prev.document }));
    if (Object.keys(errors).length > 0) return;
    goTo(4);
  };

  const handleConfirm = async () => {
    setSubmission({ status: "submitting", appointmentId: null, schedulingUrl: null, error: null });

    const formData = new FormData();
    formData.append("name", details.name.trim());
    formData.append("email", details.email.trim());
    formData.append("phone", details.phone.trim());
    formData.append("businessName", details.businessName.trim());
    formData.append("isExistingClient", details.isExistingClient === "true" ? "true" : "false");
    formData.append("alternateContact", details.alternateContact.trim());
    formData.append("service", selection.service);
    formData.append("meetingMode", selection.mode);
    formData.append("appointmentDate", selection.date);
    formData.append("appointmentTime", selection.time.iso.slice(11, 16));
    formData.append("requirementDescription", details.requirementDescription.trim());
    formData.append("consentGiven", "true");
    if (details.document) formData.append("document", details.document);

    try {
      const result = await submitAppointment(formData);
      setSubmission({
        status: "awaiting-calendly",
        appointmentId: result.appointmentId,
        schedulingUrl: result.schedulingUrl,
        error: null,
      });
    } catch (err) {
      const isSlotConflict = err instanceof ApiError && err.status === 409;
      setSubmission({
        status: "idle",
        appointmentId: null,
        schedulingUrl: null,
        error:
          err instanceof ApiError
            ? err.message
            : "Something went wrong submitting your request. Please try again.",
      });
      // A slot taken between selection and confirmation needs a fresh pick -
      // send the client back to re-choose rather than silently retry.
      if (isSlotConflict) {
        setSelection((prev) => ({ ...prev, date: null, time: null }));
        goTo(2);
      }
    }
  };

  const isAwaitingCalendly = submission.status === "awaiting-calendly";

  return (
    <section id="booking-wizard" className="scroll-mt-24 bg-brand-50/40 py-16 sm:py-20">
      <Container>
        {!isAwaitingCalendly && (
          <div className="mb-12">
            <StepIndicator currentStep={step} />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-brand-700/10 bg-white p-6 shadow-[0_10px_36px_-18px_rgba(1,24,24,0.22)] sm:p-10"
        >
          {isAwaitingCalendly ? (
            <CalendlyHandoff
              appointmentId={submission.appointmentId}
              schedulingUrl={submission.schedulingUrl}
              selection={selection}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                {step === 1 && <ServiceStep selectedKey={selection.service} onSelect={handleSelectService} />}

                {step === 2 && (
                  <div>
                    <DateTimeStep
                      service={selection.service}
                      mode={selection.mode}
                      date={selection.date}
                      time={selection.time}
                      onModeChange={(mode) => setSelection((prev) => ({ ...prev, mode, date: null, time: null }))}
                      onDateChange={(date) => setSelection((prev) => ({ ...prev, date }))}
                      onTimeChange={(time) => setSelection((prev) => ({ ...prev, time }))}
                    />
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => goTo(3)}
                        disabled={!selection.mode || !selection.date || !selection.time}
                        className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                      >
                        Continue
                      </button>
                      <button
                        type="button"
                        onClick={() => goTo(1)}
                        className="inline-flex items-center gap-2 rounded-md border border-brand-700/30 px-5 py-3.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-700/5"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <DetailsStep values={details} errors={detailErrors} onChange={handleDetailsChange} onFileChange={handleFileChange} />
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleContinueFromDetails}
                        className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-600"
                      >
                        Continue
                      </button>
                      <button
                        type="button"
                        onClick={() => goTo(2)}
                        className="inline-flex items-center gap-2 rounded-md border border-brand-700/30 px-5 py-3.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-700/5"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <SummaryStep
                    selection={selection}
                    details={details}
                    onEdit={() => goTo(3)}
                    onConfirm={handleConfirm}
                    isSubmitting={submission.status === "submitting"}
                    submitError={submission.error}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </Container>
    </section>
  );
};
