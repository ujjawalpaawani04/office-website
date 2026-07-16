import { Container } from "../../../components/common/Container";
import { Hero } from "./components/Hero";
import { Sidebar } from "./components/Sidebar";
import { ComplianceMatters } from "./components/ComplianceMatters";
import { GSTSolutionsGrid } from "./components/GSTSolutionsGrid";
import { FilingCalendar } from "./components/FilingCalendar";
import { ITC } from "./components/ITC";
import { Industries } from "./components/Industries";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { ComplianceHealthCheck } from "./components/ComplianceHealthCheck";
import { WorkingProcess } from "./components/WorkingProcess";
import { FAQSection } from "./components/FAQSection";
import { CTASection } from "./components/CTASection";

const GSTServices = () => {
  return (
    <div>
      <Hero />

      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:items-start">
            <Sidebar />

            <main className="space-y-20 overflow-x-hidden lg:space-y-28">
              <ComplianceMatters />
              <GSTSolutionsGrid />
              <FilingCalendar />
              <ITC />
              <Industries />
              <WhyChooseUs />
              <ComplianceHealthCheck />
              <WorkingProcess />
              <FAQSection />
            </main>
          </div>
        </Container>
      </section>

      <CTASection />
    </div>
  );
};

export default GSTServices;
