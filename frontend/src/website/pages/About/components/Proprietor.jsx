import { motion, useReducedMotion } from "framer-motion";
import { FiAward } from "react-icons/fi";
import { Container } from "../../../components/common/Container";
import { FIRM_INFO, ADDITIONAL_QUALIFICATIONS } from "../firmInfo";

const EASE = [0.22, 1, 0.36, 1];

const qualifications = ["B.Com", "FCA", ...ADDITIONAL_QUALIFICATIONS];

const experienceClause = FIRM_INFO.yearsOfPractice
  ? `over ${FIRM_INFO.yearsOfPractice} years of experience`
  : "experience";

const branchSentence = FIRM_INFO.icaiBranch
  ? `He is a member of the ${FIRM_INFO.icaiBranch} Branch of the Central India Regional Council of ICAI.`
  : null;

const bio = [
  `CA CA Amit Singh has ${experienceClause} in income tax compliance and advisory, goods and services tax, statutory and tax audit, and corporate and regulatory compliance.`,
  "Areas of work include return filing and assessment support under the Income-tax Act, 1961, GST registration and periodic compliance, audits of companies, firms and societies, ROC filings under the Companies Act, 2013, RERA registration and compliance, and consultancy under the Uttarakhand Zamindari Abolition and Land Reforms Act.",
  branchSentence,
]
  .filter(Boolean)
  .join(" ");

const metaLine = [
  "Proprietor",
  FIRM_INFO.membershipNumber ? `ICAI Membership No. ${FIRM_INFO.membershipNumber}` : null,
  FIRM_INFO.qualifiedYear ? `Qualified in ${FIRM_INFO.qualifiedYear}` : null,
]
  .filter(Boolean)
  .join(" · ");

export const Proprietor = () => {
  const shouldReduceMotion = useReducedMotion();

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
    <section id="proprietor" className="relative overflow-hidden bg-white py-8 sm:py-28">
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
            Meet the <span className="text-brand-700">Proprietor</span>
          </motion.h2>

          <motion.div
            variants={fadeUp}
            custom={3}
            aria-hidden="true"
            className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-brand-700 via-highlight to-gold-500"
          />
        </motion.div>

        <motion.article
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          custom={2}
          className="group relative mx-auto mt-14 max-w-4xl overflow-hidden rounded-3xl border border-brand-700/15 bg-white p-8 shadow-[0_10px_36px_-18px_rgba(1,24,24,0.22)] transition-all duration-300 sm:p-10 lg:p-12"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-700 via-highlight to-gold-500"
          />

          <div className="flex flex-col items-center gap-9 text-center lg:flex-row lg:gap-12 lg:text-left">
            <div className="relative shrink-0">
              <div className="rounded-full bg-gradient-to-br from-brand-700 via-highlight to-gold-500 p-[3px] shadow-[0_12px_28px_-12px_rgba(1,24,24,0.35)]">
                <div
                  aria-hidden="true"
                  className="flex h-44 w-44 items-center justify-center rounded-full border-4 border-white bg-brand-50 font-display text-4xl font-bold text-brand-700 sm:h-52 sm:w-52"
                >
                  AS
                </div>
              </div>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-700 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-md">
                Proprietor
              </span>
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-center lg:items-start">
              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                {qualifications.map((q) => (
                  <span
                    key={q}
                    className="rounded-full bg-brand-700/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-brand-700"
                  >
                    {q}
                  </span>
                ))}
              </div>

              <h3 className="mt-4 font-display text-2xl font-bold text-black sm:text-3xl">
                CA CA Amit Singh
              </h3>
              <p className="mt-1.5 text-sm font-semibold uppercase tracking-wide text-brand-700">
                {metaLine}
              </p>

              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-black sm:text-base">
                {bio}
              </p>
            </div>
          </div>
        </motion.article>
      </Container>
    </section>
  );
};
