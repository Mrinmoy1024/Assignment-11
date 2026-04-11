import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchLeaderboard = async () => {
  const { data } = await axios.get(
    "https://contest-carnival-server-1bxq19mi1-mtex1024-2836s-projects.vercel.app/leaderboard",
  );
  return data;
};

const Leaderboard = () => {
  const { data: leaders = [], isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center back">
        <div className="text-white text-xl font-semibold animate-pulse">
          Loading leaderboard...
        </div>
      </div>
    );
  }

  const top3 = leaders.slice(0, 3);
  const others = leaders.slice(3);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="min-h-screen back">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl font-bold text-center text-white mb-12 drop-shadow-lg">
          Leaderboard
        </h1>

        {leaders.length === 0 ? (
          <div className="text-center text-white/70 text-lg py-20">
            No winners yet. Be the first to win a contest!
          </div>
        ) : (
          <>
     
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {top3.map((leader, index) => (
                <div
                  key={leader._id}
                  className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center w-64 transition-all duration-300 hover:scale-105 hover:bg-white/20 border border-white/20 shadow-xl"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#625FA3] to-[#C15B9C] text-white rounded-full px-4 py-1 text-sm font-bold shadow-lg">
                    #{index + 1}
                  </div>

                  <div className="text-4xl mb-3 mt-4">{medals[index]}</div>

                  <img
                    src={
                      leader.winnerPhoto ||
                      "https://i.ibb.co/MgsTCcv/avater.jpg"
                    }
                    alt={leader.winnerName}
                    className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-lg mb-3 object-cover"
                  />

                  <div className="font-bold text-white text-lg mb-1">
                    {leader.winnerName}
                  </div>

                  <div className="text-white/70 text-sm mb-1 truncate px-2">
                    {leader.contestName}
                  </div>

                  <div className="text-xs text-white/50 mb-3">
                    {leader.contestType}
                  </div>

                  <div className="text-2xl font-bold text-[#6EB18E] bg-white/20 rounded-lg py-1 px-3 inline-block">
                    ${leader.prizeMoney}
                  </div>
                </div>
              ))}
            </div>

          
            {others.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-white/20">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#625FA3] to-[#C15B9C] text-white">
                      <th className="py-4 px-4 text-left font-semibold">
                        Rank
                      </th>
                      <th className="py-4 px-4 text-left font-semibold">
                        Winner
                      </th>
                      <th className="py-4 px-4 text-left font-semibold">
                        Contest
                      </th>
                      <th className="py-4 px-4 text-left font-semibold">
                        Type
                      </th>
                      <th className="py-4 px-4 text-left font-semibold">
                        Won On
                      </th>
                      <th className="py-4 px-4 text-right font-semibold">
                        Prize
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {others.map((leader, index) => (
                      <tr
                        key={leader._id}
                        className="border-t border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-4 text-white font-semibold">
                          #{index + 4}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                leader.winnerPhoto ||
                                "https://i.ibb.co/MgsTCcv/avater.jpg"
                              }
                              alt={leader.winnerName}
                              className="w-10 h-10 rounded-full border-2 border-white/30 object-cover"
                            />
                            <div>
                              <p className="text-white font-medium">
                                {leader.winnerName}
                              </p>
                              <p className="text-white/50 text-xs">
                                {leader.winnerEmail}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white/80 max-w-[150px] truncate">
                          {leader.contestName}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs bg-white/20 text-white">
                            {leader.contestType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white/70 text-sm">
                          {leader.wonAt
                            ? new Date(leader.wonAt).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-[#6EB18E] font-bold text-lg">
                            ${leader.prizeMoney}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        <div className="mt-8 text-center text-white/60 text-sm">
          Total Winners: {leaders.length}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
