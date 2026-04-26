// import React, { useContext } from "react";
import { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import About from "./pages/About";
import AllJobs from "./pages/AllJobs";
import Applications from "./pages/Applications";
import ApplyJob from "./pages/ApplyJob";
import CandidatesLogin from "./pages/CandidatesLogin";
import CandidatesSignup from "./pages/CandidatesSignup";
import Home from "./pages/Home";
import Terms from "./pages/Terms";
import RecruiterLogin from "./pages/RecruiterLogin";
import RecruiterSignup from "./pages/RecruiterSignup";
import Dashborad from "./pages/Dashborad";
import AddJobs from "./pages/AddJobs";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";
import { AppContext } from "./context/AppContext";
import ShortListed from "./pages/ShortListed";
import ProfileDetails from "./pages/ProfileDetails";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import toast from "react-hot-toast";
import { ArrowLeft, Mail } from "lucide-react";

const CursorOrb = () => {
  const orbRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches;
    if (reduceMotion || coarsePointer) return;

    const el = orbRef.current;
    if (!el) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: pos.x, y: pos.y };
    let rafId = 0;
    let activated = false;

    const render = () => {
      rafId = 0;
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      el.style.setProperty("--x", `${pos.x}px`);
      el.style.setProperty("--y", `${pos.y}px`);

      if (Math.abs(target.x - pos.x) > 0.1 || Math.abs(target.y - pos.y) > 0.1) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;

      if (!activated) {
        activated = true;
        el.classList.add("cursor-orb--active");
      }

      if (!rafId) rafId = window.requestAnimationFrame(render);
    };

    const onDown = () => el.style.setProperty("--s", "0.85");
    const onUp = () => el.style.setProperty("--s", "1");

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={orbRef} className="cursor-orb" />;
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = typeof location.state?.from === "string" ? location.state.from : "";

  const onBack = () => {
    if (from) return navigate(from);
    navigate(-1);
  };

  const onEmailSupport = (e) => {
    e.preventDefault();
    const cleaned = email.trim();
    if (!cleaned) return toast.error("Email required");

    const subject = encodeURIComponent("Password reset request");
    const body = encodeURIComponent(`Please help me reset my password for: ${cleaned}`);
    window.location.href = `mailto:support@campusconnect.com?subject=${subject}&body=${body}`;
    toast.success("Opening email...");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[80%] rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/8 to-purple-500/10 blur-3xl" />
        <div className="absolute top-40 -left-24 h-72 w-72 rounded-full bg-blue-500/8 blur-3xl" />
        <div className="absolute bottom-10 -right-24 h-72 w-72 rounded-full bg-indigo-500/8 blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative">
        <div className="bg-white/75 backdrop-blur-xl rounded-2xl shadow-[0_22px_60px_-40px_rgba(15,23,42,0.75)] border border-slate-200/60 ring-1 ring-slate-900/5 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <Link
                to="/"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Home
              </Link>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Forgot Password
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Abhi automated password reset available nahi hai. Support ko email bhej do, hum reset kar dein ge.
            </p>

            <form className="mt-6 space-y-4" onSubmit={onEmailSupport}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.01]"
              >
                Email Support
              </button>
            </form>

            <div className="mt-6 text-xs text-slate-500">
              Support email:{" "}
              <a
                href="mailto:support@campusconnect.com"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                support@campusconnect.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  // const { companyToken } = useContext(AppContext);
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/dashboard");
  return (
    <>
    {!hideLayout && <Navbar />}
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-jobs/:category" element={<AllJobs />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />
        
          <Route path="/applied-applications" element={<ProfileDetails />} />
        <Route path="/candidate-login" element={<CandidatesLogin />} />
        <Route path="/candidate-signup" element={<CandidatesSignup />} />
        <Route path="/recruiter-login" element={<RecruiterLogin />} />
        <Route path="/recruiter-signup" element={<RecruiterSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashborad />}>
          <Route path="add-job" element={<AddJobs />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="applied-applications" element={<ProfileDetails />} />
          <Route path="view-applications" element={<ViewApplications />} />
          <Route path="short-applications" element={<ShortListed />} />
        </Route>
      </Routes>
    </AppLayout>
     {!hideLayout && <Footer />}
     <Chatbot />
     <CursorOrb />
     </>
  );
};

export default App;
