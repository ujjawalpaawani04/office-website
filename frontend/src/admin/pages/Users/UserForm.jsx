import { useState } from "react";

import { ApiError } from "../../../shared/api/client";
import { usersApi } from "../../api/usersApi";
import { Button } from "../../components/Button";
import { Drawer } from "../../components/Drawer";
import { SelectField, TextField, ToggleField } from "../../components/form/Field";
import { useToast } from "../../toast/useToast";

export function UserForm({ open, initial, onClose, onSaved }) {
  const { showToast } = useToast();
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [role, setRole] = useState(initial?.role || "editor");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (initial) {
        await usersApi.update(initial.id, { name, role, isActive });
        showToast("User updated.");
      } else {
        await usersApi.create({ name, email, role });
        showToast("Invitation sent - a temporary password was emailed.");
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
    <Drawer open={open} title={initial ? "Edit User" : "Invite User"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField id="user-name" label="Name" required value={name} error={errors.name} onChange={(e) => setName(e.target.value)} />
        <TextField
          id="user-email"
          label="Email"
          type="email"
          required
          disabled={Boolean(initial)}
          value={email}
          error={errors.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <SelectField id="user-role" label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </SelectField>
        {initial ? (
          <ToggleField id="user-active" label="Active" description="Inactive accounts can't log in" checked={isActive} onChange={setIsActive} />
        ) : (
          <p className="rounded-lg bg-secondary/5 p-3 text-xs text-secondary/60">
            A temporary password will be generated and emailed to this address. They'll be asked to change it after logging in.
          </p>
        )}
        <div className="flex justify-end gap-2 border-t border-secondary/10 pt-4">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>{initial ? "Save" : "Send Invitation"}</Button>
        </div>
      </form>
    </Drawer>
  );
}
