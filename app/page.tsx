"use client";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  DarkThemeToggle,
  Dropdown,
  DropdownItem,
} from "flowbite-react";
import { useEffect, useState } from "react";
import TopContainer from "./components/top-container";
import ImageCarousel from "./components/image-carousel";
import CardCarousel from "./components/card-carousel";
import ContactUsSection from "./components/ContactUsSection";
import EventGallery from "./components/EventGallery";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";
import LokSamarthMission from "./components/LokSamarthMission";
import StatsSection from "./components/StatsSection";

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
      <TopContainer
        decreaseFontSize={decreaseFontSize}
        resetFontSize={resetFontSize}
        increaseFontSize={increaseFontSize}
        language={language}
        setLanguage={setLanguage}
      />
      <div>
        <Navbar fluid>
          <NavbarBrand href="https://loksamarth.gov.in" target="/_blank">
            <img
              src="/Logo.png"
              className="mr-1 h-6 sm:h-9"
              alt="LOKSamarth Logo"
            />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              {translations[language].appName}
            </span>
          </NavbarBrand>
          <div className="flex items-center gap-3 md:order-2">
            <Dropdown
              label={translations[language].login}
              renderTrigger={() => (
                <Button className="bg-black text-white hover:bg-gray-500 dark:bg-black dark:hover:bg-gray-500">
                  {translations[language].login}
                </Button>
              )}
            >
              <DropdownItem href="/user-login">
                {translations[language].user}
              </DropdownItem>
              <DropdownItem href="/admin-login">
                {translations[language].admin}
              </DropdownItem>
            </Dropdown>
            <NavbarToggle />
          </div>
          <NavbarCollapse>
            <NavbarLink href="#">{translations[language].home}</NavbarLink>
            <NavbarLink href="#">{translations[language].about}</NavbarLink>
            <NavbarLink href="#">{translations[language].services}</NavbarLink>
            <NavbarLink href="#">{translations[language].resources}</NavbarLink>
            <NavbarLink href="#">
              {translations[language].guidelines}
            </NavbarLink>
            <NavbarLink href="#contact">{translations[language].contact}</NavbarLink>
          </NavbarCollapse>
        </Navbar>
      <ImageCarousel />
      <StatsSection />
      <LokSamarthMission />
      <CardCarousel />
      <EventGallery />
      <FaqSection />
      <ContactUsSection />
      <Footer />
    </div>
 
    </>
  );
}
