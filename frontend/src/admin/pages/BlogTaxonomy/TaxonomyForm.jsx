import { useState } from "react";

import { ApiError } from "../../../shared/api/client";
import { Button } from "../../components/Button";
import { Drawer } from "../../components/Drawer";
import { TextAreaField, TextField } from "../../components/form/Field";
import { MediaPicker } from "../../components/MediaPicker";
import { slugify } from "../../utils/slugify";
import { useToast } from "../../toast/useToast";

// Shared create/edit drawer for Blog Categories/Tags/Authors - the three
// really are near-identical (name+slug, optionally description/avatar/
// designation+bio), so one configurable form replaces three
// copy-pasted ones. `fields` controls which optional inputs render.
export function TaxonomyForm({ open, initial, onClose, onSaved, api, entityName, fields }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(() => ({
    name: initial?.name || "",
    slug: initial?.slug || "",
    description: initial?.description || "",
    designation: initial?.designation || "",
    bio: initial?.bio || "",
  }));
  const [avatar, setAvatar] = useState(() =>
    initial?.avatarMediaId ? { mediaId: initial.avatarMediaId, url: initial.avatarUrl } : null
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleNameChange = (value) => {
    setField("name", value);
    if (!slugTouched) setField("slug", slugify(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const payload = { name: form.name, slug: form.slug };
      if (fields.description) payload.description = form.description;
      if (fields.avatar) payload.avatarMediaId = avatar?.mediaId || null;
      if (fields.designation) payload.designation = form.designation;
      if (fields.bio) payload.bio = form.bio;

      if (initial) {
        await api.update(initial.id, payload);
        showToast(`${entityName} updated.`);
      } else {
        await api.create(payload);
        showToast(`${entityName} created.`);
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
    <Drawer open={open} title={initial ? `Edit ${entityName}` : `Add ${entityName}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.avatar ? <MediaPicker label="Avatar" value={avatar} onChange={setAvatar} /> : null}
        <TextField id="tx-name" label="Name" required value={form.name} error={errors.name} onChange={(e) => handleNameChange(e.target.value)} />
        <TextField
          id="tx-slug"
          label="Slug"
          required
          value={form.slug}
          error={errors.slug}
          onChange={(e) => { setSlugTouched(true); setField("slug", e.target.value); }}
        />
        {fields.designation ? (
          <TextField id="tx-designation" label="Designation" value={form.designation} error={errors.designation} onChange={(e) => setField("designation", e.target.value)} />
        ) : null}
        {fields.bio ? (
          <TextAreaField id="tx-bio" label="Bio" value={form.bio} error={errors.bio} onChange={(e) => setField("bio", e.target.value)} />
        ) : null}
        {fields.description ? (
          <TextAreaField id="tx-description" label="Description" value={form.description} error={errors.description} onChange={(e) => setField("description", e.target.value)} />
        ) : null}
        <div className="flex justify-end gap-2 border-t border-secondary/10 pt-4">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Save</Button>
        </div>
      </form>
    </Drawer>
  );
}
