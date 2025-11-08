"use client";

import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  // Show button when scroll > 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) setVisible(true);
      else setVisible(false);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // smooth scrolling
    });
  };

  return (
    <>
      {visible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-[#152768] text-white shadow-lg hover:bg-[#152768] transition"
        >
          <ArrowUp />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
