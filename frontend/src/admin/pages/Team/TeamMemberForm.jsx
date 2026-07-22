import { useState } from "react";

import { ApiError } from "../../../api/client";
import { teamApi } from "../../api/teamApi";
import { Button } from "../../components/Button";
import { Drawer } from "../../components/Drawer";
import { TextAreaField, TextField, ToggleField } from "../../components/form/Field";
import { MediaPicker } from "../../components/MediaPicker";
import { slugify } from "../../utils/slugify";
import { useToast } from "../../toast/useToast";

function formFromInitial(initial) {
  if (!initial) {
    return {
      name: "",
      slug: "",
      designation: "",
      bio: "",
      qualifications: "",
      email: "",
      linkedinUrl: "",
      isActive: true,
    };
  }
  return {
    name: initial.name || "",
    slug: initial.slug || "",
    designation: initial.designation || "",
    bio: initial.bio || "",
    qualifications: initial.qualifications || "",
    email: initial.email || "",
    linkedinUrl: initial.linkedinUrl || "",
    isActive: initial.isActive,
  };
}

// Caller must remount this component (via a `key` keyed on the edited
// record's id, or a constant like "create") whenever `initial` changes -
// that's what makes the useState initializers below re-run with fresh
// values, instead of needing an effect to sync form state to a changed
// prop (see TeamMembers.jsx).
export function TeamMemberForm({ open, initial, onClose, onSaved }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(() => formFromInitial(initial));
  const [photo, setPhoto] = useState(() =>
    initial?.photoMediaId ? { mediaId: initial.photoMediaId, url: initial.photoUrl } : null
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
      const payload = { ...form, photoMediaId: photo?.mediaId || null };
      if (initial) {
        await teamApi.update(initial.id, payload);
        showToast("Team member updated.");
      } else {
        await teamApi.create(payload);
        showToast("Team member created.");
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
    <Drawer open={open} title={initial ? "Edit Team Member" : "Add Team Member"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <MediaPicker label="Photo" value={photo} onChange={setPhoto} />
        <TextField
          id="tm-name"
          label="Name"
          required
          value={form.name}
          error={errors.name}
          onChange={(e) => handleNameChange(e.target.value)}
        />
        <TextField
          id="tm-slug"
          label="Slug"
          required
          value={form.slug}
          error={errors.slug}
          onChange={(e) => {
            setSlugTouched(true);
            setField("slug", e.target.value);
          }}
        />
        <TextField
          id="tm-designation"
          label="Designation"
          value={form.designation}
          error={errors.designation}
          onChange={(e) => setField("designation", e.target.value)}
        />
        <TextAreaField id="tm-bio" label="Bio" value={form.bio} error={errors.bio} onChange={(e) => setField("bio", e.target.value)} />
        <TextField
          id="tm-qualifications"
          label="Qualifications"
          placeholder="e.g. FCA, DISA"
          value={form.qualifications}
          error={errors.qualifications}
          onChange={(e) => setField("qualifications", e.target.value)}
        />
        <TextField
          id="tm-email"
          label="Email"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(e) => setField("email", e.target.value)}
        />
        <TextField
          id="tm-linkedin"
          label="LinkedIn URL"
          value={form.linkedinUrl}
          error={errors.linkedinUrl}
          onChange={(e) => setField("linkedinUrl", e.target.value)}
        />
        <ToggleField
          id="tm-active"
          label="Active"
          description="Visible on the public About page"
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
