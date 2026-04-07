import { div } from "motion/react-client";
import React, { useEffect, useState } from "react";

const RecentWinnerCard = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/recent-winners")
      .then((res) => res.json())
      .then((data) => setWinners(data))
      .catch((err) => console.error("Failed to fetch recent winners:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
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

  return (
    <div>
      <div className="text-center text-5xl mt-25 mb-4">Our Recent Winners</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {winners.map(({ _id, name, contest, prizeMoneyWon, avatar }, index) => (
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
                  Money Won: ${prizeMoneyWon?.toLocaleString()}
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
