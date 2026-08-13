import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { FiAlertCircle, FiCheckCircle, FiEye, FiEyeOff, FiLoader, FiLock } from "react-icons/fi";

import { cn } from "../../../shared/utils/cn";
import { ApiError } from "../../../shared/api/client";
import { resetPassword } from "../../api/authApi";
import { resetPasswordRules, scorePasswordStrength } from "../../validations/passwordResetValidation";

const inputBaseClasses =
  "w-full rounded-lg border bg-white py-3 pl-11 pr-11 text-sm text-secondary placeholder-secondary/40 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-700/15";

const fieldBorder = (hasError) =>
  hasError ? "border-red-300 focus:border-red-400" : "border-secondary/15 focus:border-brand-700";

const STRENGTH_LABELS = ["Weak", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["bg-red-400", "bg-red-400", "bg-amber-400", "bg-brand-500", "bg-green-500"];

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const resetToken = location.state?.resetToken;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [isDone, setIsDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const newPassword = watch("newPassword") || "";
  const strength = scorePasswordStrength(newPassword);

  // Reached directly (no resetToken in state) - nothing to submit against,
  // send the admin back to start the flow over.
  useEffect(() => {
    if (!email || !resetToken) {
      navigate("/admin/forgot-password", { replace: true });
    }
  }, [email, resetToken, navigate]);

  if (!email || !resetToken) return null;

  const onSubmit = async (values) => {
    setFormError(null);
    try {
      await resetPassword(email, resetToken, values.newPassword);
      setIsDone(true);
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        setFormError("Too many attempts. Please try again in a few minutes.");
      } else if (error instanceof ApiError && error.status === 422) {
        setFormError(error.body?.fields?.newPassword || "Please choose a stronger password.");
      } else {
        setFormError("This reset session has expired. Please start again.");
      }
    }
  };

  if (isDone) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/[0.03] px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-secondary/10 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
              <FiCheckCircle className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="font-display text-xl font-semibold text-secondary">Password Reset Successful</h1>
            <p className="mt-2 text-sm text-secondary/60">
              Your password has been updated successfully. You can now log in with your new password.
            </p>
            <button
              type="button"
              onClick={() => navigate("/admin/login", { replace: true })}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-brand-800"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/[0.03] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 text-lg font-display font-bold text-white">
            SA
          </div>
          <h1 className="font-display text-xl font-semibold text-secondary">Create New Password</h1>
          <p className="mt-1 text-sm text-secondary/60">Choose a strong password for your admin account.</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
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

          <div className="mb-4">
            <label htmlFor="newPassword" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary/70">
              New Password
            </label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/40" aria-hidden="true" />
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                aria-invalid={errors.newPassword ? "true" : "false"}
                className={cn(inputBaseClasses, fieldBorder(errors.newPassword))}
                {...register("newPassword", resetPasswordRules.newPassword)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary/70"
              >
                {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              </button>
            </div>
            {newPassword ? (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn("h-1 flex-1 rounded-full", i < strength ? STRENGTH_COLORS[strength] : "bg-secondary/10")}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-secondary/50">{STRENGTH_LABELS[strength]}</p>
              </div>
            ) : null}
            {errors.newPassword ? (
              <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.newPassword.message}
              </p>
            ) : null}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary/70">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/40" aria-hidden="true" />
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                className={cn(inputBaseClasses, fieldBorder(errors.confirmPassword))}
                {...register("confirmPassword", resetPasswordRules.confirmPassword(() => getValues("newPassword")))}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary/70"
              >
                {showConfirm ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword ? (
              <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="h-4 w-4 animate-spin" aria-hidden="true" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
