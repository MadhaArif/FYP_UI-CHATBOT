import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import JobCard from "./JobCard";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { motion } from "framer-motion";
import { SlideUp } from "../utils/Animation";

const FeaturedJob = () => {
  const { jobs, jobLoading } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <section className="mt-24 relative">
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-56 w-[85%] rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/8 to-purple-500/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/5 shadow-[0_22px_60px_-45px_rgba(15,23,42,0.75)]">
        <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        <div className="px-6 py-10 sm:px-10 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
                Featured Jobs
              </h1>
              <p className="text-slate-600 max-w-2xl">
                Know your worth and find the job that qualifies your life
              </p>
            </div>
            <button
              onClick={() => {
                navigate("/all-jobs/all");
                window.scrollTo(0, 0);
              }}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-5 py-2.5 font-semibold shadow-sm hover:shadow-md hover:brightness-105 transition"
            >
              See all jobs
            </button>
          </div>
      {jobLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader />
        </div>
      ) : !Array.isArray(jobs) || jobs.length === 0 ? (
        <div className="text-center bg-white/60 border border-slate-200/60 ring-1 ring-slate-900/5 rounded-3xl p-8">
          <h3 className="text-lg font-extrabold tracking-tight text-slate-900 mb-1">
            No jobs found
          </h3>
          <p className="text-slate-600">Please check back again soon.</p>
        </div>
      ) : (
        <>
          <motion.div
            variants={SlideUp(0.5)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="grid gap-4 grid-cols-1 md:grid-cols-2"
          >
            {[...jobs]
              .reverse()
              .slice(0, 6)
              .map((job, index) => (
                <JobCard job={job} key={job.id || index} />
              ))}
          </motion.div>

          <motion.div
            variants={SlideUp(0.5)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="text-center mt-10"
          >
            <button
              onClick={() => {
                navigate("/all-jobs/all");
                window.scrollTo(0, 0);
              }}
              className="bg-white/70 border border-slate-200/70 text-slate-900 px-8 py-2.5 rounded-xl hover:bg-white transition duration-200 cursor-pointer font-semibold ring-1 ring-slate-900/5"
            >
              See more
            </button>
          </motion.div>
        </>
      )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJob;
