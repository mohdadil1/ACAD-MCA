import React, { Fragment } from "react";
import NavBar from "./Navbar/NavBar";
import Hero from "./Hero/Hero";
import Section from "./Section/Section";

const Home = () => {
  return (
    <Fragment>
     
      <Hero />
      <Section />
      <hr className="hr-2" />
    </Fragment>
  );
};

export default Home;
