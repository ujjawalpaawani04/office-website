import { ContactForm } from "../../Contact/components/ContactForm";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

const contactInfo = [
  {
    icon: FiPhone,
    label: "Phone",
    value: "+91 (120) 4000 3500",
    href: "tel:+911204000350",
  },
  {
    icon: FiMail,
    label: "Email",
    value: "info@singhamitassociates.com",
    href: "mailto:info@singhamitassociates.com",
  },
  {
    icon: FiMapPin,
    label: "Address",
    value: "Delhi, India",
    href: "#",
  },
];

export const ContactUsSection = () => {

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
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
          >
            We'd Love to <span className="text-brand-700">Hear From You</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-base leading-relaxed text-secondary/70 max-w-2xl mx-auto"
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
                    className="block text-sm font-semibold text-secondary mb-2"
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
                    className="w-full px-4 py-2.5 rounded-lg border border-brand-700/20 bg-white text-secondary placeholder-secondary/50 transition-colors focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-secondary mb-2"
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
                      className="w-full px-4 py-2.5 rounded-lg border border-brand-700/20 bg-white text-secondary placeholder-secondary/50 transition-colors focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-secondary mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-brand-700/20 bg-white text-secondary placeholder-secondary/50 transition-colors focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10"
                      placeholder="+91 90000 00000"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-secondary mb-2"
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
                    className="w-full px-4 py-2.5 rounded-lg border border-brand-700/20 bg-white text-secondary placeholder-secondary/50 transition-colors focus:outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 resize-none"
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
              <h3 className="font-display text-2xl font-bold text-secondary mb-8">
                Contact Information
              </h3>

              <div className="space-y-6">
                {contactInfo.map((info, i) => {
                  const Icon = info.icon;
                  return (
                    <motion.a
                      key={info.label}
                      href={info.href}
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
                        <p className="font-semibold text-secondary">{info.label}</p>
                        <p className="text-secondary/70 group-hover:text-brand-700 transition-colors">
                          {info.value}
                        </p>
                      </div>
                    </motion.a>
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
              <h4 className="font-semibold text-secondary mb-4">Office Hours</h4>
              <ul className="space-y-2 text-sm text-secondary/70">
                <li className="flex justify-between">
                  <span>Monday - Saturday:</span>
                  <span className="font-medium">10:00 AM - 6:00 PM</span>
                </li>
                
                <li className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-medium">Closed</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
