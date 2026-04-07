import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


const typeColors = {
  Design: "#f59e0b",
  Technology: "#3b82f6",
  Business: "#10b981",
  Coding: "#8b5cf6",
  Art: "#ec4899",
  Writing: "#f97316",
  Photography: "#06b6d4",
  Gaming: "#ef4444",
  Creative: "#a855f7",
};

const PopularContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/contest")
      .then((res) => res.json())
      .then((data) => {
        const sorted = Array.isArray(data)
          ? [...data]
              .sort((a, b) => b.participantCount - a.participantCount)
              .slice(0, 6)
          : [];
        setContests(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleDetails = (id) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/contest-details/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <section className="back py-16 px-4">
      <div className="max-w-7xl mx-auto">
    
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#C15B9C] text-sm font-medium uppercase tracking-widest mb-2">
              Trending Now
            </p>
            <h2 className="text-3xl font-bold text-white">Popular Contests</h2>
            <p className="text-black text-sm mt-1">
              The most participated contests right now
            </p>
          </div>
          <button
            onClick={() => navigate("/all-contests")}
            className="bg-transparent border border-[#C15B9C] text-[#C15B9C] hover:bg-[#C15B9C] hover:text-white text-sm font-medium px-5 py-2 rounded-lg transition hidden sm:block"
          >
            Show All →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest, index) => {
            const accent = typeColors[contest.contestType] || "#C15B9C";

            return (
              <div
                key={contest.id}
                className="bg-[#1c1c26] border border-[#2a2a38] rounded-2xl overflow-hidden flex flex-col group hover:border-[#C15B9C] transition duration-300"
              >
    
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={contest.image}
                    alt={contest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

              
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c26] via-transparent to-transparent" />

                 
                  <div
                    className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-black text-xs font-bold"
                    style={{ background: accent }}
                  >
                    #{index + 1}
                  </div>

           
                  <span
                    className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-1 rounded-full text-black"
                    style={{ background: accent }}
                  >
                    {contest.contestType}
                  </span>

                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <div className="flex -space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full border border-[#1c1c26]"
                          style={{
                            background: `hsl(${i * 60 + 200}, 60%, 55%)`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-white text-xs font-medium">
                      {contest.participantCount?.toLocaleString()} participants
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 gap-3">
                  <h3 className="text-white font-semibold text-base leading-snug line-clamp-2 group-hover:text-[#C15B9C] transition">
                    {contest.name}
                  </h3>

                  <p className="text-gray-500 text-xs leading-relaxed flex-1">
                    {contest.description?.slice(0, 100)}…
                  </p>

                
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      🏆 Prize:{" "}
                      <span className="text-white font-semibold">
                        ${contest.prizeMoney?.toLocaleString()}
                      </span>
                    </span>
                    <span className="text-gray-500">
                      🎟️{" "}
                      <span className="text-white font-semibold">
                        {contest.price === 0 ? "Free" : `$${contest.price}`}
                      </span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleDetails(contest.id)}
                    className="w-full bg-[#C15B9C] hover:bg-[#a84d87] text-white text-xs font-semibold py-2.5 rounded-lg transition"
                  >
                    {user ? "View Details" : "Login to View Details"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>


        <div className="flex justify-center mt-8 sm:hidden">
          <button
            onClick={() => navigate("/contests")}
            className="btn border border-[#C15B9C] text-[#C15B9C] hover:bg-[#C15B9C] hover:text-black text-sm font-medium px-6 py-2.5 rounded-lg transition"
          >
            Show All Contests →
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularContests;
