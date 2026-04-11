import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate, Link } from "react-router";
import useAuth from "../../Hooks/useAuth";
import axiosSecure from "../../Hooks/axiosSecure";
import { useQuery } from "@tanstack/react-query";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const terms = [
  {
    title: "1. Eligibility",
    body: "You must be at least 18 years old and have a valid account to become a Contest Creator. By paying the creator fee, you confirm that you meet these requirements.",
  },
  {
    title: "2. Creator Fee",
    body: "A one-time non-refundable fee of $100 is required to become a Creator. This grants you access to create, manage, and publish contests on the platform.",
  },
  {
    title: "3. Content Responsibility",
    body: "As a Creator, you are solely responsible for the contests you create. All contest content must comply with our community guidelines and must not include illegal, harmful, or misleading information.",
  },
  {
    title: "4. Prize Money",
    body: "You are responsible for setting and honoring the prize money for your contests. Contest Carnival does not guarantee prize payouts — this is entirely the Creator's obligation.",
  },
  {
    title: "5. Approval Process",
    body: "All contests submitted by Creators are subject to admin review and approval before being listed publicly. Contest Carnival reserves the right to reject any contest without explanation.",
  },
  {
    title: "6. Account Suspension",
    body: "Contest Carnival reserves the right to suspend or revoke Creator privileges if you violate our terms, engage in fraudulent activity, or abuse the platform in any way.",
  },
  {
    title: "7. No Refunds",
    body: "The $100 Creator fee is non-refundable under any circumstances, including account suspension or voluntary termination of your Creator status.",
  },
  {
    title: "8. Changes to Terms",
    body: "Contest Carnival may update these terms at any time. Continued use of Creator features after changes constitutes acceptance of the updated terms.",
  },
];

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!agreed) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { data } = await axiosSecure.post("/create-payment-intent", {
        price: 100,
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
        await axiosSecure.post("/creator-request", {
          userEmail: user?.email,
          userName: user?.displayName,
          userPhoto: user?.photoURL,
          transactionId: paymentIntent.id,
          requestedAt: new Date(),
          status: "pending",
        });

        navigate("/dashboard/request-pending", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs text-base-content/50 mb-2 block">
          Card Details
        </label>
        <div className="bg-base-200 border border-base-300 rounded-xl p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#a0a0b0",
                  "::placeholder": { color: "#6b6b8a" },
                },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="checkbox checkbox-sm border border-base-300 mt-0.5"
        />
        <span className="text-sm text-base-content/70">
          I have read and agree to the Creator Terms & Conditions above.
        </span>
      </label>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn flex-1 bg-base-200 border border-base-300 text-base-content hover:bg-base-300"
        >
          Go Back
        </button>
        <button
          type="submit"
          disabled={!stripe || processing || !agreed}
          className="btn flex-1 !bg-[#625FA3] text-white hover:!bg-[#4f4d8a] border-none disabled:opacity-50"
        >
          {processing ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Pay $100 & Become Creator"
          )}
        </button>
      </div>

      <p className="text-center text-xs text-base-content/40">
        Secured by Stripe. Your card info is never stored.
      </p>
    </form>
  );
};

const BecomeCreator = () => {
  const { user } = useAuth();

  const { data: requestStatus, isLoading } = useQuery({
    queryKey: ["creatorRequestStatus", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/creator-request/status?email=${user.email}`,
      );
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (requestStatus?.status === "rejected") {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm p-10 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
              <span className="text-4xl">🚫</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-base-content mb-3">
            Application Rejected
          </h2>
          <p className="text-base-content/50 text-sm mb-8">
            Your Creator application has been rejected by our admin team.
            Unfortunately you are not eligible to reapply.
          </p>
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-8">
            <p className="text-red-500 text-sm font-medium">
              ❌ Your application has been permanently rejected
            </p>
          </div>
          <Link
            to="/dashboard"
            className="btn !bg-[#625FA3] text-white hover:!bg-[#4f4d8a] border-none w-full"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (requestStatus?.status === "pending") {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm p-10 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-yellow-50 flex items-center justify-center">
              <span className="text-4xl">⏳</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-base-content mb-3">
            Request Already Pending
          </h2>
          <p className="text-base-content/50 text-sm mb-8">
            You already have a pending Creator request. Please wait for admin
            review.
          </p>
          <Link
            to="/dashboard"
            className="btn !bg-[#625FA3] text-white hover:!bg-[#4f4d8a] border-none w-full"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-xl md:text-2xl font-bold text-base-content mb-2">
        Become a Creator
      </h2>
      <p className="text-base-content/50 text-sm mb-6">
        Pay a one-time fee of{" "}
        <span className="text-[#625FA3] font-semibold">$100</span> to unlock
        Creator privileges and start hosting your own contests.
      </p>


      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6 mb-6 h-full overflow-y-auto space-y-4">
        <h3 className="text-base font-bold text-base-content sticky top-0 bg-base-100 pb-2 border-b border-base-300">
          Terms & Conditions
        </h3>
        {terms.map((term) => (
          <div key={term.title}>
            <p className="text-sm font-semibold text-base-content">
              {term.title}
            </p>
            <p className="text-sm text-base-content/50 mt-1">{term.body}</p>
          </div>
        ))}
      </div>


      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
        <h3 className="text-base font-bold text-base-content mb-4">
          Complete Payment
        </h3>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default BecomeCreator;
