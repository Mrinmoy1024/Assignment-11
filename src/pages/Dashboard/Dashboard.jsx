import React, { useEffect, useRef, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import axiosSecure from "../../Hooks/axiosSecure";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Trophy,
  PlusCircle,
  ShieldCheck,
  Award,
  ListTodo,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  UserCog,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate, Outlet, useMatch } from "react-router";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";

const StatCard = ({ icon: Icon, label, value, color, to }) => (
  <Link
    to={to}
    className="bg-white rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm border border-[#e5e3f5] hover:shadow-xl hover:scale-105 transition-all duration-300 text-center p-6"
  >
    <div
      className="w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center"
      style={{ background: `${color}18` }}
    >
      <Icon className="w-7 h-7 md:w-10 md:h-10" style={{ color }} />
    </div>
    <div className="flex flex-col items-center gap-1">
      <p className="text-sm md:text-base text-gray-400 font-medium">{label}</p>
      <p className="text-2xl md:text-4xl font-bold text-gray-800">
        {value ?? "—"}
      </p>
    </div>
  </Link>
);

const AdminDashboard = ({ stats }) => (
  <div className="flex flex-col items-center justify-center w-full gap-6">
    <h2 className="text-xl md:text-2xl font-bold text-gray-700">
      Admin Overview
    </h2>
    <div className="grid grid-cols-2 gap-4 md:gap-8 w-full">
      <StatCard
        icon={Users}
        label="Total Users"
        value={stats?.totalUsers}
        color="#625FA3"
        to="/dashboard/view-users"
      />
      <StatCard
        icon={Trophy}
        label="Total Contests"
        value={stats?.totalContests}
        color="#C15B9C"
        to="/dashboard/contests"
      />
      <StatCard
        icon={CheckCircle}
        label="Approved Contests"
        value={stats?.approvedContests}
        color="#6EB18E"
        to="/dashboard/manage-contests"
      />
      <StatCard
        icon={Clock}
        label="Pending Contests"
        value={stats?.pendingContests}
        color="#f59e0b"
        to="/dashboard/manage-contests"
      />
      <StatCard
        icon={Clock}
        label="Pending User Approval"
        value={stats?.pendingContests}
        color="#f59e0b"
        to="/dashboard/manage-contests"
      />
      <StatCard
        icon={XCircle}
        label="Rejected Users"
        value={stats?.pendingContests}
        color="#f59e0b"
        to="/dashboard/manage-contests"
      />
    </div>
  </div>
);

const CreatorDashboard = ({ stats }) => (
  <div className="flex flex-col items-center justify-center w-full gap-6">
    <h2 className="text-xl md:text-2xl font-bold text-gray-700">
      Creator Overview
    </h2>
    <div className="grid grid-cols-2 gap-4 md:gap-8 w-full">
      <StatCard
        icon={ListTodo}
        label="My Contests"
        value={stats?.myContests}
        color="#625FA3"
        to="/dashboard/my-contests"
      />
      <StatCard
        icon={Award}
        label="Submissions"
        value={stats?.totalSubmissions}
        color="#C15B9C"
        to="/dashboard/submissions"
      />
      <StatCard
        icon={PlusCircle}
        label="Add Contest"
        value="New"
        color="#6EB18E"
        to="/dashboard/add-contest"
      />
      <StatCard
        icon={TrendingUp}
        label="Analytics"
        value="View"
        color="#f59e0b"
        to="/dashboard/analytics"
      />
    </div>
  </div>
);

const UserDashboard = ({ stats }) => (
  <div className="flex flex-col items-center justify-center w-full gap-6">
    <h2 className="text-xl md:text-2xl font-bold text-gray-700">My Overview</h2>
    <div className="grid grid-cols-2 gap-4 md:gap-8 w-full">
      <StatCard
        icon={Award}
        label="Contests Joined"
        value={stats?.participated}
        color="#625FA3"
        to="/dashboard/my-contests"
      />
      <StatCard
        icon={Trophy}
        label="Total Wins"
        value={stats?.wins}
        color="#C15B9C"
        to="/dashboard/my-wins"
      />
      <StatCard
        icon={Clock}
        label="Ongoing"
        value={stats?.ongoing ?? "—"}
        color="#6EB18E"
        to="/all-contests"
      />
      <StatCard
        icon={ShieldCheck}
        label="My Profile"
        value="Edit"
        color="#f59e0b"
        to="/profile"
      />
      <StatCard
        icon={TrendingUp}
        label="Become a Creator"
        value="Apply"
        color="#3b82f6"
        to="/dashboard/become-creator"
      />
      <StatCard
        icon={PlusCircle}
        label="Add a Review"
        value="Write"
        color="#ec4899"
        to="/dashboard/add-review"
      />
    </div>
  </div>
);

const Dashboard = () => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const isChildRoute = useMatch("/dashboard/:child");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await signOutUser();
    toast.success("Logged out");
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: role, isLoading: roleLoading } = useQuery({
    queryKey: ["role", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users/role/${user.email}`);
      return data.role;
    },
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats", role, user?.email],
    enabled: !!role && !!user?.email,
    queryFn: async () => {
      if (role === "admin") {
        const { data } = await axiosSecure.get("/admin/stats");
        return data;
      } else if (role === "creator") {
        const { data } = await axiosSecure.get(
          `/creator/stats?email=${user.email}`,
        );
        return data;
      } else {
        const { data } = await axiosSecure.get(
          `/user/stats?email=${user.email}`,
        );
        return data;
      }
    },
  });

  const loading = roleLoading || statsLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gap-4 md:gap-6 overflow-visible px-3 md:px-6 py-4 md:py-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 md:p-6 rounded-2xl relative overflow-visible">
        <div className="flex items-center gap-3 md:gap-4 relative z-10">
          <div className="relative" ref={dropdownRef}>
            <img
              onClick={() => setDropdownOpen(!dropdownOpen)}
              src={user?.photoURL || "https://i.ibb.co/MgsTCcv/avater.jpg"}
              alt={user?.displayName}
              className="w-12 h-12 md:w-14 md:h-14 rounded-xl cursor-pointer border-2 border-white object-cover"
            />
            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white text-black rounded-xl shadow-xl z-[9999]">
                <div className="p-3 border-b">
                  <p className="font-semibold text-sm">{user?.displayName}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <Link
                  to="/"
                  className="flex items-center gap-2 p-3 hover:bg-gray-100 text-sm"
                >
                  <Home size={16} /> Home
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-3 hover:bg-gray-100 text-sm"
                >
                  <UserCog size={16} /> Profile
                </Link>
                <button
                  onClick={handleGoBack}
                  className="flex items-center gap-2 p-3 w-full hover:bg-gray-100 text-sm"
                >
                  <ArrowLeft size={16} /> Go Back
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 p-3 w-full text-red-500 hover:bg-red-50 text-sm"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold">
              {user?.displayName}
            </h2>
            <p className="text-xs md:text-sm capitalize opacity-80">{role}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center w-full py-4 md:py-10">
        {isChildRoute ? (
          <Outlet />
        ) : (
          <>
            {role === "admin" && <AdminDashboard stats={stats} />}
            {role === "creator" && <CreatorDashboard stats={stats} />}
            {role === "general user" && <UserDashboard stats={stats} />}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
