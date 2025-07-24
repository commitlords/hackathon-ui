"use client";

import { useEffect, useState } from "react";
import TopContainer from "./components/top-container";
import Header from "./components/Header";
import ImageCarousel from "./components/image-carousel";
import CardCarousel from "./components/card-carousel";
import ContactUsSection from "./components/ContactUsSection";
import EventGallery from "./components/EventGallery";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";
import LokSamarthMission from "./components/LokSamarthMission";
import StatsSection from "./components/StatsSection";
import Image from "next/image";
import { useState } from "react";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Dropdown,
  DropdownItem,
} from "flowbite-react";
import { useTranslation } from "react-i18next";
import { Header } from "./components/Header";

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

  const { t } = useTranslation();
  const [fontSize, setFontSize] = useState(16);

  return (
    <>
      <TopContainer
        decreaseFontSize={decreaseFontSize}
        resetFontSize={resetFontSize}
        increaseFontSize={increaseFontSize}
        language={language}
        setLanguage={setLanguage}
      />

      <Header translations={translations} language={language} />
      <ImageCarousel />
      <StatsSection />
      <LokSamarthMission />
      <CardCarousel />
      <EventGallery />
      <FaqSection />
      <ContactUsSection />
      <Footer />
 
    </>
    <div style={{ fontSize: `${fontSize}px` }}>
      <Header fontSize={fontSize} setFontSize={setFontSize} />

      <Navbar fluid rounded>
        <NavbarBrand href="https://loksamarth.gov.in" target="/_blank">
          <Image
            src="/Logo.png"
            alt="LOKSamarth Logo"
            width={36}
            height={36}
            className="mr-1 h-6 sm:h-9"
          />
          <span className="self-center font-semibold whitespace-nowrap dark:text-white">
            {t("title")}
          </span>
        </NavbarBrand>
        <div className="flex items-center gap-3 md:order-2">
          <Dropdown
            label={t("login")}
            renderTrigger={() => (
              <Button className="bg-black text-white hover:bg-gray-500 dark:bg-black dark:hover:bg-gray-500">
                {t("login")}
              </Button>
            )}
          >
            <DropdownItem href="/user-login">{t("user")}</DropdownItem>
            <DropdownItem href="/admin-login">{t("admin")}</DropdownItem>
          </Dropdown>
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink href="#">{t("home")}</NavbarLink>
          <NavbarLink href="#">{t("about")}</NavbarLink>
          <NavbarLink href="#">{t("services")}</NavbarLink>
          <NavbarLink href="#">{t("resources")}</NavbarLink>
          <NavbarLink href="#">{t("advisory")}</NavbarLink>
          <NavbarLink href="#">{t("contact")}</NavbarLink>
        </NavbarCollapse>
      </Navbar>

      <main className="container mx-auto p-8">
        <h1 className="mb-4 font-bold">Welcome to LOKSamarth</h1>
        <p>This is the main content area of your application.</p>
      </main>
    </div>
  );
}
