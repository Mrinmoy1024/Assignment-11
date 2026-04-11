import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const DeclareWinner = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedContest, setSelectedContest] = useState(null);
  const navigate = useNavigate();

  const { data: contests = [], isLoading: contestsLoading } = useQuery({
    queryKey: ["creatorContests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get("/contest/all");
      return data.filter((c) => c.createdBy === user.email);
    },
  });

  const { data: submissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ["contestSubmissions", selectedContest?._id],
    enabled: !!selectedContest?._id,
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/submissions/contest?contestId=${selectedContest._id}`,
      );
      return data;
    },
  });

  const winnerMutation = useMutation({
    mutationFn: async ({ id, contestId }) => {
      await axiosSecure.patch(`/submissions/${id}/winner`, { contestId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        "contestSubmissions",
        selectedContest?._id,
      ]);
      queryClient.invalidateQueries(["stats"]);
      toast.success("Winner declared! 🏆");
    },
    onError: () => toast.error("Failed to declare winner"),
  });

  const handleDeclareWinner = (sub) => {
    if (selectedContest?.status !== "allowed") {
      toast.error("Cannot declare winner for a pending or rejected contest");
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

  const statusColor = (status) => {
    if (status === "allowed") return "bg-green-100 text-green-600";
    if (status === "pending") return "bg-yellow-100 text-yellow-600";
    if (status === "rejected") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  if (contestsLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-base-content">
          Declare Winner
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-sm !bg-[#625FA3] text-white border-none hover:!bg-[#4f4d8a]"
        >
          Back
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contests list */}
        <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
          <div className="bg-[#625FA3] text-white px-5 py-3">
            <h3 className="font-semibold text-sm">My Contests</h3>
          </div>

          {contests.length === 0 ? (
            <div className="text-center py-10 text-base-content/40 text-sm">
              You haven't created any contests yet.
            </div>
          ) : (
            <div className="divide-y divide-base-200">
              {contests.map((contest) => (
                <div
                  key={contest._id}
                  onClick={() => setSelectedContest(contest)}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-base-200 transition-colors ${
                    selectedContest?._id === contest._id
                      ? "bg-base-200 border-l-4 border-[#625FA3]"
                      : ""
                  }`}
                >
                  <img
                    src={contest.image || "https://placehold.co/60x40"}
                    alt={contest.name}
                    className="w-12 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-base-content text-sm truncate">
                      {contest.name}
                    </p>
                    <p className="text-xs text-base-content/50">
                      {contest.contestType}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${statusColor(contest.status)}`}
                  >
                    {contest.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submissions list */}
        <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
          <div className="bg-[#625FA3] text-white px-5 py-3 flex items-center justify-between">
            <h3 className="font-semibold text-sm">
              {selectedContest
                ? `Participants — ${selectedContest.name}`
                : "Select a Contest"}
            </h3>
            {selectedContest && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(selectedContest.status)}`}
              >
                {selectedContest.status}
              </span>
            )}
          </div>

          {!selectedContest ? (
            <div className="text-center py-20 text-base-content/40 text-sm">
              Click a contest on the left to see its participants.
            </div>
          ) : submissionsLoading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-20 text-base-content/40 text-sm">
              No participants yet for this contest.
            </div>
          ) : (
            <div className="divide-y divide-base-200">
              {submissions.map((sub) => (
                <div key={sub._id} className="flex items-center gap-3 p-4">
                  <img
                    src={sub.userPhoto || "https://i.ibb.co/MgsTCcv/avater.jpg"}
                    alt={sub.userName}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-base-content text-sm">
                      {sub.userName}
                    </p>
                    <p className="text-xs text-base-content/50">
                      {sub.userEmail}
                    </p>
                    <p className="text-xs text-base-content/50">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {sub.winner && (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-600">
                        🏆 Winner
                      </span>
                    )}
                    <button
                      onClick={() => handleDeclareWinner(sub)}
                      disabled={
                        sub.winner ||
                        selectedContest.status !== "allowed" ||
                        winnerMutation.isPending
                      }
                      className="btn btn-xs !bg-[#625FA3] text-white hover:!bg-[#4f4d8a] border-none disabled:opacity-40"
                    >
                      {sub.winner ? "Winner" : "Declare Winner"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeclareWinner;
