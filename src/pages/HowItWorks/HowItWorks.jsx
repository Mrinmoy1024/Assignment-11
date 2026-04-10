import React, { useState } from "react";
import { useNavigate } from "react-router";

const steps = [
  {
    number: "01",
    title: "Create an Account",
    description:
      "Sign up in seconds with your email or Google. Your profile is your passport to every contest on the platform.",
    color: "#625FA3",
    icon: "👤",
  },
  {
    number: "02",
    title: "Browse Contests",
    description:
      "Explore contests across Design, Coding, Writing, Photography, Gaming and more. Filter by type, prize, or deadline.",
    color: "#C15B9C",
    icon: "🔍",
  },
  {
    number: "03",
    title: "Enter & Submit",
    description:
      "Pay the entry fee, read the task instructions carefully, and submit your work before the deadline.",
    color: "#6EB18E",
    icon: "📤",
  },
  {
    number: "04",
    title: "Win Prizes",
    description:
      "Our judges review all submissions. Winners are announced publicly and prize money is transferred directly.",
    color: "#f59e0b",
    icon: "🏆",
  },
];

const faqs = [
  {
    question: "How do I enter a contest?",
    answer:
      "Create a free account, browse the contests page, pick one that interests you, pay the entry fee if applicable, and submit your work before the deadline.",
  },
  {
    question: "How are winners selected?",
    answer:
      "Each contest has its own judging criteria listed in the task instructions. A panel of judges reviews all submissions and selects winners based on those criteria.",
  },
  {
    question: "When do I receive my prize money?",
    answer:
      "Prize money is transferred within 5–7 business days after the winner announcement. You'll receive an email with payment details.",
  },
  {
    question: "Can I enter multiple contests?",
    answer:
      "Absolutely! You can enter as many contests as you like simultaneously. There's no limit.",
  },
  {
    question: "What if I want to host my own contest?",
    answer:
      "Apply to become a Creator from your dashboard. Once approved, you can create and manage your own contests with custom prizes and rules.",
  },
  {
    question: "Are there free contests?",
    answer:
      "Yes! Some contests have zero entry fee. You can filter for free contests on the All Contests page.",
  },
];

const HowItWorks = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen back text-white">
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, #C15B9C 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-[#C15B9C] text-sm font-medium uppercase tracking-widest">
            Simple. Fair. Rewarding.
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6 leading-tight">
            How It Works
          </h1>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            From signing up to winning prizes — here's everything you need to
            know to get started on Contest Carnival.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-[#1c1c26] border border-[#2a2a38] rounded-2xl p-6 md:p-8 flex gap-5 hover:border-[#C15B9C] transition group"
              >
                <div
                  className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: `${step.color}18` }}
                >
                  {step.icon}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-bold tracking-widest"
                      style={{ color: step.color }}
                    >
                      STEP {step.number}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg group-hover:text-[#C15B9C] transition">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto bg-[#1c1c26] border border-[#2a2a38] rounded-2xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "40+", label: "Active Contests", color: "#625FA3" },
            { value: "$150K+", label: "Prize Money Awarded", color: "#C15B9C" },
            { value: "12K+", label: "Participants", color: "#6EB18E" },
            { value: "98%", label: "Satisfaction Rate", color: "#f59e0b" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span
                className="text-3xl md:text-4xl font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </span>
              <span className="text-gray-500 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#C15B9C] text-sm font-medium uppercase tracking-widest">
              Got Questions?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#1c1c26] border border-[#2a2a38] rounded-2xl overflow-hidden transition hover:border-[#C15B9C]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-white font-medium text-sm md:text-base">
                    {faq.question}
                  </span>
                  <span
                    className="text-xl transition-transform duration-300 shrink-0 ml-4"
                    style={{
                      color: "#C15B9C",
                      transform:
                        openFaq === index ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    +
                  </span>
                </button>

                {openFaq === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

=
      <section className="py-20 px-4">
        <div
          className="max-w-3xl mx-auto rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #625FA3 0%, #C15B9C 50%, #6EB18E 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Compete?
            </h2>
            <p className="text-white/80 text-sm md:text-base mb-8 max-w-md mx-auto">
              Join thousands of creators, coders, and artists already winning on
              Contest Carnival.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/sign-up")}
                className="bg-white text-[#625FA3] font-bold px-8 py-3 rounded-xl hover:opacity-90 transition text-sm"
              >
                Create Free Account
              </button>
              <button
                onClick={() => navigate("/all-contests")}
                className="bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition text-sm"
              >
                Browse Contests
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
