// import React, { useContext } from "react";
import { useEffect, useRef } from "react";
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
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

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
