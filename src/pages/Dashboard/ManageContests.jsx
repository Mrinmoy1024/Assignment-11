import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ManageContests = () => {
  const queryClient = useQueryClient();
  const [editContest, setEditContest] = useState(null);

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["contests"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/contest");
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/contest/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["contests"]);
      toast.success("Contest deleted successfully");
    },
    onError: () => toast.error("Failed to delete contest"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      await axiosSecure.patch(`/contest/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["contests"]);
      toast.success("Contest updated successfully");
      setEditContest(null);
    },
    onError: () => toast.error("Failed to update contest"),
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This contest will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#625FA3",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleUpdate = () => {
    updateMutation.mutate({
      id: editContest._id,
      updates: {
        name: editContest.name,
        contestType: editContest.contestType,
        price: editContest.price,
        prizeMoney: editContest.prizeMoney,
        deadline: editContest.deadline,
        status: editContest.status,
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
        Manage Contests ({contests.length})
      </h2>

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
                <td className="text-gray-500 text-sm">{contest.contestType}</td>
                <td className="text-gray-500 text-sm">${contest.price}</td>
                <td className="text-gray-500 text-sm">${contest.prizeMoney}</td>
                <td className="text-gray-500 text-sm">{contest.deadline}</td>
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
                    className="btn btn-sm bg-[#625FA3] text-white hover:bg-[#4f4d8a] border-none"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(contest._id)}
                    className="btn btn-sm bg-red-500 text-white hover:bg-red-600 border-none"
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

  
      {editContest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="back rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Update Contest
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-black mb-1 block">Name</label>
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
                <label className="text-xs text-black mb-1 block">
                  Contest Type
                </label>
                <input
                  type="text"
                  value={editContest.contestType}
                  onChange={(e) =>
                    setEditContest({
                      ...editContest,
                      contestType: e.target.value,
                    })
                  }
                  className="input input-bordered w-full"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-black mb-1 block">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={editContest.price}
                    onChange={(e) =>
                      setEditContest({ ...editContest, price: e.target.value })
                    }
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-black mb-1 block">
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
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-black mb-1 block">
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
                <label className="text-xs text-black mb-1 block">
                  Status
                </label>
                <select
                  value={editContest.status}
                  onChange={(e) =>
                    setEditContest({ ...editContest, status: e.target.value })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="allowed">Allowed</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-black mb-1 block">
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
                <label className="text-xs text-black mb-1 block">
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

            <div className="flex gap-2  justify-end mt-5">
              <button
                onClick={() => setEditContest(null)}
                className="btn btn-sm "
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="btn btn-sm  bg-[#625FA3] text-black hover:bg-[#4f4d8a] border-none"
                disabled={updateMutation.isPending}
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

export default ManageContests;
