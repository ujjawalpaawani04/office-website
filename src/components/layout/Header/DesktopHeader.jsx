import React from 'react'
import {Link} from 'react-router-dom'

// react-icons
import { RiArrowDropDownLine } from "react-icons/ri";

// images
import logo from '../../../assets/images/logo.jpg'

const services = {
  companyRegistration: [
    "Company Registration",
    "Company Incorporation",
    "Start-Up India",
    "Foreign Subsidiaries",
    "Private Limited Companies",
    "Limited Companies",
    "Limited Liability Partnership",
    "Overseas Direct Investments",
    "MSME Registration",
    "Trademark Registration",
    "Partnership Registration",
    "Proprietorship Registration"
  ],

  outsourcing: [
    "Accounts Outsourcing",
    "Payroll Outsourcing",
    "Corporate Compliance Outsourcing",
    "HR Functions Outsourcing",
    "Legal Consultancy",
    "Litigation Support Outsourcing",
    "SAP Outsourcing"
  ],

  taxation: {
    directTax: [
      "Direct Tax",
      "Corporate & Individual Taxation",
      "Capital Gains Taxation",
      "Taxation Of Expats"
    ],

    indirectTax: [
      "GST",
      "Exports From India – Refund Or Rebate",
      "Customs Duty"
    ]
  },

  auditing: [
    "Financial Statement Audit",
    "Internal Audit",
    "Process Audit",
    "Stock Audit",
    "Statutory Compliance",
    "HR Audit",
    "Marketing Communications",
    "TDS Audit",
    "Management Audit",
    "Data Security Audit"
  ],

  reporting: [
    "Corporate Reporting",
    "IFRS Reporting",
    "Business Sustainability",
    "POSH Reporting",
    "Internal Financial Controls",
    "Transfer Pricing",
    "FEMA Reporting"
  ],

  specialAreas: [
    "Virtual CFO Services",
    "Share Based Payments",
    "POSH Trainings",
    "GST Refunds",
    "Agreement & Deed Drafting",
    "Resident Director Services",
    "Societies And NGO Services",
    "Acquisition Transaction",
    "Fraud Detection",
    "Risk Management",
    "Business Process Re-Engineering",
    "Unique Document Identification Number (UDIN)"
  ]
};




export const DesktopHeader = () => {
  return (
   <>
   <header className="fixed top-0 left-0 right-0 z-[99] bg-[#f5f5f5] py-2">
    <div className= "flex justify-between items-center max-w-7xl mx-auto">
      {/* logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-16 w-16 object-contain rounded-full shadow-sm" />
        <h2 className="font-bold flex flex-col justify-center text-[#155B5C] text-[22px]">SINGH AMIT <span className="font-semibold border-t-2 border-[#155B5C] text-[13px] d-inline-block leading-[1.9]"> & ASSOCIATES FIRM</span></h2>

      </div>
      {/* navbar */}
      <nav>
        <ul className="flex items-center gap-5 ">
            <li className="py-5 text-[#155B5C] font-[500] hover:text-[#4c9091]"><Link to="/">Home</Link></li>
            <li className="py-5 text-[#155B5C] font-[500]"><Link to="/">About Us</Link></li>



            <li className="group relative py-5 text-[#155B5C] font-[500]"><Link to="/" className="flex items-center">Services <RiArrowDropDownLine className="group-hover:transform group-hover:rotate-180 transition-transform duration-200"/></Link>
             <div className="justify-center  max-w-[2000px] w-full  mx-auto hidden group-hover:flex fixed top-18 left-0 right-0 bg-white 
             border-t-1 border-gray-300 shadow-lg z-10">
      {/* company-registration */}
      <div className="shadow-[1px_0_4px_-2px_rgba(0,0,0,0.20)]  p-5 grow-1 bg-[#f5f5f5]">
        <h4 className="font-bold mb-2 text-black">Company Registration</h4>
        <ul>
          {services.companyRegistration.map((item, index) => (
            <li key={index} className="p-[5px] text-sm font-semibold text-[#155B5C] hover:bg-[#b1c7c757] transition-colors duration-200"><Link to="/">{item}</Link></li>
          ))}
        </ul>
      </div>
      {/* outsourcing */}
      <div className="shadow-[1px_0_4px_-2px_rgba(0,0,0,0.20)]  p-5 grow-1">
         <h4 className="font-bold mb-2 text-black">Outsourcing</h4>
         <ul>
          {services.outsourcing.map((item, index) => (
            <li key={index} className="p-[5px] text-sm font-semibold text-[#155B5C] hover:bg-[#b1c7c757] transition-colors duration-200"><Link to="/">{item}</Link></li>
          ))}
         </ul>
      </div>
      {/* taxation */}
      <div className="shadow-[1px_0_4px_-2px_rgba(0,0,0,0.20)]  p-5 grow-1" >
         <h4 className="font-bold mb-2 text-black">Taxation</h4>
         <div className="pl-4">
          <h5 className="font-semibold text-black">Direct Tax</h5>
          <ul>
            {services.taxation.directTax.map((item, index) => (
              <li key={index} className="p-[5px] text-sm font-semibold text-[#155B5C] hover:bg-[#b1c7c757] transition-colors duration-200"><Link to="/">{item}</Link></li>
            ))}
          </ul>
         </div>
         <div className="pl-4 mt-2">
          <h5 className="font-semibold text-black">Indirect Tax</h5>
          <ul>
            {services.taxation.indirectTax.map((item, index) => (
              <li key={index} className="p-[5px] text-sm font-semibold text-[#155B5C] hover:bg-[#b1c7c757] transition-colors duration-200"><Link to="/">{item}</Link></li>
            ))}
          </ul>
         </div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    {/* Auditing */}
    <div className="shadow-[1px_0_4px_-2px_rgba(0,0,0,0.20)]  p-5 grow-1">
      <h4 className="font-bold mb-2 text-black">Auditing</h4>
      <ul>
        {services.auditing.map((item, index) => (
          <li key={index} className="p-[5px] text-sm font-semibold text-[#155B5C] hover:bg-[#b1c7c757] transition-colors duration-200"><Link to="/">{item}</Link></li>
        ))}
      </ul>
    </div>
    {/* reporting */}
    <div className="shadow-[1px_0_4px_-2px_rgba(0,0,0,0.20)]  p-5 grow-1">
      <h4 className="font-bold mb-2 text-black">Reporting</h4>
      <ul>
        {services.reporting.map((item, index) => (
          <li key={index} className="p-[5px] text-sm font-semibold text-[#155B5C] hover:bg-[#b1c7c757] transition-colors duration-200"><Link to="/">{item}</Link></li>
        ))}
      </ul>
    </div>
    {/* Special Areas */}
    <div className="shadow-[1px_0_4px_-2px_rgba(0,0,0,0.20)]  p-5 grow-1 ">
      <h4 className="font-bold mb-2 text-black">Special Areas</h4>
      <ul>
        {services.specialAreas.map((item, index) => (
          <li key={index} className="p-[5px] text-sm font-semibold text-[#155B5C] hover:bg-[#b1c7c757] transition-colors duration-200"><Link to="/">{item}</Link></li>
        ))}
      </ul>
    </div>
    </div></li>





            <li className="py-5 text-[#155B5C] font-[500]"><Link to="/">Due Diligence</Link></li>
            <li className="py-5 text-[#155B5C] font-[500]"><Link to="/">Publications</Link></li>
            <li className="py-5 text-[#155B5C] font-[500]"><Link to="/">Our Advantage</Link></li>
            <li className="py-5 text-[#155B5C] font-[500]"><Link to="/">Blog</Link></li>
            <li className="py-5 text-[#155B5C] font-[500]"><Link to="/">Contact Us</Link></li>
        </ul>
      </nav>
      
    </div>

   
   </header>
   </>
  )
}
