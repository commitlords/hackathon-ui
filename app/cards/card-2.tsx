"use client";
import { Card } from "flowbite-react";
import { useTranslation } from "react-i18next";

export function Component() {
  const { t } = useTranslation();
  return (
    <Card
      className="max-w-sm"
      imgAlt={t('card2.imgAlt')}
      imgSrc="/card-img-2.png"
    >
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {t('card2.title')}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {t('card2.desc')}
      </p>
    </Card>
  );
}
