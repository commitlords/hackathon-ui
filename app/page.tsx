"use client";
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
  const { t } = useTranslation();
  const [fontSize, setFontSize] = useState(16);

  return (
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
