import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import useAuth from "../../Hooks/useAuth";
import { Trophy } from "lucide-react";
import { Link } from "react-router";

const TotalWins = () => {
  const { user } = useAuth();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["mySubmissions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/submissions/user?email=${user.email}`,
      );
      return data;
    },
  });

  const wins = submissions.filter((sub) => sub.winner === true);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-[#625FA3]"></span>
      </div>
    );
  }

  return (
    <div className="w-full pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-100">
          My Wins ({wins.length})
        </h2>
        <Link
          to="/dashboard"
          className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1e2130] border border-[#2a2d3e] text-gray-300 hover:bg-[#252836] transition"
        >
          Go Back
        </Link>
      </div>

      {/* Trophy banner */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 mb-6 flex items-center gap-4 text-white shadow-sm">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <div>
          <p className="text-3xl font-bold">{wins.length}</p>
          <p className="text-sm opacity-90">
            {wins.length === 1 ? "Contest Won" : "Contests Won"}
          </p>
        </div>
      </div>

      {wins.length === 0 ? (
        <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-4">
          <Trophy className="w-16 h-16 text-gray-600" />
          <p className="text-lg font-medium text-gray-300">No wins yet</p>
          <p className="text-sm">Join contests and compete to win!</p>
          <Link to="/all-contests">
            <button className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#625FA3] hover:bg-[#4f4d8a] text-white transition">
              Browse Contests
            </button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#2a2d3e] shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#625FA3] text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Contest Name</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Prize Money</th>
                <th className="px-4 py-3 text-left">Won On</th>
                <th className="px-4 py-3 text-left">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2d3e] bg-[#1e2130]">
              {wins.map((sub, index) => (
                <tr
                  key={sub._id}
                  className="hover:bg-[#252836] transition-colors"
                >
                  <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                  <td className="px-4 py-3">
                    <img
                      src={sub.image || "https://placehold.co/60x40"}
                      alt={sub.name}
                      className="w-14 h-10 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-100 max-w-[150px] truncate">
                    {sub.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {sub.contestType ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-semibold">
                    {sub.prizeMoney ? `$${sub.prizeMoney}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {sub.submittedAt
                      ? new Date(sub.submittedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-900/30 text-yellow-400">
                      🏆 Winner
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TotalWins;
