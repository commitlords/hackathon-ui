"use client";

import { useState, useEffect, useCallback } from "react";
import { ReusableCard } from "./ReusableCard"; // Import the new component

const cardData = [
  {
    titleKey: "card1.title",
    descKey: "card1.desc",
    imgAltKey: "card1.imgAlt",
    imgSrc: "/card-img-1.png",
  },
  {
    titleKey: "card2.title",
    descKey: "card2.desc",
    imgAltKey: "card2.imgAlt",
    imgSrc: "/card-img-2.png",
  },
  {
    titleKey: "card3.title",
    descKey: "card3.desc",
    imgAltKey: "card3.imgAlt",
    imgSrc: "/card-img-3.png",
  },
  {
    titleKey: "card4.title",
    descKey: "card4.desc",
    imgAltKey: "card4.imgAlt",
    imgSrc: "/card-img-4.png",
  },
  {
    titleKey: "card5.title",
    descKey: "card5.desc",
    imgAltKey: "card5.imgAlt",
    imgSrc: "/card-img-5.png",
  },
];

const VISIBLE_CARDS = 4;

export default function CardCarousel() {
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = useCallback(() => {
    setStartIndex((prevIndex) => (prevIndex + 1) % cardData.length);
  }, []);

  const handlePrev = () => {
    setStartIndex(
      (prevIndex) => (prevIndex - 1 + cardData.length) % cardData.length,
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getVisibleCards = () => {
    const visible = [];
    for (let i = 0; i < VISIBLE_CARDS; i++) {
      const index = (startIndex + i) % cardData.length;
      visible.push(cardData[index]);
    }
    return visible;
  };

  return (
    <div className="bg-gray-50 py-8 dark:bg-gray-900">
      <div className="relative mx-auto w-full max-w-7xl px-4">
        <div className="overflow-hidden">
          <div className="flex gap-4 transition-all duration-500">
            {getVisibleCards().map((card, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 sm:w-1/2 md:w-1/3 lg:w-1/4"
              >
                <ReusableCard {...card} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-2 z-40 -translate-y-1/2 rounded-full bg-white/30 p-2 text-gray-800 hover:bg-white/50 dark:bg-gray-800/30 dark:text-white dark:hover:bg-gray-800/80"
          aria-label="Previous card"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-2 z-40 -translate-y-1/2 rounded-full bg-white/30 p-2 text-gray-800 hover:bg-white/50 dark:bg-gray-800/30 dark:text-white dark:hover:bg-gray-800/80"
          aria-label="Next card"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
