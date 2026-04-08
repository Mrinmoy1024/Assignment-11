import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const typeColors = {
  Design: "#f59e0b",
  Technology: "#3b82f6",
  Business: "#10b981",
  Coding: "#8b5cf6",
  Art: "#ec4899",
  Writing: "#f97316",
  Photography: "#06b6d4",
  Gaming: "#ef4444",
  Creative: "#a855f7",
};

const ITEMS_PER_PAGE = 10;

const sortOptions = [
  { label: "Default", value: "default" },
  { label: "Prize: High to Low", value: "prize_desc" },
  { label: "Prize: Low to High", value: "prize_asc" },
  { label: "Entry Fee: Low to High", value: "price_asc" },
  { label: "Entry Fee: High to Low", value: "price_desc" },
  { label: "Deadline: Soonest", value: "deadline_asc" },
  { label: "Most Participants", value: "participants_desc" },
];

const fetchContests = async () => {
  const { data } = await axios.get(`http://localhost:3000/contest`);
  return Array.isArray(data) ? data : [];
};

const Contests = () => {
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("All");
  const navigate = useNavigate();

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["contests"],
    queryFn: fetchContests,
  });

  const contestTypes = ["All", ...new Set(contests.map((c) => c.contestType))];

  const filtered =
    filterType === "All"
      ? contests
      : contests.filter((c) => c.contestType === filterType);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "prize_desc") return b.prizeMoney - a.prizeMoney;
    if (sortBy === "prize_asc") return a.prizeMoney - b.prizeMoney;
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "deadline_asc")
      return new Date(a.deadline) - new Date(b.deadline);
    if (sortBy === "participants_desc")
      return b.participantCount - a.participantCount;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSort = (val) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  const handleFilter = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen back px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">All Contests</h1>
          <p className="text-gray-500 text-sm">
            {filtered.length} contests available
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {contestTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleFilter(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                  filterType === type
                    ? "bg-[#C15B9C] border-[#C15B9C] text-white"
                    : "bg-transparent border-[#2a2a38] text-gray-400 hover:border-[#C15B9C]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="bg-[#1c1c26] border border-[#2a2a38] text-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-[#C15B9C] transition"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginated.map((contest) => {
            const accent = typeColors[contest.contestType] || "#C15B9C";
            const daysLeft = Math.ceil(
              (new Date(contest.deadline) - new Date()) / (1000 * 60 * 60 * 24),
            );

            return (
              <div
                key={contest.id}
                className="bg-[#1c1c26] border border-[#2a2a38] rounded-2xl overflow-hidden flex flex-col hover:border-[#C15B9C] transition group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={contest.image}
                    alt={contest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span
                    className="absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full text-black"
                    style={{ background: accent }}
                  >
                    {contest.contestType}
                  </span>
                  <span className="absolute top-3 right-3 text-[10px] bg-black/60 text-white px-2 py-1 rounded-full">
                    {daysLeft > 0 ? `${daysLeft}d left` : "Closing soon"}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-1 gap-3">
                  <h2 className="text-white font-semibold text-sm leading-snug line-clamp-2">
                    {contest.name}
                  </h2>
                  <p className="text-gray-500 text-xs line-clamp-2 flex-1">
                    {contest.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      🏆{" "}
                      <span className="text-white font-medium">
                        ${contest.prizeMoney?.toLocaleString()}
                      </span>
                    </span>
                    <span>
                      👥{" "}
                      <span className="text-white font-medium">
                        {contest.participantCount}
                      </span>
                    </span>
                    <span>
                      🎟️{" "}
                      <span className="text-white font-medium">
                        {contest.price === 0 ? "Free" : `$${contest.price}`}
                      </span>
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    📅 <span>Deadline:</span>
                    <span className="text-white font-medium">
                      {new Date(contest.deadline).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/contest-details/${contest.id}`)}
                    className="w-full bg-[#C15B9C] hover:bg-[#a84d87] text-white text-xs font-semibold py-2 rounded-lg transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-sm bg-[#1c1c26] border border-[#2a2a38] text-gray-400 hover:border-[#C15B9C] disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1.5 rounded-lg text-sm transition border ${
                  currentPage === page
                    ? "bg-[#df16e6] border-[#C15B9C] text-white"
                    : "bg-[#1c1c26] border-[#2a2a38] text-gray-400 hover:border-[#C15B9C]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-sm bg-[#1c1c26] border border-[#2a2a38] text-gray-400 hover:border-[#C15B9C] disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contests;
