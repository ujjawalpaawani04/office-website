import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
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

const testimonials = [
  {
    id: 1,
    quote:
      "Singh Amit & Associates transformed our financial operations. Their expertise in GST compliance saved us thousands annually. Truly exceptional service!",
    author: "Rajesh Gupta",
    company: "Tech Innovations Ltd",
    logo: "TI",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "Working with them for our M&A was seamless. Their strategic guidance and attention to detail made all the difference in closing the deal successfully.",
    author: "Priya Sharma",
    company: "Global Finance Corp",
    logo: "GF",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "The audit process was thorough and professional. They identified areas for improvement that strengthened our internal controls significantly.",
    author: "Amit Verma",
    company: "Manufacturing Excellence",
    logo: "ME",
    rating: 5,
  },
  {
    id: 4,
    quote:
      "Their financial advisory helped us scale from 50 to 500 employees without losing sight of profitability. Highly recommended!",
    author: "Neha Patel",
    company: "StartUp Ventures",
    logo: "SV",
    rating: 5,
  },
];

export const ClientTestimonials = () => {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoPlay]);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setAutoPlay(false);
  };

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setAutoPlay(false);
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
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
            Client Voices
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-3 font-display text-3xl font-bold leading-[1.2] text-secondary sm:text-4xl"
          >
            What Our <span className="text-brand-700">Clients Say</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-base leading-relaxed text-secondary/70 max-w-2xl mx-auto"
          >
            Don't just take our word for it. Hear from the businesses we've helped achieve their financial goals.
          </motion.p>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative group"
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
        >
          <div className="overflow-hidden rounded-lg">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              key={current}
            >
              <div className="relative bg-gradient-to-br from-brand-700 to-brand-900 p-8 lg:p-12 rounded-lg">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonials[current].rating }).map(
                    (_, i) => (
                      <FiStar
                        key={i}
                        className="h-5 w-5 fill-highlight text-highlight"
                      />
                    )
                  )}
                </div>

                {/* Quote */}
                <p className="text-lg lg:text-xl font-medium text-white leading-relaxed mb-8">
                  "{testimonials[current].quote}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-highlight/20">
                      <span className="text-2xl font-bold text-highlight">
                        {testimonials[current].logo}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {testimonials[current].author}
                    </p>
                    <p className="text-white/70 text-sm">
                      {testimonials[current].company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center h-12 w-12 rounded-full bg-brand-700/10 text-brand-700 transition-all duration-300 hover:bg-brand-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 lg:-left-16 group-hover:opacity-100"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center h-12 w-12 rounded-full bg-brand-700/10 text-brand-700 transition-all duration-300 hover:bg-brand-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 lg:-right-16 group-hover:opacity-100"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrent(i);
                  setAutoPlay(false);
                }}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? "bg-brand-700 w-8 h-2.5"
                    : "bg-brand-700/30 w-2.5 h-2.5 hover:bg-brand-700/60"
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
