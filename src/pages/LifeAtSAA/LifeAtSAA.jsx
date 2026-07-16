import { LifeHero } from "./components/LifeHero";
import { OurCulture } from "./components/OurCulture";
import { LifeGallery } from "./components/LifeGallery";
import { InsightsArticles } from "./components/InsightsArticles";
import { MomentsGallery } from "./components/MomentsGallery";
import { GrowCTA } from "./components/GrowCTA";

const LifeAtSAA = () => {
  return (
    <div className="bg-white">
      <LifeHero />
      <OurCulture />
      <LifeGallery />
      <InsightsArticles />
      <MomentsGallery />
      <GrowCTA />
    </div>
  );
};

export default LifeAtSAA;
