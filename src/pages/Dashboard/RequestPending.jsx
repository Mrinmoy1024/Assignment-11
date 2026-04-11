import { Link } from "react-router";
import { Clock } from "lucide-react";

const RequestPending = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="bg-base-100 rounded-2xl border border-[#e5e3f5] shadow-sm p-10 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-yellow-50 flex items-center justify-center">
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-700 mb-3">
          Request Pending
        </h2>
        <p className="text-gray-400 text-sm mb-2">
          Your Creator request has been submitted successfully and is currently
          under review by our admin team.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          You will be notified once your request is approved. This usually takes
          up to 24 hours.
        </p>

        <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 mb-8">
          <p className="text-yellow-600 text-sm font-medium">
            ⏳ Your application is being reviewed
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="btn bg-[#625FA3] text-white hover:bg-[#4f4d8a] border-none w-full"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/all-contests"
            className="btn border border-gray-200 w-full"
          >
            Browse Contests
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestPending;
