import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FiAlertCircle, FiArrowLeft, FiLoader } from "react-icons/fi";

import { ApiError } from "../../../shared/api/client";
import { resendOtp, verifyOtp } from "../../api/authApi";
import { maskEmail } from "../../validations/passwordResetValidation";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const inputRefs = useRef([]);

  // No email in state means this page was reached directly (URL bar,
  // refresh, back button after the flow finished) rather than via a
  // successful forgot-password submission - nothing to verify, so send the
  // admin back to start over instead of showing a broken form.
  useEffect(() => {
    if (!email) {
      navigate("/admin/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((prev) => Math.max(prev - 1, 0)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  if (!email) return null;

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
  };

  const setDigit = (index, value) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleChange = (index, rawValue) => {
    const value = rawValue.replace(/\D/g, "").slice(-1);
    setDigit(index, value);
    if (value && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < OTP_LENGTH; i += 1) {
        next[i] = pasted[i] || next[i] || "";
      }
      return next;
    });
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const submitOtp = async (otp) => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      const data = await verifyOtp(email, otp);
      navigate("/admin/reset-password", { state: { email, resetToken: data.resetToken } });
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        setFormError("Too many attempts. Please try again in a few minutes.");
      } else {
        setFormError("Invalid or expired code. Please try again.");
      }
      setDigits(Array(OTP_LENGTH).fill(""));
      focusInput(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const otp = digits.join("");
    if (otp.length !== OTP_LENGTH) {
      setFormError("Enter the 6-digit code.");
      return;
    }
    submitOtp(otp);
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setFormError(null);
    setIsResending(true);
    try {
      await resendOtp(email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(""));
      focusInput(0);
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        setFormError(error.body?.error || "Please wait before requesting another code.");
        if (error.body?.retryAfterSeconds) setCooldown(error.body.retryAfterSeconds);
      } else if (error instanceof ApiError && error.status === 404) {
        setFormError(error.message || "This email is not registered as an admin.");
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/[0.03] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 text-lg font-display font-bold text-white">
            SA
          </div>
          <h1 className="font-display text-xl font-semibold text-secondary">Verify OTP</h1>
          <p className="mt-1 text-sm text-secondary/60">
            OTP sent to <span className="font-medium text-secondary">{maskEmail(email)}</span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-secondary/10 bg-white p-6 shadow-sm"
        >
          {formError ? (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
            >
              <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{formError}</span>
            </div>
          ) : null}

          <div className="mb-6 flex justify-between gap-2" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                autoFocus={index === 0}
                aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
                value={digit}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                className="h-12 w-11 rounded-lg border border-secondary/15 bg-white text-center text-lg font-semibold text-secondary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-700/15 focus:border-brand-700"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="h-4 w-4 animate-spin" aria-hidden="true" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>

          <div className="mt-4 text-center text-sm">
            {cooldown > 0 ? (
              <span className="text-secondary/50">Resend OTP in {cooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="font-medium text-brand-700 hover:text-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            )}
          </div>

          <Link
            to="/admin/forgot-password"
            className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-secondary/60 hover:text-brand-700"
          >
            <FiArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back
          </Link>
        </form>
      </div>
    </div>
  );
}
