import React, { useContext, useState } from "react";
import { Navigate, NavLink } from "react-router";
import logo from "../assets/logo1.png";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    signOutUser()
      .then(() => {
        setDropdownOpen(false);
        toast.success("Logged out successfully");
        Navigate("/");
      })
      .catch((err) => {
        toast.error("Logout failed: " + err.message);
      });
  };

  return (
    <div className="navbar shadow-sm relative">
      <div className="dropdown lg:hidden">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </div>
        <ul
          tabIndex="-1"
          className="menu menu-sm dropdown-content rounded-box z-50 mt-3 w-52 p-2 shadow bg-base-100"
        >
          <li>
            <NavLink to="/">Homepage</NavLink>
          </li>
          <li>
            <NavLink to="/all-contests">Contest</NavLink>
          </li>
          <li>
            <NavLink to="/leaderboard">Leader Board</NavLink>
          </li>
        </ul>
      </div>

      <div className="flex-1 lg:flex-none">
        <NavLink to="/">
          <img src={logo} className="w-20 h-13" alt="Logo" />
        </NavLink>
      </div>

      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
        <ul className="flex gap-5">
          <li>
            <NavLink to="/">Homepage</NavLink>
          </li>
          <li>
            <NavLink to="/all-contests">Contest</NavLink>
          </li>
          <li>
            <NavLink to="/leaderboard">Leader Board</NavLink>
          </li>
        </ul>
      </div>

      <div className="flex-1 flex justify-end">
        <div className="navbar-end flex items-center gap-3">
          {user ? (
            <div className="relative">
              <img
                src={user.photoURL}
                alt={user.displayName || "User"}
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50 p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {user.displayName || "No Name"}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                  <NavLink to="/dashboard">
                    <button className="btn btn-sm w-full bg-[#625FA3] mb-5">
                      {" "}
                      Dashboard
                    </button>
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="btn btn-sm w-full bg-red-500 text-white hover:bg-red-700 "
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login">
                <button className="btn text-white  hover:bg-[#bd0e97]">
                  Log In
                </button>
              </NavLink>

              <NavLink to="/sign-up">
                <button className="btn  text-white hover:bg-purple-700">
                  Sign Up
                </button>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
