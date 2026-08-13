import { Container } from "../../components/common/Container";
import { Seo } from "../../components/common/Seo";
import { ArticleContent } from "../Blog/BlogDetails/components/ArticleContent";
import { useSiteSettings } from "../../context/SiteSettingsContext";

// DRAFT content - written from what this codebase actually collects and
// processes (see contact_service.py, career_service.py, appointment_service.py,
// newsletter blueprint), not generic boilerplate. Needs a legal review pass
// before launch; contact details below are pulled live from Site Settings
// rather than hardcoded, same as the Footer, so they never drift out of sync.
const buildContent = ({ address, contactEmail }) => `
## Who We Are

Singh Amit & Associates ("we", "us", "our") is a chartered accountancy firm providing taxation, audit, GST, and business advisory services. This policy explains what personal data we collect through this website, why we collect it, and how it is handled.

## Information We Collect

- **Contact form**: your name, email address, phone number, the service you're enquiring about, and your message.
- **Appointment booking**: your name, email address, phone number, any notes you add, and the scheduling details from your Calendly booking (event time, meeting link).
- **Career applications**: your name, email address, phone number, the position applied for, your experience, a covering message, and your résumé file.
- **Newsletter**: your email address, if you choose to subscribe. Every newsletter email includes a one-click unsubscribe link.
- **Automatically collected data**: your IP address and browser user-agent are recorded against form submissions for security and fraud-prevention purposes (e.g. detecting abuse of our contact and application forms).

We do not collect payment information, government ID numbers, or other sensitive personal data through this website.

## How We Use Your Information

1. To respond to your enquiry or contact you about the service you asked about.
2. To schedule, confirm, and remind you of a booked consultation.
3. To review your job application and contact you about it.
4. To send the newsletter you subscribed to, until you unsubscribe.
5. For internal record-keeping, and to investigate suspected misuse of our forms.

We do not sell your personal data, and we do not use it for advertising.

## Who We Share It With

- **Calendly**, to operate the appointment booking calendar embedded on our Appointment page.
- **Our transactional email provider**, to deliver enquiry confirmations, application acknowledgements, and the newsletter.

Your information is not sold, rented or shared with any other third party beyond those listed above, except where disclosure is required by law or by a regulatory authority.

## Data Retention & Security

This website is served over HTTPS. Enquiries, appointments, and applications are stored in our systems and access to this data is restricted to authorised staff through a password-protected admin panel. We retain this data only as long as reasonably necessary for the purpose it was collected for, or as required by applicable law.

## Website Enquiries vs. Client Engagement Data

This policy covers only the personal data collected through this website - contact forms, appointment bookings, career applications, and newsletter sign-ups. If you go on to become a client and engage our firm for professional services, the information you share with us in the course of that engagement is handled separately, under the confidentiality requirements of the ICAI Code of Ethics, and is not governed by this website privacy policy.

## Your Rights

Under India's Digital Personal Data Protection Act, 2023 and applicable data protection principles, you may ask us to:

- Confirm what personal data we hold about you.
- Correct inaccurate data.
- Delete your data, where we are not required to retain it for legal or legitimate business reasons.
- Stop sending you marketing communications - use the unsubscribe link in any newsletter email, or contact us directly.

To exercise any of these rights, contact us using the details below.

## Cookies

This website does not currently use tracking or advertising cookies. If we add analytics in the future, this policy will be updated to describe what's collected and how to opt out.

## Changes to This Policy

We may update this policy from time to time. The version on this page is always the current one.

## Contact Us

For any question about this policy or your personal data, reach us at ${contactEmail || "the email address listed on our Contact page"}${address ? `, or by post at ${address}` : ""}. You can also reach us through the Contact page on this website.
`;

const PrivacyPolicy = () => {
  const { address, contactEmail } = useSiteSettings();

  return (
    <div className="bg-white">
      <Seo
        title="Privacy Policy"
        description="How Singh Amit & Associates collects, uses, and protects your personal data."
        canonicalPath="/privacy-policy"
      />
      <Container className="max-w-3xl py-16 lg:py-24">
        <h1 className="font-display text-3xl font-bold text-black sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-black/50">Last updated: August 2026</p>
        <div className="mt-10">
          <ArticleContent content={buildContent({ address, contactEmail })} />
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
