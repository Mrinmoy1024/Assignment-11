import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const contestTypes = [
  "General",
  "Business",
  "Medical",
  "Article Writing",
  "Gaming",
  "Science",
  "Sports",
  "Technology",
];

const Submissions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editContest, setEditContest] = useState(null);

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["myContests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get("/contest");
      return data.filter((c) => c.createdBy === user.email);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/contest/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myContests", user?.email]);
      toast.success("Contest deleted");
    },
    onError: () => toast.error("Failed to delete contest"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      await axiosSecure.patch(`/contest/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myContests", user?.email]);
      toast.success("Contest updated successfully");
      setEditContest(null);
    },
    onError: () => toast.error("Failed to update contest"),
  });

  const handleDelete = (id, status) => {
    if (status === "allowed") {
      toast.error("Approved contests cannot be deleted");
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "This contest will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#625FA3",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  const handleUpdate = () => {
    updateMutation.mutate({
      id: editContest._id,
      updates: {
        name: editContest.name,
        image: editContest.image,
        contestType: editContest.contestType,
        price: Number(editContest.price),
        prizeMoney: Number(editContest.prizeMoney),
        deadline: editContest.deadline,
        description: editContest.description,
        taskInstruction: editContest.taskInstruction,
      },
    });
  };

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
        My Contests ({contests.length})
      </h2>

      {contests.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          You haven't created any contests yet.
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
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest, index) => (
                <tr
                  key={contest._id}
                  className="hover:bg-[#f5f4fc] transition-colors"
                >
                  <td className="text-black">{index + 1}</td>
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
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(contest.status)}`}
                    >
                      {contest.status}
                    </span>
                  </td>
                  <td className="space-x-2">
                    <button
                      onClick={() => setEditContest(contest)}
                      disabled={contest.status === "allowed"}
                      className="btn btn-sm bg-[#625FA3] text-white hover:bg-[#4f4d8a] border-none disabled:opacity-40"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contest._id, contest.status)}
                      disabled={
                        deleteMutation.isPending || contest.status === "allowed"
                      }
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

      {/* Edit Modal */}
      {editContest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Edit Contest
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Name</label>
                <input
                  type="text"
                  value={editContest.name}
                  onChange={(e) =>
                    setEditContest({ ...editContest, name: e.target.value })
                  }
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Image URL
                </label>
                <input
                  type="text"
                  value={editContest.image}
                  onChange={(e) =>
                    setEditContest({ ...editContest, image: e.target.value })
                  }
                  className="input input-bordered w-full"
                />
                {editContest.image && (
                  <img
                    src={editContest.image}
                    alt="Preview"
                    className="mt-2 w-full h-32 object-cover rounded-lg"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Contest Type
                </label>
                <select
                  value={editContest.contestType}
                  onChange={(e) =>
                    setEditContest({
                      ...editContest,
                      contestType: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  {contestTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={editContest.price}
                    onChange={(e) =>
                      setEditContest({ ...editContest, price: e.target.value })
                    }
                    className="input input-bordered w-full"
                    min={0}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">
                    Prize Money ($)
                  </label>
                  <input
                    type="number"
                    value={editContest.prizeMoney}
                    onChange={(e) =>
                      setEditContest({
                        ...editContest,
                        prizeMoney: e.target.value,
                      })
                    }
                    className="input input-bordered w-full"
                    min={0}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Deadline
                </label>
                <input
                  type="date"
                  value={editContest.deadline}
                  onChange={(e) =>
                    setEditContest({ ...editContest, deadline: e.target.value })
                  }
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Description
                </label>
                <textarea
                  value={editContest.description}
                  onChange={(e) =>
                    setEditContest({
                      ...editContest,
                      description: e.target.value,
                    })
                  }
                  className="textarea textarea-bordered w-full"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Task Instruction
                </label>
                <textarea
                  value={editContest.taskInstruction}
                  onChange={(e) =>
                    setEditContest({
                      ...editContest,
                      taskInstruction: e.target.value,
                    })
                  }
                  className="textarea textarea-bordered w-full"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-5">
              <button
                onClick={() => setEditContest(null)}
                className="btn btn-sm btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="btn btn-sm bg-[#625FA3] text-white hover:bg-[#4f4d8a] border-none"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions;
