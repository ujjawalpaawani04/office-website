import { useState } from "react";

import { ApiError } from "../../../api/client";
import { changePassword, updateProfileName } from "../../api/profileApi";
import { useAuth } from "../../auth/useAuth";
import { Button } from "../../components/Button";
import { PageHeader } from "../../components/PageHeader";
import { TextField } from "../../components/form/Field";
import { useBreadcrumb } from "../../layout/useBreadcrumb";
import { useToast } from "../../toast/useToast";

export default function Profile() {
  useBreadcrumb([{ label: "Profile" }]);
  const { showToast } = useToast();
  const { admin, updateAdminInfo, logout } = useAuth();

  const [name, setName] = useState(admin?.name || "");
  const [nameError, setNameError] = useState(null);
  const [savingName, setSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setSavingName(true);
    setNameError(null);
    try {
      const result = await updateProfileName(name);
      updateAdminInfo(result);
      showToast("Profile updated.");
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) setNameError(err.body?.fields?.name);
      else showToast(err instanceof ApiError ? err.message : "Could not save.", "error");
    } finally {
      setSavingName(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordErrors({});
    try {
      await changePassword(currentPassword, newPassword);
      showToast("Password updated. You've been logged out of other devices.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) setPasswordErrors(err.body?.fields || {});
      else showToast(err instanceof ApiError ? err.message : "Could not update password.", "error");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <PageHeader title="Profile" description="Manage your own account details." />

      <form onSubmit={handleNameSubmit} className="space-y-4 rounded-xl border border-secondary/10 bg-white p-5">
        <TextField id="profile-name" label="Name" required value={name} error={nameError} onChange={(e) => setName(e.target.value)} />
        <TextField id="profile-email" label="Email" value={admin?.email || ""} disabled />
        <div className="flex justify-end border-t border-secondary/10 pt-4">
          <Button type="submit" loading={savingName}>Save Changes</Button>
        </div>
      </form>

      <form onSubmit={handlePasswordSubmit} className="space-y-4 rounded-xl border border-secondary/10 bg-white p-5">
        <p className="text-sm font-semibold text-secondary">Change Password</p>
        <TextField
          id="profile-current-password"
          label="Current Password"
          type="password"
          required
          value={currentPassword}
          error={passwordErrors.currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <TextField
          id="profile-new-password"
          label="New Password"
          type="password"
          required
          value={newPassword}
          error={passwordErrors.newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <p className="text-xs text-secondary/50">Minimum 12 characters. This will log you out of other devices.</p>
        <div className="flex justify-end border-t border-secondary/10 pt-4">
          <Button type="submit" loading={savingPassword}>Change Password</Button>
        </div>
      </form>

      <button type="button" onClick={logout} className="text-sm font-medium text-red-600 hover:underline">
        Log out of this device
      </button>
    </div>
  );
}
