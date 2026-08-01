import { apiFetch } from "../../shared/api/client";

export function getArticles() {
  return apiFetch("/articles");
}
