import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { testimonials } from "../assets/assets";

const Testimonials = () => {
  return (
    <section className="mt-28 mb-28 relative">
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-56 w-[85%] rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/8 to-purple-500/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/5 shadow-[0_22px_60px_-45px_rgba(15,23,42,0.75)]">
        <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        <div className="px-6 py-10 sm:px-10 sm:py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              Testimonials
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Hear from those who found success with our platform
            </p>
          </div>

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 1400,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => {
          swiper.autoplay?.start?.();
        }}
        pagination={{
          clickable: true,
          bulletClass:
            "swiper-pagination-bullet !bg-slate-300 !opacity-100 !w-2.5 !h-2.5 !mx-1.5",
          bulletActiveClass: "!bg-indigo-600 !w-3 !h-3",
          renderBullet: (index, className) => {
            return `<span class="${className}" role="button" aria-label="Go to testimonial ${
              index + 1
            }"></span>`;
          },
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
        className="!pb-12"
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white/75 backdrop-blur-xl p-6 rounded-3xl h-full flex flex-col border border-slate-200/60 ring-1 ring-slate-900/5 shadow-sm m-1">
              <h3 className="text-lg font-extrabold tracking-tight text-slate-900 mb-3">
                {testimonial.title}
              </h3>
              <blockquote className="text-slate-600 mb-6 flex-grow text-sm sm:text-base leading-relaxed">
                {testimonial.description}
              </blockquote>
              <div className="flex items-center mt-auto">
                <img
                  src={testimonial.image}
                  alt={`${testimonial.name}, ${testimonial.position}`} // Improved alt text
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-cover mr-4 ring-1 ring-slate-900/10" // Responsive image size
                  loading="lazy" // Added lazy loading
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=User";
                    e.target.alt = "Default user placeholder";
                  }}
                />
                <div>
                  <h4 className="font-bold text-slate-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {testimonial.position}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
