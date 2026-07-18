import { Container } from "../../../components/common/Container";
import { Hero } from "./components/Hero";
import { Sidebar } from "./components/Sidebar";
import { Overview } from "./components/Overview";
import { ServicesGrid } from "./components/ServicesGrid";
import { WorkingProcess } from "./components/WorkingProcess";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { Benefits } from "./components/Benefits";
import { Industries } from "./components/Industries";
import { FAQSection } from "./components/FAQSection";
import { CTASection } from "./components/CTASection";

const AccountingBookkeeping = () => {
  return (
    <div>
      <Hero />

      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:items-start">
            <Sidebar />

            <main className="space-y-15 lg:space-y-20">
              <Overview />
              <ServicesGrid />
              <WorkingProcess />
              <WhyChooseUs />
              <Benefits />
              <Industries />
            </main>
          </div>
          <FAQSection />
        </Container>
      </section>

      <CTASection />
    </div>
  );
};

export default AccountingBookkeeping;
