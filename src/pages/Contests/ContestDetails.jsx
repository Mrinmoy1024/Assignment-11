import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../Hooks/axiosSecure";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";

function useCountdown(deadline) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (!deadline) return;

    const calc = () => {
      const diff = new Date(deadline) - new Date();
      if (diff <= 0) {
        setEnded(true);
        setTimeLeft(null);
        return;
      }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return { timeLeft, ended };
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 flex items-center justify-center rounded-xl text-2xl font-bold text-white bg-[#625FA3]/20 border border-[#625FA3]/40">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[10px] mt-1 uppercase tracking-widest text-[#625FA3]">
        {label}
      </span>
    </div>
  );
}

const fetchContestById = async (id) => {
  const { data } = await axiosSecure.get(`/contest/${id}`);
  return data;
};

function ContestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: alreadyJoined = false } = useQuery({
    queryKey: ["joined", id, user?.email],
    enabled: !!user?.email && !!id,
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/submissions/check?contestId=${id}&userEmail=${user.email}`,
      );
      return data.joined;
    },
  });

  const { data: contest, isLoading } = useQuery({
    queryKey: ["contest", id],
    queryFn: () => fetchContestById(id),
  });

  const { timeLeft, ended } = useCountdown(contest?.deadline);

  const handleRegister = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (contest.status !== "allowed") {
      toast.error("This contest is not available for registration.");
      return;
    }

    navigate(`/payment/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center back">
        <div className="w-12 h-12 border-4 border-[#625FA3] border-t-[#C15B9C] rounded-full animate-spin" />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center back">
        <p className="text-[#C15B9C]">Contest not found</p>
      </div>
    );
  }

  const isDisabled = ended || alreadyJoined || contest.status !== "allowed";

  const buttonLabel = alreadyJoined
    ? "Already Joined"
    : ended
      ? "Contest Ended"
      : contest.status !== "allowed"
        ? "Not Available"
        : "Register & Pay";

  return (
    <div className="min-h-screen pt-20 back text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <img
            src={contest.image}
            alt={contest.name}
            className="w-full h-64 md:h-80 object-cover rounded-lg"
          />

          <div>
            <h1 className="text-3xl font-bold mb-3">{contest.name}</h1>

            <div className="flex justify-between mb-4">
              <p>Participants: {contest.participants ?? 0}</p>
              {ended ? (
                <p className="text-red-400">Contest Ended</p>
              ) : (
                <div className="flex gap-2">
                  <CountdownUnit value={timeLeft?.d || 0} label="D" />
                  <CountdownUnit value={timeLeft?.h || 0} label="H" />
                  <CountdownUnit value={timeLeft?.m || 0} label="M" />
                  <CountdownUnit value={timeLeft?.s || 0} label="S" />
                </div>
              )}
            </div>

            <p className="mb-3">{contest.description}</p>
            <p className="mb-3">{contest.taskInstruction}</p>

            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">Entry Fee:</span>
                <span className="font-bold text-[#C15B9C]">
                  ${contest.price}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">Prize:</span>
                <span className="font-bold text-green-400">
                  ${contest.prizeMoney}
                </span>
              </div>
            </div>

            <div className="flex gap-10">
              <button
                onClick={handleRegister}
                disabled={isDisabled}
                className="mt-5 cursor-pointer px-6 py-2 bg-[#625FA3] hover:bg-[#4f4d8a] text-white rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed transition"
              >
                {buttonLabel}
              </button>
              <button onClick={() => navigate(-1)} className="btn mt-11">
                Back
              </button>
            </div>
          </div>
        </div>

        {contest.winner && (
          <div className="mt-6 flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <img
              src={contest.winner.photo}
              alt={contest.winner.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="text-xs text-yellow-400 uppercase tracking-widest">
                🏆 Winner
              </p>
              <p className="font-semibold">{contest.winner.name}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContestDetails;
