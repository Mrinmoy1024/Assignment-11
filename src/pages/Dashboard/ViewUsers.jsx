import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ViewUsers = () => {
  const queryClient = useQueryClient();
  const [editUser, setEditUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/users");
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User deleted successfully");
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      await axiosSecure.patch(`/users/${id}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User updated successfully");
      setEditUser(null);
    },
    onError: () => toast.error("Failed to update user"),
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
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
    if (!newRole) return toast.error("Please select a role");
    updateMutation.mutate({ id: editUser._id, role: newRole });
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full pb-55">
      <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
        All Users ({users.length})
      </h2>

      <div className="overflow-x-auto rounded-2xl border border-[#e5e3f5] shadow-sm">
        <table className="table w-full">
          <thead className="bg-[#625FA3] text-white">
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                className="hover:bg-[#2e011b] transition-colors"
              >
                <td>{index + 1}</td>
                <td>
                  <img
                    src={user.photoURL || "https://i.ibb.co/MgsTCcv/avater.jpg"}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                </td>
                <td className="font-medium text-black">{user.name}</td>
                <td className="text-black text-sm">{user.email}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-600"
                        : user.role === "creator"
                          ? "bg-pink-100 text-pink-600"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="space-x-2">
                  <button
                    onClick={() => {
                      setEditUser(user);
                      setNewRole(user.role);
                    }}
                    className="btn btn-sm bg-[#625FA3] text-white hover:bg-[#4f4d8a] border-none"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
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

      {editUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-700 mb-1">
              Update Role
            </h3>
            <p className="text-sm text-gray-400 mb-4">{editUser.email}</p>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="select select-bordered w-full mb-4"
            >
              <option value="general user">General User</option>
              <option value="creator">Creator</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditUser(null)} className="btn btn-sm">
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="btn btn-sm bg-[#625FA3] text-white hover:bg-[#4f4d8a] border-none"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
