import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router";

const statusColor = (status) => {
  if (status === "allowed") return "bg-green-100 text-green-600";
  if (status === "pending") return "bg-yellow-100 text-yellow-600";
  if (status === "rejected") return "bg-red-100 text-red-600";
  return "bg-gray-100 text-gray-600";
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
  const handleGoBack = () => {
    navigate("/dashboard");
  };
  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full pb-10">
      <div className="flex justify-between">
        <div>
          {" "}
          <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
            My Joined Contests ({submissions.length})
          </h2>
        </div>
        <div>
          <button className="btn" onClick={handleGoBack}>Go Back</button>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          You haven't joined any contests yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#e5e3f5] shadow-sm">
          <table className="table w-full">
            <thead className="bg-[#625FA3] text-black">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Contest Name</th>
                <th>Type</th>
                <th>Prize</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, index) => (
                <tr
                  key={sub._id}
                  className="hover:bg-[#660856] transition-colors"
                >
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={sub.contestImage || "https://placehold.co/60x40"}
                      alt={sub.contestName}
                      className="w-14 h-10 rounded-lg object-cover"
                    />
                  </td>
                  <td className="font-medium text-gray-700 max-w-[150px] truncate">
                    {sub.contestName}
                  </td>
                  <td className="text-black text-sm">{sub.contestType}</td>
                  <td className="text-black text-sm">
                    ${sub.prizeMoney || "—"}
                  </td>
                  <td className="text-black text-sm">
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(sub.contestStatus)}`}
                    >
                      {sub.contestStatus}
                    </span>
                  </td>
                  <td>
                    {sub.winner ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-600">
                        🏆 Winner
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                        Participant
                      </span>
                    )}
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

export default MyContests;
