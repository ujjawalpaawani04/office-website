import { motion } from "framer-motion";
import { Container } from "../../../components/common/Container";
import { FiAward, FiStar, FiTrendingUp } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

const awards = [
  {
    year: "2023",
    title: "Best Emerging CA Firm",
    organization: "Indian Chartered Accountants Association",
    icon: FiAward,
    description: "Recognized for innovative approach and excellence in service delivery",
  },
  {
    year: "2022",
    title: "Excellence in Financial Advisory",
    organization: "Business Excellence Awards India",
    icon: FiStar,
    description: "For outstanding contributions to corporate taxation and planning",
  },
  {
    year: "2021",
    title: "Top 50 CA Firms",
    organization: "CA Practice Magazine",
    icon: FiTrendingUp,
    description: "Ranked among India's leading chartered accountancy practices",
  },
  {
    year: "2020",
    title: "Client Choice Award",
    organization: "Financial Services Excellence Forum",
    icon: FiStar,
    description: "Voted by clients for consistency and quality of service",
  },
  {
    year: "2019",
    title: "Innovation in Audit",
    organization: "ICAI Annual Conference",
    icon: FiTrendingUp,
    description: "For implementing cutting-edge audit methodologies",
  },
  {
    year: "2018",
    title: "ICAI Registered Firm Certification",
    organization: "Institute of Chartered Accountants of India",
    icon: FiAward,
    description: "Official recognition as a registered CA firm",
  },
];

const certifications = [
  "ICAI Registered Firm",
  "ISO 9001:2015 Certified",
  "GST Authorized Partner",
  "Udyam Registered",
];

export const AwardsRecognitions = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-white via-white to-brand-50">
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
            Recognition
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
          >
            Awards & <span className="text-brand-700">Recognitions</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-base leading-relaxed text-secondary/70 max-w-2xl mx-auto"
          >
            Over the years, our commitment to excellence has been recognized by leading industry bodies and client testimonials. These accolades reinforce our dedication to delivering world-class services.
          </motion.p>
        </motion.div>

        {/* Awards Timeline */}
        <div className="space-y-6 mb-16">
          {awards.map((award, i) => {
            const Icon = award.icon;
            return (
              <motion.div
                key={award.year + award.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="group relative"
              >
                <div className="flex gap-6">
                  {/* Timeline marker */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-brand-700/20 to-accent/20 border border-brand-700/30 group-hover:from-brand-700/40 group-hover:to-accent/40 transition-all">
                      <Icon className="h-5 w-5 text-brand-700" />
                    </div>
                    {i < awards.length - 1 && (
                      <div className="w-1 h-20 bg-gradient-to-b from-brand-700/30 to-brand-700/5 mt-2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-6 pt-2 flex-1">
                    <p className="text-sm font-semibold text-brand-700 uppercase tracking-wide">
                      {award.year}
                    </p>
                    <h3 className="font-semibold text-lg text-secondary mt-1">
                      {award.title}
                    </h3>
                    <p className="text-sm text-secondary/60 font-medium mt-0.5">
                      {award.organization}
                    </p>
                    <p className="text-secondary/70 text-sm mt-2 leading-relaxed">
                      {award.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-20 pt-20 border-t border-brand-700/10"
        >
          <h3 className="font-display text-2xl font-bold text-secondary mb-8 text-center">
            Official <span className="text-brand-700">Certifications</span>
          </h3>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="relative group p-6 rounded-lg border border-brand-700/10 bg-gradient-to-br from-white to-brand-50 hover:border-brand-700/30 hover:bg-brand-50 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-700/10 group-hover:bg-brand-700/20 transition-colors">
                      <FiAward className="h-4 w-4 text-brand-700" />
                    </div>
                  </div>
                  <p className="font-medium text-secondary">{cert}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
