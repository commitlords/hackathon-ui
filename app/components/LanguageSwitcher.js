import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <button
        onClick={() => changeLanguage("en")}
        disabled={i18n.language === "en"}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage("mr")}
        disabled={i18n.language === "mr"}
      >
        मराठी
      </button>
    </div>
  );
};

export default LanguageSwitcher;
