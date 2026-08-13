// Client-side rules for the forgot-password/reset-password pages. Mirrors
// (but is only a UX courtesy for) the server-side checks in
// backend/app/validations/auth_validator.py - the backend remains the
// source of truth.
export const forgotPasswordRules = {
  email: {
    required: "Email is required.",
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." },
  },
};

const UPPER = /[A-Z]/;
const LOWER = /[a-z]/;
const DIGIT = /\d/;
const SPECIAL = /[^A-Za-z0-9]/;

export function getPasswordStrengthError(password) {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!UPPER.test(password)) return "Password must include at least one uppercase letter.";
  if (!LOWER.test(password)) return "Password must include at least one lowercase letter.";
  if (!DIGIT.test(password)) return "Password must include at least one number.";
  if (!SPECIAL.test(password)) return "Password must include at least one special character.";
  return null;
}

export const resetPasswordRules = {
  newPassword: {
    required: "New password is required.",
    validate: (value) => getPasswordStrengthError(value) || true,
  },
  confirmPassword: (getNewPassword) => ({
    required: "Please confirm your new password.",
    validate: (value) => value === getNewPassword() || "Passwords do not match.",
  }),
};

// Scored 0-4 for the strength indicator (length + 4 character classes,
// length only counts once it clears the 8-char minimum).
export function scorePasswordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (UPPER.test(password)) score += 1;
  if (LOWER.test(password)) score += 1;
  if (DIGIT.test(password)) score += 1;
  if (SPECIAL.test(password)) score += 1;
  return Math.min(score, 4);
}

export function maskEmail(email) {
  const [local, domain] = (email || "").split("@");
  if (!local || !domain) return email || "";
  const visible = local.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(local.length - 1, 3))}@${domain}`;
}
