import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const fetchContestById = async (id) => {
  const { data } = await axiosSecure.get(`/contest/${id}`);
  return data;
};

const CheckoutForm = ({ contest }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // Reactively track dark mode instead of reading once at render
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!user) { toast.error("Login required"); return; }

    const card = elements.getElement(CardElement);
    if (!card) { toast.error("Card not loaded"); return; }

    setProcessing(true);
    setError("");

    try {
      const { data } = await axiosSecure.post("/create-payment-intent", {
        price: Number(contest.price),
      });

      const { paymentIntent, error: stripeError } =
        await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card,
            billing_details: {
              name: user.displayName,
              email: user.email,
            },
          },
        });

      if (stripeError) throw new Error(stripeError.message);
      if (paymentIntent.status !== "succeeded") throw new Error("Payment failed");

      await axiosSecure.post("/submissions", {
        contestId: String(contest._id),
        userEmail: user.email,
        userName: user.displayName,
        userPhoto: user.photoURL,
        transactionId: paymentIntent.id,
      });

      toast.success("Payment successful 🎉");
      navigate("/dashboard/my-contests");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Contest info */}
      <div className="p-4 bg-[#252836] rounded-xl border border-[#2a2d3e]">
        <h3 className="font-semibold text-gray-100">{contest.name}</h3>
        <p className="text-sm text-gray-400 mt-1">
          Entry fee:{" "}
          <span className="font-semibold text-[#a09ddb]">
            ${contest.price}
          </span>
        </p>
      </div>

      {/* Card input */}
      <div>
        <label className="text-xs text-gray-400 mb-1.5 block">Card Details</label>
        <div className="border border-[#2a2d3e] bg-[#2a2d3e] px-3 py-3.5 rounded-lg focus-within:ring-2 focus-within:ring-[#625FA3] transition">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "15px",
                  // Always use light text — bg is always dark #2a2d3e
                  color: "#f3f4f6",
                  "::placeholder": { color: "#6b7280" },
                  fontFamily: "inherit",
                  iconColor: "#a09ddb",
                },
                invalid: { color: "#f87171" },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <button
        disabled={!stripe || processing}
        className="w-full py-2.5 rounded-lg bg-[#625FA3] hover:bg-[#4f4d8a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition"
      >
        {processing ? "Processing..." : `Pay $${contest.price}`}
      </button>
    </form>
  );
};

const Payment = () => {
  const { id } = useParams();

  const { data: contest, isLoading } = useQuery({
    queryKey: ["contest", id],
    queryFn: () => fetchContestById(id),
  });

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg text-[#625FA3]"></span>
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-md bg-[#1e2130] p-6 rounded-2xl shadow-lg border border-[#2a2d3e]">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-100">Complete Payment</h2>
          <p className="text-sm text-gray-400 mt-1">
            Secure payment powered by Stripe
          </p>
        </div>
        <Elements stripe={stripePromise}>
          <CheckoutForm contest={contest} />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;