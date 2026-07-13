import { motion } from "framer-motion";
import { Container } from "../../../components/common/Container";
import { FiLinkedin, FiMail } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

const partners = [
  {
    id: 1,
    name: "Amit Singh",
    title: "Founder & Chief Executive",
    bio: "With over 22 years of experience in chartered accountancy, Amit leads our vision for transformative financial advisory. A CA from ICAI, he specializes in corporate taxation and financial planning.",
    image: "/images/partner-1.jpg",
    expertise: ["Corporate Taxation", "Financial Planning", "Business Advisory"],
  },
  {
    id: 2,
    name: "Priya Sharma",
    title: "Partner - Audit & Assurance",
    bio: "Priya brings 18 years of expertise in audit, assurance, and compliance. She's committed to ensuring our clients maintain the highest standards of financial governance.",
    image: "/images/partner-2.jpg",
    expertise: ["Internal Audit", "Compliance", "Risk Management"],
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    title: "Partner - Strategic Advisory",
    bio: "Rajesh specializes in strategic financial planning and business restructuring. His insights help clients navigate complex financial challenges with confidence.",
    image: "/images/partner-3.jpg",
    expertise: ["M&A Advisory", "Business Restructuring", "Strategic Planning"],
  },
  {
    id: 4,
    name: "Meera Patel",
    title: "Partner - Operations & Growth",
    bio: "Meera oversees our operations and growth initiatives. With a background in both accounting and business management, she ensures operational excellence across all engagements.",
    image: "/images/partner-4.jpg",
    expertise: ["Operations Management", "Process Optimization", "Growth Strategy"],
  },
];

export const Partners = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-brand-50">
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
            Leadership
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
          >
            Meet Our <span className="text-brand-700">Partners</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-base leading-relaxed text-secondary/70 max-w-2xl mx-auto"
          >
            Our founding partners bring together decades of combined experience, expertise, and a shared commitment to delivering exceptional results for our clients.
          </motion.p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className="group"
            >
              <div className="relative mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-brand-700/10 to-accent/10 aspect-square">
                {/* Placeholder for partner image */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-700/20 to-accent/20">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-brand-700/20 mb-2">
                      {partner.name.charAt(0)}
                    </div>
                    <p className="text-xs text-brand-700/40 font-semibold">Photo</p>
                  </div>
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-brand-700/0 group-hover:bg-brand-700/10 transition-colors duration-300 flex items-end justify-center opacity-0 group-hover:opacity-100 p-4">
                  <div className="flex gap-2">
                    <a
                      href="#"
                      className="p-2 rounded-full bg-white text-brand-700 hover:bg-highlight hover:text-white transition-colors"
                      aria-label="LinkedIn"
                    >
                      <FiLinkedin className="h-4 w-4" />
                    </a>
                    <a
                      href="#"
                      className="p-2 rounded-full bg-white text-brand-700 hover:bg-highlight hover:text-white transition-colors"
                      aria-label="Email"
                    >
                      <FiMail className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-secondary">{partner.name}</h3>
                <p className="text-sm font-medium text-brand-700 mt-1">{partner.title}</p>

                <p className="text-sm text-secondary/70 mt-3 leading-relaxed">
                  {partner.bio}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {partner.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="inline-block px-2.5 py-1 rounded-full bg-brand-700/10 text-xs font-medium text-brand-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
