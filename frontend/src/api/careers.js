import { apiFetch } from "./client";

export function getJobOpenings({ all = false } = {}) {
  return apiFetch(`/careers/openings${all ? "?all=true" : ""}`);
}

export function submitJobApplication({ name, email, phone, position, experience, message, resume }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("position", position);
  if (experience) formData.append("experience", experience);
  if (message) formData.append("message", message);
  formData.append("resume", resume);

  return apiFetch("/careers/applications", { method: "POST", body: formData });
}
