"use client";

import { useEffect } from "react";
import ImageCarousel from "./components/image-carousel";
import CardCarousel from "./components/card-carousel";
import ContactUsSection from "./components/ContactUsSection";
import EventGallery from "./components/EventGallery";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";
import LokSamarthMission from "./components/LokSamarthMission";
import { Header } from "./components/Header.jsx";
import Chatbot from "./components/Chatbot";

const Home = () => {
  useEffect(() => {
    document.documentElement.style.fontSize = `16px`;
  }, []);

  return (
    <>
      <Header />
      <ImageCarousel />
      <LokSamarthMission />
      <CardCarousel />
      <EventGallery />
      <FaqSection />
      <ContactUsSection />
      <Footer />
      <Chatbot />
    </>
  );
};

export default Home;
