import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { Container } from "../../../components/common/Container";
import { cn } from "../../../../shared/utils/cn";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.1 * i, ease: EASE },
  }),
};

const galleryItems = [
  {
    category: "Office Workspace",
    title: "A Space Built to Focus",
    description: "A calm, organised workspace designed for precision and everyday collaboration.",
    image: "/about-images/bg1.png",
  },
  {
    category: "Client Discussion",
    title: "Documentation & Review",
    description: "Every engagement starts with meticulous review, backed by strong processes.",
    image: "/about-images/bg2.png",
  },
  {
    category: "Precision at Work",
    title: "Numbers, Handled with Care",
    description: "From tax computations to compliance checklists, accuracy defines our craft.",
    image: "/about-images/bg.jpg",
  },
  {
    category: "Team Collaboration",
    title: "Team Spirit",
    description: "Beyond deadlines and deliverables, we celebrate wins and grow together.",
    image: "/about-images/bg2.png",
  },
];

const GalleryCard = ({ item, index }) => {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      custom={index}
      tabIndex={0}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_10px_30px_-14px_rgba(1,24,24,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2"
    >
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-110"
      />

      {/* Persistent base caption */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent p-5 pt-14">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-highlight">
          {item.category}
        </p>
        <h3 className="mt-1 font-display text-base font-bold text-white">{item.title}</h3>
      </div>

      {/* Hover overlay: slides top -> bottom, transform only (no fade) */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-center gap-2 bg-secondary/90 p-6",
          "-translate-y-full transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:translate-y-0 group-focus:translate-y-0"
        )}
      >
        <p className="text-[11px] font-semibold uppercase tracking-widest text-highlight">
          {item.category}
        </p>
        <h3 className="font-display text-xl font-bold text-white">{item.title}</h3>
        <p className="text-sm leading-relaxed text-white/80">{item.description}</p>
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-highlight">
          Discover More
          <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </motion.div>
  );
};

export const LifeGallery = () => {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-12"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-brand-700"
          >
            Life At SAA
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
          >
            A Glimpse Into <span className="text-brand-700">Our Everyday</span>
          </motion.h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {galleryItems.map((item, i) => (
            <GalleryCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
};
