import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { FiAlertCircle, FiEye, FiEyeOff, FiLoader, FiLock, FiMail } from "react-icons/fi";

import { cn } from "../../../utils/cn";
import { ApiError } from "../../../api/client";
import { useAuth } from "../../auth/useAuth";

const inputBaseClasses =
  "w-full rounded-lg border bg-white py-3 pl-11 pr-11 text-sm text-secondary placeholder-secondary/40 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-700/15";

const fieldBorder = (hasError) =>
  hasError ? "border-red-300 focus:border-red-400" : "border-secondary/15 focus:border-brand-700";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (values) => {
    setFormError(null);
    try {
      await login(values.email.trim().toLowerCase(), values.password);
      const redirectTo = location.state?.from?.pathname || "/admin";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        setFormError("Too many attempts. Please try again in a few minutes.");
      } else if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        setFormError(error.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/[0.03] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 text-lg font-display font-bold text-white">
            SA
          </div>
          <h1 className="font-display text-xl font-semibold text-secondary">Admin Panel</h1>
          <p className="mt-1 text-sm text-secondary/60">Singh Amit &amp; Associates</p>
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
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary/70">
              Email
            </label>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/40" aria-hidden="true" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={cn(inputBaseClasses, fieldBorder(errors.email))}
                {...register("email", {
                  required: "Email is required.",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." },
                })}
              />
            </div>
            {errors.email ? (
              <p id="email-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary/70">
              Password
            </label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/40" aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={cn(inputBaseClasses, fieldBorder(errors.password))}
                {...register("password", { required: "Password is required." })}
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
            {errors.password ? (
              <p id="password-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.password.message}
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
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
