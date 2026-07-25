import { useState } from "react";
import { FiStar } from "react-icons/fi";

import { ApiError } from "../../../shared/api/client";
import { testimonialsApi } from "../../api/testimonialsApi";
import { Button } from "../../components/Button";
import { Drawer } from "../../components/Drawer";
import { TextAreaField, TextField, ToggleField } from "../../components/form/Field";
import { MediaPicker } from "../../components/MediaPicker";
import { useToast } from "../../toast/useToast";

function formFromInitial(initial) {
  if (!initial) {
    return { clientName: "", clientDesignation: "", clientCompany: "", content: "", rating: 5, isFeatured: false, isActive: true };
  }
  return {
    clientName: initial.clientName || "",
    clientDesignation: initial.clientDesignation || "",
    clientCompany: initial.clientCompany || "",
    content: initial.content || "",
    rating: initial.rating ?? 5,
    isFeatured: initial.isFeatured,
    isActive: initial.isActive,
  };
}

function StarRating({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`}>
          <FiStar className={`h-5 w-5 ${n <= value ? "text-gold-500" : "text-secondary/20"}`} />
        </button>
      ))}
    </div>
  );
}

// Remount via `key` on the caller's edited-record id/"create" so this
// re-initializes from a fresh `initial` without needing an effect - see
// TeamMemberForm.jsx for why.
export function TestimonialForm({ open, initial, onClose, onSaved }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(() => formFromInitial(initial));
  const [photo, setPhoto] = useState(() =>
    initial?.photoMediaId ? { mediaId: initial.photoMediaId, url: initial.photoUrl } : null
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const payload = { ...form, photoMediaId: photo?.mediaId || null };
      if (initial) {
        await testimonialsApi.update(initial.id, payload);
        showToast("Testimonial updated.");
      } else {
        await testimonialsApi.create(payload);
        showToast("Testimonial created.");
      }
      onSaved();
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setErrors(err.body?.fields || {});
      } else {
        showToast(err instanceof ApiError ? err.message : "Could not save.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer open={open} title={initial ? "Edit Testimonial" : "Add Testimonial"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <MediaPicker label="Client Photo" value={photo} onChange={setPhoto} />
        <TextField
          id="t-name"
          label="Client Name"
          required
          value={form.clientName}
          error={errors.clientName}
          onChange={(e) => setField("clientName", e.target.value)}
        />
        <TextField
          id="t-designation"
          label="Designation"
          value={form.clientDesignation}
          error={errors.clientDesignation}
          onChange={(e) => setField("clientDesignation", e.target.value)}
        />
        <TextField
          id="t-company"
          label="Company"
          value={form.clientCompany}
          error={errors.clientCompany}
          onChange={(e) => setField("clientCompany", e.target.value)}
        />
        <TextAreaField
          id="t-content"
          label="Testimonial"
          required
          value={form.content}
          error={errors.content}
          onChange={(e) => setField("content", e.target.value)}
        />
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-secondary/70">Rating</p>
          <StarRating value={form.rating} onChange={(v) => setField("rating", v)} />
        </div>
        <ToggleField
          id="t-featured"
          label="Featured"
          description="Included in the homepage carousel"
          checked={form.isFeatured}
          onChange={(v) => setField("isFeatured", v)}
        />
        <ToggleField
          id="t-active"
          label="Active"
          description="Visible on the public site"
          checked={form.isActive}
          onChange={(v) => setField("isActive", v)}
        />
        <div className="flex justify-end gap-2 border-t border-secondary/10 pt-4">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
