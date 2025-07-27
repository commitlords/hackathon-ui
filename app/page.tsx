"use client";

import ImageCarousel from "./components/image-carousel";
import CardCarousel from "./components/card-carousel";
import ContactUsSection from "./components/ContactUsSection";
import EventGallery from "./components/EventGallery";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";
import LokSamarthMission from "./components/LokSamarthMission";
import StatsSection from "./components/StatsSection";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      {/* The Header is now part of the main layout, so it's no longer needed here */}
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