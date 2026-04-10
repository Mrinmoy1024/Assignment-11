import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Submissions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["creatorSubmissions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/submissions?email=${user.email}&role=creator`,
      );
      return data;
    },
  });

  const winnerMutation = useMutation({
    mutationFn: async ({ id, contestId }) => {
      await axiosSecure.patch(`/submissions/${id}/winner`, { contestId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["creatorSubmissions", user?.email]);
      toast.success("Winner declared! 🏆");
    },
    onError: () => toast.error("Failed to declare winner"),
  });

  const handleDeclareWinner = (sub) => {
    if (sub.contestStatus === "pending") {
      toast.error("Cannot declare winner for a pending contest");
      return;
    }
    Swal.fire({
      title: "Declare Winner?",
      text: `Are you sure you want to declare ${sub.userName} as the winner?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#625FA3",
      cancelButtonColor: "#e53e3e",
      confirmButtonText: "Yes, declare!",
    }).then((result) => {
      if (result.isConfirmed) {
        winnerMutation.mutate({ id: sub._id, contestId: sub.contestId });
      }
    });
  };


  const grouped = submissions.reduce((acc, sub) => {
    const key = sub.contestId || "unknown";
    if (!acc[key]) {
      acc[key] = {
        contestName: sub.contestName || "Unknown Contest",
        contestStatus: sub.contestStatus || "unknown",
        submissions: [],
      };
    }
    acc[key].submissions.push(sub);
    return acc;
  }, {});
  const statusColor = (status) => {
    if (status === "allowed") return "bg-green-100 text-green-600";
    if (status === "pending") return "bg-yellow-100 text-yellow-600";
    if (status === "rejected") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
        Contest Submissions ({submissions.length})
      </h2>

      {submissions.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No submissions yet for your contests.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(
            ([
              contestId,
              { contestName, contestStatus, submissions: subs },
            ]) => (
              <div
                key={contestId}
                className="rounded-2xl border border-[#e5e3f5] shadow-sm overflow-hidden"
              >
                <div className="bg-[#625FA3] text-white px-5 py-3 flex items-center justify-between">
                  <h3 className="font-semibold text-sm md:text-base">
                    {contestName}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(contestStatus)}`}
                  >
                    {contestStatus}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead className="bg-[#f5f4fc]">
                      <tr>
                        <th>#</th>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Submitted</th>
                        <th>Result</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subs.map((sub, index) => (
                        <tr
                          key={sub._id}
                          className="hover:bg-[#f5f4fc] transition-colors"
                        >
                          <td>{index + 1}</td>
                          <td>
                            <img
                              src={
                                sub.userPhoto ||
                                "https://i.ibb.co/MgsTCcv/avater.jpg"
                              }
                              alt={sub.userName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </td>
                          <td
                            className="font-medium text-gray-700 hover:text-[#625FA3] cursor-pointer"
                            onClick={() => setSelectedUser(sub)}
                          >
                            {sub.userName}
                          </td>
                          <td className="text-gray-500 text-sm">
                            {sub.userEmail}
                          </td>
                          <td className="text-gray-500 text-sm">
                            {new Date(sub.submittedAt).toLocaleDateString()}
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
                          <td>
                            <button
                              onClick={() => handleDeclareWinner(sub)}
                              disabled={
                                sub.winner ||
                                contestStatus === "pending" ||
                                winnerMutation.isPending
                              }
                              className="btn btn-sm bg-[#625FA3] text-white hover:bg-[#4f4d8a] border-none disabled:opacity-40"
                            >
                              {sub.winner ? "Winner ✓" : "Declare Winner"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ),
          )}
        </div>
      )}


      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex flex-col items-center gap-3 mb-4">
              <img
                src={
                  selectedUser.userPhoto ||
                  "https://i.ibb.co/MgsTCcv/avater.jpg"
                }
                alt={selectedUser.userName}
                className="w-20 h-20 rounded-full object-cover border-4 border-[#625FA3]"
              />
              <h3 className="text-lg font-bold text-gray-700">
                {selectedUser.userName}
              </h3>
              {selectedUser.winner && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-600">
                  🏆 Winner
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-400">Email</span>
                <span className="font-medium">{selectedUser.userEmail}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-400">Contest</span>
                <span className="font-medium">{selectedUser.contestName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-400">Submitted</span>
                <span className="font-medium">
                  {new Date(selectedUser.submittedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Result</span>
                <span className="font-medium">
                  {selectedUser.winner ? "🏆 Winner" : "Participant"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="btn btn-sm w-full mt-5 bg-[#625FA3] text-white hover:bg-[#4f4d8a] border-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions;
