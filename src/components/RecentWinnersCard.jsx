import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchRecentWinners = async () => {
  const { data } = await axios.get(
    "https://contest-carnival-server.vercel.app/leaderboard",
  );
  return data;
};

const RecentWinnerCard = () => {
  const { data: winners = [], isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchRecentWinners,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-4 animate-pulse"
          >
            <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-3"></div>
            <div className="h-5 bg-white/10 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-1/2 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!winners.length) {
    return (
      <div className="text-center py-8 bg-white/5 backdrop-blur-lg rounded-xl">
        <p className="text-white/60">🏆 No winners yet</p>
      </div>
    );
  }

  const topWinners = [...winners]
    .sort((a, b) => b.prizeMoney - a.prizeMoney)
    .slice(0, 6);

  return (
    <div>
      <div className="text-center text-5xl mt-25 mb-4">Our Recent Winners</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topWinners.map(({ _id, name, contest, prizeMoney, avatar }, index) => (
          <div
            key={_id}
            className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={avatar || `https://i.pravatar.cc/150?img=${_id}`}
                  alt={name}
                  className="w-16 h-16 rounded-full border-2 border-white/30 object-cover"
                />
                {index === 0 && (
                  <div className="absolute -top-1 -right-1 text-yellow-400">
                    👑
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white group-hover:text-[#C15B9C] transition-colors">
                    {name}
                  </h3>
                  <span className="text-xs text-white/40">#{index + 1}</span>
                </div>
                <p className="text-white/50 text-sm">{contest}</p>
                <p className="text-[#6EB18E] font-bold text-lg">
                  Money Won: ${prizeMoney?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentWinnerCard;
