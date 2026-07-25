import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { FiAward, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Container } from "../../../components/common/Container";
import { PartnerCard } from "./PartnerCard";
import { AchievementStrip } from "./AchievementStrip";
import { getTeamMembers } from "../../../api/team";
import { getFirmStats } from "../../../api/firmStats";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const EASE = [0.22, 1, 0.36, 1];

const ICON_KEYS = ["award", "users", "filings", "satisfaction"];

const mapMember = (m) => ({
  id: m.id,
  name: m.name,
  designation: m.designation,
  qualifications: m.qualifications,
  bio: m.bio,
  image: m.photoUrl,
  social: { linkedin: m.linkedinUrl, email: m.email },
});

const mapFirmStats = (stats) =>
  stats
    .filter((s) => ICON_KEYS.includes(s.icon))
    .map((s) => ({ id: s.id, icon: s.icon, value: Number(s.value), suffix: s.suffix, label: s.label }));

export const Partners = () => {
  const shouldReduceMotion = useReducedMotion();
  const [partners, setPartners] = useState([]);
  const [firmStats, setFirmStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getTeamMembers(),
      getFirmStats().catch(() => []),
    ])
      .then(([members, stats]) => {
        if (cancelled) return;
        setPartners(Array.isArray(members) ? members.map(mapMember) : []);
        setFirmStats(Array.isArray(stats) ? mapFirmStats(stats) : []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load partners:", err);
        setError("Unable to load our leadership team right now. Please check back shortly.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const [featuredPartner, ...otherPartners] = partners;

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.7,
        delay: shouldReduceMotion ? 0 : 0.12 * i,
        ease: EASE,
      },
    }),
  };

  return (
    <section className="relative overflow-hidden bg-white py-8 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-brand-50 to-white"
      />

      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-700/20 bg-brand-700/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-700"
          >
            <FiAward className="h-3.5 w-3.5" aria-hidden="true" />
            Our Leadership
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-4 font-display text-3xl font-bold leading-[1.15] text-black sm:text-4xl lg:text-5xl"
          >
            Meet Our <span className="text-brand-700">Partners</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-base leading-relaxed text-black"
          >
            Our leadership brings together decades of combined expertise in taxation, audit, and
            business advisory - guiding every client relationship with integrity, precision, and a
            genuine commitment to your success.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            aria-hidden="true"
            className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-brand-700 via-highlight to-gold-500"
          />
        </motion.div>

        {isLoading && (
          <p className="mt-14 text-center text-sm text-black/60" aria-busy="true" aria-live="polite">
            Loading our leadership team...
          </p>
        )}

        {!isLoading && error && (
          <p className="mt-14 text-center text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        )}

        {!isLoading && !error && !featuredPartner && (
          <p className="mt-14 text-center text-sm text-black/60">No team members to show yet.</p>
        )}

        {!isLoading && !error && featuredPartner && (
          <>
            <div className="mt-14">
              <PartnerCard partner={featuredPartner} variant="featured" index={0} />
            </div>

            <AchievementStrip stats={firmStats} />

            {partners.length > 3 ? (
              <div className="relative">
                <div className="mb-6 flex justify-end gap-3">
                  <button
                    type="button"
                    aria-label="Previous team member"
                    className="partners-prev inline-flex h-10 w-10 items-center justify-center rounded-full border border-secondary/15 text-secondary transition hover:border-brand-700 hover:bg-brand-700 hover:text-white"
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next team member"
                    className="partners-next inline-flex h-10 w-10 items-center justify-center rounded-full border border-secondary/15 text-secondary transition hover:border-brand-700 hover:bg-brand-700 hover:text-white"
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <Swiper
                  className="partners-slider partners-dots"
                  modules={[Navigation, Pagination]}
                  slidesPerView={1}
                  spaceBetween={24}
                  navigation={{ prevEl: ".partners-prev", nextEl: ".partners-next" }}
                  pagination={{ clickable: true }}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                  }}
                >
                  {otherPartners.map((partner, i) => (
                    <SwiperSlide key={partner.id} className="h-auto pb-2">
                      <PartnerCard partner={partner} variant="standard" index={i} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {otherPartners.map((partner, i) => (
                  <PartnerCard key={partner.id} partner={partner} variant="standard" index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
};
