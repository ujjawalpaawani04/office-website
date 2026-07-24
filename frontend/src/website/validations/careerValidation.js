import { EMAIL_PATTERN, INDIAN_MOBILE_PATTERN } from "./patterns";

export const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB

export const applyNowRules = {
  applicantName: {
    required: "Please enter your full name.",
    minLength: { value: 3, message: "Name must be at least 3 characters." },
  },
  applicantEmail: {
    required: "Please enter your email address.",
    pattern: EMAIL_PATTERN,
  },
  applicantPhone: {
    required: "Please enter your phone number.",
    pattern: INDIAN_MOBILE_PATTERN,
  },
  position: {
    required: "Please select a position.",
  },
  resume: {
    required: "Please upload your resume.",
    validate: {
      fileSize: (files) =>
        !files?.[0] || files[0].size <= MAX_RESUME_SIZE || "File must be under 5MB.",
    },
  },
};
