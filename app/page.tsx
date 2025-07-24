"use client";

import { useEffect, useState } from "react";
import { TopComponent } from "./components/top-container";
import ImageCarousel from "./components/image-carousel";
import CardCarousel from "./components/card-carousel";
import ContactUsSection from "./components/ContactUsSection";
import EventGallery from "./components/EventGallery";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";
import LokSamarthMission from "./components/LokSamarthMission";
import StatsSection from "./components/StatsSection";
import {Header} from "./components/Header.jsx";

export default function Home() {
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [language, setLanguage] = useState<"en" | "hi">("en");

  const translations = {
    en: {
      appName: "LOKSamarth",
      login: "Login",
      user: "User",
      admin: "Admin",
      home: "Home",
      about: "About Us",
      services: "Our Services",
      resources: "Resource Center",
      guidelines: "Advisory and Guidelines",
      contact: "Contact",
    },
    hi: {
      appName: "लोक समर्थ",
      login: "लॉग इन करें",
      user: "उपयोगकर्ता",
      admin: "एडमिन",
      home: "होम",
      about: "हमारे बारे में",
      services: "हमारी सेवाएँ",
      resources: "संसाधन केंद्र",
      guidelines: "सलाह और दिशानिर्देश",
      contact: "संपर्क करें",
    },
  };

  useEffect(() => {
    document.documentElement.style.fontSize = `${baseFontSize}px`;
  }, [baseFontSize]);

  const decreaseFontSize = () => {
    setBaseFontSize((size) => Math.max(size - 2, 12));
  };

  const increaseFontSize = () => {
    setBaseFontSize((size) => Math.min(size + 2, 24));
  };

  const resetFontSize = () => {
    setBaseFontSize(16);
  };

  return (
    <>
      <TopComponent fontSize={baseFontSize} setFontSize={setBaseFontSize} />
      <Header />
      <ImageCarousel />
      <StatsSection />
      <LokSamarthMission />
      <CardCarousel />
      <EventGallery />
      <FaqSection />
      <ContactUsSection />
      <Footer />
 
    </>
  );
}
