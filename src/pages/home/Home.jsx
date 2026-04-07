import React from "react";
import Banner from "../../components/Banner";
import PopularContests from "../../components/PopularContests";
import WinnerAdvertisement from "../../components/WinnerAdvertisement";
import RecentWinnersCard from "../../components/RecentWinnersCard";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <PopularContests></PopularContests>
      <WinnerAdvertisement></WinnerAdvertisement>
      <RecentWinnersCard></RecentWinnersCard>
    </div>
  );
};

export default Home;
