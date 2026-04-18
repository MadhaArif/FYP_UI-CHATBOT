import React from "react";
import Counter from "../components/Counter";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Testimonials from "../components/Testimonials";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { SlideLeft, SlideUp } from "../utils/Animation";

const About = () => {
  return (
    <>
      {/* <Navbar /> */}
      <section className="relative">
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-[85%] rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/8 to-purple-500/10 blur-3xl" />

        <div className="relative mb-12 overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/5 shadow-[0_22px_60px_-45px_rgba(15,23,42,0.75)]">
          <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
          <div className="px-6 py-10 sm:px-10 sm:py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              About CampusConnect
            </h1>
            <p className="mt-3 text-slate-600 max-w-3xl mx-auto">
              CampusConnect helps students discover opportunities and helps recruiters find the right talent—fast, simple, and organized.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-b from-white/55 to-white/20 ring-1 ring-slate-900/5 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.6)]" />
          <div className="pointer-events-none absolute left-6 right-6 top-0 h-[2px] rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-55" />
          <Counter />
        </div>

        {/* About Section */}
        <div className="mt-12 relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/5 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.7)]">
          <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-60" />
          <div className="px-6 py-10 sm:px-10 sm:py-12">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 text-center mb-8">
            Our Mission
          </h2>
          <div className="max-w-4xl text-center mx-auto space-y-6 text-slate-600">
            <motion.p
              variants={SlideUp(0.3)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="leading-relaxed"
            >
              Far much that one rank beheld bluebird after outside ignobly
              allegedly more when oh arrogantly vehement irresistibly fussy
              penguin insect additionally wow absolutely crud meretriciously
              hastily dalmatian a glowered inset one echidna cassowary some
              parrot and much as goodness some froze the sullen much connected
              bat.
            </motion.p>
            <motion.p
              variants={SlideUp(0.5)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="text-lg leading-relaxed"
            >
              Repeatedly dreamed alas opossum but dramatically despite
              expeditiously that jeepers loosely yikes that as or eel underneath
              kept and slept compactly far purred sure abidingly up above
              fitting to strident wiped set waywardly.
            </motion.p>
          </div>
          </div>
        </div>

        <div className="mt-12 relative">
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] bg-white/55 backdrop-blur-xl ring-1 ring-slate-900/5 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.7)]" />
          <div className="pointer-events-none absolute left-6 right-6 top-0 h-[2px] rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-55" />
          <Testimonials />
        </div>

        {/* How It Works Section */}
        <div className="mt-12 relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/5 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.7)]">
          <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-60" />
          <div className="px-6 py-10 sm:px-10 sm:py-12">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
                How It Works
              </h2>
              <p className="text-base md:text-lg text-slate-600">
                Simple steps to get started
              </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Work Step 1 */}
            <motion.div
              variants={SlideLeft(0.2)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="bg-white/75 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 ring-1 ring-slate-900/5 shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center mb-6">
                <img
                  src={assets.work_1}
                  alt="Resume Assessment"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Free Resume Assessments
              </h3>
              <p className="text-gray-600">
                Employers on average spend 31 seconds scanning resumes to
                identify potential matches.
              </p>
            </motion.div>

            {/* Work Step 2 */}
            <motion.div
              variants={SlideLeft(0.4)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="bg-white/75 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 ring-1 ring-slate-900/5 shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center mb-6">
                <img
                  src={assets.work_2}
                  alt="Job Fit Scoring"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Job Fit Scoring
              </h3>
              <p className="text-gray-600">
                Our advanced algorithm scores your resume against job criteria.
              </p>
            </motion.div>

            {/* Work Step 3 */}
            <motion.div
              variants={SlideLeft(0.6)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="bg-white/75 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 ring-1 ring-slate-900/5 shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center mb-6">
                <img
                  src={assets.work_3}
                  alt="Help Every Step"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Help Every Step of the Way
              </h3>
              <p className="text-gray-600">
                Receive expert guidance throughout your job search journey.
              </p>
            </motion.div>
          </div>
          </div>
        </div>
      </section>
      {/* <Footer /> */}
    </>
  );
};

export default About;
