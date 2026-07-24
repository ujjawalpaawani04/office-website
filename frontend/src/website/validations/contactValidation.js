import { EMAIL_PATTERN, INDIAN_MOBILE_PATTERN } from "./patterns";

export const contactFormRules = {
  fullName: {
    required: "Please enter your full name.",
    minLength: { value: 3, message: "Name must be at least 3 characters." },
  },
  email: {
    required: "Please enter your email address.",
    pattern: EMAIL_PATTERN,
  },
  phone: {
    required: "Please enter your mobile number.",
    pattern: INDIAN_MOBILE_PATTERN,
  },
  service: {
    required: "Please select a service.",
  },
  message: {
    required: "Please enter a message.",
    minLength: { value: 20, message: "Message must be at least 20 characters." },
  },
  privacy: {
    required: "You must agree to the Privacy Policy.",
  },
};

export const otherServiceRule = (isOtherService) => ({
  required: isOtherService ? "Please specify your required service." : false,
});
