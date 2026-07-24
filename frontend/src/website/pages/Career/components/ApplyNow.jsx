import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiUploadCloud,
  FiFile,
  FiSend,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { Container } from "../../../components/common/Container";
import { cn } from "../../../../shared/utils/cn";
import { submitJobApplication } from "../../../api/careers";
import { applyNowRules } from "../../../validations/careerValidation";

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
  "w-full rounded-lg border bg-white py-3 pl-11 pr-4 text-sm text-secondary placeholder-secondary/40 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-700/10";

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

export const ApplyNow = ({ positions, selectedPosition }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm({ mode: "onBlur" });
  const [submitError, setSubmitError] = useState(null);

  const resumeFiles = watch("resume");
  const resumeFile = resumeFiles?.[0];

  useEffect(() => {
    if (selectedPosition) {
      setValue("position", selectedPosition, { shouldValidate: true });
    }
  }, [selectedPosition, setValue]);

  const onSubmit = async (data) => {
    setSubmitError(null);
    try {
      await submitJobApplication({
        name: data.applicantName,
        email: data.applicantEmail,
        phone: data.applicantPhone,
        position: data.position,
        resume: data.resume[0],
      });
      reset();
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
      throw err;
    }
  };

  return (
    <section id="apply-now" className="scroll-mt-24 bg-gradient-to-b from-white to-brand-50 py-16 lg:py-24">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            Apply Now
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
          >
            Start Your <span className="text-brand-700">Application</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-base leading-relaxed text-secondary/70"
          >
            Share a few details and your resume - our team will review your application and get
            in touch.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-2xl rounded-2xl border border-secondary/10 bg-white p-6 shadow-lg shadow-secondary/5 sm:p-8"
        >
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Full Name */}
              <div>
                <label htmlFor="applicantName" className="mb-2 block text-sm font-semibold text-secondary">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiUser className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/40" aria-hidden="true" />
                  <input
                    id="applicantName"
                    type="text"
                    placeholder="Your name"
                    aria-invalid={errors.applicantName ? "true" : "false"}
                    aria-describedby={errors.applicantName ? "applicantName-error" : undefined}
                    className={cn(inputBaseClasses, fieldBorder(errors.applicantName))}
                    {...register("applicantName", applyNowRules.applicantName)}
                  />
                </div>
                {errors.applicantName && (
                  <ErrorMessage id="applicantName-error">{errors.applicantName.message}</ErrorMessage>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="applicantEmail" className="mb-2 block text-sm font-semibold text-secondary">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/40" aria-hidden="true" />
                  <input
                    id="applicantEmail"
                    type="email"
                    placeholder="you@example.com"
                    aria-invalid={errors.applicantEmail ? "true" : "false"}
                    aria-describedby={errors.applicantEmail ? "applicantEmail-error" : undefined}
                    className={cn(inputBaseClasses, fieldBorder(errors.applicantEmail))}
                    {...register("applicantEmail", applyNowRules.applicantEmail)}
                  />
                </div>
                {errors.applicantEmail && (
                  <ErrorMessage id="applicantEmail-error">{errors.applicantEmail.message}</ErrorMessage>
                )}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Phone */}
              <div>
                <label htmlFor="applicantPhone" className="mb-2 block text-sm font-semibold text-secondary">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiPhone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/40" aria-hidden="true" />
                  <input
                    id="applicantPhone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    aria-invalid={errors.applicantPhone ? "true" : "false"}
                    aria-describedby={errors.applicantPhone ? "applicantPhone-error" : undefined}
                    className={cn(inputBaseClasses, fieldBorder(errors.applicantPhone))}
                    {...register("applicantPhone", applyNowRules.applicantPhone)}
                  />
                </div>
                {errors.applicantPhone && (
                  <ErrorMessage id="applicantPhone-error">{errors.applicantPhone.message}</ErrorMessage>
                )}
              </div>

              {/* Position */}
              <div>
                <label htmlFor="position" className="mb-2 block text-sm font-semibold text-secondary">
                  Position Applying For <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiBriefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/40" aria-hidden="true" />
                  <select
                    id="position"
                    defaultValue=""
                    aria-invalid={errors.position ? "true" : "false"}
                    aria-describedby={errors.position ? "position-error" : undefined}
                    className={cn(
                      "w-full appearance-none rounded-lg border bg-white py-3 pl-11 pr-4 text-sm text-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-700/10",
                      fieldBorder(errors.position)
                    )}
                    {...register("position", applyNowRules.position)}
                  >
                    <option value="" disabled>
                      Select a position
                    </option>
                    {positions.map((position) => (
                      <option key={position.title} value={position.title}>
                        {position.title}
                        {position.isActive === false ? " (Closed)" : ""}
                      </option>
                    ))}
                    <option value="General Application">General Application</option>
                  </select>
                </div>
                {errors.position && <ErrorMessage id="position-error">{errors.position.message}</ErrorMessage>}
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label htmlFor="resume" className="mb-2 block text-sm font-semibold text-secondary">
                Upload Resume <span className="text-red-500">*</span>
              </label>
              <label
                htmlFor="resume"
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-brand-50/40 px-4 py-8 text-center transition-colors duration-200 hover:border-brand-700 hover:bg-brand-50",
                  errors.resume ? "border-red-300" : "border-secondary/20"
                )}
              >
                {resumeFile ? (
                  <>
                    <FiFile className="h-6 w-6 text-brand-700" aria-hidden="true" />
                    <span className="text-sm font-medium text-secondary">{resumeFile.name}</span>
                    <span className="text-xs text-secondary/50">Click to choose a different file</span>
                  </>
                ) : (
                  <>
                    <FiUploadCloud className="h-6 w-6 text-brand-700" aria-hidden="true" />
                    <span className="text-sm font-medium text-secondary">
                      Click to upload your resume
                    </span>
                    <span className="text-xs text-secondary/50">PDF or Word, up to 5MB</span>
                  </>
                )}
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="sr-only"
                  aria-invalid={errors.resume ? "true" : "false"}
                  aria-describedby={errors.resume ? "resume-error" : undefined}
                  {...register("resume", applyNowRules.resume)}
                />
              </label>
              {errors.resume && <ErrorMessage id="resume-error">{errors.resume.message}</ErrorMessage>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
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
                Thank you! Your application has been received.
              </motion.p>
            )}

            {submitError && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-sm font-medium text-red-600"
                role="alert"
              >
                <FiAlertCircle className="h-4 w-4" aria-hidden="true" />
                {submitError}
              </motion.p>
            )}
          </form>
        </motion.div>
      </Container>
    </section>
  );
};
