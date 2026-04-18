import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ArrowRight,
  Heart
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "All Jobs", path: "/all-jobs/all" },
    { name: "About Us", path: "/about" },
    { name: "Features", path: "/features" },
  ];

  const supportLinks = [
    { name: "Contact Us", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "FAQ", path: "/faq" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", color: "hover:text-blue-600" },
    { icon: Twitter, href: "#", color: "hover:text-sky-500" },
    { icon: Linkedin, href: "#", color: "hover:text-blue-700" },
    { icon: Instagram, href: "#", color: "hover:text-pink-600" },
  ];

  return (
    <footer className="relative mt-20">
      <div className="pointer-events-none absolute inset-x-0 -top-20 h-40 bg-gradient-to-b from-blue-500/10 via-indigo-500/6 to-transparent blur-2xl" />
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
      {/* Main Footer Content */}
      <div className="w-full border-t border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-[1.02]">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                  CampusConnect
                </span>
                <span className="text-xs text-slate-500 font-semibold -mt-1">
                  Your Career Gateway
                </span>
              </div>
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-sm">
              Connecting talented students with dream career opportunities. 
              Bridging the gap between academia and industry through innovative job matching.
            </p>
            
            {/* Contact Info */}
            {/* <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="text-sm">hello@campusconnect.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-4 h-4 text-blue-500" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-sm">123 Campus Drive, Edu City</span>
              </div>
            </div> */}
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-extrabold tracking-wide text-slate-900 mb-6 flex items-center gap-2 uppercase">
              Quick Links
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-all duration-200 group text-sm py-1.5"
                  >
                    <div className="w-1.5 h-1.5 bg-slate-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-extrabold tracking-wide text-slate-900 mb-6 flex items-center gap-2 uppercase">
              Support
              <Heart className="w-4 h-4 text-slate-400" />
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-all duration-200 group text-sm py-1.5"
                  >
                    <div className="w-1.5 h-1.5 bg-slate-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-extrabold tracking-wide text-slate-900 mb-6 uppercase">
              Stay Updated
            </h3>
            <p className="text-slate-600 text-sm mb-5 max-w-sm">
              Subscribe to get notified about new job opportunities and career tips.
            </p>
          
            {/* Social Links */}
            <div className="rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-5 ring-1 ring-slate-900/5 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.7)]">
              <h4 className="text-xs font-extrabold tracking-wide text-slate-900 mb-4 uppercase">
                Follow Us
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className={`w-10 h-10 bg-white/70 border border-slate-200/70 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-white transition-all duration-200 ${social.color} shadow-sm hover:shadow-md hover:scale-[1.03]`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200/60 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-slate-600">
              <p className="text-sm text-center sm:text-left">
                © {currentYear} <span className="font-semibold text-slate-900">CampusConnect</span>. All rights reserved.
              </p>
            
            </div>

            {/* Additional Links */}
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <Link
                to="/privacy"
                className="hover:text-slate-900 transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="hover:text-slate-900 transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                to="/sitemap"
                className="hover:text-slate-900 transition-colors duration-200"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Wave Decoration */}
      <div className="w-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-2 relative">
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-500/25 via-indigo-500/20 to-purple-500/25"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
