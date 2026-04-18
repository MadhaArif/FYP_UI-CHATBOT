import React from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { SlideUp } from "../utils/Animation";

const Download = () => {
  return (
    <section className="mt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-56 w-[85%] rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/8 to-purple-500/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/5 shadow-[0_22px_60px_-45px_rgba(15,23,42,0.75)]">
        <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 px-6 py-10 sm:px-10 sm:py-12">
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
          <motion.h3
            variants={SlideUp(0.5)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="text-xs font-extrabold tracking-widest uppercase text-slate-700"
          >
            Download & Enjoy
          </motion.h3>
          <motion.h1
            variants={SlideUp(0.5)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight"
          >
            Get the CampusConnect{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Job Search
            </span>{" "}
            App
          </motion.h1>
          <motion.p
            variants={SlideUp(0.5)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="text-base sm:text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed"
          >
            Search through millions of jobs and find the right fit. Simply swipe
            right to apply to your dream job in seconds.
          </motion.p>

          {/* App Store Buttons */}
          <motion.div
            variants={SlideUp(0.6)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2"
          >
            <a
              href="#"
              className="transition-transform hover:scale-[1.03] active:scale-[0.99] drop-shadow-sm"
            >
              <img
                src={assets.play_store}
                alt="Get on Google Play"
                className="h-12 sm:h-14 w-auto"
              />
            </a>
            <a
              href="#"
              className="transition-transform hover:scale-[1.03] active:scale-[0.99] drop-shadow-sm"
            >
              <img
                src={assets.app_store}
                alt="Download on the App Store"
                className="h-12 sm:h-14 w-auto"
              />
            </a>
          </motion.div>

          <div className="pt-2 flex flex-wrap gap-2 justify-center lg:justify-start text-xs text-slate-500">
            <span className="px-3 py-1 rounded-full bg-white/60 border border-slate-200/60 ring-1 ring-slate-900/5">
              Faster apply
            </span>
            <span className="px-3 py-1 rounded-full bg-white/60 border border-slate-200/60 ring-1 ring-slate-900/5">
              Smart filters
            </span>
            <span className="px-3 py-1 rounded-full bg-white/60 border border-slate-200/60 ring-1 ring-slate-900/5">
              Track status
            </span>
          </div>
        </div>

        {/* App Image */}
        <div className="w-full lg:w-[45%] mt-2 lg:mt-0 flex justify-center">
          <motion.img
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ stiffness: 90, delay: 0.1 }}
            src={assets.download_image}
            alt="Campus Connect App Preview"
            className="w-full max-w-md lg:max-w-none h-auto object-contain drop-shadow-[0_30px_60px_rgba(15,23,42,0.22)]"
          />
        </div>
      </div>
      </div>
    </section>
  );
};

export default Download;
