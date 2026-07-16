import { FiCheckCircle } from "react-icons/fi";

export const KeyTakeaways = ({ points }) => {
  if (!points?.length) return null;

  return (
    <div className="my-10 rounded-2xl border border-brand-700/15 bg-gradient-to-br from-brand-50 to-white p-6 sm:p-8">
      <h2 className="font-display text-xl font-bold text-black">Key Takeaways</h2>
      <ul className="mt-5 space-y-3.5">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-3">
            <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
            <span className="text-[15px] leading-relaxed text-black/75">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
