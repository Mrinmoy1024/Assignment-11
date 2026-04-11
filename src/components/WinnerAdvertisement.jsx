import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchContests = async () => {
  const { data } = await axios.get("https://contest-carnival-server.vercel.app/contest");
  return Array.isArray(data) ? data : [];
};

const WinnerAdvertisement = () => {
  const { data: contests = [] } = useQuery({
    queryKey: ["contests"],
    queryFn: fetchContests,
  });

  const topContests = [...contests]
    .sort((a, b) => b.prizeMoney - a.prizeMoney)
    .slice(0, 3);

  const totalPrize = contests.reduce(
    (sum, contest) => sum + (contest.prizeMoney || 0),
    0,
  );
  return (
    <div className="relative w-full py-20 mt-20">
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.6)_60%,transparent_100%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            🏆 Winners Are Winning BIG
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Join thousands of creators, developers, and innovators competing for
            life-changing prizes. Your name could be next on this list.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-center">
            <h3 className="text-3xl font-bold text-amber-400">
              ${totalPrize.toLocaleString()}
            </h3>
            <p className="text-white/60 mt-2">Total Prize Pool</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-center">
            <h3 className="text-3xl font-bold text-amber-400">
              {contests.length}+
            </h3>
            <p className="text-white/60 mt-2">Active Contests</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-center">
            <h3 className="text-3xl font-bold text-amber-400">
              {topContests.length * 10}+
            </h3>
            <p className="text-white/60 mt-2">Happy Winners</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {topContests.map((contest, index) => (
            <motion.div
              key={contest.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
            >
              <img
                src={contest.image}
                className="w-full h-48 object-cover"
                alt={contest.name}
              />
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2">{contest.name}</h3>
                <p className="text-sm text-white/60 mb-3">
                  {contest.contestType}
                </p>
                <p className="text-amber-400 font-semibold text-lg">
                  💰 ${contest.prizeMoney.toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold mb-4">
            🚀 Ready to Become a Winner?
          </h3>
          <NavLink to="all-contests">
            <button className="btn bg-amber-500 text-black hover:bg-amber-600 px-8">
              Join a Contest Now
            </button>
          </NavLink>
        </motion.div>
      </div>
    </div>
  );
};

export default WinnerAdvertisement;
