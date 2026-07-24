import { HomeHero } from './components/HomeHero';
import { StatsSection } from './components/StatsSection';
import { AboutUsSnippet } from './components/AboutUsSnippet';
import { KeyServices } from './components/KeyServices';
import { ClientTestimonials } from './components/ClientTestimonials';
import { ContactUsSection } from './components/ContactUsSection';

const Home = () => {
  return (
    <div className="bg-white">
      <HomeHero />
      <StatsSection />
      <AboutUsSnippet />
      <KeyServices />
      <ClientTestimonials />
      <ContactUsSection />
    </div>
  );
};

export default Home;