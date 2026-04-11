import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import useAuth from "../../Hooks/useAuth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useNavigate } from "react-router";

const COLORS = ["#625FA3", "#C15B9C", "#6EB18E", "#f59e0b", "#3b82f6"];

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isDark = document.documentElement.classList.contains("dark");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["creatorStats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/creator/stats?email=${user.email}`,
      );
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-[#625FA3]"></span>
      </div>
    );
  }

  const contestStatusData = [
    { name: "Approved", value: stats?.approvedContests ?? 0 },
    { name: "Pending", value: stats?.pendingContests ?? 0 },
    { name: "Active", value: stats?.activeContests ?? 0 },
  ];

  const overviewData = [
    { name: "My Contests", value: stats?.myContests ?? 0 },
    { name: "Submissions", value: stats?.totalSubmissions ?? 0 },
    { name: "Winners", value: stats?.winners ?? 0 },
    { name: "Approved", value: stats?.approvedContests ?? 0 },
    { name: "Pending", value: stats?.pendingContests ?? 0 },
  ];

  const winRate =
    stats?.totalSubmissions > 0
      ? Math.round((stats.winners / stats.totalSubmissions) * 100)
      : 0;

  const submissionRate =
    stats?.myContests > 0
      ? Math.round((stats.totalSubmissions / stats.myContests) * 100)
      : 0;

  const approvalRate =
    stats?.myContests > 0
      ? Math.round((stats.approvedContests / stats.myContests) * 100)
      : 0;

  const tooltipStyle = {
    borderRadius: "12px",
    border: isDark ? "1px solid #374151" : "1px solid #e5e3f5",
    backgroundColor: isDark ? "#1f2937" : "#ffffff",
    color: isDark ? "#f3f4f6" : "#1f2937",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  };

  const axisTickColor = isDark ? "#6b7280" : "#9ca3af";
  const gridColor = isDark ? "#374151" : "#f0f0f0";

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-100">
          Analytics Overview
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            label: "Total Contests",
            value: stats?.myContests ?? 0,
            color: "#625FA3",
          },
          {
            label: "Total Submissions",
            value: stats?.totalSubmissions ?? 0,
            color: "#C15B9C",
          },
          {
            label: "Total Winners",
            value: stats?.winners ?? 0,
            color: "#6EB18E",
          },
          {
            label: "Approved",
            value: stats?.approvedContests ?? 0,
            color: "#3b82f6",
          },
          {
            label: "Pending",
            value: stats?.pendingContests ?? 0,
            color: "#f59e0b",
          },
          { label: "Win Rate", value: `${winRate}%`, color: "#ec4899" },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-1"
          >
            <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
              {card.label}
            </p>
            <p className="text-3xl font-bold" style={{ color: card.color }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="text-base font-bold text-gray-600 dark:text-gray-300 mb-6">
          Contest & Submission Overview
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={overviewData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: axisTickColor }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: axisTickColor }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {overviewData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-base font-bold text-gray-600 dark:text-gray-300 mb-4">
            Contest Status Breakdown
          </h3>
          {contestStatusData.every((d) => d.value === 0) ? (
            <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
              No contest data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={contestStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {contestStatusData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span
                      style={{
                        color: isDark ? "#9ca3af" : "#6b7280",
                        fontSize: "13px",
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-6 justify-center">
          <h3 className="text-base font-bold text-gray-600 dark:text-gray-300">
            Performance Rates
          </h3>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Win Rate
              </span>
              <span className="text-sm font-bold text-[#625FA3]">
                {winRate}%
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{ width: `${winRate}%`, background: "#625FA3" }}
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {stats?.winners ?? 0} winners out of{" "}
              {stats?.totalSubmissions ?? 0} submissions
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Avg Submissions / Contest
              </span>
              <span className="text-sm font-bold text-[#C15B9C]">
                {submissionRate}%
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(submissionRate, 100)}%`,
                  background: "#C15B9C",
                }}
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {stats?.totalSubmissions ?? 0} total submissions across{" "}
              {stats?.myContests ?? 0} contests
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Approval Rate
              </span>
              <span className="text-sm font-bold text-[#6EB18E]">
                {approvalRate}%
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{ width: `${approvalRate}%`, background: "#6EB18E" }}
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {stats?.approvedContests ?? 0} approved out of{" "}
              {stats?.myContests ?? 0} contests
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
