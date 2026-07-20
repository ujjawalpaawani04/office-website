import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { Container } from "../../../components/common/Container";
import { Breadcrumb } from "../../../components/common/Breadcrumb";

import heroVideo from "../../../assets/videos/home-hero-video.mp4";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: EASE },
  }),
};

export const AboutHero = () => {
  return (
    <section className="relative isolate flex min-h-[100vh] w-full items-center overflow-hidden bg-secondary pb-16 lg:pb-0 pt-25 lg:min-h-0 lg:h-[100vh] lg:max-h-[900px]">
      <img
  src="/about-images/bg2.png"
  alt="About Background"
  className="absolute inset-0 -z-20 h-full w-full object-cover pointer-events-none"
/>

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/45" />
      <div className="absolute inset-0 -z-10 bg-secondary/25" />

      <Container className="relative">
        <div className="max-w-3xl">
          

          <Breadcrumb items={[{ label: "About Us" }]} />
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 font-display text-hero-h1 font-bold leading-[1.1] text-white"
          >
            Trusted Chartered Accountants Delivering Financial Excellence <span className="text-highlight">Since [2014]</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 text-base leading-relaxed text-white/80 sm:text-lg"
          >
            We are a dedicated team of Chartered Accountants committed to helping individuals, startups, and businesses achieve financial clarity and sustainable growth. From taxation and accounting to auditing, GST compliance, and business advisory, we provide reliable, transparent, and result-driven financial solutions tailored to your needs.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-md bg-highlight px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-black shadow-lg shadow-highlight/20 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
            >
              Work With Us
              <FiArrowRight
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <a
              href="#our-story"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Learn More
            </a>
          </motion.div>
        </div>
        
      
      </Container>
    </section>
  );
};
