import React from "react";
import Banner from "../../components/Banner";
import PopularContests from "../../components/PopularContests";
import WinnerAdvertisement from "../../components/WinnerAdvertisement";
import RecentWinnersCard from "../../components/RecentWinnersCard";
import Partners from "../../components/Partners";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <PopularContests></PopularContests>
      <WinnerAdvertisement></WinnerAdvertisement>
      <RecentWinnersCard></RecentWinnersCard>
      <Partners></Partners>
    </div>
  );
};

export default Home;
