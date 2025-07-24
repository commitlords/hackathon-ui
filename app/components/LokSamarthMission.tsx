"use client";

import { Card } from "flowbite-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function LokSamarthMission() {
  const { t } = useTranslation();
  const missionCards = [
    {
      title: t("missionCard1"),
      icon: "🌐",
    },
    {
      title: t("missionCard2"),
      icon: "📁",
    },
    {
      title: t("missionCard3"),
      icon: "💰",
    },
    {
      title: t("missionCard4"),
      icon: "🌱",
    },
  ];
  return (
    <section className="bg-white py-16 dark:bg-gray-800">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2">
        {/* Left Text Section */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            {t("mission.title")}
          </h2>
          <h3 className="mt-2 text-3xl font-bold text-orange-500">
            {t("mission.subtitle")}
          </h3>
          <p className="mt-6 leading-relaxed text-gray-700 dark:text-gray-400">
            {t("mission.p1")}
            <br />
            <br />
            {t("mission.p2")}
            <br />
            <br />
            {t("mission.p3")}
          </p>
        </div>

        {/* Right Image + Grid Section */}
        <div className="relative">
          {/* Main Image */}
          <div className="w-full overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/self-help-groups.jpg"
              alt={t("mission.imageAlt")}
              width={600}
              height={400}
              className="w-full object-cover"
            />
          </div>

          <div className="absolute bottom-1 left-0 grid w-full grid-cols-2 gap-2 p-2 md:w-2/3 md:gap-4 md:p-4">
            {missionCards.map((card, index) => (
              <Card
                key={index}
                className="!max-w-full bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{card.icon}</span>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {card.title}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
