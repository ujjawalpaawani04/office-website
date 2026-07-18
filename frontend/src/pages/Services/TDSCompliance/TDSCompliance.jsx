import { Container } from "../../../components/common/Container";
import { Hero } from "./components/Hero";
import { Sidebar } from "./components/Sidebar";
import { ComplianceMatters } from "./components/ComplianceMatters";
import { TDSSolutionsGrid } from "./components/TDSSolutionsGrid";
import { FilingCalendar } from "./components/FilingCalendar";
import { FormsReconciliation } from "./components/FormsReconciliation";
import { WhoNeedsTDS } from "./components/WhoNeedsTDS";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { ComplianceHealthCheck } from "./components/ComplianceHealthCheck";
import { WorkingProcess } from "./components/WorkingProcess";
import { FAQSection } from "./components/FAQSection";
import { CTASection } from "./components/CTASection";

const TDSCompliance = () => {
  return (
    <div>
      <Hero />

      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:items-start">
            <Sidebar />

            <main className="space-y-15 lg:space-y-20">
              <ComplianceMatters />
              <TDSSolutionsGrid />
              <FilingCalendar />
              <FormsReconciliation />
              <WhoNeedsTDS />
              <WhyChooseUs />
              <ComplianceHealthCheck />
              <WorkingProcess />
            </main>
          </div>
          <FAQSection />
        </Container>
      </section>

      <CTASection />
    </div>
  );
};

export default TDSCompliance;
