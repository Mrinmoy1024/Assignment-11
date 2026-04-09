import { useState } from "react";
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
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      
      const { data } = await axiosSecure.post("/create-payment-intent", {
        price: contest.price,
      });

      const { paymentIntent, error: stripeError } =
        await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.displayName,
              email: user?.email,
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        
        await axiosSecure.post("/submissions", {
          contestId: contest._id,
          contestName: contest.name,
          contestStatus: contest.status,
          contestImage: contest.image,
          contestType: contest.contestType,
          prizeMoney: contest.prizeMoney, 
          createdBy: contest.createdBy,
          userEmail: user?.email,
          userName: user?.displayName,
          userPhoto: user?.photoURL,
          transactionId: paymentIntent.id,
        });

      
        navigate("/dashboard/my-contests");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError("You have already joined this contest.");
      } else {
        setError(err.message || "Payment failed");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div className="flex items-center gap-4 bg-[#f5f4fc] rounded-xl p-4">
        <img
          src={contest.image}
          alt={contest.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-700">{contest.name}</h3>
          <p className="text-sm text-gray-400">{contest.contestType}</p>
          <p className="text-[#625FA3] font-bold">${contest.price} entry fee</p>
          <p className="text-green-500 text-sm font-medium">
            🏆 Prize: ${contest.prizeMoney?.toLocaleString()}
          </p>
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-2 block">Card Details</label>
        <div className="border border-gray-200 rounded-xl p-4 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#374151",
                  "::placeholder": { color: "#9ca3af" },
                },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn w-full bg-[#625FA3] text-white hover:bg-[#4f4d8a] border-none"
      >
        {processing ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          `Pay $${contest.price}`
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        Secured by Stripe. Your card info is never stored.
      </p>
    </form>
  );
};

const Payment = () => {
  const { id } = useParams();

  const { data: contest, isLoading } = useQuery({
    queryKey: ["contest", id],
    queryFn: () => fetchContestById(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">Contest not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#f5f4fc]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#e5e3f5] p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-6 text-center">
          Complete Payment
        </h2>
        <Elements stripe={stripePromise}>
          <CheckoutForm contest={contest} />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;