import { ContactHero } from "./components/ContactHero";
import { ContactForm } from "./components/ContactForm";
import { WhyContactUs } from "./components/WhyContactUs";
import LocationMap from "./components/LocationMap";
// import { ProcessSection } from "./components/ProcessSection";
// import { ContactFAQ } from "./components/ContactFAQ";

const ContactPage = () => {
  return (
    <div className="bg-white">
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
