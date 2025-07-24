"use client";

import { useState, useEffect, useCallback } from "react";

const images = [
  "/top-card-1.png",
  "/top-card-2.png",
  "/top-card-3.png",
  "/top-card-4.png",
  "/top-card-5.png"
];

export default function ImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [handleNext]);

  const handlePrev = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };

  const getCardStyle = (index: number) => {
    const offset = index - activeIndex;
    const total = images.length;

    // This logic handles the circular nature of the carousel
    let displayOffset = offset;
    if (offset > total / 2) {
      displayOffset = offset - total;
    } else if (offset < -total / 2) {
      displayOffset = offset + total;
    }

    const baseStyle = {
      transition: "all 0.5s ease-out",
      position: "absolute" as const,
      width: "60%", // Each card takes up 60% of the container width
      height: "100%",
    };

    switch (displayOffset) {
      case 0: // Active slide
        return {
          ...baseStyle,
          transform: "translateX(0) scale(1)",
          opacity: 1,
          zIndex: 30,
        };
      case 1: // Next slide
        return {
          ...baseStyle,
          transform: "translateX(65%) scale(0.8)",
          opacity: 0.5,
          zIndex: 20,
        };
      case -1: // Previous slide
        return {
          ...baseStyle,
          transform: "translateX(-65%) scale(0.8)",
          opacity: 0.5,
          zIndex: 20,
        };
      default: // Other slides (hidden)
        return {
          ...baseStyle,
          transform: `translateX(${displayOffset > 0 ? 100 : -100}%) scale(0.6)`,
          opacity: 0,
          zIndex: 10,
        };
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8">
      <div className="relative mx-auto flex h-80 w-4/5 items-center justify-center">
        {images.map((src, index) => (
          <div key={index} style={getCardStyle(index)}>
            <img
              src={src}
              alt={`Carousel image ${index + 1}`}
              className="h-full w-full rounded-lg object-cover shadow-lg"
            />
          </div>
        ))}
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/30 p-2 text-gray-800 hover:bg-white/50 dark:bg-gray-800/30 dark:text-white dark:hover:bg-gray-800/80"
          aria-label="Previous image"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/30 p-2 text-gray-800 hover:bg-white/50 dark:bg-gray-800/30 dark:text-white dark:hover:bg-gray-800/80"
          aria-label="Next image"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </div>
  );
}