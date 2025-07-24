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
import { useTranslation } from "react-i18next";

export function Header() {
  const { t } = useTranslation();

  return (
    <Navbar fluid>
      <NavbarBrand href="https://loksamarth.gov.in" target="/_blank">
        <img
          src="/Logo.png"
          className="mr-1 h-6 sm:h-9"
          alt="LOKSamarth Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          {t("title")}
        </span>
      </NavbarBrand>
      <div className="flex items-center gap-3 md:order-2">
        <Dropdown
          label={t("login")}
          renderTrigger={() => (
            <Button className="bg-black text-white hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-black">
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
        <NavbarLink href="#contact">{t("contact")}</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
} 