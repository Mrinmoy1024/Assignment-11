import React from "react";
import { NavLink } from "react-router";
import logo from "../assets/logo1.png";

const Navbar = () => {
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
            <NavLink to="/contest">Contest</NavLink>
          </li>
          <li>
            <NavLink to="/leader-board">Leader Board</NavLink>
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
            <NavLink to="/contest">Contest</NavLink>
          </li>
          <li>
            <NavLink to="/leader-board">Leader Board</NavLink>
          </li>
        </ul>
      </div>

      <div className="flex-1 flex justify-end">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content rounded-box z-50 mt-3 w-52 p-2 shadow bg-base-100"
          >
            <li>
              <NavLink to="/profile" className="justify-between">
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
