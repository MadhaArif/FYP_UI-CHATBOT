import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { faqs } from "../assets/assets";

import { motion } from "framer-motion";
import { SlideLeft, SlideUp } from "../utils/Animation";

const Terms = () => {
  return (
    <>
      {/* <Navbar /> */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-56 w-[85%] rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/8 to-purple-500/10 blur-3xl" />

        <div className="relative mb-10 overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/5 shadow-[0_22px_60px_-45px_rgba(15,23,42,0.75)]">
          <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
          <div className="px-6 py-10 sm:px-10 sm:py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Terms and Conditions
            </h1>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Please read these terms carefully. They explain how CampusConnect works and what to expect while using the platform.
            </p>
          </div>
        </div>

        {/* Terms Content */}
        <div className="grid gap-5">
          {faqs.map((faq) => (
            <motion.div
              variants={SlideLeft(0.3)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              key={faq.id}
              className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/5 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.7)]"
            >
              <div className="p-6 md:p-8">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-50" />
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-start">
                  <span className="mr-3 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-900 text-white text-sm font-semibold">
                    {faq.id}
                  </span>
                  {faq.title}
                </h2>
                <div className="text-slate-600 space-y-4 pl-10">
                  <p className="leading-relaxed">{faq.description1}</p>
                  {faq.description2 && (
                    <p className="leading-relaxed">{faq.description2}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Additional Legal Notice */}
        <motion.div
          variants={SlideUp(0.3)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/5 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.7)]"
        >
          <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-60" />
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-extrabold tracking-tight text-slate-900 mb-2">
              Legal Notice
            </h3>
            <p className="text-slate-600">
              By using our services, you agree to these terms and conditions in full. If you disagree with any part of these terms, please do not use our services.
            </p>
          </div>
        </motion.div>
      </section>
      {/* <Footer /> */}
    </>
  );
};

export default Terms;
