import { IoCheckmarkDoneOutline } from "react-icons/io5";

export const KeyTakeaways = ({ items }) => {
  if (!items?.length) return null;

  return (
    <div className="mt-12 rounded-2xl border-l-4 border-brand-700 bg-brand-50 p-6 sm:p-8">
      <h2 className="font-display text-xl font-bold text-secondary">Key Takeaways</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <IoCheckmarkDoneOutline className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
            <span className="text-sm leading-relaxed text-secondary/80">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
