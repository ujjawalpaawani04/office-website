import { apiFetch } from "../../shared/api/client";

export function submitEnquiry({ fullName, email, phone, company, city, service, otherService, message }) {
  const resolvedService = service === "Other" ? otherService : service;

  const contextLines = [];
  if (company) contextLines.push(`Company: ${company}`);
  if (city) contextLines.push(`City: ${city}`);
  const fullMessage = contextLines.length ? `${contextLines.join(" | ")}\n\n${message}` : message;

  return apiFetch("/enquiries", {
    method: "POST",
    body: { name: fullName, email, phone, service: resolvedService, message: fullMessage },
  });
}
