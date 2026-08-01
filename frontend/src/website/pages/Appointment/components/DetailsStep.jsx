import { FiUploadCloud, FiX } from "react-icons/fi";

const inputClasses =
  "w-full px-4 py-2.5 rounded-lg border bg-white text-black placeholder-secondary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-700/10";

const fieldClass = (hasError) =>
  `${inputClasses} ${hasError ? "border-red-400 focus:border-red-400" : "border-brand-700/20 focus:border-brand-700"}`;

const MAX_DOCUMENT_MB = 5;

export const DetailsStep = ({ values, errors, onChange, onFileChange }) => {
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    onChange(name, type === "checkbox" ? checked : value);
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0] || null;
    if (file && file.size > MAX_DOCUMENT_MB * 1024 * 1024) {
      onFileChange(null, `File must be under ${MAX_DOCUMENT_MB}MB.`);
      event.target.value = "";
      return;
    }
    onFileChange(file, null);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-700">Your Details</h3>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="d-name" className="mb-2 block text-sm font-semibold text-black">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="d-name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            placeholder="Your name"
            className={fieldClass(errors.name)}
          />
          {errors.name && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="d-phone" className="mb-2 block text-sm font-semibold text-black">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            id="d-phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            placeholder="9XXXXXXXXX"
            className={fieldClass(errors.phone)}
          />
          {errors.phone && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="d-email" className="mb-2 block text-sm font-semibold text-black">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="d-email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={fieldClass(errors.email)}
          />
          {errors.email && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="d-business" className="mb-2 block text-sm font-semibold text-black">
            Business / Firm Name <span className="font-normal text-black/50">(optional)</span>
          </label>
          <input
            id="d-business"
            name="businessName"
            type="text"
            value={values.businessName}
            onChange={handleChange}
            placeholder="If applicable"
            className={fieldClass(false)}
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-semibold text-black">Existing Client?</span>
          <div className="flex gap-3">
            {[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  values.isExistingClient === opt.value
                    ? "border-brand-700 bg-brand-700/5 text-brand-700"
                    : "border-brand-700/20 text-black/70 hover:border-brand-700/40"
                }`}
              >
                <input
                  type="radio"
                  name="isExistingClient"
                  value={opt.value}
                  checked={values.isExistingClient === opt.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="d-alt-contact" className="mb-2 block text-sm font-semibold text-black">
            Alternate Contact Number <span className="font-normal text-black/50">(optional)</span>
          </label>
          <input
            id="d-alt-contact"
            name="alternateContact"
            type="tel"
            value={values.alternateContact}
            onChange={handleChange}
            placeholder="9XXXXXXXXX"
            className={fieldClass(errors.alternateContact)}
          />
          {errors.alternateContact && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.alternateContact}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="d-requirement" className="mb-2 block text-sm font-semibold text-black">
          Brief Description of Requirement <span className="text-red-500">*</span>
        </label>
        <textarea
          id="d-requirement"
          name="requirementDescription"
          value={values.requirementDescription}
          onChange={handleChange}
          rows={4}
          placeholder="Tell us what you'd like to discuss"
          className={`${fieldClass(errors.requirementDescription)} resize-none`}
        />
        {errors.requirementDescription && (
          <p className="mt-1.5 text-xs font-medium text-red-600">{errors.requirementDescription}</p>
        )}
      </div>

      <div>
        <span className="mb-2 block text-sm font-semibold text-black">
          Supporting Document <span className="font-normal text-black/50">(optional)</span>
        </span>
        {values.document ? (
          <div className="flex items-center justify-between rounded-lg border border-brand-700/20 bg-brand-50/40 px-4 py-3">
            <span className="truncate text-sm text-black">{values.document.name}</span>
            <button
              type="button"
              onClick={() => onFileChange(null, null)}
              aria-label="Remove file"
              className="ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-black/50 hover:bg-black/5 hover:text-black"
            >
              <FiX className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="d-document"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-brand-700/30 bg-brand-50/30 px-4 py-6 text-center transition-colors hover:border-brand-700/50"
          >
            <FiUploadCloud className="h-6 w-6 text-brand-700/70" aria-hidden="true" />
            <span className="text-sm font-medium text-black/70">Click to upload (PDF, Word or image, max {MAX_DOCUMENT_MB}MB)</span>
            <input id="d-document" type="file" onChange={handleFile} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="sr-only" />
          </label>
        )}
        {errors.document && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.document}</p>}
        <p className="mt-2 text-xs leading-relaxed text-black/50">
          Please avoid uploading unnecessary confidential financial documents. Additional documents may be requested
          separately if required for the consultation.
        </p>
      </div>

      <label className="flex items-start gap-3 rounded-lg border border-brand-700/15 bg-brand-50/30 p-4">
        <input
          type="checkbox"
          name="consentGiven"
          checked={values.consentGiven}
          onChange={handleChange}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-brand-700/40 text-brand-700 focus:ring-brand-700/30"
        />
        <span className="text-sm text-black/80">
          I agree to be contacted regarding this appointment request and confirm that the information provided is
          accurate. <span className="text-red-500">*</span>
        </span>
      </label>
      {errors.consentGiven && <p className="text-xs font-medium text-red-600">{errors.consentGiven}</p>}
    </div>
  );
};
