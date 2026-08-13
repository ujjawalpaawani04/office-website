import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiFileText,
  FiShield,
} from "react-icons/fi";
import { LuUserRoundCheck } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import {
   FaBalanceScale,
   FaLaptopCode
   } from "react-icons/fa";
import { Container } from "../../../components/common/Container";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

const services = [
  {
    icon: LuUserRoundCheck,
    title: "Direct involvement of the proprietor",
    description:
      "Engagements are supervised by CA Amit Singh, and the client deals with the same point of contact through the assignment.",
    
  },
  {
    icon: SlCalender,
    title: "Compliance calendar discipline",
    description:
      "Statutory due dates under the Income-tax Act, GST law, the Companies Act and RERA are tracked for every client, with reminders raised ahead of the due date.",
    
  },
  {
    icon: FiFileText,
    title: "Documentation",
    description:
      "Working papers, reconciliations and audit documentation are maintained in accordance with applicable professional standards, so that positions taken can be supported during assessment or scrutiny.",
    
  },
  {
    icon: FiShield,
    title: "Confidentiality",
    description:
      "Client information is treated as confidential and is handled in accordance with the Code of Ethics issued by ICAI.",
    
  },
  {
    icon: FaBalanceScale,
    title: "Local regulatory knowledge",
    description:
      "In addition to central tax and corporate law, the firm handles matters under the Uttarakhand Zamindari Abolition and Land Reforms Act and the Real Estate (Regulation and Development) Act, 2016, as applicable in Uttarakhand.",
    
  },
  {
    icon: FaLaptopCode,
    title: "Technology",
    description:
      "The firm works with commonly used accounting and compliance platforms, including Tally, and with the Income-tax, GST, MCA, TRACES and UK-RERA portals.",
    
  },
];

export const KeyServices = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-brand-50 to-white">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="lg:text-center mb-16"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            Our Approach
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
          >
            Delivering Value <span className="text-brand-700">Consistently</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-base leading-relaxed text-black max-w-2xl lg:mx-auto"
          >
            Delivering accurate, compliant, and client-focused financial solutions through expert guidance, proactive planning, transparent communication, and strict adherence to professional and regulatory standards.
          </motion.p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="group relative"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-700/5 to-accent/5 rounded-lg blur-xl transition-all group-hover:blur-2xl group-hover:from-brand-700/10 group-hover:to-accent/10 " />

                {/* Card */}
                <div className="relative p-8 rounded-lg border border-brand-700/10 bg-white h-full flex flex-col transition-all duration-300 group-hover:border-brand-700/30 group-hover:shadow-lg">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-lg bg-gradient-to-br from-brand-700/10 to-accent/10 mb-5 group-hover:from-brand-700/20 group-hover:to-accent/20 transition-all">
                    <Icon className="h-7 w-7 text-brand-700 group-hover:text-brand-600" />
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-lg text-black mb-3">
                    {service.title}
                  </h3>
                  <p className="text-black text-sm leading-relaxed flex-1">
                    {service.description}
                  </p>

                  {/* Link */}
                  
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
