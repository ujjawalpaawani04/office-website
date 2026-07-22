import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

import { ApiError } from "../../../api/client";
import { servicesApi } from "../../api/servicesApi";
import { Button } from "../../components/Button";
import { Drawer } from "../../components/Drawer";
import { TextAreaField, TextField, ToggleField } from "../../components/form/Field";
import { MediaPicker } from "../../components/MediaPicker";
import { SITE_URL } from "../../config/env";
import { slugify } from "../../utils/slugify";
import { useToast } from "../../toast/useToast";

function formFromInitial(initial) {
  if (!initial) {
    return { name: "", slug: "", shortDescription: "", fullDescription: "", icon: "", sortOrder: 0, isActive: true, faqs: [] };
  }
  return {
    name: initial.name || "",
    slug: initial.slug || "",
    shortDescription: initial.shortDescription || "",
    fullDescription: initial.fullDescription || "",
    icon: initial.icon || "",
    sortOrder: initial.sortOrder ?? 0,
    isActive: initial.isActive,
    faqs: initial.faqs || [],
  };
}

export function ServiceForm({ open, initial, onClose, onSaved, onSuggestion }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(() => formFromInitial(initial));
  const [image, setImage] = useState(() => (initial?.featuredImageMediaId ? { mediaId: initial.featuredImageMediaId, url: initial.featuredImageUrl } : null));
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [faqDraft, setFaqDraft] = useState({ question: "", answer: "" });
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState([]);
  const [saving, setSaving] = useState(false);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleNameChange = (value) => {
    setField("name", value);
    if (!slugTouched) setField("slug", slugify(value));
  };

  const addFaq = () => {
    if (!faqDraft.question.trim() || !faqDraft.answer.trim()) return;
    setField("faqs", [...form.faqs, faqDraft]);
    setFaqDraft({ question: "", answer: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setWarnings([]);
    try {
      const payload = { ...form, featuredImageMediaId: image?.mediaId || null };
      const result = initial ? await servicesApi.update(initial.id, payload) : await servicesApi.create(payload);
      if (result.warnings) setWarnings(result.warnings);
      if (result.newsletterSuggestion?.shouldPrompt) {
        onSuggestion({
          ...result.newsletterSuggestion,
          subject: result.name,
          summary: result.shortDescription || result.name,
          ctaUrl: `${SITE_URL}/services/${result.slug}`,
          ctaLabel: "Learn More",
          sourceType: "service",
          sourceId: result.id,
        });
      }
      showToast(initial ? "Service updated." : "Service created.");
      onSaved();
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) setErrors(err.body?.fields || {});
      else showToast(err instanceof ApiError ? err.message : "Could not save.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer open={open} title={initial ? "Edit Service" : "Add Service"} onClose={onClose} widthClassName="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {warnings.map((w) => (
          <div key={w} role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-700">{w}</div>
        ))}
        <MediaPicker label="Featured Image" value={image} onChange={setImage} />
        <TextField id="svc-name" label="Name" required value={form.name} error={errors.name} onChange={(e) => handleNameChange(e.target.value)} />
        <TextField
          id="svc-slug"
          label="Slug"
          required
          value={form.slug}
          error={errors.slug}
          onChange={(e) => { setSlugTouched(true); setField("slug", e.target.value); }}
        />
        <TextAreaField id="svc-short" label="Short Description" rows={2} value={form.shortDescription} error={errors.shortDescription} onChange={(e) => setField("shortDescription", e.target.value)} />
        <TextAreaField id="svc-full" label="Full Description" rows={5} value={form.fullDescription} error={errors.fullDescription} onChange={(e) => setField("fullDescription", e.target.value)} />
        <TextField id="svc-icon" label="Icon" value={form.icon} error={errors.icon} onChange={(e) => setField("icon", e.target.value)} />
        <TextField id="svc-sort" label="Sort Order" type="number" value={form.sortOrder} error={errors.sortOrder} onChange={(e) => setField("sortOrder", e.target.value)} />
        <ToggleField id="svc-active" label="Active" checked={form.isActive} onChange={(v) => setField("isActive", v)} />

        <div className="rounded-xl border border-secondary/10 bg-white p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-secondary/70">FAQs</p>
          <ul className="mb-3 space-y-2">
            {form.faqs.map((faq, i) => (
              <li key={i} className="rounded-lg bg-secondary/5 px-3 py-2 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-secondary">{faq.question}</p>
                  <button type="button" onClick={() => setField("faqs", form.faqs.filter((_, idx) => idx !== i))} aria-label="Remove">
                    <FiX className="h-4 w-4 shrink-0 text-secondary/40" />
                  </button>
                </div>
                <p className="mt-0.5 text-secondary/60">{faq.answer}</p>
              </li>
            ))}
          </ul>
          <div className="space-y-2">
            <input
              value={faqDraft.question}
              onChange={(e) => setFaqDraft((prev) => ({ ...prev, question: e.target.value }))}
              placeholder="Question"
              className="w-full rounded-lg border border-secondary/15 px-3 py-2 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
            />
            <textarea
              value={faqDraft.answer}
              onChange={(e) => setFaqDraft((prev) => ({ ...prev, answer: e.target.value }))}
              placeholder="Answer"
              rows={2}
              className="w-full rounded-lg border border-secondary/15 px-3 py-2 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
            />
            <Button type="button" variant="secondary" onClick={addFaq}><FiPlus className="h-4 w-4" /> Add FAQ</Button>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-secondary/10 pt-4">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Save</Button>
        </div>
      </form>
    </Drawer>
  );
}
