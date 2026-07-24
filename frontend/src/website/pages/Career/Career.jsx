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
  isActive: opening.isActive,
});

const Career = () => {
  const [selectedPosition, setSelectedPosition] = useState("");
  // All job openings ever posted (active + closed) - the Apply Now dropdown
  // needs the full list so an applicant can still name a since-closed role;
  // the "Current Openings" cards below just filter this down to active ones.
  const [allPositions, setAllPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getJobOpenings({ all: true })
      .then((data) => {
        if (cancelled) return;
        setAllPositions(Array.isArray(data) ? data.map(mapOpening) : []);
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

  const activePositions = allPositions.filter((p) => p.isActive);

  const handleApply = (positionTitle) => {
    setSelectedPosition(positionTitle);
    document.getElementById("apply-now")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white">
      <CareerHero />
      <CurrentOpenings positions={activePositions} isLoading={isLoading} error={error} onApply={handleApply} />
      <WhyJoinSAA />
      <ApplyNow positions={allPositions} selectedPosition={selectedPosition} />
      <CareerFAQ />
    </div>
  );
};

export default Career;
