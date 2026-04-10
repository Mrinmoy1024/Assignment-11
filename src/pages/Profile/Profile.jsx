import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import { toast } from "react-toastify";
import useAuth from "../../Hooks/useAuth";
import useRole from "../../Hooks/useRole";
import { useNavigate } from "react-router";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [role] = useRole();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.displayName || "",
    photoURL: user?.photoURL || "",
  });

  const updateMutation = useMutation({
    mutationFn: async (updates) => {
      await axiosSecure.patch(`/users/update/${user.email}`, updates);
      await updateUserProfile(updates.name, updates.photoURL);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["role", user.email]);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const handleSave = () => {
    if (!form.name.trim()) return toast.error("Name cannot be empty");
    updateMutation.mutate(form);
  };

  const roleColor =
    role === "admin"
      ? "bg-purple-100 text-purple-600"
      : role === "creator"
        ? "bg-pink-100 text-pink-600"
        : "bg-gray-100 text-gray-600";
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className="w-full max-w-xl mx-auto py-10 px-4 pb-55 pt-55">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
            My Profile
          </h2>
        </div>
        <div>
          <button className="btn " onClick={handleGoBack}>Go Back</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e3f5] p-6">
        <div className="flex flex-col items-center gap-3 mb-6">
          <img
            src={
              isEditing
                ? form.photoURL || "https://i.ibb.co/MgsTCcv/avater.jpg"
                : user?.photoURL || "https://i.ibb.co/MgsTCcv/avater.jpg"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-[#625FA3]"
            onError={(e) =>
              (e.target.src = "https://i.ibb.co/MgsTCcv/avater.jpg")
            }
          />
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${roleColor}`}
          >
            {role || "loading..."}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input input-bordered w-full"
              />
            ) : (
              <p className="text-gray-700 font-medium px-1">
                {user?.displayName || "—"}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Email</label>
            <p className="text-gray-400 text-sm px-1">{user?.email}</p>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Photo URL
            </label>
            {isEditing ? (
              <input
                type="text"
                value={form.photoURL}
                onChange={(e) => setForm({ ...form, photoURL: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="input input-bordered w-full"
              />
            ) : (
              <p className="text-gray-400 text-sm px-1 truncate">
                {user?.photoURL || "—"}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Role</label>
            <p className="text-gray-400 text-sm px-1 capitalize">
              {role || "—"}
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setForm({
                    name: user?.displayName || "",
                    photoURL: user?.photoURL || "",
                  });
                }}
                className="btn btn-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="btn btn-sm bg-[#625FA3] text-white hover:bg-[#4f4d8a] border-none"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-sm bg-[#625FA3] text-white hover:bg-[#4f4d8a] border-none"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
