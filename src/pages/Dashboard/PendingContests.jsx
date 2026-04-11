import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const PendingContests = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["pendingContests"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/contest/all");
      return data.filter((c) => c.status === "pending");
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/contest/${id}`, { status: "allowed" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingContests"]);
      queryClient.invalidateQueries(["stats"]);
      toast.success("Contest approved!");
    },
    onError: () => toast.error("Failed to approve contest"),
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/contest/${id}`, { status: "rejected" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingContests"]);
      queryClient.invalidateQueries(["stats"]);
      toast.success("Contest rejected!");
    },
    onError: () => toast.error("Failed to reject contest"),
  });

  const handleApprove = (id, name) => {
    Swal.fire({
      title: "Approve Contest?",
      text: `"${name}" will be listed publicly.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#625FA3",
      cancelButtonColor: "#e53e3e",
      confirmButtonText: "Yes, approve!",
    }).then((result) => {
      if (result.isConfirmed) approveMutation.mutate(id);
    });
  };

  const handleReject = (id, name) => {
    Swal.fire({
      title: "Reject Contest?",
      text: `"${name}" will be rejected and hidden from public.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#625FA3",
      confirmButtonText: "Yes, reject!",
    }).then((result) => {
      if (result.isConfirmed) rejectMutation.mutate(id);
    });
  };

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
          Pending Contests ({contests.length})
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1e2130] border border-[#2a2d3e] text-gray-300 hover:bg-[#252836] transition"
        >
          Go Back
        </button>
      </div>

      {contests.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No pending contests at the moment.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#2a2d3e] shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#625FA3] text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Prize</th>
                <th className="px-4 py-3 text-left">Deadline</th>
                <th className="px-4 py-3 text-left">Created By</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2d3e] bg-[#1e2130]">
              {contests.map((contest, index) => (
                <tr
                  key={contest._id}
                  className="hover:bg-[#252836] transition-colors"
                >
                  <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                  <td className="px-4 py-3">
                    <img
                      src={contest.image || "https://placehold.co/60x40"}
                      alt={contest.name}
                      className="w-14 h-10 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-100 max-w-[150px] truncate">
                    {contest.name}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {contest.contestType}
                  </td>
                  <td className="px-4 py-3 text-gray-400">${contest.price}</td>
                  <td className="px-4 py-3 text-gray-400">
                    ${contest.prizeMoney}
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {contest.deadline}
                  </td>
                  <td className="px-4 py-3 text-gray-400 truncate max-w-[140px]">
                    {contest.createdBy}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(contest._id, contest.name)}
                        disabled={approveMutation.isPending}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#625FA3] hover:bg-[#4f4d8a] text-white transition disabled:opacity-40"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(contest._id, contest.name)}
                        disabled={rejectMutation.isPending}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/20 hover:bg-red-500/30 text-red-400 transition disabled:opacity-40"
                      >
                        Reject
                      </button>
                    </div>
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

export default PendingContests;
