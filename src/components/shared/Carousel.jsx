"use client";

import { useState, useEffect, useRef } from "react";

export default function Carousel({ slideImages = [], slideInterval = 3000 }) {
  const [current, setCurrent] = useState(1); // start at first real slide
  const [isAnimating, setIsAnimating] = useState(true);
  const intervalRef = useRef(null);

  // Clone first and last slides
  const slides = [
    slideImages[slideImages.length - 1],
    ...slideImages,
    slideImages[0],
  ];
  const length = slides.length;

  const startSlider = () => {
    stopSlider();
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 3000);
  };

  const stopSlider = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Handle infinite loop effect
  const handleTransitionEnd = () => {
    if (current === length - 1) {
      // If we reach the cloned last, reset to first real slide
      setIsAnimating(false);
      setCurrent(1);
    } else if (current === 0) {
      // If we go backwards to cloned first, reset to last real slide
      setIsAnimating(false);
      setCurrent(length - 2);
    }
  };

  useEffect(() => {
    if (!isAnimating) {
      // Re-enable animation after instant jump
      requestAnimationFrame(() => setIsAnimating(true));
    }
  }, [isAnimating]);

  useEffect(() => {
    startSlider();
    return () => stopSlider(); // cleanup on unmount
  }, []);

  if (length === 0) return null;

  return (
    <div className="mt-20 max-w-7xl mx-auto relative">
      {/* Banner Slider */}
      <div
        className="overflow-hidden"
        onMouseEnter={stopSlider}
        onMouseLeave={startSlider}
      >
        <div
          className={`flex ${
            isAnimating ? "transition-transform duration-700 ease-in-out" : ""
          }`}
          style={{ transform: `translateX(-${current * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((src, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <img
                src={src}
                alt={`Slide ${index}`}
                className="object-contain w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
