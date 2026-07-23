import { useState } from "react";
import { subscribeToNewsletter } from "../api/newsletter";

// Shared submit logic for the newsletter signup form, which exists twice on
// the public site (Blog listing + Insights page). Centralizing it here
// keeps the two forms from silently drifting apart, as they already had
// once (one form called the real API, the other only faked a delay).
export function useNewsletterSubscribe() {
  const [status, setStatus] = useState(null); // "success" | "already" | "error" | null
  const [error, setError] = useState(null);

  const submit = async (email) => {
    setStatus(null);
    setError(null);
    try {
      const response = await subscribeToNewsletter(email);
      setStatus(response?.alreadySubscribed ? "already" : "success");
    } catch (err) {
      setStatus("error");
      setError(err?.message || "Something went wrong. Please try again.");
      throw err;
    }
  };

  return { status, error, submit };
}
