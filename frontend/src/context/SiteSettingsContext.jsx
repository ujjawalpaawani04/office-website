import { createContext, useContext, useEffect, useState } from "react";
import { getSiteSettings } from "../api/settings";

// The values every hardcoded phone/email/address/hours on the public site
// used to duplicate independently (Footer, Contact page, service page
// heroes, the WhatsApp button...) before any of them read from the admin
// Site Settings screen. These are the fallback shown before the fetch
// resolves and if it ever fails, so a settings-API outage never blanks out
// the site's contact info - it just falls back to these last-known-good
// defaults instead.
export const DEFAULT_SITE_SETTINGS = {
  phone: "9897999967",
  whatsapp: "9897999967",
  contactEmail: "casinghamit@yahoo.com",
  address: "Ganga Enclave, Canal Rd, near Ganeshpur, Roorkee, Uttarakhand 247667",
  businessHours: "Mon - Sat: 10:00 AM - 6:00 PM",
};

const SiteSettingsContext = createContext(DEFAULT_SITE_SETTINGS);

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    let cancelled = false;

    getSiteSettings()
      .then((data) => {
        if (cancelled || !data) return;
        // Per-field fallback: an admin who has only filled in some fields
        // (e.g. phone but not WhatsApp yet) still gets sensible defaults
        // for the rest, rather than a blank value on the live site.
        setSettings({
          phone: data.phone || DEFAULT_SITE_SETTINGS.phone,
          whatsapp: data.whatsapp || DEFAULT_SITE_SETTINGS.whatsapp,
          contactEmail: data.contactEmail || DEFAULT_SITE_SETTINGS.contactEmail,
          address: data.address || DEFAULT_SITE_SETTINGS.address,
          businessHours: data.businessHours || DEFAULT_SITE_SETTINGS.businessHours,
        });
      })
      .catch((err) => {
        console.error("Failed to load site settings, using defaults:", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
};

export const useSiteSettings = () => useContext(SiteSettingsContext);

// phone, contactEmail and businessHours are all stored as a single
// newline-separated string (an admin can enter one number/email/schedule
// line per line in Settings) - this turns that back into an array so
// components can render each line separately instead of one run-on line.
export const splitLines = (value) => (value || "").split("\n").map((line) => line.trim()).filter(Boolean);

// For single-CTA spots (a service page's one "Call Expert" button) that
// can only link to one number - the first line the admin entered.
export const primaryPhone = (phone) => splitLines(phone)[0] || "";

// Settings store plain 10-digit Indian mobile numbers (validator-enforced,
// no country code/spaces) - these format a single number consistently
// everywhere it's displayed or linked, so every component doesn't
// reimplement the same "+91 XXXXX XXXXX" / "tel:+91..." string-building.
export const formatPhoneDisplay = (phone) => `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
export const telHref = (phone) => `tel:+91${phone}`;
export const mailHref = (email) => `mailto:${email}`;
export const whatsappHref = (whatsapp) => `https://wa.me/${whatsapp}`;
