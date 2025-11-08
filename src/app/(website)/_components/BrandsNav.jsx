"use client";

import { useState, useEffect } from "react";
import pb from "../_lib/pb";

export default function BrandsNav({ brands, activeName }) {
  const [showNav, setShowNav] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setShowNav(currentScroll < prevScrollY || currentScroll < 10);
      setPrevScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  return (
    <div
      className={`sticky top-16 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 pt-8 transform transition-transform duration-300 ${
        showNav ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 items-center py-2 gap-4 md:gap-6">
        {brands.map((brand) => (
          <a href={`/brands/${brand.name.replaceAll(" ", "-")}`} key={brand.id}>
            <div
              className={`flex items-center justify-center rounded-lg md:rounded-2xl cursor-pointer transition border-2 px-2 ${
                activeName === brand.name.replaceAll(" ", "-")
                  ? "border-orange-500"
                  : "border-gray-300"
              }`}
            >
              <img
                className="h-12 lg:h-20 object-contain"
                src={pb.files.getURL(brand, brand.logo)}
                alt={brand.id}
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}