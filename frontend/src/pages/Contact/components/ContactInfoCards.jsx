import { motion } from "framer-motion";
import { FiMapPin, FiPhone, FiMail} from "react-icons/fi";
import { FaRegClock } from "react-icons/fa";
import { formatPhoneDisplay, mailHref, splitLines, telHref, useSiteSettings } from "../../../context/SiteSettingsContext";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: EASE },
  }),
};

export const ContactInfoCards = () => {
  const { phone, contactEmail, address, businessHours } = useSiteSettings();

  const cards = [
    {
      icon: FiMapPin,
      title: "Office Address",
      lines: [{ text: address }],
    },
    {
      icon: FiPhone,
      title: "Call Us",
      lines: splitLines(phone).map((num) => ({ text: formatPhoneDisplay(num), href: telHref(num) })),
    },
    {
      icon: FiMail,
      title: "Email Address",
      lines: splitLines(contactEmail).map((email) => ({ text: email, href: mailHref(email) })),
    },
    {
      icon: FaRegClock,
      title: "Office Timing",
      lines: splitLines(businessHours).map((line) => ({ text: line })),
    },
  ];

  return (
    <div className="grid gap-3 ">
      {cards.map((card, i) => {
        const Icon = card.icon;
        // Only the whole card links out when there's exactly one line with
        // an href (phone) - multiple lines (e.g. several emails) each need
        // their own link, so the card itself stays a plain container and
        // each line renders its own <a>.
        const singleHref = card.lines.length === 1 ? card.lines[0].href : undefined;

        const content = (
          <>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-700 group-hover:text-white">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-black">{card.title}</p>
              <div className="mt-1 space-y-0.5 text-sm leading-relaxed text-black">
                {card.lines.map((line, j) =>
                  line.href && !singleHref ? (
                    <a key={j} href={line.href} className="block hover:text-brand-700">
                      {line.text}
                    </a>
                  ) : (
                    <p key={j}>{line.text}</p>
                  )
                )}
              </div>
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
            {singleHref ? (
              <a href={singleHref} target={singleHref.startsWith("http") ? "_blank" : undefined} rel={singleHref.startsWith("http") ? "noreferrer" : undefined} className={sharedClasses}>
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
