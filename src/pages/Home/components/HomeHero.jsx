import React from 'react'
import bgImg from "../../../assets/images/home-hero-bg-img.jfif"
import { Link } from "react-router-dom"

// images
import heroImg from "../../../assets/images/sulululu-removebg-preview.png"

export const HomeHero = () => {
  return (
   <section className="bg-cover bg-center bg-no-repeat h-[100vh] max-h-[800px]  w-full relative overflow-hidden"  style={{ backgroundImage: `url(${bgImg})` }}>
    <div className="absolute inset-0 w-full h-full bg-[#155B5C]/70 z-1"></div>
    <div className="max-w-7xl mx-auto h-full w-full relative z-2 flex justify-center items-center pt-18">
      <div className="w-[40%] flex flex-col gap-2 items-start">
        <span className="d-inline-block text-black px-4 py-2 rounded-full bg-white">Trusted Financial Expertise</span>
        <h2 className="text-white text-3xl font-bold mt-4">CA in <span className="text-[#00EAE7]">Roorkee</span></h2>
        <p className="text-white">Want to Setup a Company, We are always there for you with right solution. With our 20+ years of quality experience in financial advice. We ensure you will be getting 100% trusted services.</p>
        <div className="flex gap-4 mt-4">
          <Link to="/" className="bg-[#f5f5f5] text-black px-4 py-2 rounded-[8px] mt-4 inline-block transition-colors duration-300">Know More</Link>
          <Link to="/" className="bg-[#f5f5f5] text-black px-4 py-2 rounded-[8px] mt-4 inline-block  transition-colors duration-300">Get a Free Consultation Now</Link>
        
        </div>
      </div>
      <div className="w-[35%] self-end">
        <img src={heroImg} alt="Hero Image" className="w-full h-full object-contain"/>
      </div>
</div>
   </section>
  )
}
