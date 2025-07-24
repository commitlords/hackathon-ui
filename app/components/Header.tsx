"use client";

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

export default function Header({ translations, language }: HeaderProps) {
  const t = translations[language];

  return (
    <Navbar fluid>
      <NavbarBrand href="https://loksamarth.gov.in" target="/_blank">
        <img
          src="/Logo.png"
          className="mr-1 h-6 sm:h-9"
          alt="LOKSamarth Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
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