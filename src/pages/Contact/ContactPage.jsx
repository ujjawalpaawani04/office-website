import { ContactHero } from "./components/ContactHero";
import { ContactForm } from "./components/ContactForm";
import { WhyContactUs } from "./components/WhyContactUs";
import { ProcessSection } from "./components/ProcessSection";
import { ContactFAQ } from "./components/ContactFAQ";

const ContactPage = () => {
  return (
    <div className="bg-white">
      <ContactHero />
      <ContactForm />
      <WhyContactUs />
      <ProcessSection />
      <ContactFAQ />
    </div>
  );
};

export default ContactPage;
