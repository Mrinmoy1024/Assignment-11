import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router";

const API_URL = "http://localhost:3000/contest/search";
const CONTEST_TYPES = [
  "All",
  "Design",
  "Technology",
  "Photography",
  "Writing",
  "Coding",
  "Business",

  "Art",
  "Creative",
  "Gaming",
  "Science",
];

function SearchModal({ onClose }) {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [deadlineStatus, setDeadlineStatus] = useState("All");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const fetchContests = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search.trim()) params.set("name", search.trim());
    if (selectedType !== "All") params.set("type", selectedType);
    if (deadlineStatus !== "All")
      params.set("status", deadlineStatus.toLowerCase());

    fetch(`${API_URL}?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setContests(data);
          setTotal(data.length);
        } else {
          setContests(data.contests ?? []);
          setTotal(data.total ?? data.contests?.length ?? 0);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [search, selectedType, deadlineStatus]);

  useEffect(() => {
    const timer = setTimeout(fetchContests, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchContests]);

  const isEnded = (d) => new Date(d) <= new Date();
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  const hasFilters =
    search || selectedType !== "All" || deadlineStatus !== "All";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-16 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[75vh] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <svg
            className="w-4 h-4 text-gray-400 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contests by name…"
            className="flex-1 text-sm bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
          />
          {loading && (
            <svg
              className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          )}
          <button
            onClick={onClose}
            className="text-gray-400  hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none ml-1"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs py-1.5 px-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {CONTEST_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "All" ? "All Types" : t}
              </option>
            ))}
          </select>

          <select
            value={deadlineStatus}
            onChange={(e) => setDeadlineStatus(e.target.value)}
            className="text-xs py-1.5 px-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Ended">Ended</option>
          </select>

          {hasFilters && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedType("All");
                setDeadlineStatus("All");
              }}
              className="text-xs text-red-400 hover:text-red-500 ml-1"
            >
              ✕ Clear
            </button>
          )}

          <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
            {loading
              ? "Searching…"
              : `${total} result${total !== 1 ? "s" : ""}`}
          </span>
        </div>

        <div className="overflow-y-auto flex-1">
          {error ? (
            <p className="text-center text-red-500 text-sm py-10">⚠ {error}</p>
          ) : loading && contests.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-10">
              Loading…
            </p>
          ) : contests.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-10">
              {hasFilters
                ? "No contests match your filters."
                : "Start typing to search contests."}
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500">
                <tr>
                  <th className="px-4 py-2.5 text-left">Contest</th>
                  <th className="px-4 py-2.5 text-left">Type</th>
                  <th className="px-4 py-2.5 text-left">Prize</th>
                  <th className="px-4 py-2.5 text-left">Deadline</th>
                  <th className="px-4 py-2.5 text-left">Status</th>
                  <th className="px-4 py-2.5 text-left"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {contests.map((c) => {
                  const ended = isEnded(c.deadline);
                  return (
                    <tr
                      key={c._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={c.image}
                            alt={c.name}
                            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                          <span className="font-medium text-gray-800 dark:text-gray-100 line-clamp-1 max-w-[180px]">
                            {c.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded">
                          {c.contestType}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-yellow-500 whitespace-nowrap">
                        ${c.prizeMoney?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">
                        {formatDate(c.deadline)}
                      </td>
                      <td className="px-4 py-3">
                        {ended ? (
                          <span className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 text-xs font-semibold px-2 py-0.5 rounded">
                            Ended
                          </span>
                        ) : (
                          <span className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-semibold px-2 py-0.5 rounded">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/contest/${c._id}`}
                          onClick={onClose}
                          className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium whitespace-nowrap"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function Search() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-100 items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 transition"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        Search contests…
      </button>

      {open && <SearchModal onClose={() => setOpen(false)} />}
    </>
  );
}

export default Search;
