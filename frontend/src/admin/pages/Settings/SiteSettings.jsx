import { useCallback, useState } from "react";

import { ApiError } from "../../../shared/api/client";
import { fetchSiteSettings, updateSiteSettings } from "../../api/settingsApi";
import { Button } from "../../components/Button";
import { ErrorState } from "../../components/ErrorState";
import { TextAreaField, TextField } from "../../components/form/Field";
import { PageHeader } from "../../components/PageHeader";
import { Skeleton } from "../../components/Skeleton";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { useToast } from "../../toast/useToast";

export default function SiteSettings() {
  useBreadcrumb([{ label: "Settings" }]);
  const { showToast } = useToast();

  const fetcher = useCallback(() => fetchSiteSettings(), []);
  const { data, error, loading, refetch } = useAsyncData(fetcher);

  const [form, setForm] = useState(null);
  const [loadedData, setLoadedData] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Seeds the local editable copy once the fetch resolves - adjusting
  // state directly during render (guarded by comparing against the last
  // snapshot seen) rather than in an effect, same pattern as
  // SearchInput's prop-sync and for the same reason: it keeps this out of
  // the set-state-in-effect rule's reach entirely.
  if (data && data !== loadedData) {
    setLoadedData(data);
    setForm(data);
  }

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const result = await updateSiteSettings(form);
      setForm(result);
      showToast("Settings updated.");
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) setErrors(err.body?.fields || {});
      else showToast(err instanceof ApiError ? err.message : "Could not save.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (error) return <ErrorState message="Could not load settings." onRetry={refetch} />;

  return (
    <div>
      <PageHeader title="Settings" description="Firm-wide contact details used across the public site." />
      <div className="max-w-xl rounded-xl border border-secondary/10 bg-white p-5">
        {loading || !form ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <TextAreaField
                id="settings-phone"
                label="Phone"
                rows={2}
                placeholder={"9876543210\n9123456780"}
                value={form.phone || ""}
                error={errors.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
              <p className="mt-1 text-xs text-secondary/50">Enter one 10-digit number per line to show more than one on the site.</p>
            </div>
            <TextField id="settings-whatsapp" label="WhatsApp Number" value={form.whatsapp || ""} error={errors.whatsapp} onChange={(e) => setField("whatsapp", e.target.value)} />
            <div>
              <TextAreaField
                id="settings-email"
                label="Contact Email"
                rows={3}
                placeholder={"info@example.com\nsupport@example.com"}
                value={form.contactEmail || ""}
                error={errors.contactEmail}
                onChange={(e) => setField("contactEmail", e.target.value)}
              />
              <p className="mt-1 text-xs text-secondary/50">Enter one email per line to show more than one on the site.</p>
            </div>
            <TextAreaField id="settings-address" label="Office Address" value={form.address || ""} error={errors.address} onChange={(e) => setField("address", e.target.value)} />
            <div>
              <TextAreaField
                id="settings-hours"
                label="Business Hours"
                rows={3}
                placeholder={"Mon - Fri: 10:00 AM - 6:00 PM\nSaturday: 10:00 AM - 2:00 PM\nSunday: Closed"}
                value={form.businessHours || ""}
                error={errors.businessHours}
                onChange={(e) => setField("businessHours", e.target.value)}
              />
              <p className="mt-1 text-xs text-secondary/50">Enter one line per schedule to show more than one line on the site.</p>
            </div>
            <div className="flex justify-end border-t border-secondary/10 pt-4">
              <Button type="submit" loading={saving}>Save</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
