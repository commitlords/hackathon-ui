"use client";
import { DarkThemeToggle } from "flowbite-react";
import { HiTranslate } from "react-icons/hi";
import { useTranslation } from "react-i18next";
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

// Types for Header

type TranslationKeys =
  | "appName"
  | "login"
  | "user"
  | "admin"
  | "home"
  | "about"
  | "services"
  | "resources"
  | "guidelines"
  | "contact";

type Translations = {
  en: Record<TranslationKeys, string>;
  hi: Record<TranslationKeys, string>;
};

interface HeaderProps {
  translations: Translations;
  language: "en" | "hi";
}

export function TopComponent({
  fontSize,
  setFontSize,
}: {
  fontSize: number;
  setFontSize: (size: number) => void;
}) {
  const { i18n } = useTranslation();

  console.log("Current language:", i18n.language);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const increaseFontSize = () => setFontSize(fontSize + 2);
  const decreaseFontSize = () => setFontSize(Math.max(fontSize - 2, 12));
  const resetFontSize = () => setFontSize(16);

  return (
    <header className="flex items-center justify-end bg-gray-100 p-2 dark:bg-gray-800">
      <div className="flex items-center gap-4">
        {/* Font Size Controls */}
        <button
          onClick={decreaseFontSize}
          className="rounded-md bg-gray-200 px-2 py-1 text-sm font-medium dark:bg-gray-700"
          aria-label="Decrease font size"
        >
          A-
        </button>
        <button
          onClick={resetFontSize}
          className="rounded-md bg-gray-200 px-2 py-1 text-sm font-medium dark:bg-gray-700"
          aria-label="Reset font size"
        >
          A
        </button>
        <button
          onClick={increaseFontSize}
          className="rounded-md bg-gray-200 px-2 py-1 text-sm font-medium dark:bg-gray-700"
          aria-label="Increase font size"
        >
          A+
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

        {/* Translation and Dark Mode */}
        <Dropdown
          label={<HiTranslate className="h-5 w-5" />}
          arrowIcon={false}
          inline
        >
          <DropdownItem onClick={() => changeLanguage("en")}>
            English
          </DropdownItem>
          <DropdownItem onClick={() => changeLanguage("hi")}>
            हिन्दी
          </DropdownItem>
          <DropdownItem onClick={() => changeLanguage("mr")}>
            मराठी
          </DropdownItem>
        </Dropdown>
        <DarkThemeToggle />
      </div>
    </header>
  );
}

export function Header({ translations, language }: HeaderProps) {
  const t = translations[language];

  return (
    <Navbar fluid>
      <NavbarBrand href="https://loksamarth.gov.in" target="/_blank">
        <img
          src="/Logo.png"
          className="mr-1 h-6 sm:h-9"
          alt="LOKSamarth Logo"
        />
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          {t.appName}
        </span>
      </NavbarBrand>
      <div className="flex items-center gap-3 md:order-2">
        <Dropdown
          label={t.login}
          renderTrigger={() => (
            <Button className="bg-black text-white hover:bg-gray-500 dark:bg-black dark:hover:bg-gray-500">
              {t.login}
            </Button>
          )}
        >
          <DropdownItem href="/user-login">{t.user}</DropdownItem>
          <DropdownItem href="/admin-login">{t.admin}</DropdownItem>
        </Dropdown>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink href="#">{t.home}</NavbarLink>
        <NavbarLink href="#">{t.about}</NavbarLink>
        <NavbarLink href="#">{t.services}</NavbarLink>
        <NavbarLink href="#">{t.resources}</NavbarLink>
        <NavbarLink href="#">{t.guidelines}</NavbarLink>
        <NavbarLink href="#contact">{t.contact}</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
