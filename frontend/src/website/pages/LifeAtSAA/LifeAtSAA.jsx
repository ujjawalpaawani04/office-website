import { Seo } from "../../components/common/Seo";
import { LifeHero } from "./components/LifeHero";
import { OurCulture } from "./components/OurCulture";
import { LifeGallery } from "./components/LifeGallery";
import { InsightsArticles } from "./components/InsightsArticles";
import { MomentsGallery } from "./components/MomentsGallery";
import { GrowCTA } from "./components/GrowCTA";

const LifeAtSAA = () => {
  return (
    <div className="bg-white">
      <Seo
        title="Life at SAA"
        description="A look inside our culture, workspace, and team at Singh Amit & Associates - what it's like to grow your career with us."
        canonicalPath="/life-at-saa"
      />
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
