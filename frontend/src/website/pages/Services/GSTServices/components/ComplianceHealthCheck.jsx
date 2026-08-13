import { motion, useReducedMotion } from "framer-motion";
import { FiFilePlus, FiCalendar, FiRepeat, FiEye, FiFolder, FiArchive } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: EASE },
  }),
};

const checks = [
  { icon: FiFilePlus, title: "Registration & Amendments", description: "Assessment of registration liability, amendment of registration particulars, and cancellation or revocation of cancellation." },
  { icon: FiCalendar, title: "Monthly & Quarterly Returns", description: "GSTR-1, GSTR-3B, GSTR-4 and other applicable returns, including returns under the QRMP scheme." },
  { icon: FiRepeat, title: "Reconciliation", description: "Reconciliation of outward supplies with books of account and of input tax credit with GSTR-2B, with follow-up on mismatches." },
  { icon: FiEye, title: "Notices & Departmental Proceedings", description: "Replies to notices in Form ASMT-10, DRC-01A and DRC-01, and assistance during departmental audit and scrutiny." },
  { icon: FiFolder, title: "E-invoicing & E-way Bills", description: "Advisory on the applicability of e-invoicing and review of e-way bill compliance." },
  { icon: FiArchive, title: "Annual Return", description: "Preparation of GSTR-9 and, where applicable, the reconciliation statement in GSTR-9C." },
];

export const ComplianceHealthCheck = () => {
  const reduced = useReducedMotion();

  return (
    <section id="gst-compliance" className="scroll-mt-28">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-2xl"
      >
        <motion.span
          variants={fadeUp}
          custom={0}
          className="text-sm font-semibold uppercase tracking-widest text-brand-700"
        >
          Compliance Areas
        </motion.span>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mt-3 font-display text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
        >
          GST Compliance <span className="text-brand-700">Coverage</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 text-base leading-relaxed text-black"
        >
          The areas of GST compliance and advisory covered as part of the engagement.
        </motion.p>
      </motion.div>

      <div className="relative mt-10">
        <div aria-hidden="true" className="absolute top-2 bottom-2 left-6 w-px bg-secondary/10" />
        <motion.div
          aria-hidden="true"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0 : 1, ease: EASE }}
          style={{ transformOrigin: "top" }}
          className="absolute top-2 bottom-2 left-6 w-px bg-gradient-to-b from-brand-700 to-accent"
        />

        <div className="space-y-6">
          {checks.map((check, i) => {
            const Icon = check.icon;
            return (
              <motion.div
                key={check.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                className="relative flex items-start gap-5"
              >
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white shadow-md shadow-brand-700/20">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="rounded-xl border border-secondary/10 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-black">{check.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-black">{check.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
