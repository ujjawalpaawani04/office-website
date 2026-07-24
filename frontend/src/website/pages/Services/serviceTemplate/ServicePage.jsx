import { Container } from "../../../components/common/Container";
import { Hero } from "./Hero";
import { Sidebar } from "./Sidebar";
import { Overview } from "./Overview";
import { ServicesGrid } from "./ServicesGrid";
import { WorkingProcess } from "./WorkingProcess";
import { WhyChooseUs } from "./WhyChooseUs";
import { Benefits } from "./Benefits";
import { Industries } from "./Industries";
import { FAQSection } from "./FAQSection";
import { CTASection } from "./CTASection";

// Shared page shell for every "Corporate & Specialised Services" page (and any
// other service page that doesn't need bespoke sections). Each page supplies
// its own content via `config` - the layout, spacing, sidebar behaviour and
// section order are identical to the Income Tax & Tax Advisory reference page.
export const ServicePage = ({ config }) => {
  const { slug, sidebarTitle, hero, overview, services, process, whyChooseUs, benefits, industries, faqs, cta, sections } =
    config;

  return (
    <div>
      <Hero
        breadcrumbLabel={hero.breadcrumbLabel}
        titlePre={hero.titlePre}
        titleHighlight={hero.titleHighlight}
        description={hero.description}
        backgroundImageUrl={hero.backgroundImageUrl}
      />

      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:items-start">
            <Sidebar title={sidebarTitle} slug={slug} sections={sections} />

            <main className="space-y-15 lg:space-y-20">
              <Overview
                tagline={overview.tagline}
                headingPre={overview.headingPre}
                headingHighlight={overview.headingHighlight}
                paragraphs={overview.paragraphs}
                highlights={overview.highlights}
              />
              <ServicesGrid
                tagline={services.tagline}
                headingPre={services.headingPre}
                headingHighlight={services.headingHighlight}
                intro={services.intro}
                items={services.items}
              />
              <WorkingProcess intro={process.intro} steps={process.steps} />
              <WhyChooseUs
                intro={whyChooseUs.intro}
                reasons={whyChooseUs.reasons}
                imageAlt={whyChooseUs.imageAlt}
                imageUrl={whyChooseUs.imageUrl}
              />
              <Benefits
                tagline={benefits.tagline}
                headingPre={benefits.headingPre}
                headingHighlight={benefits.headingHighlight}
                intro={benefits.intro}
                benefits={benefits.items}
              />
              <Industries intro={industries.intro} industries={industries.items} />
            </main>
          </div>
          <FAQSection faqs={faqs} idPrefix={slug} />
        </Container>
      </section>

      <CTASection heading={cta.heading} description={cta.description} primaryLabel={cta.primaryLabel} />
    </div>
  );
};
