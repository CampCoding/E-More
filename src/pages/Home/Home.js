import React, { useEffect } from "react";
import Banner from "./Banner/Banner";
import "./home.css";
import Feature from "./Features/Feature";
import Banner2 from "./Banner/Banner2";
import Courses from "./Courses/Courses";
import Footer from "../../components/Footer/Footer";
import About from "../About/About";
import Apply from "./Apply/Apply";
import { MetaTags, pageMetaTags } from "../../utils/metaTags";
import ContactNumbers from "./ContactSection/ContactSection";

const Home = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <MetaTags {...pageMetaTags.home} />
      <div className="home">
        <Banner2 />
        <div className="">
        <Feature />
        </div>
        <ContactNumbers />
        {/* <Courses /> */}
        <About />
        <Footer />
      </div>
    </>
  );
};

export default Home;
