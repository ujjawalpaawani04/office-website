import { useEffect, useState } from "react";
import { FiAward, FiBookOpen, FiClipboard, FiPercent, FiShield } from "react-icons/fi";
import { CareerHero } from "./components/CareerHero";
import { CurrentOpenings } from "./components/CurrentOpenings";
import { WhyJoinSAA } from "./components/WhyJoinSAA";
import { ApplyNow } from "./components/ApplyNow";
import { CareerFAQ } from "./components/CareerFAQ";
import { getJobOpenings } from "../../api/careers";

const ICONS_CYCLE = [FiAward, FiBookOpen, FiClipboard, FiPercent, FiShield];

const EMPLOYMENT_TYPE_LABELS = {
  full_time: "Full-Time",
  part_time: "Part-Time",
  internship: "Articleship",
  contract: "Contract",
};

const mapOpening = (opening, i) => ({
  icon: ICONS_CYCLE[i % ICONS_CYCLE.length],
  title: opening.title,
  description: opening.description,
  experience: opening.requirements || (opening.minExperienceYears != null ? `${opening.minExperienceYears}+ Years` : ""),
  location: opening.location,
  type: EMPLOYMENT_TYPE_LABELS[opening.employmentType] || opening.employmentType,
});

const Career = () => {
  const [selectedPosition, setSelectedPosition] = useState("");
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getJobOpenings()
      .then((data) => {
        if (cancelled) return;
        setPositions(Array.isArray(data) ? data.map(mapOpening) : []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load job openings:", err);
        setError("Unable to load current openings right now. Please check back shortly.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleApply = (positionTitle) => {
    setSelectedPosition(positionTitle);
    document.getElementById("apply-now")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white">
      <CareerHero />
      <CurrentOpenings positions={positions} isLoading={isLoading} error={error} onApply={handleApply} />
      <WhyJoinSAA />
      <ApplyNow positions={positions} selectedPosition={selectedPosition} />
      <CareerFAQ />
    </div>
  );
};

export default Career;
