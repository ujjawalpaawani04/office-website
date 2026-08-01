import { Seo } from '../../components/common/Seo';
import { HomeHero } from './components/HomeHero';
import { StatsSection } from './components/StatsSection';
import { AboutUsSnippet } from './components/AboutUsSnippet';
import { KeyServices } from './components/KeyServices';
import { ClientTestimonials } from './components/ClientTestimonials';
import { ContactUsSection } from './components/ContactUsSection';

const Home = () => {
  return (
    <div className="bg-white">
      <Seo
        title="Chartered Accountants for Tax, GST & Business Advisory"
        description="Singh Amit & Associates is a chartered accountancy firm offering income tax, GST, audit, and business advisory services, trusted by 2,000+ businesses."
        canonicalPath="/"
      />
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