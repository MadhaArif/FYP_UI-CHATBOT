import React, { useContext, useEffect, useMemo, useState } from "react";
import { assets } from "../assets/assets";
import { CheckCheck } from "lucide-react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { SlideUp } from "../utils/Animation";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const Counter = () => {
  const { backendUrl, jobs } = useContext(AppContext);
  const [totalUsers, setTotalUsers] = useState(null);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        if (!backendUrl) return;
        const { data } = await axios.get(`${backendUrl}/user/all-users`);
        if (data?.success && typeof data?.total === "number") {
          setTotalUsers(data.total);
        }
      } catch {
        setTotalUsers(null);
      }
    };
    fetchTotalUsers();
  }, [backendUrl]);

  const openJobsCount = Array.isArray(jobs) ? jobs.length : 0;
  const partnerCompaniesCount = useMemo(() => {
    if (!Array.isArray(jobs)) return 0;
    const ids = new Set();
    for (const job of jobs) {
      const id = job?.companyId?._id || job?.companyId;
      if (id) ids.add(String(id));
    }
    return ids.size;
  }, [jobs]);

  const formatMetric = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return { end: 0, decimals: 0, suffix: "" };
    if (n >= 1_000_000) return { end: Number((n / 1_000_000).toFixed(1)), decimals: 1, suffix: "M" };
    if (n >= 10_000) return { end: Math.round(n / 1_000), decimals: 0, suffix: "K" };
    if (n >= 1_000) return { end: Number((n / 1_000).toFixed(1)), decimals: 1, suffix: "K" };
    return { end: n, decimals: 0, suffix: "" };
  };

  const activeUsersMetric = formatMetric(totalUsers ?? 0);
  const openJobsMetric = formatMetric(openJobsCount);
  const partnersMetric = formatMetric(partnerCompaniesCount);

  return (
    <section>
      {/* Main Content Section */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch gap-10 mb-6">
        {/* Image Container */}
        <div className="lg:w-[50%] lg:h-[400px] w-full flex">
          <motion.img
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ stiffness: 90, delay: 0.1 }}
            src={assets.counter_image}
            alt="People working together"
            className="w-full h-full object-cover rounded-3xl shadow-[0_22px_60px_-45px_rgba(15,23,42,0.75)]"
          />
        </div>

        {/* Content Container */}
        <div className="w-full lg:w-[50%] flex flex-col justify-center">
          <div className="py-6 lg:py-0 lg:px-8">
            <motion.h1
              variants={SlideUp(0.5)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight"
            >
              Millions of Jobs. Find the one that{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                suits you.
              </span>
            </motion.h1>
            <motion.p
              variants={SlideUp(0.5)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="text-base sm:text-lg text-slate-600 mb-6 leading-relaxed"
            >
              Search all the open positions on the web. Get your own
              personalized salary estimate. Read reviews on over 600,000
              companies worldwide.
            </motion.p>
            <motion.ul
              variants={SlideUp(0.5)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="space-y-3 mb-8"
            >
              <li className="flex items-start gap-3">
                <CheckCheck className="text-green-500 flex-shrink-0 mt-1" />
                <span className="text-slate-700">
                  Bring to the table win-win survival
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCheck className="text-green-500 flex-shrink-0 mt-1" />
                <span className="text-slate-700">
                  Capitalize on low hanging fruit to identify
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCheck className="text-green-500 flex-shrink-0 mt-1" />
                <span className="text-slate-700">
                  But I must explain to you how all this
                </span>
              </li>
            </motion.ul>
            <motion.button
              variants={SlideUp(0.6)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl transition-all hover:brightness-105 shadow-sm hover:shadow-md"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 p-6 md:p-8 rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/5 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.7)]">
        <div className="text-center p-4 rounded-2xl bg-white/60 border border-slate-200/60 ring-1 ring-slate-900/5">
          <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
            <CountUp
              start={0}
              end={activeUsersMetric.end}
              duration={1.4}
              decimals={activeUsersMetric.decimals}
              useEasing={false}
              enableScrollSpy
              scrollSpyOnce={false}
              scrollSpyDelay={0}
            >
              {({ countUpRef }) => <span ref={countUpRef} />}
            </CountUp>
            <span>{activeUsersMetric.suffix}</span>
          </div>
          <span className="text-slate-600 text-sm">Daily active users</span>
        </div>
        <div className="text-center p-4 rounded-2xl bg-white/60 border border-slate-200/60 ring-1 ring-slate-900/5">
          <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
            <CountUp
              start={0}
              end={openJobsMetric.end}
              duration={1.4}
              decimals={openJobsMetric.decimals}
              useEasing={false}
              enableScrollSpy
              scrollSpyOnce={false}
              scrollSpyDelay={0}
            >
              {({ countUpRef }) => <span ref={countUpRef} />}
            </CountUp>
            <span>{openJobsMetric.suffix}</span>
          </div>
          <span className="text-slate-600 text-sm">Open Jobs</span>
        </div>
        <div className="text-center p-4 rounded-2xl bg-white/60 border border-slate-200/60 ring-1 ring-slate-900/5">
          <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
            <CountUp
              start={0}
              end={partnersMetric.end}
              duration={1.4}
              decimals={partnersMetric.decimals}
              useEasing={false}
              enableScrollSpy
              scrollSpyOnce={false}
              scrollSpyDelay={0}
            >
              {({ countUpRef }) => <span ref={countUpRef} />}
            </CountUp>
            <span>{partnersMetric.suffix}</span>
          </div>
          <span className="text-slate-600 text-sm">Partners</span>
        </div>
      </div>
    </section>
  );
};

export default Counter;
