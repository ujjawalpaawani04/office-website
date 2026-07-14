import { Swiper, SwiperSlide } from "swiper/react";
import "../../../index.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
// icons
import { FaQuoteLeft } from "react-icons/fa";
import { IoChevronForward } from "react-icons/io5";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import bgImg from "../../../assets/images/home-hero-bg-img.jfif";
import heroImg from "../../../assets/images/testimonialBgImg.png";

const testimonials = [
  {
    id: 1,
    name: "Ananya Reddy",
    handle: "Bengaluru · Verified Collector",
    review:
      "The detailing on the brushwork is unreal - you can see every fold and expression. It sits on my puja shelf and everyone who visits asks where it's from.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 2,
    name: "Vikram Singh",
    handle: "Pune · Verified Buyer",
    review:
      "Bought the Krishna figure as an anniversary gift for my parents. The weight, the finish, the packaging - it genuinely feels like a heirloom, not a trinket.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 3,
    name: "Priya Menon",
    handle: "Kochi · Verified Collector",
    review:
      "I've collected figurines for years and the hand-painting here is a step above. Colours are rich, nothing is mass-produced. Three pieces in and counting.",
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 4,
    name: "Rohan Gupta",
    handle: "New Delhi · Verified Buyer",
    review:
      "Being able to spin the model in 3D before buying sold me instantly. What arrived matched it exactly. Arrived in two days, packed like it was precious.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 5,
    name: "Sneha Iyer",
    handle: "Chennai · Verified Collector",
    review:
      "Gifted the Radha Ji piece to my mother on her birthday. She teared up. It's rare to find devotional art made with this much care and soul.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
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
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full  backdrop-blur-md text-highlight text-sm font-semibold border-1 border-highlight">Collector Stories</span>
            <h2 className="mt-5  text-4xl font-bold text-white md:text-6xl">
              Loved by <span className="text-highlight">Collectors</span> Everywhere
            </h2>
            <p className="mt-4 text-base text-white text-[18px]">
              Real words from the people who've welcomed our miniatures into
              their homes, shrines, and collections.
            </p>
          </div>

          <div className="flex items-center gap-4 justify-start lg:justify-end">
            <button className="testimonial-prev inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20  text-white transition hover:bg-brand-700  hover:text-white duration-200">
              <IoChevronForward className="transform rotate-180" />
            </button>
            <button className="testimonial-next inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-brand-700 hover:text-white duration-200">
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
              <div className="rounded-[30px] border border-white/15 bg-white/95 px-8 py-8 shadow-[0_24px_64px_rgba(15,23,42,0.12)] h-[320px]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-start text-[#b03a5b]">
                    <FaQuoteLeft size={24} />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-[#c1ba5e]">
                    <span className="text-[#ffb207] text-[24px]">☆</span>
                    <span className="text-[#ffb207] text-[24px]">☆</span>
                    <span className="text-[#ffb207] text-[24px]">☆</span>
                    <span className="text-[#ffb207] text-[24px]">☆</span>
                    <span className="text-[#ffb207] text-[24px]">☆</span>
                  </div>
                </div>

                <p className="mt-4 text-base leading-[22px] text-black">
                  {item.review}
                </p>

                {/* divider */}
                <div className="my-6 h-px w-full bg-slate-200/80"></div>

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
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};


