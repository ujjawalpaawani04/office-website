import { Swiper, SwiperSlide } from "swiper/react";
import "../../../index.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
// icons
import { IoChevronForward } from "react-icons/io5";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import bgImg from "../../../assets/images/home-hero-bg-img.jfif";
import heroImg from "../../../assets/images/testimonialBgImg.png";

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    handle: "New Delhi · Business Owner",
    review:
      "Their team handled our GST filings with outstanding professionalism. Every deadline was met, every document was accurate, and the entire process gave us complete confidence in their expertise.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 2,
    name: "Priya Verma",
    handle: "Mumbai · Startup Founder",
    review:
      "They guided us through company registration and compliance from start to finish. Their advice was practical, communication was excellent, and every step felt organized and completely stress-free throughout.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 3,
    name: "Amit Mehta",
    handle: "Ahmedabad · Business Owner",
    review:
      "Our annual tax planning became significantly easier thanks to their knowledgeable team. They identified valuable savings, explained every detail clearly, and ensured every filing was completed without delays.",
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 4,
    name: "Neha Kapoor",
    handle: "Bengaluru · Freelancer",
    review:
      "As a freelancer, I always worried about tax compliance and documentation. Their experts simplified everything, answered every question patiently, and delivered exactly what they promised without unnecessary complications.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 5,
    name: "Sandeep Arora",
    handle: "Jaipur · Manufacturing Business",
    review:
      "Their accounting and compliance services have transformed how we manage our finances. Professional guidance, prompt responses, and reliable support have made them a trusted partner for our growing business.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
  },
];

export const ClientTestimonials = () => {
  return (
    <section className="relative overflow-hidden py-24 bg-secondary px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
      <img
        src={heroImg}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark Overlay */}
         <div className="absolute inset-0 z-10 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/45" />
      <div className="absolute inset-0 z-10 bg-secondary/25" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full backdrop-blur-md text-highlight text-sm font-semibold border-1 border-highlight">
 Testimonials
</span>

<h2 className="mt-5 text-4xl font-bold text-white md:text-[3.2rem] max-w-[80%]">
  Trusted by <span className="text-highlight">Businesses</span><br/> Across India
</h2>

{/* <p className="mt-4 text-base text-white text-[18px]">
  Hear from entrepreneurs, professionals, and business owners who rely on our
  expertise for taxation, accounting, GST compliance, and financial advisory
  services.
</p> */}
          </div>

          <div className="flex items-center gap-4 justify-start lg:justify-end">
            <button className="testimonial-prev inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20  text-white transition hover:bg-highlight  hover:text-black duration-200">
              <IoChevronForward className="transform rotate-180" />
            </button>
            <button className="testimonial-next inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-highlight hover:text-black duration-200">
              <IoChevronForward />
            </button>
          </div>
        </div>

        <Swiper
          className="testimonial-slider"
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={5}
          spaceBetween={16}
          loop={true}
          speed={1000}
          grabCursor={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            prevEl: ".testimonial-prev",
            nextEl: ".testimonial-next",
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 3,
            },
          }}
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="rounded-[30px] border border-white/15 bg-white/95 px-8 py-8 shadow-[0_24px_64px_rgba(15,23,42,0.12)] min-h-[300px]">
            

           

                <div className=" flex items-center gap-4 ">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-500">{item.handle}</p>
                  </div>
                </div>
                
                {/* divider */}
                <div className="my-5 h-px w-full bg-slate-200"></div>
                     <p className="mt-4 text-base leading-[22px] text-black">
                  {item.review}
                </p>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};


