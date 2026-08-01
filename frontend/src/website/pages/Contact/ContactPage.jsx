import { Seo } from "../../components/common/Seo";
import { ContactHero } from "./components/ContactHero";
import { ContactForm } from "./components/ContactForm";
import { WhyContactUs } from "./components/WhyContactUs";
import LocationMap from "./components/LocationMap";
// import { ProcessSection } from "./components/ProcessSection";
// import { ContactFAQ } from "./components/ContactFAQ";

const ContactPage = () => {
  return (
    <div className="bg-white">
      <Seo
        title="Contact Us"
        description="Get in touch with Singh Amit & Associates for income tax, GST, audit, and business advisory queries - visit our office or send us a message."
        canonicalPath="/contact"
      />
      <ContactHero />
      <ContactForm />
      {/* <WhyContactUs /> */}
      <LocationMap />
      {/* <ProcessSection /> */}
      {/* <ContactFAQ /> */}
    </div>
  );
};

export default ContactPage;
