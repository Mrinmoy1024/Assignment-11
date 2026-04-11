import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

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

const statusColor = (status) => {
  if (status === "allowed")
    return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
  if (status === "pending")
    return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400";
  if (status === "rejected")
    return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
  return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
};

const CreatedContests = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [editContest, setEditContest] = useState(null);

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["createdContests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get("/contest/all");
      return data.filter((c) => c.createdBy === user.email);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/contest/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["createdContests", user?.email]);
      queryClient.invalidateQueries(["stats"]);
      toast.success("Contest deleted");
    },
    onError: () => toast.error("Failed to delete contest"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      await axiosSecure.patch(`/contest/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["createdContests", user?.email]);
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

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-[#625FA3]"></span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-100">
          My Created Contests ({contests.length})
        </h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          Dashboard
        </button>
      </div>

      {contests.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          You haven't created any contests yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
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
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-900">
              {contests.map((contest, index) => (
                <tr
                  key={contest._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <img
                      src={contest.image || "https://placehold.co/60x40"}
                      alt={contest.name}
                      className="w-14 h-10 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100 max-w-[150px] truncate">
                    {contest.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {contest.contestType}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    ${contest.price}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    ${contest.prizeMoney}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {contest.deadline}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(contest.status)}`}
                    >
                      {contest.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditContest(contest)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#625FA3] hover:bg-[#4f4d8a] text-white transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(contest._id, contest.status)
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editContest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
              Edit Contest
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                  Name
                </label>
                <input
                  type="text"
                  value={editContest.name}
                  onChange={(e) =>
                    setEditContest({ ...editContest, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#625FA3]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                  Image URL
                </label>
                <input
                  type="text"
                  value={editContest.image}
                  onChange={(e) =>
                    setEditContest({ ...editContest, image: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#625FA3]"
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
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
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
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#625FA3]"
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
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={editContest.price}
                    onChange={(e) =>
                      setEditContest({ ...editContest, price: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#625FA3]"
                    min={0}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
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
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#625FA3]"
                    min={0}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                  Deadline
                </label>
                <input
                  type="date"
                  value={editContest.deadline}
                  onChange={(e) =>
                    setEditContest({ ...editContest, deadline: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#625FA3]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
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
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#625FA3] resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
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
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#625FA3] resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-5">
              <button
                onClick={() => setEditContest(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#625FA3] hover:bg-[#4f4d8a] text-white transition"
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

export default CreatedContests;
