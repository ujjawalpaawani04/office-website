import { apiFetch } from "./client";

export function submitEnquiry({ fullName, email, phone, company, city, service, otherService, message }) {
  const subject = service === "Other" ? otherService : service;

  const contextLines = [];
  if (company) contextLines.push(`Company: ${company}`);
  if (city) contextLines.push(`City: ${city}`);
  const fullMessage = contextLines.length ? `${contextLines.join(" | ")}\n\n${message}` : message;

  return apiFetch("/enquiries", {
    method: "POST",
    body: { name: fullName, email, mobile: phone, subject, message: fullMessage },
  });
}
