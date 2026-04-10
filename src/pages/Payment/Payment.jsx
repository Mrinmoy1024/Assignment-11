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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    if (!user) {
      toast.error("Login required");
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      toast.error("Card not loaded");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      // 1. Create payment intent
      const { data } = await axiosSecure.post("/create-payment-intent", {
        price: Number(contest.price),
      });

      // 2. Confirm payment
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

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status !== "succeeded") {
        throw new Error("Payment failed");
      }

      // 3. Save submission
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
      const msg =
        err.response?.data?.message || err.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="p-4 bg-gray-100 rounded-xl">
        <h3>{contest.name}</h3>
        <p>${contest.price}</p>
      </div>

      <div className="border p-3 rounded">
        <CardElement />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        disabled={!stripe || processing}
        className="btn bg-purple-600 text-white w-full"
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

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-96 bg-white p-6 rounded-xl shadow">
        <Elements stripe={stripePromise}>
          <CheckoutForm contest={contest} />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
