"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import React, { useEffect, useState } from "react";
import pb from "../_lib/pb";

export default function Footer() {
  const pathname = usePathname();

  const getLinkClass = (path) =>
    pathname === path || pathname.includes(path)
      ? "text-[#d13b2a]"
      : "text-white hover:text-[#d13b2a]";

  const [data, setData] = useState({
    brands: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes] = await Promise.all([
          pb
            .collection("brands")
            .getFullList(200, { sort: "sno", requestKey: null }),
        ]);

        setData({
          brands: brandsRes,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const links = [
    { name: "Home", path: "/" },
    { name: "About us", path: "/about" },
    { name: "Franchises", path: "/franchises" },
    { name: "Gallery", path: "/gallery" },
    {
      name: "Investor Relations",
      path: "/investor-relation/corporate-information",
    },
    { name: "Contact Us", path: "/contact" },
  ];

  const groupedPaths = ["/brands", "/gallery", "/investor-relation"];
  return (
    <footer className="bg-[#152768] text-white py-4">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-2">
        {/* Left: About */}
        <div className="col-span-3">
          <div className="flex justify-center">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-24 mb-4 rounded"
            />
          </div>
          <p className="text-gray-200 text-sm leading-relaxed">
            Spice Lounge Food Works, Ltd. is a global food chain offering
            diverse cuisines Indian, Mediterranean, Asian, and Western across
            multiple countries.
          </p>

          <div className="mt-4 flex gap-6 items-center justify-center">
            <img
              className="h-6 w-6 rounded object-cover"
              src="/images/shared/logos/facebook.png"
              alt="Facebook"
            />
            <img
              className="h-6 w-6 rounded object-cover"
              src="/images/shared/logos/instagram.png"
              alt="Instagram"
            />
            {/* <Linkedin className="text-blue-500" /> */}
            <img
              className="h-6 w-6 rounded object-cover"
              src="/images/shared/logos/google-logo.png"
              alt="Google"
            />
            <img
              className="h-6 w-6 rounded object-cover"
              src="/images/shared/logos/youtube.png"
              alt="Google"
            />
          </div>
        </div>

        <div className="col-span-3 lg:flex justify-evenly">
          {/* Quick Links with Active Highlight */}
          <div className="mb-4 lg:mb-0">
            <h3 className="font-bold mb-3">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              {links.map((link) => {
                const isActive =
                  pathname === link.path ||
                  groupedPaths.some(
                    (p) => link.path.startsWith(p) && pathname.startsWith(p)
                  );
                return (
                  <li key={link.name}>
                    <Link
                      href={link.path}
                      className={`${
                        isActive
                          ? "text-[#d13b2a] font-semibold hover:underline"
                          : "hover:underline text-gray-200"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h3 className={`font-bold mb-3 ${getLinkClass("/brands")}`}>
              Brands
            </h3>
            <div>
              <ul className="space-y-1 text-sm">
                {data.brands.length > 0 ? (
                  data.brands.map((brand) => {
                    return (
                      <a
                        href={`/brands/${brand.name.replaceAll(" ", "-")}`}
                        key={brand.id}
                      >
                        <li
                          className={getLinkClass(
                            brand.name.replaceAll(" ", "-")
                          )}
                        >
                          {brand.name}
                        </li>
                      </a>
                    );
                  })
                ) : (
                  <></>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="col-span-3">
          <h3 className="font-bold mb-3">Spice Lounge Food Works, Ltd.</h3>
          <p className="text-sm text-gray-200">
            Western Dallas Centre, 5th Floor, Survey No.83/1, Knowledge City,
            Gachibowli, Hyderabad, Telangana - 500032
          </p>
          <div className="border-b border-gray-300 my-4 w-[80%]"></div>
          <p className="mt-3 text-sm">
            <span className="font-bold">Phone:</span> +91 63626 72263
          </p>
          <p className="text-sm">
            <span className="font-bold">Email:</span>{" "}
            <a href="mailto:info@espicelounge.com" className="hover:underline">
              info@espicelounge.com
            </a>
          </p>
        </div>
        <div className="col-span-3">
          <h2 className="text-center font-bold">Our Portfolio</h2>
          <img src="/images/shared/logos/tree-structure.png" alt="" />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-600 my-6"></div>

      {/* Bottom */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 text-sm">
        <div className="text-gray-300 text-center md:text-left mb-3 md:mb-0 col-span-9 md:flex justify-center gap-2">
          <div>© All rights reserved to</div>{" "}
          <div className="font-bold"> Spice Lounge Food Works, Ltd.</div>{" "}
          <div>@2019</div>
        </div>
        <div className="flex justify-around col-span-3">
          <Link
            href="/disclaimer"
            className={`${
              pathname === "/disclaimer"
                ? "text-red-400 font-semibold underline"
                : "hover:underline text-gray-200"
            }`}
          >
            Disclaimer
          </Link>
          <Link
            href="/privacy"
            className={`${
              pathname === "/privacy"
                ? "text-red-400 font-semibold underline"
                : "hover:underline text-gray-200"
            }`}
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
