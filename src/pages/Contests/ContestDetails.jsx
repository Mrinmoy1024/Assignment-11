import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

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

function ContestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [participants, setParticipants] = useState(0);

  const { timeLeft, ended } = useCountdown(contest?.deadline);

  useEffect(() => {
    fetch(`http://localhost:3000/contest`)
      .then((r) => r.json())
      .then((data) => {
        const found = data.find(
          (c) => String(c._id) === id || String(c.id) === id,
        );
        if (found) {
          setContest(found);
          setParticipants(found.participants ?? 0);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleRegister = () => {
    if (ended) return;
    navigate(`/payment/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0b18]">
        <div className="w-12 h-12 rounded-full border-4 border-[#625FA3] border-t-[#C15B9C] animate-spin" />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0b18]">
        <p className="text-lg text-[#C15B9C]">Contest not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-55 pb-0 back text-[#e8e6f5] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-center">
          <div>
            <img
              src={contest.image}
              alt={contest.name}
              className="w-full h-64 md:h-80 object-cover rounded-lg"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-3">{contest.name}</h1>

            <div className="flex justify-between mb-4">
              <p>Participants: {participants}</p>

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

            <p className="mb-3">
              <span className="text-xl text-[#380320] font-bold">Details:</span>{" "}
              {contest.description}
            </p>
            <p className="mb-3">
              <span className="text-xl text-[#380320] font-bold">Task:</span>{" "}
              {contest.taskInstruction}
            </p>

            <button
              onClick={handleRegister}
              disabled={ended || isRegistered}
              className="px-4 py-2 bg-blue-600 rounded disabled:bg-gray-500"
            >
              {isRegistered ? "Registered" : "Register / Pay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContestDetails;
