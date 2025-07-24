"use client";
import { Card } from "flowbite-react";
import { useTranslation } from "react-i18next";

export function Component() {
  const { t } = useTranslation();
  return (
    <Card
      className="max-w-sm"
      imgAlt={t('card1.imgAlt')}
      imgSrc="/card-img-1.png"
    >
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {t('card1.title')}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {t('card1.desc')}
      </p>
    </Card>
  );
}
