import { Link } from "react-router-dom";
import { FiLinkedin, FiTwitter, FiFacebook, FiInstagram } from "react-icons/fi";
import { Container } from "../../common/Container";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Services: [
      "Taxation & Compliance",
      "Audit & Assurance",
      "Business Advisory",
      "Risk Management",
      "Corporate Compliance",
      "Financial Planning",
    ],
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/about" },
      { label: "Careers", href: "/" },
      { label: "Publications", href: "/" },
      { label: "Blog", href: "/" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
      { label: "Cookie Policy", href: "/" },
      { label: "Disclaimer", href: "/" },
    ],
    Other: [
      { label: "Contact Us", href: "/" },
      { label: "Admin Panel", href: "/" },
      { label: "Support", href: "/" },
      { label: "Sitemap", href: "/" },
    ],
  };

  return (
    <footer className="bg-secondary text-white">
      {/* Main Footer */}
      <div className="border-b border-white/10">
        <Container className="py-16 lg:py-24">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link
                to="/"
                className="inline-flex flex-col gap-2 mb-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 rounded-md"
              >
                <span className="text-xl font-bold text-highlight">
                  Singh Amit & Associates
                </span>
                <span className="text-xs text-white/60 font-semibold uppercase tracking-widest">
                  Chartered Accountants
                </span>
              </Link>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                India's trusted partner for comprehensive financial advisory and chartered accountancy services.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/10 hover:bg-brand-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  <FiLinkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/10 hover:bg-brand-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  <FiTwitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/10 hover:bg-brand-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  <FiFacebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/10 hover:bg-brand-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  <FiInstagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2.5">
                {footerLinks.Services.map((service) => (
                  <li key={service}>
                    <a
                      href="/"
                      className="text-sm text-white/70 hover:text-highlight transition-colors"
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2.5">
                {footerLinks.Company.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-white/70 hover:text-highlight transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {footerLinks.Legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-white/70 hover:text-highlight transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Other */}
            <div>
              <h4 className="font-semibold text-white mb-4">Other</h4>
              <ul className="space-y-2.5">
                {footerLinks.Other.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-white/70 hover:text-highlight transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Footer */}
      <Container className="py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-sm text-white/60">
          &copy; {currentYear} Singh Amit & Associates. All rights reserved.
        </p>
        <p className="text-sm text-white/60">
          Designed with care for financial excellence.
        </p>
      </Container>
    </footer>
  );
};
