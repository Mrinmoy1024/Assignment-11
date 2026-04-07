import React from "react";
import Banner from "../../components/Banner";
import PopularContests from "../../components/PopularContests";
import WinnerAdvertisement from "../../components/WinnerAdvertisement";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <PopularContests></PopularContests>
      <WinnerAdvertisement></WinnerAdvertisement>
    </div>
  );
};

export default Home;
