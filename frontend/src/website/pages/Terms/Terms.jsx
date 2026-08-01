import { Container } from "../../components/common/Container";
import { Seo } from "../../components/common/Seo";
import { ArticleContent } from "../Blog/BlogDetails/components/ArticleContent";
import { useSiteSettings } from "../../context/SiteSettingsContext";

// DRAFT content, same review note as PrivacyPolicy.jsx - needs a legal pass
// before launch. Contact details pulled live from Site Settings rather than
// hardcoded.
const buildContent = ({ contactEmail }) => `
## Acceptance of Terms

By using this website, you agree to these terms. If you do not agree, please do not use the site.

## About This Website

This website is operated by Singh Amit & Associates to share information about our chartered accountancy services and to let visitors get in touch, book a consultation, apply for open roles, or subscribe to our newsletter.

!!! Nothing on this website constitutes professional tax, audit, or financial advice, and browsing it does not create a client relationship with our firm. A formal advisor-client relationship begins only once we've agreed on the scope of an engagement directly with you.

## Booking a Consultation

Consultations are booked through our Calendly-powered scheduler. A booked slot is subject to availability and may need to be rescheduled by either party. Booking a consultation does not by itself constitute a formal client engagement.

## Career Applications

Submitting an application through our Careers page does not guarantee an interview or a job offer. We review applications as roles become available and will contact you if there's a match.

## Website Content & Intellectual Property

All text, graphics, and branding on this website belong to Singh Amit & Associates unless otherwise stated, and may not be reproduced without our permission.

## Third-Party Services

This website uses Calendly for appointment scheduling and links to our social media profiles. Your use of those third-party services is governed by their own terms, not ours.

## No Warranty & Limitation of Liability

This website and its content are provided "as is". While we make reasonable efforts to keep information accurate and current, we do not guarantee it is error-free, and we are not liable for any loss arising from reliance on website content in place of formal professional advice.

## Governing Law

These terms are governed by the laws of India, and any dispute relating to them falls under the jurisdiction of the courts where our firm is registered.

## Changes to These Terms

We may update these terms from time to time. The version on this page is always the current one.

## Contact Us

Questions about these terms can be sent to ${contactEmail || "the email address listed on our Contact page"}, or through the Contact page on this website.
`;

const Terms = () => {
  const { contactEmail } = useSiteSettings();

  return (
    <div className="bg-white">
      <Seo
        title="Terms of Service"
        description="The terms governing your use of the Singh Amit & Associates website."
        canonicalPath="/terms"
      />
      <Container className="max-w-3xl py-16 lg:py-24">
        <h1 className="font-display text-3xl font-bold text-black sm:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-black/50">Last updated: August 2026</p>
        <div className="mt-10">
          <ArticleContent content={buildContent({ contactEmail })} />
        </div>
      </Container>
    </div>
  );
};

export default Terms;
