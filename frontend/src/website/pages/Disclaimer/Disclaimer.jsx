import { Container } from "../../components/common/Container";
import { Seo } from "../../components/common/Seo";
import { LegalPageHero } from "../../components/common/LegalPageHero";
import { ArticleContent } from "../Blog/BlogDetails/components/ArticleContent";

// DRAFT content, same review note as PrivacyPolicy.jsx and Terms.jsx - needs
// a legal review pass before launch. Wording follows the ICAI Website
// Guidelines' expected disclaimer points for a chartered accountancy firm
// (no solicitation, no advice given, no client relationship formed by
// browsing, position-of-law caveat, RERA/land-law caveat, liability limit).
const content = `
This website has been developed and is maintained in accordance with the Website Guidelines issued by the Institute of Chartered Accountants of India.

By accessing this website, you acknowledge and accept that:

- You are seeking information about Singh Amit & Associates of your own accord, and there has been no advertisement, solicitation, invitation or inducement of any kind from the firm or any of its members to solicit work through this website.
- The contents of this website are for general information only and do not constitute professional advice. No client relationship is created by accessing this website or by submitting an enquiry through it.
- The material on this website reflects the position of law as on the date of publication. Statutes, rules, notifications and judicial precedents change from time to time, and the firm assumes no obligation to update the material.
- Appropriate professional advice should be obtained before acting on any information contained on this website. Singh Amit & Associates shall not be liable for any consequence of any action taken on the basis of the information provided here.
- Information on this website relating to the Real Estate (Regulation and Development) Act, 2016 and the Uttarakhand Zamindari Abolition and Land Reforms Act is provided for general guidance. It is not an opinion on title and is not a substitute for advice from a legal practitioner on any specific property or transaction.
- The firm shall not be liable for any loss or damage arising from errors in content, or from any virus or other destructive software transmitted through this website.
`;

const Disclaimer = () => {
  return (
    <div className="bg-white">
      <Seo
        title="Disclaimer"
        description="The disclaimer governing your use of the Singh Amit & Associates website, issued in accordance with ICAI Website Guidelines."
        canonicalPath="/disclaimer"
      />
      <LegalPageHero
        breadcrumbLabel="Disclaimer"
        title={
          <>
            Legal <span className="text-highlight">Disclaimer</span>
          </>
        }
        description="Important information governing your use of this website, issued in accordance with ICAI Website Guidelines."
      />
      <Container className="max-w-3xl py-16 lg:py-24">
        <p className="text-sm text-black/50">Last updated on: August 2026</p>
        <div className="mt-10">
          <ArticleContent content={content} />
        </div>
      </Container>
    </div>
  );
};

export default Disclaimer;
