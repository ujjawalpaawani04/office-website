import { FaWhatsapp } from "react-icons/fa";
import { cn } from "../../shared/utils/cn";
import { useSiteSettings, whatsappHref } from "../context/SiteSettingsContext";

// Shared between the floating WhatsApp button and its inline header
// placement so the link/icon only need to be defined once.
export const WhatsAppButton = ({ className, iconClassName = "h-6 w-6", ...rest }) => {
  const { whatsapp } = useSiteSettings();

  return (
    <a
      href={whatsappHref(whatsapp)}
      target="_blank"
      rel="noreferrer"
      aria-label="Contact us on WhatsApp"
      className={cn(
        "flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-105",
        className
      )}
      {...rest}
    >
      <FaWhatsapp className={iconClassName} aria-hidden="true" />
    </a>
  );
};
