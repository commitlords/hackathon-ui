"use client";
import { useState } from "react";
import { DarkThemeToggle, Dropdown, DropdownItem } from "flowbite-react";
import { HiTranslate } from "react-icons/hi";
import { useTranslation } from "react-i18next";

export function Header({
  fontSize,
  setFontSize,
}: {
  fontSize: number;
  setFontSize: (size: number) => void;
}) {
  const { i18n } = useTranslation();

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
