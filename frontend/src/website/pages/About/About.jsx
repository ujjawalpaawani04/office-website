import { motion } from "framer-motion";
import { Container } from "../../components/common/Container";
import { Seo } from "../../components/common/Seo";
import { AboutHero } from "./components/AboutHero";
import { OurStory } from "./components/OurStory";
import { Partners } from "./components/Partners";
import { MissionVision } from "./components/MissionVision";
import { AwardsRecognitions } from "./components/AwardsRecognitions";
import { Certifications } from "./components/Certifications";

const About = () => {
  return (
    <div>
      <Seo
        title="About Us"
        description="Trusted accounting excellence since 2014 - meet the chartered accountants behind Singh Amit & Associates and our approach to taxation, audit, and advisory."
        canonicalPath="/about"
      />
      <AboutHero />
      <OurStory />
      <Partners />
      <MissionVision />
      <AwardsRecognitions />
      <Certifications />
    </div>
  );
};

export default About;
