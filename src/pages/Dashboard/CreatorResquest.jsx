import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const CreatorRequest = () => {
  const queryClient = useQueryClient();
  const { data: allRequests = [], isLoading } = useQuery({
    queryKey: ["creatorRequests"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/creator-requests");
      return data;
    },
  });

  const requests = allRequests.filter((req) => req.status === "pending");
  const approveMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/creator-request/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["creatorRequests"]);
      queryClient.invalidateQueries(["stats"]);
      queryClient.invalidateQueries(["users"]);
      toast.success("Creator approved!");
    },
    onError: () => toast.error("Failed to approve"),
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/creator-request/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["creatorRequests"]);
      queryClient.invalidateQueries(["stats"]);
      toast.success("Request rejected!");
    },
    onError: () => toast.error("Failed to reject"),
  });

  const handleApprove = (id, userName) => {
    Swal.fire({
      title: "Approve Request?",
      text: `${userName} will become a Creator.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#625FA3",
      cancelButtonColor: "#e53e3e",
      confirmButtonText: "Yes, approve!",
    }).then((result) => {
      if (result.isConfirmed) approveMutation.mutate(id);
    });
  };

  const handleReject = (id, userName) => {
    Swal.fire({
      title: "Reject Request?",
      text: `${userName}'s request will be rejected.`,
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
  const statusColor = (status) => {
    if (status === "approved") return "bg-green-100 text-green-600";
    if (status === "rejected") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-600";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
          Creator Requests ({requests.length})
        </h2>
        <button className="btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
      {requests.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No creator requests yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#e5e3f5] shadow-sm">
          <table className="table w-full">
            <thead className="bg-[#625FA3] text-white">
              <tr>
                <th>#</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Transaction ID</th>
                <th>Requested</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr
                  key={req._id}
                  className="hover:bg-[#f5f4fc] transition-colors"
                >
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={
                        req.userPhoto || "https://i.ibb.co/MgsTCcv/avater.jpg"
                      }
                      alt={req.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="font-medium text-black">{req.userName}</td>
                  <td className="text-black text-sm">{req.userEmail}</td>
                  <td className="text-black text-xs font-mono truncate max-w-[140px]">
                    {req.transactionId}
                  </td>
                  <td className="text-black text-sm">
                    {new Date(req.requestedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(req.status)}`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="space-x-2">
                    <button
                      onClick={() => handleApprove(req._id, req.userName)}
                      disabled={
                        req.status !== "pending" || approveMutation.isPending
                      }
                      className="btn btn-sm bg-[#625FA3] text-white hover:bg-[#4f4d8a] border-none disabled:opacity-40"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req._id, req.userName)}
                      disabled={
                        req.status !== "pending" || rejectMutation.isPending
                      }
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

export default CreatorRequest;
