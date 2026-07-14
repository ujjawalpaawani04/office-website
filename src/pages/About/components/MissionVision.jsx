import { motion } from "framer-motion";
import { Container } from "../../../components/common/Container";
import { FiTarget, FiEye, FiHeart } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

const values = [
  {
    icon: FiTarget,
    title: "Integrity First",
    description: "We maintain the highest ethical standards in all our engagements, ensuring transparency and accountability in every interaction.",
  },
  {
    icon: FiEye,
    title: "Client-Centric",
    description: "Your success is our success. We take time to understand your business goals and craft tailored solutions that deliver real value.",
  },
  {
    icon: FiHeart,
    title: "Excellence",
    description: "We're committed to continuous improvement and staying ahead of industry standards through ongoing learning and innovation.",
  },
];

export const MissionVision = () => {
  return (
    <section className="py-16 bg-white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-3 mb-16">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-700/5 to-accent/5 rounded-lg blur-xl transition-all group-hover:blur-2xl group-hover:from-brand-700/10 group-hover:to-accent/10" />
            <div className="relative p-8 rounded-lg border border-brand-700/10 bg-white h-full">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-brand-700/10 mb-4">
                <FiTarget className="h-6 w-6 text-brand-700" />
              </div>
              <h3 className="font-display text-2xl font-bold text-secondary mb-3">
                Our Mission
              </h3>
              <p className="text-secondary/70 leading-relaxed">
                To empower businesses across India through comprehensive, innovative financial advisory services that combine technical excellence with deep industry expertise and unwavering commitment to client success.
              </p>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-700/5 to-accent/5 rounded-lg blur-xl transition-all group-hover:blur-2xl group-hover:from-brand-700/10 group-hover:to-accent/10" />
            <div className="relative p-8 rounded-lg border border-brand-700/10 bg-white h-full">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-brand-700/10 mb-4">
                <FiEye className="h-6 w-6 text-brand-700" />
              </div>
              <h3 className="font-display text-2xl font-bold text-secondary mb-3">
                Our Vision
              </h3>
              <p className="text-secondary/70 leading-relaxed">
                To be India's most trusted and innovative chartered accountancy firm, recognized for transforming complex financial challenges into strategic opportunities that drive sustainable business growth.
              </p>
            </div>
          </motion.div>

          {/* Impact */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-700/5 to-accent/5 rounded-lg blur-xl transition-all group-hover:blur-2xl group-hover:from-brand-700/10 group-hover:to-accent/10" />
            <div className="relative p-8 rounded-lg border border-brand-700/10 bg-white h-full">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-brand-700/10 mb-4">
                <FiHeart className="h-6 w-6 text-brand-700" />
              </div>
              <h3 className="font-display text-2xl font-bold text-secondary mb-3">
                Our Impact
              </h3>
              <p className="text-secondary/70 leading-relaxed">
                Beyond financial advisory, we're committed to contributing to India's economic growth through mentorship, thought leadership, and active participation in industry development.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-20 pt-20 border-t border-brand-700/10"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl mb-12 text-center"
          >
            Core <span className="text-brand-700">Values</span>
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  variants={fadeUp}
                  custom={i + 1}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-brand-700/10 to-accent/10 mb-4 mx-auto group hover:from-brand-700/20 hover:to-accent/20 transition-all">
                    <Icon className="h-8 w-8 text-brand-700 group-hover:text-brand-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-secondary mb-2">
                    {value.title}
                  </h3>
                  <p className="text-secondary/70 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
