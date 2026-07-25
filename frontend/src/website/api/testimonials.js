import { apiFetch } from "../../shared/api/client";

export function getTestimonials() {
  return apiFetch("/testimonials");
}
