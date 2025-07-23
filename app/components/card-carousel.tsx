"use client";

import { useState, useEffect, useCallback } from "react";

import { Component as Card1 } from "../cards/card-1";
import { Component as Card2 } from "../cards/card-2";
import { Component as Card3 } from "../cards/card-3";
import { Component as Card4 } from "../cards/card-4";
import { Component as Card5 } from "../cards/card-5";

const cardComponents = [Card1, Card2, Card3, Card4, Card5];

const VISIBLE_CARDS = 4;

export default function CardCarousel() {
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = useCallback(() => {
    setStartIndex((prevIndex) => (prevIndex + 1) % cardComponents.length);
  }, []);

  const handlePrev = () => {
    setStartIndex(
      (prevIndex) =>
        (prevIndex - 1 + cardComponents.length) % cardComponents.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [handleNext]);

  const getVisibleCards = () => {
    const visible = [];
    for (let i = 0; i < VISIBLE_CARDS; i++) {
      const index = (startIndex + i) % cardComponents.length;
      visible.push(cardComponents[index]);
    }
    return visible;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8">
      <div className="relative mx-auto w-full max-w-7xl px-4">
        <div className="overflow-hidden">
          <div className="flex gap-4 transition-all duration-500">
            {getVisibleCards().map((CardComponent, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
              >
                <CardComponent />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/30 p-2 text-gray-800 hover:bg-white/50 dark:bg-gray-800/30 dark:text-white dark:hover:bg-gray-800/80"
          aria-label="Previous card"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/30 p-2 text-gray-800 hover:bg-white/50 dark:bg-gray-800/30 dark:text-white dark:hover:bg-gray-800/80"
          aria-label="Next card"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
