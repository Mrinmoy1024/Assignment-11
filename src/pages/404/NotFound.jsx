import React from "react";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen back text-white flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-9xl font-black text-indigo-500 leading-none">
          404
        </h1>

        <div className="w-24 h-1 bg-[#C15B9C] mx-auto rounded-full"></div>

        <h2 className="text-2xl font-bold">Page Not Found</h2>
        <p className="text-gray-400 text-base">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <p className="text-gray-400 text-base">Here are some helpful links</p>
        <div className="flex gap-4 justify-center pt-2">
          <button
            onClick={() => navigate(-1)}
            className="btn bg-gray-600 hover:bg-gray-500 text-white"
          >
            ← Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn bg-[#bd12df] hover:bg-[#840d9c] text-white"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
