import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JobCategories, JobLocations } from "../assets/assets";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { slideRigth, SlideUp } from "../utils/Animation";

function AllJobs() {
  const [jobData, setJobData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const {
    jobs,
    searchFilter,
    setSearchFilter,
    setIsSearched,
    isSearched,
    fetchJobsData,
  } = useContext(AppContext);

  const { category } = useParams();
  const navigate = useNavigate();

  const jobsPerPage = 6;

  const [searchInput, setSearchInput] = useState({
    title: "",
    location: "",
    selectedCategories: [],
    selectedLocations: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchJobsData();
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!jobs?.length) return;

    let filtered = [...jobs];

    if (category !== "all") {
      filtered = filtered.filter(
        (job) => job.category.toLowerCase() === category.toLowerCase()
      );
    }

    setJobData(filtered);
    setSearchInput({
      title: isSearched ? searchFilter.title : "",
      location: isSearched ? searchFilter.location : "",
      selectedCategories: [],
      selectedLocations: [],
    });

    setCurrentPage(1);
  }, [category, jobs, isSearched, searchFilter]);

  useEffect(() => {
    let results = [...jobData];

    if (searchInput.title.trim()) {
      results = results.filter((job) =>
        job.title.toLowerCase().includes(searchInput.title.trim().toLowerCase())
      );
    }

    if (searchInput.location.trim()) {
      results = results.filter((job) =>
        job.location
          .toLowerCase()
          .includes(searchInput.location.trim().toLowerCase())
      );
    }

    if (searchInput.selectedCategories.length > 0) {
      results = results.filter((job) =>
        searchInput.selectedCategories.includes(job.category)
      );
    }

    if (searchInput.selectedLocations.length > 0) {
      results = results.filter((job) =>
        searchInput.selectedLocations.includes(job.location)
      );
    }

    setFilteredJobs(results);
    setCurrentPage(1);
  }, [jobData, searchInput]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (cat) => {
    setSearchInput((prev) => {
      const updated = prev.selectedCategories.includes(cat)
        ? prev.selectedCategories.filter((c) => c !== cat)
        : [...prev.selectedCategories, cat];
      return { ...prev, selectedCategories: updated };
    });
  };

  const handleLocationToggle = (loc) => {
    setSearchInput((prev) => {
      const updated = prev.selectedLocations.includes(loc)
        ? prev.selectedLocations.filter((l) => l !== loc)
        : [...prev.selectedLocations, loc];
      return { ...prev, selectedLocations: updated };
    });
  };

  const clearAllFilters = () => {
    setSearchInput({
      title: "",
      location: "",
      selectedCategories: [],
      selectedLocations: [],
    });
    setSearchFilter({ title: "", location: "" });
    setIsSearched(false);
    navigate("/all-jobs/all");
  };

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginatedJobs = useMemo(() => {
    return [...filteredJobs]
      .reverse()
      .slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);
  }, [filteredJobs, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {/* <Navbar /> */}
      <section className="relative">
        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-56 w-[90%] rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/8 to-purple-500/10 blur-3xl" />

        <div className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/5 shadow-[0_22px_60px_-45px_rgba(15,23,42,0.75)]">
          <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 capitalize">
                  {category === "all"
                    ? "All Jobs"
                    : `Jobs in ${
                        category.charAt(0).toUpperCase() + category.slice(1)
                      }`}
                </h1>
                <p className="mt-2 text-slate-600">
                  Get your desired job from top companies
                  {filteredJobs.length > 0 && (
                    <span className="ml-2 text-slate-500">
                      • {filteredJobs.length}{" "}
                      {filteredJobs.length === 1 ? "job" : "jobs"}
                    </span>
                  )}
                </p>
              </div>

              <div className="md:hidden">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition"
                >
                  <Filter size={18} />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          variants={slideRigth(0.5)}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row md:gap-8 lg:gap-10"
        >
          {/* Filters */}
          <div
            className={`md:w-[340px] lg:w-[360px] p-5 rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/5 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.7)] ${
              showFilters ? "block" : "hidden md:block"
            }`}
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-extrabold tracking-wide text-slate-900 mb-2 uppercase">
                  Job Title
                </h2>
                <input
                  type="text"
                  name="title"
                  value={searchInput.title}
                  onChange={handleSearchChange}
                  placeholder="Enter title"
                  className="w-full border border-slate-200/70 bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <h2 className="text-sm font-extrabold tracking-wide text-slate-900 mb-2 uppercase">
                  Job Location
                </h2>
                <input
                  type="text"
                  name="location"
                  value={searchInput.location}
                  onChange={handleSearchChange}
                  placeholder="Enter location"
                  className="w-full border border-slate-200/70 bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <h2 className="text-sm font-extrabold tracking-wide text-slate-900 mb-2 uppercase">
                  Categories
                </h2>
                <ul className="space-y-2">
                  {JobCategories.map((cat, i) => (
                    <li key={i} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`cat-${i}`}
                        checked={searchInput.selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        className="h-4 w-4 accent-blue-600"
                      />
                      <label
                        htmlFor={`cat-${i}`}
                        className="ml-2 text-slate-700 text-sm"
                      >
                        {cat}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-sm font-extrabold tracking-wide text-slate-900 mb-2 uppercase">
                  Locations
                </h2>
                <ul className="space-y-2">
                  {JobLocations.map((loc, i) => (
                    <li key={i} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`loc-${i}`}
                        checked={searchInput.selectedLocations.includes(loc)}
                        onChange={() => handleLocationToggle(loc)}
                        className="h-4 w-4 accent-blue-600"
                      />
                      <label
                        htmlFor={`loc-${i}`}
                        className="ml-2 text-slate-700 text-sm"
                      >
                        {loc}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={clearAllFilters}
                className="w-full rounded-xl border border-slate-200/70 bg-white/70 hover:bg-white text-slate-800 font-semibold py-2.5 text-sm transition"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Job Cards */}
          <div className="flex-1">
            <motion.div
              variants={SlideUp(0.5)}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map((job, i) => <JobCard key={i} job={job} />)
              ) : (
                <div className="text-center bg-white/70 backdrop-blur-xl p-8 border border-slate-200/60 ring-1 ring-slate-900/5 rounded-3xl shadow-[0_18px_50px_-42px_rgba(15,23,42,0.7)]">
                  <h3 className="text-lg font-extrabold tracking-tight text-slate-900 mb-1">
                    No jobs found
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Try adjusting your search filters.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-sm hover:shadow-md hover:brightness-105 transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </motion.div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-200/70 bg-white/70 rounded-xl hover:bg-white disabled:opacity-50 text-slate-700 transition"
                >
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl border text-center cursor-pointer transition ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-transparent shadow-sm"
                        : "bg-white/70 border-slate-200/70 text-slate-700 hover:bg-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-200/70 bg-white/70 rounded-xl hover:bg-white disabled:opacity-50 text-slate-700 transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </section>
      {/* <Footer /> */}
    </>
  );
}

export default AllJobs;
