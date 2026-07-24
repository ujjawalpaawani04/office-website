import { motion } from "framer-motion";
import { useState } from "react";
import { FiPhone, FiMail, FiMapPin, FiSend } from "react-icons/fi";
import { Container } from "../common/Container";
import { formatPhoneDisplay, mailHref, splitLines, telHref, useSiteSettings } from "../../context/SiteSettingsContext";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

export const ContactUsSection = () => {
  const { phone, contactEmail, address, businessHours } = useSiteSettings();

  const contactInfo = [
    { icon: FiPhone, label: "Phone", lines: splitLines(phone).map((num) => ({ text: formatPhoneDisplay(num), href: telHref(num) })) },
    { icon: FiMail, label: "Email", lines: splitLines(contactEmail).map((email) => ({ text: email, href: mailHref(email) })) },
    { icon: FiMapPin, label: "Address", lines: [{ text: address }] },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-brand-50">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            Get In Touch
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            We'd Love to <span className="text-brand-700">Hear From You</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-base leading-relaxed text-black max-w-2xl mx-auto"
          >
            Have questions about our services? Want to discuss your financial goals? Reach out to us using the form below or contact us directly.
          </motion.p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-700/5 to-accent/5 rounded-lg blur-xl" />
              <form
                onSubmit={handleSubmit}
                className="relative p-8 rounded-lg border border-brand-700/10 bg-white space-y-6"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-black mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-brand-700/20 bg-white text-black placeholder-secondary/50 transition-colors focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-black mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-brand-700/20 bg-white text-black placeholder-secondary/50 transition-colors focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-black mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-brand-700/20 bg-white text-black placeholder-secondary/50 transition-colors focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10"
                      placeholder="+91 90000 00000"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-black mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2.5 rounded-lg border border-brand-700/20 bg-white text-black placeholder-secondary/50 transition-colors focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 resize-none"
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                <button
                  type="submit"
                  className="group w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-700/20 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
                >
                  {submitted ? "Message Sent!" : "Send Message"}
                  <FiSend className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                {submitted && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-green-600 font-medium text-center"
                  >
                    Thank you! We'll get back to you soon.
                  </motion.p>
                )}
              </form>
            </div>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-display text-2xl font-bold text-black mb-8">
                Contact Information
              </h3>

              <div className="space-y-6">
                {contactInfo.map((info, i) => {
                  const Icon = info.icon;
                  // Only the whole row links out when there's exactly one
                  // line with an href (phone) - multiple lines (e.g.
                  // several emails) each get their own link instead.
                  const singleHref = info.lines.length === 1 ? info.lines[0].href : undefined;
                  const Wrapper = singleHref ? motion.a : motion.div;

                  return (
                    <Wrapper
                      key={info.label}
                      href={singleHref}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                      custom={i + 1}
                      className="flex gap-4 group"
                    >
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-brand-700/10 to-accent/10 group-hover:from-brand-700/20 group-hover:to-accent/20 transition-all">
                          <Icon className="h-6 w-6 text-brand-700" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-black">{info.label}</p>
                        {info.lines.map((line, j) =>
                          line.href && !singleHref ? (
                            <a key={j} href={line.href} className="block text-black hover:text-brand-700 transition-colors">
                              {line.text}
                            </a>
                          ) : (
                            <p key={j} className="text-black group-hover:text-brand-700 transition-colors">
                              {line.text}
                            </p>
                          )
                        )}
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            </div>

            {/* Office Hours */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={4}
              className="p-6 rounded-lg bg-gradient-to-br from-brand-700/5 to-accent/5 border border-brand-700/10"
            >
              <h4 className="font-semibold text-black mb-4">Office Hours</h4>
              <div className="space-y-1">
                {splitLines(businessHours).map((line, i) => (
                  <p key={i} className="text-sm font-medium text-black">{line}</p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
