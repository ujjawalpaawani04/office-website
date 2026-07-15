import { motion } from "framer-motion";
import { FiMapPin, FiPhone, FiMail, FiClock, FiMessageCircle, FiGlobe } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: EASE },
  }),
};

const cards = [
  {
    icon: FiMapPin,
    title: "Office Address",
    description: "Ganga Enclave, Canal Rd, near Ganeshpur, Roorkee, Uttarakhand 247667",
  },
  {
    icon: FiPhone,
    title: "Phone Number",
    description: "+91 (120) 4000 3500",
    href: "tel:+911204000350",
  },
  {
    icon: FiMail,
    title: "Email Address",
    description: "info@singhamilassociates.com",
    href: "mailto:info@singhamilassociates.com",
  },
  {
    icon: FiClock,
    title: "Office Hours",
    description: "Mon - Fri: 9:00 AM - 6:00 PM, Sat: 10:00 AM - 3:00 PM",
  },
  {
    icon: FiMessageCircle,
    title: "WhatsApp Support",
    description: "+91 98765 43210",
    href: "https://wa.me/919876543210",
  },
  {
    icon: FiGlobe,
    title: "Website",
    description: "www.singhamilassociates.com",
    href: "https://www.singhamilassociates.com",
  },
];

export const ContactInfoCards = () => {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const content = (
          <>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-700 group-hover:text-white">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">{card.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-secondary/60">
                {card.description}
              </p>
            </div>
          </>
        );

        const sharedClasses =
          "group flex h-full items-start gap-4 rounded-xl border border-secondary/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-700/30 hover:shadow-lg";

        return (
          <motion.div
            key={card.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={i}
          >
            {card.href ? (
              <a href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel={card.href.startsWith("http") ? "noreferrer" : undefined} className={sharedClasses}>
                {content}
              </a>
            ) : (
              <div className={sharedClasses}>{content}</div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
