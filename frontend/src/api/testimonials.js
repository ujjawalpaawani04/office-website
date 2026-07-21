import { apiFetch } from "./client";

export function getTestimonials() {
  return apiFetch("/testimonials");
}
