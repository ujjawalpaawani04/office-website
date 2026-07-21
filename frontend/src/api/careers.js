import { apiFetch } from "./client";

export function getJobOpenings() {
  return apiFetch("/careers/openings");
}

export function submitJobApplication({ name, email, mobile, position, coverLetter, resume }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("mobile", mobile);
  formData.append("position", position);
  if (coverLetter) formData.append("coverLetter", coverLetter);
  formData.append("resume", resume);

  return apiFetch("/careers/applications", { method: "POST", body: formData });
}
