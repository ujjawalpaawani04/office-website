import { useState } from "react";

import { ApiError } from "../../../api/client";
import { awardsApi } from "../../api/awardsApi";
import { Button } from "../../components/Button";
import { Drawer } from "../../components/Drawer";
import { TextAreaField, TextField, ToggleField } from "../../components/form/Field";
import { MediaPicker } from "../../components/MediaPicker";
import { useToast } from "../../toast/useToast";

function formFromInitial(initial) {
  if (!initial) return { title: "", description: "", year: new Date().getFullYear(), sortOrder: 0, isActive: true };
  return {
    title: initial.title || "",
    description: initial.description || "",
    year: initial.year ?? new Date().getFullYear(),
    sortOrder: initial.sortOrder ?? 0,
    isActive: initial.isActive,
  };
}

export function AwardForm({ open, initial, onClose, onSaved }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(() => formFromInitial(initial));
  const [image, setImage] = useState(() => (initial?.imageMediaId ? { mediaId: initial.imageMediaId, url: initial.imageUrl } : null));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const payload = { ...form, imageMediaId: image?.mediaId || null };
      if (initial) {
        await awardsApi.update(initial.id, payload);
        showToast("Award updated.");
      } else {
        await awardsApi.create(payload);
        showToast("Award created.");
      }
      onSaved();
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) setErrors(err.body?.fields || {});
      else showToast(err instanceof ApiError ? err.message : "Could not save.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer open={open} title={initial ? "Edit Award" : "Add Award"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <MediaPicker label="Image" value={image} onChange={setImage} />
        <TextField id="aw-title" label="Title" required value={form.title} error={errors.title} onChange={(e) => setField("title", e.target.value)} />
        <TextAreaField id="aw-description" label="Description" value={form.description} error={errors.description} onChange={(e) => setField("description", e.target.value)} />
        <TextField id="aw-year" label="Year" type="number" value={form.year} error={errors.year} onChange={(e) => setField("year", e.target.value)} />
        <TextField id="aw-sort" label="Sort Order" type="number" value={form.sortOrder} error={errors.sortOrder} onChange={(e) => setField("sortOrder", e.target.value)} />
        <ToggleField id="aw-active" label="Active" description="Visible on the public About page" checked={form.isActive} onChange={(v) => setField("isActive", v)} />
        <div className="flex justify-end gap-2 border-t border-secondary/10 pt-4">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Save</Button>
        </div>
      </form>
    </Drawer>
  );
}
