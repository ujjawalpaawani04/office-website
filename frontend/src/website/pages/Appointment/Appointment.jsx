import { Seo } from "../../components/common/Seo";
import { AppointmentHero } from "./components/AppointmentHero";
// import { ConsultationOverview } from "./components/ConsultationOverview";
// import { WhyBookWithUs } from "./components/WhyBookWithUs";
// import { ConsultationProcess } from "./components/ConsultationProcess";
// import { Benefits } from "./components/Benefits";
import { BookingSection } from "./components/BookingSection";
import { AppointmentFAQ } from "./components/AppointmentFAQ";

const Appointment = () => {
  return (
    <div className="bg-white">
      <Seo
        title="Book a Consultation"
        description="Book a free, one-on-one consultation with our Chartered Accountants for taxation, GST, audit, and business advisory - pick a slot that works for you."
        canonicalPath="/appointment"
      />
      <AppointmentHero />
      {/* <ConsultationOverview /> */}
      {/* <WhyBookWithUs />
      <ConsultationProcess />
      <Benefits /> */}
      <BookingSection />
      <AppointmentFAQ />
    </div>
  );
};

export default Appointment;
