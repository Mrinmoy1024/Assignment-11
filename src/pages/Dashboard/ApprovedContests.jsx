import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ApprovedContests = () => {
  const queryClient = useQueryClient();

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["approvedContests"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/contest");
      return data.filter((c) => c.status === "allowed");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/contest/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["approvedContests"]);
      queryClient.invalidateQueries(["stats"]);
      toast.success("Contest deleted successfully");
    },
    onError: () => toast.error("Failed to delete contest"),
  });

  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Are you sure?",
      text: `"${name}" will be permanently deleted!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#625FA3",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
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
        Approved Contests ({contests.length})
      </h2>

      {contests.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No approved contests yet.
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
                  className="hover:bg-[#f5f4fc] transition-colors"
                >
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={contest.image || "https://placehold.co/60x40"}
                      alt={contest.name}
                      className="w-14 h-10 rounded-lg object-cover"
                    />
                  </td>
                  <td className="font-medium text-gray-700 max-w-[150px] truncate">
                    {contest.name}
                  </td>
                  <td className="text-gray-500 text-sm">
                    {contest.contestType}
                  </td>
                  <td className="text-gray-500 text-sm">${contest.price}</td>
                  <td className="text-gray-500 text-sm">
                    ${contest.prizeMoney}
                  </td>
                  <td className="text-gray-500 text-sm">{contest.deadline}</td>
                  <td className="text-gray-500 text-sm truncate max-w-[140px]">
                    {contest.createdBy}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(contest._id, contest.name)}
                      disabled={deleteMutation.isPending}
                      className="btn btn-sm bg-red-500 text-white hover:bg-red-600 border-none disabled:opacity-40"
                    >
                      Delete
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

export default ApprovedContests;
