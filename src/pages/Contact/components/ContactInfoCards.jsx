import { motion } from "framer-motion";
import { FiMapPin, FiPhone, FiMail} from "react-icons/fi";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
   FaTwitter
} from "react-icons/fa";

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
    title: "Call Us",
    description: "+91 9897999969",
    href: "tel:+919897999969",
  },
  {
    icon: FiMail,
    title: "Email Address",
    description: "info@singhamitassociates.com",
    href: "mailto:info@singhamitassociates.com",
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

const socials = [
  { Icon: FaInstagram, label: "Instagram", url: "https://www.instagram.com/caamitsingh_?igsh=ZXo5ODZyY3g4bm9i" },
  { Icon: FaFacebookF, label: "Facebook", url: "https://www.facebook.com/profile.php?id=61585701170431" },
  { Icon: FaLinkedinIn, label: "Linkedin", url: "https://www.linkedin.com/in/ca-amit-singh-a53322378/" },
  { Icon:  FaTwitter, label: "Twitter", url: "https://x.com/CAAMITSINGHPAL" }
];

export const ContactInfoCards = () => {
  return (
    <div className="grid gap-4 ">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const content = (
          <>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-700 group-hover:text-white">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-black">{card.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-black">
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
        <div>
            <p className="text-sm text-brand-700 mb-3">
              Stay Connected With Us
            </p>
            <div className="flex gap-3">
              {socials.map(({ Icon, label, url }) => (
                <a
                  key={label}
                  target="_blank"
                  href={url}
                  aria-label={label}
                  className="grid place-items-center w-10 h-10 rounded-full bg-white  border border-gray-100  text-gray-600  hover:bg-gradient-to-r hover:bg-brand-700 hover:text-white hover:border-transparent transition-all"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
    </div>
  );
};
