import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";

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

const initialForm = {
  name: "",
  image: "",
  description: "",
  price: "",
  prizeMoney: "",
  taskInstruction: "",
  contestType: "",
  deadline: "",
};

const AddContest = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialForm);

  const mutation = useMutation({
    mutationFn: async (contestData) => {
      await axiosSecure.post("/contest", contestData);
    },
    onSuccess: () => {
      // ✅ invalidate so dashboard cards update instantly
      queryClient.invalidateQueries(["stats"]);
      queryClient.invalidateQueries(["myContests", user?.email]);
      Swal.fire({
        title: "Contest Created!",
        text: "Your contest has been submitted for review.",
        icon: "success",
        confirmButtonColor: "#625FA3",
        confirmButtonText: "Great!",
      });
      setForm(initialForm);
    },
    onError: () => {
      Swal.fire({
        title: "Failed!",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#e53e3e",
      });
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.contestType) {
      Swal.fire({
        title: "Missing Field",
        text: "Please select a contest type.",
        icon: "warning",
        confirmButtonColor: "#625FA3",
      });
      return;
    }

    mutation.mutate({
      ...form,
      price: Number(form.price),
      prizeMoney: Number(form.prizeMoney),
      createdBy: user?.email,
      status: "pending",
      createdAt: new Date(),
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
        Add New Contest
      </h2>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e3f5] p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Contest Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Sustainability Pitch Contest"
              required
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Image URL
            </label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
              className="input input-bordered w-full"
            />
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="mt-2 w-full h-40 object-cover rounded-lg"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your contest..."
              required
              rows={3}
              className="textarea textarea-bordered w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Task Instruction
            </label>
            <textarea
              name="taskInstruction"
              value={form.taskInstruction}
              onChange={handleChange}
              placeholder="What should participants do?"
              required
              rows={3}
              className="textarea textarea-bordered w-full"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">
                Entry Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 10"
                required
                min={0}
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">
                Prize Money ($)
              </label>
              <input
                type="number"
                name="prizeMoney"
                value={form.prizeMoney}
                onChange={handleChange}
                placeholder="e.g. 1000"
                required
                min={0}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Contest Type
            </label>
            <select
              name="contestType"
              value={form.contestType}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select a type</option>
              {contestTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Created By
            </label>
            <input
              type="text"
              value={user?.email || ""}
              readOnly
              className="input input-bordered w-full bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Status</label>
            <input
              type="text"
              value="pending"
              readOnly
              className="input input-bordered w-full bg-gray-50 text-yellow-500 cursor-not-allowed"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn w-full bg-[#625FA3] text-white hover:bg-[#4f4d8a] border-none"
            >
              {mutation.isPending ? "Submitting..." : "Submit Contest"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContest;
