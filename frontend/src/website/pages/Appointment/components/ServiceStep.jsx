import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../../../shared/utils/cn";
import { APPOINTMENT_SERVICES } from "../appointmentServices";
import { getBookableServices } from "../../../api/appointments";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.03 * i, ease: EASE },
  }),
};

export const ServiceStep = ({ selectedKey, onSelect }) => {
  const [bookableMap, setBookableMap] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getBookableServices()
      .then((data) => {
        if (cancelled) return;
        const map = {};
        (data || []).forEach((s) => {
          map[s.key] = s.isBookable;
        });
        setBookableMap(map);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-700">
        Which service do you need?
      </h3>

      {loadError && (
        <p className="mb-4 text-sm font-medium text-red-600" role="alert">
          Couldn't check which services are currently bookable. Please refresh and try again.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {APPOINTMENT_SERVICES.map((service, i) => {
          const Icon = service.icon;
          const isSelected = service.key === selectedKey;
          const isBookable = bookableMap ? bookableMap[service.key] : true;
          return (
            <motion.button
              key={service.key}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={bookableMap !== null && !isBookable}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={i}
              onClick={() => onSelect(service.key)}
              className={cn(
                "group relative flex items-start gap-3 rounded-2xl border bg-white p-5 text-left shadow-[0_4px_20px_-12px_rgba(1,24,24,0.15)] transition-all duration-300",
                bookableMap !== null && !isBookable
                  ? "cursor-not-allowed opacity-50"
                  : "hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-700/10",
                isSelected ? "border-brand-700 ring-1 ring-brand-700" : "border-brand-700/10 hover:border-brand-700/30"
              )}
            >
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                  isSelected ? "bg-brand-700 text-white" : "bg-brand-700/10 text-brand-700 group-hover:bg-brand-700 group-hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-[15px] font-bold text-black">{service.label}</span>
                  {bookableMap !== null && !isBookable && (
                    <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black/50">
                      Coming Soon
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-black/70">{service.description}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
