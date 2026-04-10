import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
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

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const AddContest = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [imageMode, setImageMode] = useState("url");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "image") {
      setPreviewUrl(e.target.value);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        { method: "POST", body: formData },
      );
      const data = await res.json();

      if (data.success) {
        const url = data.data.url;
        setForm((prev) => ({ ...prev, image: url }));
        setPreviewUrl(url);
        Swal.fire({
          title: "Upload Successful!",
          text: "Image uploaded successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Upload Failed",
          text: "Could not upload image. Please try a URL instead.",
          icon: "error",
          confirmButtonColor: "#e53e3e",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Upload Failed",
        text: "Something went wrong during upload.",
        icon: "error",
        confirmButtonColor: "#e53e3e",
      });
    } finally {
      setUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: async (contestData) => {
      const response = await axiosSecure.post("/contest", contestData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stats"], exact: false });
      queryClient.invalidateQueries(["myContests", user?.email]);
      Swal.fire({
        title: "Contest Created!",
        text: "Your contest has been submitted for review.",
        icon: "success",
        confirmButtonColor: "#625FA3",
        confirmButtonText: "Great!",
      }).then(() => {
        navigate("/dashboard/my-contests");
      });
      setForm(initialForm);
      setPreviewUrl("");
    },
    onError: (error) => {
      console.error("Contest creation error:", error);
      Swal.fire({
        title: "Failed!",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#e53e3e",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      Swal.fire({
        title: "Missing Field",
        text: "Please enter a contest name.",
        icon: "warning",
        confirmButtonColor: "#625FA3",
      });
      return;
    }

    if (!form.contestType) {
      Swal.fire({
        title: "Missing Field",
        text: "Please select a contest type.",
        icon: "warning",
        confirmButtonColor: "#625FA3",
      });
      return;
    }

    if (!form.image) {
      Swal.fire({
        title: "Missing Image",
        text: "Please provide an image URL or upload an image.",
        icon: "warning",
        confirmButtonColor: "#625FA3",
      });
      return;
    }

    if (!form.description.trim()) {
      Swal.fire({
        title: "Missing Field",
        text: "Please enter a description.",
        icon: "warning",
        confirmButtonColor: "#625FA3",
      });
      return;
    }

    if (!form.taskInstruction.trim()) {
      Swal.fire({
        title: "Missing Field",
        text: "Please enter task instructions.",
        icon: "warning",
        confirmButtonColor: "#625FA3",
      });
      return;
    }

    if (!form.price || form.price <= 0) {
      Swal.fire({
        title: "Invalid Price",
        text: "Please enter a valid entry price greater than 0.",
        icon: "warning",
        confirmButtonColor: "#625FA3",
      });
      return;
    }

    if (!form.prizeMoney || form.prizeMoney <= 0) {
      Swal.fire({
        title: "Invalid Prize Money",
        text: "Please enter a valid prize money greater than 0.",
        icon: "warning",
        confirmButtonColor: "#625FA3",
      });
      return;
    }

    if (!form.deadline) {
      Swal.fire({
        title: "Missing Field",
        text: "Please select a deadline date.",
        icon: "warning",
        confirmButtonColor: "#625FA3",
      });
      return;
    }

    const selectedDate = new Date(form.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      Swal.fire({
        title: "Invalid Deadline",
        text: "Deadline must be a future date.",
        icon: "warning",
        confirmButtonColor: "#625FA3",
      });
      return;
    }

    const contestData = {
      name: form.name.trim(),
      image: form.image,
      description: form.description.trim(),
      price: Number(form.price),
      prizeMoney: Number(form.prizeMoney),
      taskInstruction: form.taskInstruction.trim(),
      contestType: form.contestType,
      deadline: form.deadline,
      createdBy: user?.email,
      status: "pending",
      createdAt: new Date(),
    };

    console.log("Submitting contest:", contestData);
    mutation.mutate(contestData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-700">
          Add New Contest
        </h2>
        <button type="button" onClick={() => navigate(-1)} className="btn ">
          Back
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e3f5] p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Contest Name <span className="text-red-500">*</span>
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
              Contest Image <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`btn btn-sm flex-1 ${imageMode === "url" ? "bg-[#625FA3] text-white border-none" : "border border-gray-200"}`}
              >
                Enter URL
              </button>
              <button
                type="button"
                onClick={() => setImageMode("upload")}
                className={`btn btn-sm flex-1 ${imageMode === "upload" ? "bg-[#625FA3] text-white border-none" : "border border-gray-200"}`}
              >
                Upload File
              </button>
            </div>

            {imageMode === "url" ? (
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Enter image URL here..."
                className="input input-bordered w-full"
              />
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  {uploading ? (
                    <span className="loading loading-spinner loading-md text-[#625FA3]" />
                  ) : (
                    <>
                      <span className="text-3xl">📁</span>
                      <span className="text-sm text-gray-500">
                        Click to upload image
                      </span>
                      <span className="text-xs text-gray-400">
                        PNG, JPG, WEBP up to 10MB
                      </span>
                    </>
                  )}
                </label>
              </div>
            )}

            {previewUrl && (
              <div className="mt-3">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                    Swal.fire({
                      title: "Invalid Image URL",
                      text: "The image URL is not valid. Please provide a valid image URL.",
                      icon: "error",
                    });
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Description <span className="text-red-500">*</span>
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
              Task Instruction <span className="text-red-500">*</span>
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
                Entry Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 10"
                required
                min={1}
                step="0.01"
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">
                Prize Money ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="prizeMoney"
                value={form.prizeMoney}
                onChange={handleChange}
                placeholder="e.g. 1000"
                required
                min={1}
                step="0.01"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Contest Type <span className="text-red-500">*</span>
            </label>
            <select
              name="contestType"
              value={form.contestType}
              onChange={handleChange}
              required
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
            <label className="text-xs text-gray-500 mb-1 block">
              Deadline <span className="text-red-500">*</span>
            </label>
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
              disabled
              className="input input-bordered w-full bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Status</label>
            <input
              type="text"
              value="Pending Review"
              readOnly
              disabled
              className="input input-bordered w-full bg-gray-50 text-yellow-600 cursor-not-allowed font-medium"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={mutation.isPending || uploading}
              className="btn w-full bg-[#625FA3] text-white hover:bg-[#4f4d8a] border-none disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Submitting...
                </>
              ) : (
                "Submit Contest"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContest;
