import { useState } from "react";

import { ApiError } from "../../../api/client";
import { jobOpeningsApi } from "../../api/jobOpeningsApi";
import { Button } from "../../components/Button";
import { Drawer } from "../../components/Drawer";
import { SelectField, TextAreaField, TextField, ToggleField } from "../../components/form/Field";
import { slugify } from "../../utils/slugify";
import { useToast } from "../../toast/useToast";

function formFromInitial(initial) {
  if (!initial) {
    return {
      title: "",
      slug: "",
      department: "",
      location: "",
      employmentType: "full_time",
      description: "",
      requirements: "",
      responsibilities: "",
      minExperienceYears: "",
      isActive: true,
    };
  }
  return {
    title: initial.title || "",
    slug: initial.slug || "",
    department: initial.department || "",
    location: initial.location || "",
    employmentType: initial.employmentType || "full_time",
    description: initial.description || "",
    requirements: initial.requirements || "",
    responsibilities: initial.responsibilities || "",
    minExperienceYears: initial.minExperienceYears ?? "",
    isActive: initial.isActive,
  };
}

export function JobOpeningForm({ open, initial, onClose, onSaved }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(() => formFromInitial(initial));
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleTitleChange = (value) => {
    setField("title", value);
    if (!slugTouched) setField("slug", slugify(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (initial) {
        await jobOpeningsApi.update(initial.id, form);
        showToast("Job opening updated.");
      } else {
        await jobOpeningsApi.create(form);
        showToast("Job opening created.");
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
    <Drawer open={open} title={initial ? "Edit Job Opening" : "Add Job Opening"} onClose={onClose} widthClassName="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField id="jo-title" label="Title" required value={form.title} error={errors.title} onChange={(e) => handleTitleChange(e.target.value)} />
        <TextField id="jo-slug" label="Slug" required value={form.slug} error={errors.slug} onChange={(e) => { setSlugTouched(true); setField("slug", e.target.value); }} />
        <TextField id="jo-department" label="Department" value={form.department} error={errors.department} onChange={(e) => setField("department", e.target.value)} />
        <TextField id="jo-location" label="Location" value={form.location} error={errors.location} onChange={(e) => setField("location", e.target.value)} />
        <SelectField id="jo-type" label="Employment Type" value={form.employmentType} onChange={(e) => setField("employmentType", e.target.value)}>
          <option value="full_time">Full-Time</option>
          <option value="part_time">Part-Time</option>
          <option value="internship">Internship</option>
          <option value="contract">Contract</option>
        </SelectField>
        <TextField id="jo-min-exp" label="Min. Experience (years)" type="number" value={form.minExperienceYears} error={errors.minExperienceYears} onChange={(e) => setField("minExperienceYears", e.target.value)} />
        <TextAreaField id="jo-description" label="Description" required rows={4} value={form.description} error={errors.description} onChange={(e) => setField("description", e.target.value)} />
        <TextAreaField id="jo-requirements" label="Requirements" rows={3} value={form.requirements} error={errors.requirements} onChange={(e) => setField("requirements", e.target.value)} />
        <TextAreaField id="jo-responsibilities" label="Responsibilities" rows={3} value={form.responsibilities} error={errors.responsibilities} onChange={(e) => setField("responsibilities", e.target.value)} />
        <ToggleField id="jo-active" label="Active" description="Visible on the public Career page" checked={form.isActive} onChange={(v) => setField("isActive", v)} />
        <div className="flex justify-end gap-2 border-t border-secondary/10 pt-4">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Save</Button>
        </div>
      </form>
    </Drawer>
  );
}
