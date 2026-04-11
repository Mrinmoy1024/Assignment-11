import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import useAuth from "../../Hooks/useAuth";
import { Link, useNavigate } from "react-router";

const statusColor = (status) => {
  if (status === "allowed") return "bg-green-900/30 text-green-400";
  if (status === "pending") return "bg-yellow-900/30 text-yellow-400";
  if (status === "rejected") return "bg-red-900/30 text-red-400";
  return "bg-[#2a2d3e] text-gray-400";
};

const MyContests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-100">
          My Joined Contests ({submissions.length})
        </h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1e2130] border border-[#2a2d3e] text-gray-300 hover:bg-[#252836] transition"
        >
          Go Back
        </button>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center flex flex-col items-center gap-5 py-20 text-gray-500">
          You haven't joined any contests yet.
          <Link to="/all-contests">
            <button className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#625FA3] hover:bg-[#4f4d8a] text-white transition">
              Join A Contest
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-[#2a2d3e] shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#625FA3] text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Contest Name</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Prize</th>
                  <th className="px-4 py-3 text-left">Submitted</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2d3e] bg-[#1e2130]">
                {submissions.map((sub, index) => (
                  <tr
                    key={sub._id}
                    className="hover:bg-[#252836] transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                    <td className="px-4 py-3">
                      <img
                        src={sub.image || "https://placehold.co/60x40"}
                        className="w-14 h-10 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-100 max-w-[150px] truncate">
                      {sub.name}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {sub.contestType}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      ${sub.prizeMoney || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(sub.contestStatus)}`}
                      >
                        {sub.contestStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {sub.winner ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-900/30 text-yellow-400">
                          🏆 Winner
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2a2d3e] text-gray-400">
                          Participant
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-12">
            <Link to="/all-contests">
              <button className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#625FA3] hover:bg-[#4f4d8a] text-white transition">
                Join More Contests
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default MyContests;
