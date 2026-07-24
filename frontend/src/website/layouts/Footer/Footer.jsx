import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiMapPin, FiPhone, FiMail, FiClock, FiArrowUpRight } from "react-icons/fi";
import { Container } from "../../components/common/Container";
import { socialLinks } from "../../constants/socialLinks";
import { cn } from "../../../shared/utils/cn";
import logo from "../../assets/images/logo.png";
import { formatPhoneDisplay, mailHref, splitLines, telHref, useSiteSettings } from "../../context/SiteSettingsContext";

const EASE = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const serviceLinks = [
  { label: "Income Tax & Tax Advisory", to: "/services/income-tax-advisory" },
  { label: "GST Services", to: "/services/gst-services" },
  { label: "TDS Compliance", to: "/services/tds-compliance" },
  { label: "Accounting & Bookkeeping", to: "/services/accounting-bookkeeping" },
  { label: "Company & LLP Registration (ROC)", to: "/services/company-llp-registration" },
  { label: "RERA Registration & Compliance", to: "/services/rera-registration" },
  { label: "Land Laws Consultancy (UPZLAR)", to: "/services/land-laws-consultancy" },
];

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Blogs", to: "/blogs" },
  { label: "Life@SAA", to: "/life-at-saa" },
  { label: "Careers", to: "/career" },
  { label: "Contact Us", to: "/contact" },
];

const FooterHeading = ({ children }) => (
  <h3 className="relative inline-block pb-3 pl-2 text-sm font-bold uppercase tracking-widest text-white after:absolute after:bottom-0 after:left-2 after:h-0.5 after:w-12 after:rounded-full after:bg-highlight">
    {children}
  </h3>
);

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="group inline-flex items-center gap-2 text-sm text-white/65 transition-all duration-300 hover:translate-x-1 hover:text-highlight focus-visible:translate-x-1 focus-visible:text-highlight focus-visible:outline-none"
  >
    <span className="h-px w-0 bg-highlight transition-all duration-300 group-hover:w-3 group-focus-visible:w-3" aria-hidden="true" />
    {children}
  </Link>
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { phone, contactEmail, address, businessHours } = useSiteSettings();

  const contactDetails = [
    { icon: FiMapPin, label: "Office Address", lines: [{ text: address }] },
    {
      icon: FiPhone,
      label: "Phone Number",
      lines: splitLines(phone).map((num) => ({ text: formatPhoneDisplay(num), href: telHref(num) })),
    },
    {
      icon: FiMail,
      label: "Email Address",
      lines: splitLines(contactEmail).map((email) => ({ text: email, href: mailHref(email) })),
    },
    { icon: FiClock, label: "Office Hours", lines: splitLines(businessHours).map((line) => ({ text: line })) },
  ];

  return (
    <footer className="bg-secondary text-white">
      {/* Main Footer */}
      <Container className="py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={container}
          className="grid grid-cols-1 gap-12 sm:text-left md:grid-cols-2 md:gap-10 lg:grid-cols-4 lg:gap-8 xl:gap-12"
        >
          {/* Column 1: Brand */}
          <motion.div variants={fadeUp} className="flex flex-col items-start mb-2">
            <Link
              to="/"
              className="mb-5 inline-flex flex-col gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
            >
              <img src={logo} alt="Singh Amit & Associates" className="w-auto object-contain h-14 lg:h-20"/>
              
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-white/65">
              Since 2004, Singh Amit &amp; Associates has delivered trusted taxation, audit, and
              financial advisory services. Our 100+ qualified professionals support businesses
              across 50+ cities with clarity, compliance, and care.
            </p>

            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ label, icon: Icon, url, hoverClassName }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-highlight shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:text-white hover:shadow-lg focus-visible:-translate-y-0.5 focus-visible:scale-105 focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                    hoverClassName
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Our Services */}
          <motion.div variants={fadeUp} className="flex flex-col items-start">
            <FooterHeading>Our Services</FooterHeading>
            <ul className="mt-5 space-y-3">
              {serviceLinks.map((service) => (
                <li key={service.label}>
                  <FooterLink to={service.to}>{service.label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Quick Links */}
          <motion.div variants={fadeUp} className="flex flex-col items-start">
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink to={link.to}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact Information */}
          <motion.div variants={fadeUp} className="flex flex-col items-start">
            <FooterHeading>Contact Us</FooterHeading>
            <ul className="mt-5 space-y-4 pl-2">
              {contactDetails.map(({ icon: Icon, label, lines }) => (
                <li key={label} className="flex items-start gap-3 text-left">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-highlight">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-white">
                      {label}
                    </span>
                    {lines.map((line, i) =>
                      line.href ? (
                        <a
                          key={i}
                          href={line.href}
                          className="block text-sm text-white/65 transition-colors duration-300 hover:text-highlight focus-visible:text-highlight focus-visible:outline-none"
                        >
                          {line.text}
                        </a>
                      ) : (
                        <span key={i} className="block text-sm text-white/75">
                          {line.text}
                        </span>
                      )
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </Container>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center gap-4 py-6 text-center sm:flex-row sm:justify-center sm:text-left">
          <p className="text-[13px] sm:text-sm text-white/55">
            &copy; {currentYear} Singh Amit &amp; Associates. All Rights Reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
};
