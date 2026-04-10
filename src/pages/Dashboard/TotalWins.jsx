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
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full pb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-700">
          My Wins ({wins.length})
        </h2>
        <Link to="/dashboard" className="btn">
          Go Back
        </Link>
      </div>

      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 mb-6 flex items-center gap-4 text-white shadow-sm">
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
        <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-4">
          <Trophy className="w-16 h-16 text-gray-200" />
          <p className="text-lg font-medium">No wins yet</p>
          <p className="text-sm">Join contests and compete to win!</p>
          <Link to="/all-contests">
            <button className="btn bg-[#625FA3] text-white border-none hover:bg-[#4f4d8a]">
              Browse Contests
            </button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#e5e3f5] shadow-sm">
          <table className="table w-full">
            <thead className="bg-[#625FA3] text-white">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Contest Name</th>
                <th>Type</th>
                <th>Prize Money</th>
                <th>Won On</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {wins.map((sub, index) => (
                <tr
                  key={sub._id}
                  className="hover:bg-[#f5f4fc] transition-colors"
                >
                  <td className="text-black">{index + 1}</td>
                  <td>
                    <img
                      src={sub.image || "https://placehold.co/60x40"}
                      alt={sub.name}
                      className="w-14 h-10 rounded-lg object-cover"
                    />
                  </td>
                  <td className="font-medium text-gray-700 max-w-[150px] truncate">
                    {sub.name ?? "—"}
                  </td>
                  <td className="text-gray-500 text-sm">
                    {sub.contestType ?? "—"}
                  </td>
                  <td className="text-gray-500 text-sm font-semibold">
                    {sub.prizeMoney ? `$${sub.prizeMoney}` : "—"}
                  </td>
                  <td className="text-gray-500 text-sm">
                    {sub.submittedAt
                      ? new Date(sub.submittedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-600">
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
