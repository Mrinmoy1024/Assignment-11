import React from "react";
import useAuth from "../Hooks/useAuth";

import useRole from "../Hooks/useRole";

import { Link } from "react-router";

const AdminRoutes = ({ children }) => {
  const { loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <p>loading</p>;
  }

  if (role !== "admin") {
    return (
      <div className="w-full h-screen flex flex-col gap-4 justify-center items-center p-4">
        <div>
          <h2 className="text-2xl font-bold text-[#cc1983] text-center">
            Access to this page is restricted
          </h2>
          <p className="text-primary text-center">
            Please contact the administrator if you believe it is an error
          </p>
          <div className="mt-2 space-x-2 text-center">
            <Link to="/" className="btn btn-primary">
              Go to Home
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              Go Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoutes;
