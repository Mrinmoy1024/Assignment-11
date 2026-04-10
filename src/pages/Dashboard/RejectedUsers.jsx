import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import { useNavigate } from "react-router";

const RejectedUsers = () => {
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["rejectedUsers"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/creator-requests/rejected");
      return data;
    },
  });
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
          Rejected Users ({requests.length})
        </h2>
        <button className="btn" onClick={() => navigate(-1)}>Back</button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No rejected users yet.
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
                  <td className="font-medium text-gray-700">{req.userName}</td>
                  <td className="text-gray-500 text-sm">{req.userEmail}</td>
                  <td className="text-gray-400 text-xs font-mono truncate max-w-[140px]">
                    {req.transactionId}
                  </td>
                  <td className="text-gray-500 text-sm">
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
