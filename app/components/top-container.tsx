"use client";

import { DarkThemeToggle, Dropdown, DropdownItem } from "flowbite-react";

interface TopContainerProps {
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  increaseFontSize: () => void;
  language: string;
  setLanguage: (language: "en" | "hi") => void;
}

export default function TopContainer({
  decreaseFontSize,
  resetFontSize,
  increaseFontSize,
  language,
  setLanguage,
}: TopContainerProps) {
  return (
    <div
      className="bg-[#1a237e] text-white dark:bg-black"
      style={{ height: "calc(56px * 0.75)" }}
    >
      <div className="h-full flex items-center justify-between px-5">
        <div className="h-full flex items-center gap-2 py-1">
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 rounded-full border border-white px-2 py-0.5">
            <button onClick={decreaseFontSize} className="hover:text-gray-300 text-xs" aria-label="Decrease font size">
              A-
            </button>
            <button onClick={resetFontSize} className="hover:text-gray-300 text-base" aria-label="Reset font size">
              A
            </button>
            <button onClick={increaseFontSize} className="hover:text-gray-300 text-lg" aria-label="Increase font size">
              A+
            </button>
          </div>
            <DarkThemeToggle />
          <Dropdown
            label="Language"
            inline
            renderTrigger={() => (
              <button className="text-white hover:text-gray-300 inline-flex items-center">
                {language === "en" ? "English" : "हिंदी"}
                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>
            )}
          >
            <DropdownItem onClick={() => setLanguage("en")}>English</DropdownItem>
            <DropdownItem onClick={() => setLanguage("hi")}>हिंदी</DropdownItem>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}