import { motion } from "framer-motion";
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

const stats = [
  { value: "20+", label: "Years of Experience" },
  { value: "500+", label: "Happy Clients" },
  { value: "100+", label: "Team Members" },
  { value: "50+", label: "Cities Covered" },
];

export const StatsSection = () => {
  return (
    <section className="relative py-16 lg:py-5 lg:py-8 bg-[#eef4f4] lg:bg-gradient-to-b lg:from-secondary lg:to-brand-900 max-w-7xl lg:-translate-y-[50%] mx-auto lg:rounded-lg ">
                               {/* <div className="absolute inset-0 bg-gradient-to-br from-brand-700/7 rounded-lg blur-xl transition-all group-hover:blur-2xl group-hover:from-brand-700/10 group-hover:to-accent/10 " /> */}

      <Container>
         <motion.div
               initial="hidden"
               whileInView="show"
               viewport={{ once: true }}
               className="text-center mb-10 lg:hidden"
             >
               <motion.span
                 variants={fadeUp}
                 custom={0}
                 className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
               >
                 Our Stats
               </motion.span>
     
               <motion.h2
                 variants={fadeUp}
                 custom={1}
                 className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
               >
                Numbers That Reflect <span className="text-brand-700">Our Commitment</span> to Excellence
               </motion.h2>
     
               <motion.p
                 variants={fadeUp}
                 custom={2}
                 className="mt-4 text-base leading-relaxed text-secondary/70 max-w-2xl mx-auto"
               >
A proven track record of delivering trusted financial, taxation, and legal solutions with integrity.               </motion.p>
             </motion.div>
        <div className="grid gap-4 lg:gap-8 md:grid-cols-2 lg:grid-cols-4 relative">

          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className={`text-center group ${i === stats.length - 1 ? "" : "lg:border-r lg:border-white" } shadow-sm lg:shadow-none bg-white lg:bg-transparent rounded-lg lg:rounded-none p-4 lg:p-0`}
            >

              
              <div className="relative inline-block mb-3">
                {/* <div className="absolute inset-0 bg-gradient-to-br from-highlight/20 to-accent/20 rounded-full blur-xl group-hover:blur-2xl transition-all" /> */}
                <p className="relative text-4xl sm:text-5xl font-bold lg:text-highlight font-display text-brand-700">
                  {stat.value}
                </p>
              </div>
              <p className="text-base font-medium lg:text-white/80 text-secondary/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
