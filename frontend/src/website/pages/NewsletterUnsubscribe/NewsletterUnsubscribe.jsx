import { useState } from "react";
import { useParams } from "react-router-dom";
import { FiAlertCircle, FiCheckCircle, FiLoader, FiMail } from "react-icons/fi";
import { Container } from "../../components/common/Container";
import { unsubscribeFromNewsletter } from "../../api/newsletter";

// Reached from the "Unsubscribe" link in every newsletter email. Deliberately
// does nothing on page load - only the button click fires the actual
// mutation - so that email-security scanners which auto-visit every link in
// an inbound email (Outlook/Defender link prefetching is the classic case)
// can't silently mass-unsubscribe subscribers just by loading this page.
const NewsletterUnsubscribe = () => {
  const { token } = useParams();
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [message, setMessage] = useState(null);

  const handleUnsubscribe = async () => {
    setState("loading");
    try {
      const response = await unsubscribeFromNewsletter(token);
      setMessage(response?.message || "You have successfully unsubscribed from our newsletter.");
      setState("done");
    } catch (err) {
      setMessage(err.message || "This unsubscribe link is invalid or has expired.");
      setState("error");
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center bg-white py-20">
      <Container>
        <div className="mx-auto max-w-md rounded-2xl border border-secondary/10 bg-white p-8 text-center shadow-lg shadow-secondary/5">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-700/10 text-brand-700">
            <FiMail className="h-6 w-6" aria-hidden="true" />
          </span>

          {state === "idle" || state === "loading" ? (
            <>
              <h1 className="mt-4 font-display text-xl font-bold text-black">Unsubscribe from our newsletter?</h1>
              <p className="mt-2 text-sm leading-relaxed text-black/60">
                You'll stop receiving tax and compliance updates from Singh Amit &amp; Associates. You can
                resubscribe any time from our website.
              </p>
              <button
                type="button"
                onClick={handleUnsubscribe}
                disabled={state === "loading"}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {state === "loading" ? (
                  <>
                    <FiLoader className="h-4 w-4 animate-spin" aria-hidden="true" /> Unsubscribing...
                  </>
                ) : (
                  "Confirm Unsubscribe"
                )}
              </button>
            </>
          ) : (
            <>
              <h1 className="mt-4 font-display text-xl font-bold text-black">
                {state === "done" ? "You're unsubscribed" : "Something went wrong"}
              </h1>
              <p
                className={`mt-3 flex items-center justify-center gap-2 text-sm font-medium ${
                  state === "done" ? "text-green-600" : "text-red-600"
                }`}
                role={state === "done" ? "status" : "alert"}
              >
                {state === "done" ? (
                  <FiCheckCircle className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <FiAlertCircle className="h-4 w-4" aria-hidden="true" />
                )}
                {message}
              </p>
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default NewsletterUnsubscribe;
