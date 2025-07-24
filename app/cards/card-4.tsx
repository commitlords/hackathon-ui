"use client";
import { Card } from "flowbite-react";
import { useTranslation } from "react-i18next";

export function Component() {
  const { t } = useTranslation();
  return (
    <Card
      className="max-w-sm"
      imgAlt={t("card4.imgAlt")}
      imgSrc="/card-img-4.png"
    >
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {t("card4.title")}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {t("card4.desc")}
      </p>
    </Card>
  );
}
