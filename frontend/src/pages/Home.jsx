import React, { useContext, useEffect } from "react";
import FeaturedJob from "../components/FeaturedJob";
import Hero from "../components/Hero";
import JobCategoryt from "../components/JobCategory";
// import Navbar from "../components/Navbar";
import Testimonials from "../components/Testimonials";
import Counter from "../components/Counter";
import Download from "../components/Download";
// import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import Chatbot from "../components/Chatbot";

const Home = () => {
  const { fetchJobsData } = useContext(AppContext);

  useEffect(() => {
    fetchJobsData();
  }, []);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[85%] rounded-full bg-gradient-to-r from-blue-500/12 via-indigo-500/10 to-purple-500/12 blur-3xl" />
      <div className="pointer-events-none absolute top-[520px] -left-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-[1100px] -right-24 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-[1650px] left-1/2 -translate-x-1/2 h-80 w-[70%] rounded-full bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-purple-500/10 blur-3xl" />

      <div className="relative">
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-b from-white/60 to-white/20 ring-1 ring-slate-900/5 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.7)]" />
          <div className="pointer-events-none absolute left-6 right-6 top-0 h-[2px] rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-70" />
          <Hero />
        </div>

        <div className="pointer-events-none mx-auto my-12 h-px w-[85%] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] bg-white/55 backdrop-blur-xl ring-1 ring-slate-900/5 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.6)]" />
          <div className="pointer-events-none absolute left-6 right-6 top-0 h-[2px] rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-55" />
          <JobCategoryt />
        </div>

        <div className="pointer-events-none mx-auto my-12 h-px w-[85%] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-b from-white/55 to-white/25 ring-1 ring-slate-900/5 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.6)]" />
          <div className="pointer-events-none absolute left-6 right-6 top-0 h-[2px] rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-55" />
          <FeaturedJob />
        </div>

        <div className="pointer-events-none mx-auto my-12 h-px w-[85%] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] bg-white/55 backdrop-blur-xl ring-1 ring-slate-900/5 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.6)]" />
          <div className="pointer-events-none absolute left-6 right-6 top-0 h-[2px] rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-55" />
          <Testimonials />
        </div>

        <div className="pointer-events-none mx-auto my-12 h-px w-[85%] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-b from-white/55 to-white/20 ring-1 ring-slate-900/5 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.6)]" />
          <div className="pointer-events-none absolute left-6 right-6 top-0 h-[2px] rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-55" />
          <Counter />
        </div>

        <div className="pointer-events-none mx-auto my-12 h-px w-[85%] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <div className="relative pb-14">
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] bg-white/55 backdrop-blur-xl ring-1 ring-slate-900/5 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.6)]" />
          <div className="pointer-events-none absolute left-6 right-6 top-0 h-[2px] rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-55" />
          <Download />
        </div>
      </div>
    </div>
  );
};

export default Home;
