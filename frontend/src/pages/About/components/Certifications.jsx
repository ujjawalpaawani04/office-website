import { motion } from "framer-motion";
import { FiGlobe } from "react-icons/fi";
import { TbBuildingBank, TbShieldCheck, TbCertificate } from "react-icons/tb";

const EASE = [0.22, 1, 0.36, 1];
const TEAL = "#0D8A82";
const DARK = "#1D1D1D";
const GRAY = "#555555";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.12 * i, ease: EASE },
  }),
};

const certifications = [
  {
    icon: TbBuildingBank,
    title: "ICAI",
    subtitle: "Registered Firm",
    description: "Proudly registered with the Institute of Chartered Accountants of India.",
  },
  {
    icon: FiGlobe,
    title: "ISO 9001:2015",
    subtitle: "Certified",
    description: "Quality Management System certified for consistent excellence.",
  },
  {
    icon: TbShieldCheck,
    title: "GST",
    subtitle: "Authorized Partner",
    description: "Authorized GST partner for seamless and reliable services.",
  },
  {
    icon: TbCertificate,
    title: "Udyam",
    subtitle: "Registered",
    description: "Registered under Udyam for empowering MSME growth.",
  },
];

export const Certifications = () => {
  return (
    <section
      className="bg-white py-16 sm:py-20 lg:py-[100px]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto w-full max-w-[1320px] px-6 text-center lg:px-8"
      >
        {/* Eyebrow */}
        <motion.div
          variants={fadeUp}
          custom={0}
          className="flex items-center justify-center gap-4"
        >
          
          <span
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
            style={{ color: TEAL, letterSpacing: "4px" }}
          >
            Our Credentials
          </span>
          
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
        >
          <span style={{ color: DARK }}>Official </span>
          <span style={{ color: TEAL }}>Certifications</span>
        </motion.h2>

        

        {/* Trust line */}
        <motion.p
          variants={fadeUp}
          custom={3}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 text-base"
          style={{ color: "#333333" }}
        >
          <span aria-hidden="true" style={{ color: TEAL }}>
            &bull;
          </span>
          <span>Trusted</span>
          <span aria-hidden="true" style={{ color: TEAL }}>
            &bull;
          </span>
          <span>Verified</span>
          <span aria-hidden="true" style={{ color: TEAL }}>
            &bull;
          </span>
          <span>Government Approved</span>
        </motion.p>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert, i) => {
            const Icon = cert.icon;
            return (
              <motion.div
                key={cert.title}
                variants={fadeUp}
                custom={4 + i}
                className="flex flex-col items-center rounded-[28px] bg-white p-9 transition-all duration-[350ms] ease-out hover:-translate-y-2"
                style={{
                  boxShadow: "0 15px 45px rgba(0,0,0,0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 25px 60px rgba(0,0,0,0.16)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 15px 45px rgba(0,0,0,0.08)";
                }}
              >
                {/* Icon circle */}
                <div
                  className="flex h-[90px] w-[90px] shrink-0 items-center justify-center rounded-full"
                  style={{ border: `2px solid ${TEAL}` }}
                >
                  <Icon className="h-9 w-9" style={{ color: TEAL }} aria-hidden="true" />
                </div>

                {/* Small divider: line - dot - line */}
                <div className="mt-5 flex items-center justify-center gap-2">
                  <span aria-hidden="true" className="h-px w-6" style={{ backgroundColor: `${TEAL}40` }} />
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: TEAL }} />
                  <span aria-hidden="true" className="h-px w-6" style={{ backgroundColor: `${TEAL}40` }} />
                </div>

                {/* Title - fixed-height wrapper keeps every card's subtitle,
                    divider and description aligned regardless of whether the
                    title wraps to one or two lines (e.g. "ISO 9001:2015"). */}
                <div className="mt-4">
                  <h3
                    className="text-center text-2xl leading-tight font-bold"
                    style={{ color: DARK }}
                  >
                    {cert.title}
                  </h3>
                </div>

                {/* Subtitle */}
                <p className="mt-2 text-center text-lg font-semibold" style={{ color: TEAL }}>
                  {cert.subtitle}
                </p>

                {/* Small teal divider line */}
                <span aria-hidden="true" className="mt-4 h-0.5 w-10" style={{ backgroundColor: TEAL }} />

                {/* Description */}
                <p
                  className="mt-4 text-center text-base leading-[1.8]"
                  style={{ color: GRAY }}
                >
                  {cert.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
