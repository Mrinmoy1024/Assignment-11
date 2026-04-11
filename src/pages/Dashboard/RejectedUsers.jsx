import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import { useNavigate } from "react-router";

const RejectedUsers = () => {
  const navigate = useNavigate();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["rejectedUsers"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/creator-requests/rejected");
      return data;
    },
  });

  if (isLoading) {
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
          Rejected Users ({requests.length})
        </h2>
        <button
          className="btn btn-sm !bg-[#625FA3] text-white border-none hover:!bg-[#4f4d8a]"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 text-base-content/40">
          No rejected users yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-base-300 shadow-sm">
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
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr
                  key={req._id}
                  className="hover:bg-base-200 transition-colors"
                >
                  <td className="text-base-content">{index + 1}</td>
                  <td>
                    <img
                      src={
                        req.userPhoto || "https://i.ibb.co/MgsTCcv/avater.jpg"
                      }
                      alt={req.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="font-medium text-base-content">
                    {req.userName}
                  </td>
                  <td className="text-base-content/70 text-sm">
                    {req.userEmail}
                  </td>
                  <td className="text-base-content/70 text-xs font-mono truncate max-w-[140px]">
                    {req.transactionId}
                  </td>
                  <td className="text-base-content/70 text-sm">
                    {new Date(req.requestedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                      Rejected
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

export default RejectedUsers;
