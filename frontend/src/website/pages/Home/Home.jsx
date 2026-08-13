import { Seo } from '../../components/common/Seo';
import { HomeHero } from './components/HomeHero';
import { StatsSection } from './components/StatsSection';
import { AboutUsSnippet } from './components/AboutUsSnippet';
import { ServicesSnapshot } from './components/ServicesSnapshot';
import { KeyServices } from './components/KeyServices';
import { ClientTestimonials } from './components/ClientTestimonials';
import { KnowledgeCentreTeaser } from './components/KnowledgeCentreTeaser';
import { ContactUsSection } from './components/ContactUsSection';

const Home = () => {
  return (
    <div className="bg-white">
      <Seo
        title="Chartered Accountants in Roorkee - Income Tax, GST, Audit & ROC"
        description="Singh Amit & Associates is a firm of Chartered Accountants practising from Roorkee, Uttarakhand, offering income tax, GST, audit and assurance, accounting, ROC, RERA and land law compliance services."
        canonicalPath="/"
      />
      <HomeHero />
      <StatsSection />
      <AboutUsSnippet />
      <ServicesSnapshot />
      <KeyServices />
      <ClientTestimonials />
      <KnowledgeCentreTeaser />
      <ContactUsSection />
    </div>
  );
};

export default Home;