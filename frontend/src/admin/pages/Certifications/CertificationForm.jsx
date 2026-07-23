import { useState } from "react";

import { ApiError } from "../../../api/client";
import { certificationsApi } from "../../api/certificationsApi";
import { Button } from "../../components/Button";
import { Drawer } from "../../components/Drawer";
import { TextAreaField, TextField, ToggleField } from "../../components/form/Field";
import { MediaPicker } from "../../components/MediaPicker";
import { useToast } from "../../toast/useToast";

function formFromInitial(initial) {
  if (!initial) return { name: "", description: "", issuingBody: "", sortOrder: 0, isActive: true };
  return {
    name: initial.name || "",
    description: initial.description || "",
    issuingBody: initial.issuingBody || "",
    sortOrder: initial.sortOrder ?? 0,
    isActive: initial.isActive,
  };
}

export function CertificationForm({ open, initial, onClose, onSaved }) {
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
        await certificationsApi.update(initial.id, payload);
        showToast("Certification updated.");
      } else {
        await certificationsApi.create(payload);
        showToast("Certification created.");
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
    <Drawer open={open} title={initial ? "Edit Certification" : "Add Certification"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <MediaPicker label="Badge Image" value={image} onChange={setImage} />
        <TextField id="cert-name" label="Name" required value={form.name} error={errors.name} onChange={(e) => setField("name", e.target.value)} />
        <TextField id="cert-issuer" label="Issuing Body" value={form.issuingBody} error={errors.issuingBody} onChange={(e) => setField("issuingBody", e.target.value)} />
        <TextAreaField id="cert-description" label="Description" value={form.description} error={errors.description} onChange={(e) => setField("description", e.target.value)} />
        <TextField id="cert-sort" label="Sort Order" type="number" value={form.sortOrder} error={errors.sortOrder} onChange={(e) => setField("sortOrder", e.target.value)} />
        <ToggleField id="cert-active" label="Active" checked={form.isActive} onChange={(v) => setField("isActive", v)} />
        <div className="flex justify-end gap-2 border-t border-secondary/10 pt-4">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Save</Button>
        </div>
      </form>
    </Drawer>
  );
}
