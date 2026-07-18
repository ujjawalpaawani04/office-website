import { useState } from "react";
import { CareerHero } from "./components/CareerHero";
import { CurrentOpenings } from "./components/CurrentOpenings";
import { WhyJoinSAA } from "./components/WhyJoinSAA";
import { ApplyNow } from "./components/ApplyNow";
import { CareerFAQ } from "./components/CareerFAQ";

const Career = () => {
  const [selectedPosition, setSelectedPosition] = useState("");

  const handleApply = (positionTitle) => {
    setSelectedPosition(positionTitle);
    document.getElementById("apply-now")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white">
      <CareerHero />
      <CurrentOpenings onApply={handleApply} />
      <WhyJoinSAA />
      <ApplyNow selectedPosition={selectedPosition} />
      <CareerFAQ />
    </div>
  );
};

export default Career;
