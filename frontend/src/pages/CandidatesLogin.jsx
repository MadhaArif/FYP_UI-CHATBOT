import React, { useContext, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Mail, Lock, LoaderCircle, User, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const CandidatesLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const { backendUrl, setUserData, setUserToken, setIsLogin } =
    useContext(AppContext);

  const userLoginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/user/login-user`, {
        email,
        password,
      });

      if (data.success) {
        setUserToken(data.token);
        setUserData(data.userData);
        setIsLogin(true);
        localStorage.setItem("userToken", data.token);
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center px-4 py-10 relative">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[80%] rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/8 to-purple-500/10 blur-3xl" />
            <div className="absolute top-40 -left-24 h-72 w-72 rounded-full bg-blue-500/8 blur-3xl" />
            <div className="absolute bottom-10 -right-24 h-72 w-72 rounded-full bg-indigo-500/8 blur-3xl" />
          </div>

          <div className="w-full max-w-5xl relative">
            <div className="grid lg:grid-cols-2 gap-10 items-stretch">
              <div className="hidden lg:flex relative overflow-hidden rounded-3xl p-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_26px_70px_-45px_rgba(15,23,42,0.85)]">
                <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/15 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
                <div className="flex flex-col justify-between w-full">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold ring-1 ring-white/20">
                      <User className="w-4 h-4" />
                      Candidate Portal
                    </div>
                    <h2 className="mt-6 text-4xl font-extrabold tracking-tight leading-tight">
                      Find roles that match your skills.
                    </h2>
                    <p className="mt-4 text-white/85 leading-relaxed">
                      Sign in to explore jobs, apply faster, and track your applications in one place.
                    </p>
                  </div>

                  <div className="mt-10 grid gap-3 text-sm text-white/90">
                    <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                      <div className="h-2 w-2 rounded-full bg-white" />
                      Smart job discovery & filters
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                      <div className="h-2 w-2 rounded-full bg-white" />
                      Saved applications & status tracking
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                      <div className="h-2 w-2 rounded-full bg-white" />
                      Secure sign-in experience
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-full max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -inset-2 bg-blue-500/20 rounded-2xl blur-lg opacity-60"></div>
                      </div>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
                      Candidate Login
                    </h1>
                    <p className="text-slate-600 text-sm">
                      Welcome back! Continue your job search journey
                    </p>
                  </div>

                  <div className="bg-white/75 backdrop-blur-xl rounded-2xl shadow-[0_22px_60px_-40px_rgba(15,23,42,0.75)] border border-slate-200/60 ring-1 ring-slate-900/5 overflow-hidden">
                    <div className="p-8">
                      <form className="space-y-6" onSubmit={userLoginHandler}>
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="relative w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="relative w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400 pr-12"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center group-hover:border-blue-500 ${
                          rememberMe 
                            ? "bg-blue-500 border-blue-500" 
                            : "bg-white border-gray-300"
                        }`}>
                          {rememberMe && (
                            <div className="w-2 h-2 bg-white rounded-sm"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        Remember me
                      </span>
                    </label>
                    <Link
                      to="/forgot-password"
                      state={{ from: "/candidate-login" }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 flex justify-center items-center gap-2 ${
                      loading 
                        ? "cursor-not-allowed opacity-50" 
                        : "cursor-pointer hover:from-blue-700 hover:to-indigo-700 hover:scale-105"
                    }`}
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin h-5 w-5" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        <span>Sign In to Your Account</span>
                      </>
                    )}
                  </button>

                  {/* Sign Up Link */}
                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      New to CampusConnect?{" "}
                      <Link
                        to="/candidate-signup"
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline inline-flex items-center gap-1"
                      >
                        Create Account
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </p>
                  </div>
                </form>
                    </div>
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-xs text-slate-500">
                      Your career journey starts here • Secure & encrypted login
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default CandidatesLogin;
