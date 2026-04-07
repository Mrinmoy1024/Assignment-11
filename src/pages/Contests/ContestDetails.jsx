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

function SubmitModal({ onClose, onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1a1830] p-6 rounded-xl w-full max-w-md">
        <h2 className="text-lg font-bold mb-3 text-white">Submit Task</h2>
        <textarea
          className="w-full p-3 rounded bg-black/30 text-white mb-3"
          rows={4}
          placeholder="Paste your links here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-500 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-green-600 rounded"
          >
            Submit
          </button>
        </div>
      </div>
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
  const [showModal, setShowModal] = useState(false);

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
    setIsRegistered(true);
    setParticipants((p) => p + 1);
    navigate(`/payment/${id}`);
  };

  const handleTaskSubmit = (data) => {
    console.log("Submitted:", data);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0b18]">
        <div className="w-12 h-12 border-4 border-[#625FA3] border-t-[#C15B9C] rounded-full animate-spin" />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0b18]">
        <p className="text-[#C15B9C]">Contest not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-55 pb-4 back text-white p-6">
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

            <p className="mb-3">{contest.description}</p>
            <p className="mb-3">{contest.taskInstruction}</p>

            <div className="flex gap-3">
              <button
                onClick={handleRegister}
                disabled={ended || isRegistered}
                className="px-4 py-2 bg-blue-600 rounded disabled:bg-gray-500"
              >
                {isRegistered ? "Registered" : "Register / Pay"}
              </button>

              <button
                onClick={() => setShowModal(true)}
                disabled={!isRegistered || ended}
                className="px-4 py-2 bg-green-600 rounded disabled:bg-gray-500"
              >
                Submit Task
              </button>
            </div>
          </div>
        </div>

        {contest.winner && (
          <div className="mt-6 flex items-center gap-3">
            <img
              src={contest.winner.photo}
              alt={contest.winner.name}
              className="w-12 h-12 rounded-full"
            />
            <p>Winner: {contest.winner.name}</p>
          </div>
        )}
      </div>

      {showModal && (
        <SubmitModal
          onClose={() => setShowModal(false)}
          onSubmit={handleTaskSubmit}
        />
      )}
    </div>
  );
}

export default ContestDetails;
