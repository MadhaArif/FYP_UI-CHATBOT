import { useContext, useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { Bell, LoaderCircle, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Added this

  const { companyData, companyLoading, backendUrl, companyToken, userToken } = useContext(AppContext);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifcationAll, setNotifactionAll] = useState([]);
 

  const sidebarLinks = [
    {
      id: "manage-jobs",
      name: "Manage Jobs",
      path: "/dashboard/manage-jobs",
      icon: assets.home_icon,
    },
    {
      id: "add-job",
      name: "Add Job",
      path: "/dashboard/add-job",
      icon: assets.add_icon,
    },
    {
      id: "view-applications",
      name: "Apply Applicants",
      path: "/dashboard/view-applications",
      icon: assets.person_tick_icon,
    },
    {
      id: "short-applications",
      name: "ShortListed Applications",
      path: "/dashboard/short-applications",
      icon: assets.person_tick_icon,
    },
  ];

  const fetchNotications = async () => {
    try {
      // console.log("companyToken ", companyToken);
      const { data } = await axios.get(`${backendUrl}/notification/all`, {
        headers: {
          Authorization: `Bearer ${companyToken || userToken}`,
        },
      });

      console.log("==========    ",data);

      if (data.success) {
        setNotifactionAll(data?.notifications);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  useEffect(() => {
    fetchNotications();
  }, []);

  
  console.log({ notifcationAll });
  const handleClearNotifications = async (id) => {
  try {
    const { data } = await axios.put(
      `${backendUrl}/notification/read/${id}`,
      {}, // no body needed
      {
        headers: { Authorization: `Bearer ${companyToken || userToken}` },
      }
    );

    if (data.success) {
      toast.success(data.message || "All notifications marked as read.");
      setNotifactionAll([]); // clear list or refetch to refresh
      setIsNotifOpen(false); // close popover
    } else {
      toast.error(data.message || "Failed to update notifications.");
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Error updating notifications."
    );
  }
};


  const handleLogout = () => {
    localStorage.removeItem("companyToken");
    toast.success("Logout successfully");
    navigate("/recruiter-login");
  };

  useEffect(() => {
    if (
      location.pathname === "/dashboard" ||
      location.pathname === "/dashboard/"
    ) {
      document.title = "Campus Connect - | Dashboard";
      navigate("/dashboard/manage-jobs");
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-white/75 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        <div className="flex items-center justify-between py-3 px-4 md:px-6">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-extrabold tracking-tight text-slate-900"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-sm">
            CC
          </span>
          <span className="hidden sm:block">Campus Connect</span>
        </Link>
        {companyLoading ? (
          <LoaderCircle className="animate-spin text-gray-500" />
        ) : companyData ? (
          <div className="flex items-center gap-4 md:gap-3">
            {/* 🔔 Notification Button */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className="relative p-2 rounded-xl bg-white/70 border border-slate-200/70 text-slate-700 hover:bg-white hover:text-blue-700 shadow-sm hover:shadow transition-all ring-1 ring-slate-900/5"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {notifcationAll.length > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-[1px] rounded-full min-w-[16px] text-center leading-tight">
      {notifcationAll.filter((n) => !n.read).length}
    </span>
  )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white/80 backdrop-blur-xl border border-slate-200/70 rounded-2xl shadow-[0_22px_60px_-40px_rgba(15,23,42,0.75)] z-50 overflow-hidden ring-1 ring-slate-900/5 animate-fadeIn">
                  <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-70" />
                  <div className="p-3 border-b border-slate-200/60 flex items-center justify-between">
                    <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
                      Notifications
                    </h3>
                    <button
                      onClick={() => setIsNotifOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <ul className="max-h-60 overflow-y-auto">
                    {notifcationAll.length > 0 ? (
                      notifcationAll.map((notif) => (
                        <li
                          key={notif._id}
                          className="flex items-start gap-3 p-3 text-sm hover:bg-white/60 cursor-pointer border-b last:border-b-0 border-slate-200/60"
                        >
                          <img
                            src={
                              notif?.userId?.image || assets.avatarPlaceholder
                            }
                            alt={notif?.userId?.name || "User"}
                            className="w-8 h-8 rounded-2xl object-cover flex-shrink-0 ring-1 ring-slate-900/10"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">
                              {notif?.userId?.name}
                            </span>
                            <p className="text-slate-600 text-xs leading-snug">
                              {notif?.message}
                            </p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="p-3 text-sm text-slate-500 text-center">
                        No notifications found.
                      </li>
                    )}
                  </ul>

                  <div className="flex items-center justify-between p-2 border-t border-slate-200/60">
                    <button
                      onClick={()=>handleClearNotifications("all")}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => navigate("/notifications")}
                      className="text-xs text-blue-700 hover:underline font-semibold"
                    >
                      View All
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <p className="text-slate-700 font-bold hidden sm:block">Hi, {companyData?.name}</p>
              <img
                className="w-9 h-9 rounded-2xl object-cover ring-1 ring-slate-900/10"
                src={companyData?.image}
                alt={`${companyData?.name}'s profile`}
              />
            </div>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/70 border border-slate-200/70 hover:bg-white transition-colors cursor-pointer ring-1 ring-slate-900/5"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut size={18} className="text-slate-700" />
            </button>
          </div>
        ) : null}
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="md:w-64 w-16 border-r border-slate-200/60 bg-white/70 backdrop-blur-xl flex flex-col shrink-0">
          <nav className="p-3 space-y-2">
            {sidebarLinks.map((item) => (
              <NavLink
                to={item.path}
                key={item.id}
                className={({ isActive }) =>
                  `flex items-center py-3 px-3 gap-3 transition-all rounded-2xl ring-1 ring-transparent hover:ring-slate-900/5 hover:bg-white/60 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-sm"
                      : "text-slate-700"
                  }`
                }
                end={item.path === "/dashboard/manage-jobs"}
              >
                <img
                  src={item.icon}
                  alt={`${item.name} icon`}
                  className="w-5 h-5"
                  aria-hidden="true"
                />
                <span className="md:block hidden">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
