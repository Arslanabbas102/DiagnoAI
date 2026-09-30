import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import patientAvatar from "../../assets/images/patient-avatar.png";
import { HiStar } from "react-icons/hi2";
import { LuQuote } from "react-icons/lu";

const testimonials = [
  {
    name: "Abdul Wahab",
    role: "Diabetes screening",
    text: "I have taken medical services from them. They treat patients so well and they are providing the best medical services.",
  },
  {
    name: "Sara Ahmed",
    role: "Heart disease test",
    text: "The test was quick and the results were easy to understand. Booking a follow-up with a cardiologist took less than a minute.",
  },
  {
    name: "Usman Ali",
    role: "Kidney disease test",
    text: "Clear guidance at every step. The doctor I consulted had already reviewed my results before the call started.",
  },
  {
    name: "Ayesha Khan",
    role: "Liver disease test",
    text: "A calm, professional experience from start to finish. I finally feel like I understand my health.",
  },
  {
    name: "Hamza Raza",
    role: "Pneumonia test",
    text: "Fast, accurate and genuinely helpful. The platform made it easy to get the right specialist quickly.",
  },
  {
    name: "Fatima Noor",
    role: "Breast cancer test",
    text: "Supportive doctors and a thoughtful process. I would recommend this service to my family and friends.",
  },
];

const Testimonial = () => {
  return (
    <div className="mt-10 lg:mt-14">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={24}
        slidesPerView={1}
        className="!px-1 !pb-14 !pt-1"
        style={{
          "--swiper-pagination-color": "#2A4BDB",
          "--swiper-pagination-bullet-inactive-color": "#BFD0FF",
          "--swiper-pagination-bullet-inactive-opacity": "1",
          "--swiper-pagination-bullet-size": "8px",
          "--swiper-pagination-bullet-horizontal-gap": "5px",
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 24,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 28,
          },
        }}
      >
        {testimonials.map((t, index) => (
          <SwiperSlide key={index} className="!h-auto">
            <figure className="card flex h-full flex-col p-6 transition duration-300 hover:shadow-lift hover:ring-brand-200 lg:p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
                  {[...Array(5).keys()].map((i) => (
                    <HiStar key={i} className="h-4 w-4 text-yellowColor" />
                  ))}
                </div>
                <LuQuote className="h-7 w-7 text-brand-100" />
              </div>

              <blockquote className="mt-5 flex-1 text-[15px] leading-7 text-ink-700">
                “{t.text}”
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <img
                  src={patientAvatar}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-soft"
                />
                <div>
                  <p className="font-display text-[15px] font-semibold text-ink">
                    {t.name}
                  </p>
                  <p className="text-sm text-muted">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonial;
