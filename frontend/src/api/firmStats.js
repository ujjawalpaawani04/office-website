import { apiFetch } from "./client";

export function getFirmStats() {
  return apiFetch("/firm-stats");
}

export function getAwards() {
  return apiFetch("/awards");
}

export function getCertifications() {
  return apiFetch("/certifications");
}
