import {
  Bell,
  Briefcase,
  ChevronDown,
  LoaderCircle,
  LogOut,
  Menu,
  Upload,
  UserRound,
  X,
  GraduationCap,
} from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { isLogin, userData, userDataLoading, setIsLogin, setUserToken, setUserData } =
    useContext(AppContext);
  const location = useLocation();

  const navigate = useNavigate();

  const menu = [
    { name: "Home", path: "/" },
    { name: "All Jobs", path: "/all-jobs/all" },
    { name: "About", path: "/about" },
    { name: "Terms", path: "/terms" },
  ];

  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('[aria-label="Toggle menu"]')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setUserToken(null);
    setUserData(null);
    setIsLogin(false);
    toast.success("Logout successfully");
    navigate("/candidate-login");
  };
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 mb-10 bg-transparent">
      {/* Wrapper ensures spacing across all screen sizes */}
      <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 md:px-10 py-4">
        <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.55)] ring-1 ring-slate-900/5 overflow-hidden">
          <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
          <nav className="flex items-center justify-between h-16 px-4 sm:px-6">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-105">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-blue-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                CampusConnect
              </span>
              <span className="text-[10px] text-slate-500 font-semibold -mt-1">
                Your Career Gateway
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-6">
            {/* Navigation Menu */}
            <ul className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-50/80 border border-slate-200/70">
              {menu.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none ${isActive
                        ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Desktop Buttons */}
            {userDataLoading ? (
              <LoaderCircle className="animate-spin text-blue-600 hidden lg:block" />
            ) : isLogin ? (
              <div
                className="hidden lg:flex items-center gap-4 relative"
                ref={profileMenuRef}
              >
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/70 border border-slate-200/70 hover:bg-white transition-colors cursor-pointer ring-1 ring-slate-900/5"
                  aria-label="Logout"
                >
                  <LogOut size={18} className="text-slate-700" />
                </button>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-2 focus:outline-none bg-white/70 px-3 py-2 rounded-full shadow-sm border border-slate-200/70 ring-1 ring-slate-900/5 hover:shadow-md hover:bg-white transition-all"
                  aria-expanded={isProfileMenuOpen}
                >
                  <span className="text-sm font-medium text-gray-700">
                    Hi, {userData?.name || "User"}
                  </span>
                  <img
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/15"
                    src={userData?.image || assets.avatarPlaceholder}
                    alt="User profile"
                    onError={(e) => {
                      e.currentTarget.src = assets.avatarPlaceholder;
                    }}
                  />
                  <ChevronDown
                    size={16}
                    className={`transition-transform text-blue-500 ${isProfileMenuOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-12 mt-2 w-56 origin-top-right rounded-2xl border border-white/50 bg-white/80 backdrop-blur-xl z-50 overflow-hidden shadow-[0_20px_60px_-25px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/5">
                    <div>
                      <Link
                        to="/applied-applications"
                        className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-white/70 gap-2"
                      >
                        <Briefcase size={16} />
                        My profile
                      </Link>

                      <button
                        className="w-full text-left flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-white/70 gap-2"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-4">
                <Link
                  to="/recruiter-login"
                  className="bg-white/70 text-slate-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-white transition-all border border-slate-200/70 ring-1 ring-slate-900/5 hover:shadow-sm"
                >
                  Recruiter Login
                </Link>
                <Link
                  to="/candidate-login"
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all hover:brightness-105"
                >
                  Candidate Login
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-xl text-slate-800 hover:bg-slate-100/70 focus:outline-none ring-1 ring-slate-900/5"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        ref={mobileMenuRef}
      >
        <div
          className="fixed inset-0 backdrop-blur-sm bg-slate-900/20"
          onClick={toggleMenu}
        />
        <div className="relative flex flex-col w-4/5 max-w-sm h-full bg-white/85 backdrop-blur-xl border-r border-r-slate-200/60 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.6)] ring-1 ring-slate-900/5">
          <div className="flex items-center justify-between p-4 border-b border-slate-200/60">
            <Link
              to="/"
              onClick={toggleMenu}
              className="text-xl font-extrabold tracking-tight text-slate-900"
            >
              CampusConnect
            </Link>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-xl text-slate-800 hover:bg-slate-100/70 transition-colors ring-1 ring-slate-900/5"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menu.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100/70"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {userDataLoading ? (
              <LoaderCircle className="animate-spin text-gray-600" />
            ) : isLogin ? (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/15"
                    src={userData?.image || assets.avatarPlaceholder}
                    alt="User profile"
                    onError={(e) => {
                      e.currentTarget.src = assets.avatarPlaceholder;
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {userData?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">{userData?.email}</p>
                  </div>
                </div>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/applied-jobs"
                      onClick={toggleMenu}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-white/70"
                    >
                      <Briefcase size={16} />
                      Applied Jobs
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-white/70 cursor-pointer"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <Link
                  to="/recruiter-login"
                  onClick={toggleMenu}
                  className="block w-full bg-white/70 text-slate-900 px-4 py-2 rounded-2xl text-sm font-semibold hover:bg-white text-center ring-1 ring-slate-900/5 border border-slate-200/70"
                >
                  Recruiter Login
                </Link>
                <Link
                  to="/candidate-login"
                  onClick={toggleMenu}
                  className="block w-full bg-slate-900 text-white px-4 py-2 rounded-2xl text-sm font-semibold hover:shadow-md text-center cursor-pointer shadow-sm"
                >
                  Candidate Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

  );
};

export default Navbar;
