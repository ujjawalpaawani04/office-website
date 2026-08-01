import { FiCheckSquare, FiCalendar, FiUserCheck } from "react-icons/fi";
import { Hero } from "../Services/serviceTemplate/Hero";
import { CTASection } from "../Services/serviceTemplate/CTASection";
import { Seo } from "../../components/common/Seo";
import { BookingIntro } from "./components/BookingIntro";
import { BookingWizard } from "./components/BookingWizard";
import { WhySchedule } from "./components/WhySchedule";
import { AppointmentFAQ } from "./components/AppointmentFAQ";

const heroSupportingPoints = [
  { icon: FiCheckSquare, label: "Professional Consultation" },
  { icon: FiCalendar, label: "Convenient Scheduling" },
  { icon: FiUserCheck, label: "Confidential Discussion" },
];

const Appointment = () => {
  return (
    <div>
      <Seo
        title="Book an Appointment"
        description="Schedule a professional consultation with Singh Amit & Associates for income tax, GST, audit, accounting, compliance and business advisory services."
        canonicalPath="/appointment"
      />

      <Hero
        breadcrumbLabel="Book Appointment"
        breadcrumbParent={null}
        label="Schedule a Consultation"
        titlePre="Book an"
        titleHighlight="Appointment"
        description="Schedule a professional consultation at a convenient date and time for tax, audit, GST, compliance, accounting and business advisory matters."
        supportingPoints={heroSupportingPoints}
        actions={null}
        backgroundImageUrl="/about-images/bg2.png"
      />

      <BookingIntro />

      <BookingWizard />

      <WhySchedule />

      <AppointmentFAQ />

      <CTASection
        heading="Prefer to Speak With Us First?"
        description="If you have questions before booking, get in touch and our team will be glad to help."
        primaryLabel="Contact Our Team"
      />
    </div>
  );
};

export default Appointment;
