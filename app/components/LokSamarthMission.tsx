"use client";

import { Button, Card } from "flowbite-react";
import Image from "next/image";

const missionCards = [
  {
    title: "Digitization of SHG Networks",
    icon: "🌐",
  },
  {
    title: "Central Repository for CBO Data",
    icon: "📁",
  },
  {
    title: "Optimizing Member Financial Support",
    icon: "💰",
  },
  {
    title: "Sustainable Livelihood Opportunities",
    icon: "🌱",
  },
];

export default function LokSamarthMission() {
  return (
    <section className="bg-white py-16 dark:bg-gray-800">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2">
        {/* Left Text Section */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            LOKSamarth Mission
          </h2>
          <h3 className="mt-2 text-3xl font-bold text-orange-500">
            Enhancing Rural Livelihoods
          </h3>
          <p className="mt-6 leading-relaxed text-gray-700 dark:text-gray-400">
            LokOS plays a crucial role in realizing NRLM's vision of empowering
            Self-Help Groups through digitization. The application is designed
            to record member profiles and activities at every Community-Based
            Organization (CBO) nationwide. It marks a significant step towards
            centralizing the entire system and eliminating traditional ways of
            bookkeeping on paper.
            <br />
            <br />
            Through LokOS, the government can maximize returns on SHG savings
            and easily provide financial assistance for sustainable livelihood
            development at the grassroots level.
          </p>
        </div>

        {/* Right Image + Grid Section */}
        <div className="relative">
          {/* Main Image */}
          <div className="w-full overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/self-help-groups.jpg" // Make sure this image exists in /public/images
              alt="A group of women in a Self-Help Group meeting"
              width={600}
              height={400}
              className="w-full object-cover"
            />
          </div>

           <div className="absolute bottom-1 left-0 grid w-full grid-cols-2 gap-2 p-2 md:w-2/3 md:gap-4 md:p-4">
            {missionCards.map((card, index) => (
              <Card key={index} className="!max-w-full bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{card.icon}</span>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{card.title}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}