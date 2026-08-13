import { useEffect, useState } from "react";

import { ApiError } from "../../../shared/api/client";
import {
  changePassword,
  requestEmailChangeOtp,
  updateProfileName,
  verifyEmailChangeOtp,
} from "../../api/profileApi";
import { useAuth } from "../../auth/useAuth";
import { Button } from "../../components/Button";
import { PageHeader } from "../../components/PageHeader";
import { TextField } from "../../components/form/Field";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { useToast } from "../../toast/useToast";

const RESEND_COOLDOWN_SECONDS = 60;

export default function Profile() {
  useBreadcrumb([{ label: "Profile" }]);
  const { showToast } = useToast();
  const { admin, updateAdminInfo, logout } = useAuth();

  const [name, setName] = useState(admin?.name || "");
  const [nameError, setNameError] = useState(null);
  const [savingName, setSavingName] = useState(false);

  const [newEmail, setNewEmail] = useState(admin?.email || "");
  const [emailError, setEmailError] = useState(null);
  const [emailStep, setEmailStep] = useState("idle"); // "idle" | "otp"
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(null);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((prev) => Math.max(prev - 1, 0)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

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

  const handleRequestEmailOtp = async (e) => {
    e.preventDefault();
    setSendingOtp(true);
    setEmailError(null);
    try {
      await requestEmailChangeOtp(newEmail);
      setEmailStep("otp");
      setCooldown(RESEND_COOLDOWN_SECONDS);
      showToast(`Verification code sent to ${newEmail}.`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) setEmailError(err.body?.fields?.newEmail);
      else if (err instanceof ApiError && err.status === 429) showToast(err.body?.error || "Please wait before requesting another code.", "error");
      else showToast(err instanceof ApiError ? err.message : "Could not send verification code.", "error");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResendEmailOtp = async () => {
    if (cooldown > 0) return;
    setSendingOtp(true);
    try {
      await requestEmailChangeOtp(newEmail);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setOtp("");
      setOtpError(null);
      showToast(`Verification code sent to ${newEmail}.`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        showToast(err.body?.error || "Please wait before requesting another code.", "error");
        if (err.body?.retryAfterSeconds) setCooldown(err.body.retryAfterSeconds);
      } else {
        showToast(err instanceof ApiError ? err.message : "Could not resend code.", "error");
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyEmailOtp = async (e) => {
    e.preventDefault();
    setVerifyingOtp(true);
    setOtpError(null);
    try {
      const result = await verifyEmailChangeOtp(otp);
      updateAdminInfo(result.admin);
      showToast("Email updated. You've been logged out of other devices.");
      setEmailStep("idle");
      setOtp("");
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) showToast(err.body?.error || "That email is no longer available.", "error");
      else setOtpError("Invalid or expired code.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleCancelEmailChange = () => {
    setEmailStep("idle");
    setNewEmail(admin?.email || "");
    setOtp("");
    setOtpError(null);
    setEmailError(null);
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
        <div className="flex justify-end border-t border-secondary/10 pt-4">
          <Button type="submit" loading={savingName}>Save Changes</Button>
        </div>
      </form>

      <div className="space-y-4 rounded-xl border border-secondary/10 bg-white p-5">
        <p className="text-sm font-semibold text-secondary">Email Address</p>

        {emailStep === "idle" ? (
          <form onSubmit={handleRequestEmailOtp} className="space-y-4">
            <TextField
              id="profile-email"
              label="Email"
              type="email"
              required
              value={newEmail}
              error={emailError}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <p className="text-xs text-secondary/50">
              Changing your email requires verifying a code sent to the new address.
            </p>
            <div className="flex justify-end border-t border-secondary/10 pt-4">
              <Button type="submit" loading={sendingOtp} disabled={newEmail === admin?.email}>
                Send Verification Code
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
            <p className="text-sm text-secondary/70">
              Enter the 6-digit code sent to <span className="font-medium text-secondary">{newEmail}</span>.
            </p>
            <TextField
              id="profile-email-otp"
              label="Verification Code"
              required
              inputMode="numeric"
              maxLength={6}
              value={otp}
              error={otpError}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleCancelEmailChange}
                className="text-sm font-medium text-secondary/60 hover:text-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResendEmailOtp}
                disabled={cooldown > 0 || sendingOtp}
                className="text-sm font-medium text-brand-700 hover:text-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </button>
            </div>
            <div className="flex justify-end border-t border-secondary/10 pt-4">
              <Button type="submit" loading={verifyingOtp} disabled={otp.length !== 6}>
                Verify &amp; Update Email
              </Button>
            </div>
          </form>
        )}
      </div>

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
