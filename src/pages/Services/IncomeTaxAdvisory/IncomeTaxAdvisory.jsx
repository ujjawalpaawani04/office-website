import { Container } from "../../../components/common/Container";
import { Hero } from "./components/Hero";
import { Sidebar } from "./components/Sidebar";
import { Overview } from "./components/Overview";
import { ITRFiling } from "./components/ITRFiling";
import { TaxPlanning } from "./components/TaxPlanning";
import { TaxAdvisory } from "./components/TaxAdvisory";
import { TaxCompliance } from "./components/TaxCompliance";
import { NoticeAssessment } from "./components/NoticeAssessment";
import { BusinessTaxConsultation } from "./components/BusinessTaxConsultation";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { ProcessTimeline } from "./components/ProcessTimeline";
import { FAQSection } from "./components/FAQSection";
import { CTASection } from "./components/CTASection";

const IncomeTaxAdvisory = () => {
  return (
    <div>
      <Hero />

      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:items-start">
            <Sidebar />

            <main className="space-y-15 lg:space-y-20">
              <Overview />
              <ITRFiling />
              <TaxPlanning />
              <TaxAdvisory />
              <TaxCompliance />
              <NoticeAssessment />
              <BusinessTaxConsultation />
              <WhyChooseUs />
              <ProcessTimeline />
             
            </main>
          </div>
           <FAQSection />
        </Container>
      </section>

      <CTASection />
    </div>
  );
};

export default IncomeTaxAdvisory;
