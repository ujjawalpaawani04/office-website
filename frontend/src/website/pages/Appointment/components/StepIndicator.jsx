import { FiCheck } from "react-icons/fi";
import { cn } from "../../../../shared/utils/cn";

const STEPS = ["Select Service", "Choose Date & Time", "Enter Your Details", "Confirm Appointment"];

export const StepIndicator = ({ currentStep }) => {
  return (
    <ol className="mx-auto flex max-w-3xl items-start justify-between">
      {STEPS.map((label, i) => {
        const stepNumber = i + 1;
        const isComplete = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        return (
          <li key={label} className="flex flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <span
                aria-hidden="true"
                className={cn(
                  "h-0.5 flex-1",
                  i === 0 ? "invisible" : isComplete || isCurrent ? "bg-brand-700" : "bg-brand-700/15"
                )}
              />
              <span
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors duration-300",
                  isComplete
                    ? "border-brand-700 bg-brand-700 text-white"
                    : isCurrent
                      ? "border-brand-700 bg-white text-brand-700"
                      : "border-brand-700/20 bg-white text-black/40"
                )}
              >
                {isComplete ? <FiCheck className="h-4 w-4" aria-hidden="true" /> : stepNumber}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "h-0.5 flex-1",
                  i === STEPS.length - 1 ? "invisible" : isComplete ? "bg-brand-700" : "bg-brand-700/15"
                )}
              />
            </div>
            <span
              className={cn(
                "mt-2 max-w-[6.5rem] text-[11px] font-semibold uppercase tracking-wide sm:text-xs",
                isCurrent || isComplete ? "text-brand-700" : "text-black/40"
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
};
