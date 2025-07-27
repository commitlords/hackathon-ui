"use client";
import { Card } from "flowbite-react";
import { useTranslation } from "react-i18next";

interface ReusableCardProps {
  titleKey: string;
  descKey: string;
  imgAltKey: string;
  imgSrc: string;
}

export function ReusableCard({ titleKey, descKey, imgAltKey, imgSrc }: ReusableCardProps) {
  const { t } = useTranslation();
  return (
    <Card
      className="max-w-sm"
      imgAlt={t(imgAltKey)}
      imgSrc={imgSrc}
    >
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {t(titleKey)}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {t(descKey)}
      </p>
    </Card>
  );
}