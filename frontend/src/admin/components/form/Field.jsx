import { cn } from "../../../utils/cn";

const inputBase =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-secondary placeholder-secondary/40 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-700/15";
const borderFor = (hasError) => (hasError ? "border-red-300 focus:border-red-400" : "border-secondary/15 focus:border-brand-700");

function FieldWrapper({ label, error, htmlFor, required, children }) {
  return (
    <div>
      {label ? (
        <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-secondary/70">
          {label} {required ? <span className="text-red-500">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({ label, error, required, id, ...props }) {
  return (
    <FieldWrapper label={label} error={error} htmlFor={id} required={required}>
      <input
        id={id}
        aria-invalid={error ? "true" : "false"}
        className={cn(inputBase, borderFor(error))}
        {...props}
      />
    </FieldWrapper>
  );
}

export function TextAreaField({ label, error, required, id, rows = 4, ...props }) {
  return (
    <FieldWrapper label={label} error={error} htmlFor={id} required={required}>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? "true" : "false"}
        className={cn(inputBase, borderFor(error))}
        {...props}
      />
    </FieldWrapper>
  );
}

export function SelectField({ label, error, required, id, children, ...props }) {
  return (
    <FieldWrapper label={label} error={error} htmlFor={id} required={required}>
      <select id={id} aria-invalid={error ? "true" : "false"} className={cn(inputBase, borderFor(error))} {...props}>
        {children}
      </select>
    </FieldWrapper>
  );
}

export function ToggleField({ label, description, checked, onChange, id }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
      <span className="relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors" data-checked={checked}>
        <input
          id={id}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="absolute inset-0 rounded-full bg-secondary/20 transition-colors peer-checked:bg-brand-700" />
        <span className="relative h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-[18px]" />
      </span>
      <span>
        <span className="block text-sm font-medium text-secondary">{label}</span>
        {description ? <span className="block text-xs text-secondary/50">{description}</span> : null}
      </span>
    </label>
  );
}
