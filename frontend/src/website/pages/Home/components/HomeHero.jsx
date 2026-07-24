import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight} from "react-icons/fi";
import { Container } from "../../../components/common/Container";

// images
// import bgImg from "../../../assets/images/home-hero-bg-img.jfif";
import heroImg from "../../../assets/images/image2.png";

// videos
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

export const HomeHero = () => {
  return (
    <section className="relative isolate flex min-h-[90vh] w-full items-center overflow-hidden bg-secondary pb-5 lg:pb-0 pt-16 sm:pt-25 lg:min-h-0 lg:h-[100vh] lg:max-h-[900px]">
      {/* Background video - replace the <source> below with the firm's footage at
          public/videos/ca-hero-bg.mp4 (+ a .webm for smaller file size). The poster
          image keeps the section fully readable before the video loads or if it 404s. */}
      <video
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        // poster={bgImg}
        aria-hidden="true"
      >
        <source src="/videos/ca-hero-bg.webm" type="video/webm" />
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Dark navy overlay - directional gradient keeps the left text column high-contrast
          while letting the video breathe more on the right, behind the portrait. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/45" />
      <div className="absolute inset-0 -z-10 bg-secondary/25" />

      <Container className="relative grid  gap-10 lg:grid-cols-2 lg:gap-8 h-full ">
        {/* Text column */}
        <div className="order-2  lg:order-1 content-center">
        

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 font-display text-hero-h1 font-bold leading-[1.1] text-white"
          >
            Chartered Accountancy,
            <br />
            <span className="text-highlight">Elevated.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 text-base leading-relaxed text-white/80 sm:text-lg"
          >
            From incorporation to audit, taxation, and compliance, we deliver precise,
            confidential, and forward-looking financial guidance - backed by 20+ years of
            experience trusted by businesses across India.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-md bg-highlight px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-black shadow-lg shadow-highlight/20 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
            >
              Get a Free Consultation
              <FiArrowRight
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Know More
            </Link>
          </motion.div>

          {/* <motion.dl
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-12 flex flex-wrap gap-x-4 gap-y-4 border-t border-white/10 pt-8"
          >
            {trustPoints.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-white/85">
                <Icon className="h-5 w-5 shrink-0 text-highlight" aria-hidden="true" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </motion.dl> */}
        </div>

        {/* Portrait column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="hidden lg:block relative order-1 mx-auto content-end overflow-hidden"
        >
          {/* <div className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-[2.5rem] bg-gradient-to-br from-highlight/30 via-highlight/10 to-transparent blur-2xl" /> */}
          {/* <div className="absolute -inset-4 -z-10 hidden rounded-[2.5rem] border border-highlight/20 sm:block" /> */}
          <motion.img
            src={heroImg}
            alt="Senior Chartered Accountant at the firm"
            className="w-full object-cover  h-[90%]"
            // animate={{ y: [0, -12, 0] }}
            // transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </Container>

      {/* Scroll cue */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute inset-x-0 bottom-8 hidden justify-center lg:flex"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1.5"
          aria-hidden="true"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-highlight" />
        </motion.span>
      </motion.div> */}
    </section>
  );
};
