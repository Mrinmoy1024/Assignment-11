import React, { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/leaderboard")
      .then(({ data }) => setLeaders(data))
      .catch((err) => console.error("Failed to fetch leaderboard:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#625FA3] via-[#C15B9C] to-[#6EB18E]">
        <div className="text-white text-xl font-semibold animate-pulse">
          Loading leaderboard...
        </div>
      </div>
    );
  }

  const top3 = leaders.slice(0, 3);
  const others = leaders.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#625FA3] via-[#C15B9C] to-[#6EB18E] py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl font-bold text-center text-white mb-12 drop-shadow-lg">
          Leaderboard
        </h1>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {top3.map((leader, index) => (
            <div
              key={leader.id}
              className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center w-64 transition-all duration-300 hover:scale-105 hover:bg-white/20 border border-white/20 shadow-xl"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#625FA3] to-[#C15B9C] text-white rounded-full px-4 py-1 text-sm font-bold shadow-lg">
                #{leader.rank}
              </div>

              <div className="text-4xl mb-3 mt-4">
                {index === 0 && "🥇"}
                {index === 1 && "🥈"}
                {index === 2 && "🥉"}
              </div>

              <img
                src={leader.avatar}
                alt={leader.name}
                className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-lg mb-3 object-cover"
              />

              <div className="font-bold text-white text-lg mb-1">
                {leader.name}
              </div>

              <div className="text-white/70 text-sm mb-2">{leader.country}</div>

              <div className="text-2xl font-bold text-[#6EB18E] bg-white/20 rounded-lg py-1 px-3 inline-block">
                {leader.score} pts
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-white/20">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#625FA3] to-[#C15B9C] text-white">
                <th className="py-4 px-4 text-left font-semibold">Rank</th>
                <th className="py-4 px-4 text-left font-semibold">
                  Contestant
                </th>
                <th className="py-4 px-4 text-left font-semibold">Country</th>
                <th className="py-4 px-4 text-right font-semibold">Score</th>
              </tr>
            </thead>
            <tbody>
              {others.map((leader) => (
                <tr
                  key={leader.id}
                  className="border-t border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4 text-white font-semibold">
                    #{leader.rank}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={leader.avatar}
                        alt={leader.name}
                        className="w-10 h-10 rounded-full border-2 border-white/30 object-cover"
                      />
                      <span className="text-white font-medium">
                        {leader.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/80">{leader.country}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[#6EB18E] font-bold text-lg">
                      {leader.score}
                    </span>
                    <span className="text-white/60 text-sm ml-1">pts</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center text-white/60 text-sm">
          Total Participants: {leaders.length}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
