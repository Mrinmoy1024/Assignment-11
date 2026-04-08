import React, { useEffect, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router";
import axios from "axios";

const Banner = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/contest")
      .then(({ data }) => setContests(Array.isArray(data) ? data : []))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full h-[80vh]">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={contests.length > 1}
        className="w-full h-full"
      >
        {contests.map((contest) => (
          <SwiperSlide key={contest.id} className="relative w-full h-full">
            <img
              src={contest.image}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 z-10 bg-[linear-gradient(105deg,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.4)_60%,transparent_100%)]" />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-10 flex items-center px-20"
            >
              <div className="max-w-[600px] md:max-w-2xl lg:max-w-4xl text-white mx-auto p-4">
                <span className="text-[11px] tracking-[3px] uppercase text-amber-500 font-medium">
                  {contest.contestType}
                </span>
                <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-none mt-3 mb-4">
                  {contest.name}
                </h1>
                <p className="">{contest.description?.slice(0, 120)}...</p>
                <div className="mt-[28px] flex flex-col gap-[16px]">
                  <span className="text-white/50 text-[13px]">
                    Prize:{" "}
                    <strong className="color-[#f59e0b]">
                      ${contest.prizeMoney?.toLocaleString()}
                    </strong>
                  </span>
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
