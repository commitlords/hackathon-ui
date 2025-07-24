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
import { useTranslation } from "react-i18next";

export default function Home() {
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [language, setLanguage] = useState<"en" | "hi" | "mr">("en");
  const { t } = useTranslation();

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
