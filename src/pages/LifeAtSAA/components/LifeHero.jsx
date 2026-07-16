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

export const LifeHero = () => {
  return (
    <section className="relative isolate flex h-[70vh] max-h-[700px] w-full items-center overflow-hidden bg-secondary pb-20 pt-36 lg:pt-40">
      <img
        src="/about-images/bg1.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover pointer-events-none"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/95 via-secondary/85 to-secondary" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary/90 via-secondary/40 to-transparent" />

      <Container className="relative">
        <div className="max-w-3xl">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-highlight/50 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-highlight backdrop-blur-sm"
          >
            Life@SAA
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-[3.2rem]"
          >
            More Than a Workplace - A Community of Learning,{" "}
            <span className="text-highlight">and Excellence.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 text-base leading-relaxed text-white/80 sm:text-lg"
          >
            At SAA, we believe in building careers through collaboration, continuous learning, and
            meaningful client experiences. Every day is an opportunity to grow professionally while
            working alongside experienced mentors and delivering value to our clients.
          </motion.p>
        </div>
      </Container>
    </section>
  );
};
