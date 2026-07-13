import { motion } from "framer-motion";
import { Container } from "../../components/common/Container";
import { AboutHero } from "./components/AboutHero";
import { OurStory } from "./components/OurStory";
import { Partners } from "./components/Partners";
import { MissionVision } from "./components/MissionVision";
import { AwardsRecognitions } from "./components/AwardsRecognitions";

const About = () => {
  return (
    <div className="bg-white pt-24">
      <AboutHero />
      <OurStory />
      <Partners />
      <MissionVision />
      <AwardsRecognitions />
    </div>
  );
};

export default About;
