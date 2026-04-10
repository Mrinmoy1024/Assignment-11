import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const PendingContests = () => {
  const queryClient = useQueryClient();

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
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
          Pending Contests ({contests.length})
        </h2>
        <button className="btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
      {contests.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No pending contests at the moment.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#e5e3f5] shadow-sm">
          <table className="table w-full">
            <thead className="bg-[#625FA3] text-white">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Type</th>
                <th>Price</th>
                <th>Prize</th>
                <th>Deadline</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest, index) => (
                <tr
                  key={contest._id}
                  className="hover:bg-[#8f0b79] transition-colors"
                >
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={contest.image || "https://placehold.co/60x40"}
                      alt={contest.name}
                      className="w-14 h-10 rounded-lg object-cover"
                    />
                  </td>
                  <td className="font-medium text-black max-w-[150px] truncate">
                    {contest.name}
                  </td>
                  <td className="text-black text-sm">
                    {contest.contestType}
                  </td>
                  <td className="text-black text-sm">${contest.price}</td>
                  <td className="text-black text-sm">
                    ${contest.prizeMoney}
                  </td>
                  <td className="text-black text-sm">{contest.deadline}</td>
                  <td className="text-black text-sm truncate max-w-[140px]">
                    {contest.createdBy}
                  </td>
                  <td className="space-x-2">
                    <button
                      onClick={() => handleApprove(contest._id, contest.name)}
                      disabled={approveMutation.isPending}
                      className="btn btn-sm bg-[#625FA3] text-white hover:bg-[#4f4d8a] border-none disabled:opacity-40"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(contest._id, contest.name)}
                      disabled={rejectMutation.isPending}
                      className="btn btn-sm bg-red-500 text-white hover:bg-red-600 border-none disabled:opacity-40"
                    >
                      Reject
                    </button>
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
