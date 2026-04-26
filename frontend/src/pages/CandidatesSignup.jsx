import axios from "axios";
import { LoaderCircle, Lock, Mail, Upload, UserRound } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";

const CandidatesSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form");
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  const navigate = useNavigate();
  const { backendUrl, setUserData, setUserToken, setIsLogin } =
    useContext(AppContext);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  const userSignupHanlder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("image", image);

      const { data } = await axios.post(
        `${backendUrl}/user/register-user`,
        formData,
         {
        headers: {
          "Content-Type": "multipart/form-data", // ✅ ensure correct header
        },
      }
      );

      if (data.success) {
        toast.success(data.message);
        if (data.requiresVerification) {
          setPendingEmail(email);
          setStep("verify");
          return;
        }

        setUserToken(data.token);
        setUserData(data.userData);
        setIsLogin(true);
        navigate("/");
        localStorage.setItem("userToken", data.token);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const cleanedOtp = otp.trim();
    if (!cleanedOtp) return toast.error("OTP required");

    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/user/verify-email`, {
        email: pendingEmail,
        otp: cleanedOtp,
      });

      if (data.success) {
        setUserToken(data.token);
        setUserData(data.userData);
        setIsLogin(true);
        localStorage.setItem("userToken", data.token);
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!pendingEmail) return toast.error("Email missing");
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/user/resend-otp`, {
        email: pendingEmail,
      });

      if (data.success) toast.success(data.message);
      else toast.error(data.message || "Failed to resend OTP");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
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
                      <UserRound className="w-4 h-4" />
                      Create your profile
                    </div>
                    <h2 className="mt-6 text-4xl font-extrabold tracking-tight leading-tight">
                      Start your career journey with CampusConnect.
                    </h2>
                    <p className="mt-4 text-white/85 leading-relaxed">
                      Create an account to apply faster, save jobs, and get matched with the right opportunities.
                    </p>
                  </div>

                  <div className="mt-10 grid gap-3 text-sm text-white/90">
                    <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                      <div className="h-2 w-2 rounded-full bg-white" />
                      Profile photo for better visibility
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                      <div className="h-2 w-2 rounded-full bg-white" />
                      Personalized job recommendations
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                      <div className="h-2 w-2 rounded-full bg-white" />
                      Secure account & data
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
                          <UserRound className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -inset-2 bg-blue-500/20 rounded-2xl blur-lg opacity-60"></div>
                      </div>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
                      Candidate Sign Up
                    </h1>
                    <p className="text-slate-600 text-sm">
                      Welcome! Please sign up to continue
                    </p>
                  </div>

                  <div className="bg-white/75 backdrop-blur-xl rounded-2xl shadow-[0_22px_60px_-40px_rgba(15,23,42,0.75)] border border-slate-200/60 ring-1 ring-slate-900/5 overflow-hidden">
                    <div className="p-8">
                      {step === "verify" ? (
                        <form className="space-y-5" onSubmit={verifyOtp}>
                          <div className="text-center">
                            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                              Verify your email
                            </h2>
                            <p className="mt-2 text-sm text-slate-600">
                              OTP bheja gaya hai: <span className="font-semibold text-slate-800">{pendingEmail}</span>
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              Enter OTP
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="6-digit OTP"
                              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400"
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 flex justify-center items-center gap-2 ${
                              loading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:brightness-105"
                            }`}
                          >
                            {loading ? (
                              <>
                                <LoaderCircle className="animate-spin h-5 w-5" />
                                <span>Verifying...</span>
                              </>
                            ) : (
                              "Verify OTP"
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={resendOtp}
                            disabled={loading}
                            className={`w-full border border-slate-200 bg-white text-slate-800 py-3.5 px-4 rounded-xl font-semibold shadow-sm hover:shadow transition-all duration-200 ${
                              loading ? "cursor-not-allowed opacity-50" : "hover:bg-slate-50"
                            }`}
                          >
                            Resend OTP
                          </button>

                          <div className="text-center text-sm text-slate-600 pt-2">
                            Wrong email?{" "}
                            <button
                              type="button"
                              onClick={() => {
                                setStep("form");
                                setOtp("");
                                setPendingEmail("");
                              }}
                              className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                            >
                              Go back
                            </button>
                          </div>
                        </form>
                      ) : (
                        <form className="space-y-5" onSubmit={userSignupHanlder}>
                        <div className="flex flex-col items-center mb-2">
                          <label className="relative cursor-pointer">
                            <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200/70 ring-1 ring-slate-900/5 flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                              {previewUrl ? (
                                <img
                                  src={previewUrl}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Upload className="h-5 w-5 text-slate-400" />
                              )}
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => setImage(e.target.files[0])}
                            />
                            <span className="block text-xs text-center mt-2 text-slate-500">
                              {image ? "Change photo" : "Upload your photo"}
                            </span>
                          </label>
                        </div>

                        <div className="space-y-3">
                          <div className="relative group">
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
                            <div className="relative border border-slate-200/70 bg-white rounded-xl flex items-center px-4 py-3.5">
                              <UserRound className="h-5 w-5 text-slate-400 mr-2" />
                              <input
                                type="text"
                                placeholder="Full name"
                                className="w-full outline-none text-sm bg-transparent placeholder-slate-400"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                                required
                              />
                            </div>
                          </div>

                          <div className="relative group">
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
                            <div className="relative border border-slate-200/70 bg-white rounded-xl flex items-center px-4 py-3.5">
                              <Mail className="h-5 w-5 text-slate-400 mr-2" />
                              <input
                                type="email"
                                placeholder="Email address"
                                className="w-full outline-none text-sm bg-transparent placeholder-slate-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                              />
                            </div>
                          </div>

                          <div className="relative group">
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
                            <div className="relative border border-slate-200/70 bg-white rounded-xl flex items-center px-4 py-3.5">
                              <Lock className="h-5 w-5 text-slate-400 mr-2" />
                              <input
                                type="password"
                                placeholder="Password"
                                className="w-full outline-none text-sm bg-transparent placeholder-slate-400"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <label
                          htmlFor="terms-checkbox"
                          className="flex items-center gap-2 cursor-pointer text-sm text-slate-600"
                        >
                          <input
                            id="terms-checkbox"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                            required
                          />
                          I agree to the{" "}
                          <Link to="/terms" className="text-blue-600 hover:underline font-semibold">
                            Terms and Conditions
                          </Link>
                        </label>

                        <button
                          type="submit"
                          disabled={loading}
                          className={`w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 flex justify-center items-center gap-2 ${
                            loading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:brightness-105"
                          }`}
                        >
                          {loading ? (
                            <>
                              <LoaderCircle className="animate-spin h-5 w-5" />
                              <span>Creating...</span>
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </button>

                        <div className="text-center text-sm text-slate-600 pt-2">
                          Already have an account?{" "}
                          <Link
                            to="/candidate-login"
                            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                          >
                            Log In
                          </Link>
                        </div>
                      </form>
                      )}
                    </div>
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-xs text-slate-500">
                      Create your account • Secure & encrypted
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

export default CandidatesSignup;
