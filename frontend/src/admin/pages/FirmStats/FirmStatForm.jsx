import { useState } from "react";

import { ApiError } from "../../../shared/api/client";
import { firmStatsApi } from "../../api/firmStatsApi";
import { Button } from "../../components/Button";
import { Drawer } from "../../components/Drawer";
import { TextField, ToggleField } from "../../components/form/Field";
import { useToast } from "../../toast/useToast";

function formFromInitial(initial) {
  if (!initial) return { key: "", label: "", value: "", suffix: "", icon: "", sortOrder: 0, isActive: true };
  return {
    key: initial.key || "",
    label: initial.label || "",
    value: initial.value || "",
    suffix: initial.suffix || "",
    icon: initial.icon || "",
    sortOrder: initial.sortOrder ?? 0,
    isActive: initial.isActive,
  };
}

export function FirmStatForm({ open, initial, onClose, onSaved }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(() => formFromInitial(initial));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (initial) {
        await firmStatsApi.update(initial.id, form);
        showToast("Firm stat updated.");
      } else {
        await firmStatsApi.create(form);
        showToast("Firm stat created.");
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
    <Drawer open={open} title={initial ? "Edit Firm Stat" : "Add Firm Stat"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          id="fs-key"
          label="Key"
          required
          disabled={Boolean(initial)}
          placeholder="e.g. years_experience"
          value={form.key}
          error={errors.key}
          onChange={(e) => setField("key", e.target.value)}
        />
        <TextField id="fs-label" label="Label" required value={form.label} error={errors.label} onChange={(e) => setField("label", e.target.value)} />
        <TextField id="fs-value" label="Value" required value={form.value} error={errors.value} onChange={(e) => setField("value", e.target.value)} />
        <TextField id="fs-suffix" label="Suffix" placeholder="e.g. +" value={form.suffix} error={errors.suffix} onChange={(e) => setField("suffix", e.target.value)} />
        <TextField id="fs-icon" label="Icon" value={form.icon} error={errors.icon} onChange={(e) => setField("icon", e.target.value)} />
        <TextField id="fs-sort" label="Sort Order" type="number" value={form.sortOrder} error={errors.sortOrder} onChange={(e) => setField("sortOrder", e.target.value)} />
        <ToggleField id="fs-active" label="Active" checked={form.isActive} onChange={(v) => setField("isActive", v)} />
        <div className="flex justify-end gap-2 border-t border-secondary/10 pt-4">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Save</Button>
        </div>
      </form>
    </Drawer>
  );
}
