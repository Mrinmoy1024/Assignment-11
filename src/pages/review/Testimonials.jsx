import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import axiosSecure from "../../Hooks/axiosSecure";
import useAuth from "../../Hooks/useAuth";
import { Star } from "lucide-react";
import { toast } from "react-toastify";

const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-7 h-7 cursor-pointer transition-colors ${
            star <= (hovered || value)
              ? "text-yellow-400 fill-yellow-400"
              : "text-base-content/30"
          }`}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          onClick={() => onChange && onChange(star)}
        />
      ))}
    </div>
  );
};

const Testimonials = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await axios.get("https://contest-carnival-server.vercel.app/reviews");
      return data;
    },
  });

  const { data: hasReviewed } = useQuery({
    queryKey: ["hasReviewed", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axios.get("https://contest-carnival-server.vercel.app/reviews");
      return data.some((r) => r.userEmail === user.email);
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ rating, review }) => {
      await axiosSecure.post("/reviews", { rating, review });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      queryClient.invalidateQueries(["hasReviewed", user?.email]);
      toast.success("Review submitted successfully!");
      setRating(0);
      setReview("");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to submit review");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return toast.error("Please select a rating");
    if (!review.trim()) return toast.error("Please write a review");
    mutation.mutate({ rating, review });
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <section className="w-full back py-16 px-4 bg-base-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-3">
            What Our Users Say
          </h2>
          <p className="text-base-content/50 text-sm md:text-base max-w-xl mx-auto">
            Real experiences from our community of contestants and creators.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <StarRating value={Math.round(averageRating)} />
            <span className="text-2xl font-bold text-base-content">
              {averageRating}
            </span>
            <span className="text-base-content/40 text-sm">
              ({reviews.length} reviews)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-300 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={r.userPhoto || "https://i.ibb.co/MgsTCcv/avater.jpg"}
                  alt={r.userName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-base-300"
                />
                <div>
                  <p className="font-semibold text-base-content">
                    {r.userName}
                  </p>
                  <p className="text-xs text-base-content/40">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <StarRating value={r.rating} />
              <p className="text-base-content/60 text-sm mt-3 leading-relaxed">
                "{r.review}"
              </p>
            </div>
          ))}
        </div>

        <div className="max-w-xl mx-auto bg-base-100 rounded-2xl p-8 shadow-sm border border-base-300">
          <h3 className="text-xl font-bold text-base-content mb-6 text-center">
            Share Your Experience
          </h3>

          {!user ? (
            <p className="text-center text-base-content/50 text-sm">
              Please{" "}
              <a
                href="/login"
                className="text-[#625FA3] font-semibold underline"
              >
                log in
              </a>{" "}
              to write a review.
            </p>
          ) : hasReviewed ? (
            <div className="text-center py-4">
              <p className="text-[#625FA3] font-semibold">
                ✅ You have already submitted a review. Thank you!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL || "https://i.ibb.co/MgsTCcv/avater.jpg"}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-base-300"
                />
                <p className="font-semibold text-base-content">
                  {user.displayName}
                </p>
              </div>

              <div>
                <label className="text-xs text-base-content/50 mb-2 block">
                  Your Rating
                </label>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <div>
                <label className="text-xs text-base-content/50 mb-1 block">
                  Your Review
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience with the platform..."
                  rows={4}
                  className="w-full bg-base-200 border border-base-300 focus:border-[#C15B9C] text-base-content placeholder:text-base-content/30 rounded-lg px-4 py-2.5 text-sm outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="btn w-full !bg-[#625FA3] text-white hover:!bg-[#4f4d8a] border-none"
              >
                {mutation.isPending ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
