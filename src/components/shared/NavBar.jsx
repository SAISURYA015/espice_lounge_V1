"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuMenu, LuX } from "react-icons/lu";
import pb from "@/app/(admin)/_lib/pb";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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

  const groupedPaths = ["/brands", "/gallery", "/investor-relation"];

  const links = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    {
      name: "Brands",
      path: `/brands/${data.brands[0]?.name.replaceAll(" ", "-")}`,
    },
    { name: "Franchises", path: "/franchises" },
    { name: "Gallery", path: "/gallery/images" },
    {
      name: "Investor Relation",
      path: "/investor-relation/corporate-information",
    },
    { name: "Contact", path: "/contact" },
  ];

  const getLinkClass = (path) => {
    const isActive =
      pathname === path ||
      groupedPaths.some((p) => path.startsWith(p) && pathname.startsWith(p));

    return isActive
      ? "text-[#d13b2a] font-bold"
      : "text-gray-700 font-semibold hover:text-[#d13b2a]";
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-orange-50 h-18">
      <div className="fixed top-6 px-4 sm:px-6 lg:px-8 w-full bg-white">
        {/* Logo and Stock Link */}
        <div className="flex justify-between items-center h-12">
          <Link href="/">
            <img
              className="h-24 rounded-lg border-1 border-black"
              src="/images/logo.png"
              alt="Logo"
            />
            {/* You could use next/image here if desired */}
          </Link>

          <Link
            href="/investor-relation/livestock#focus"
            className="text-[10px]"
          >
            <span className="font-bold border border-[#223a6c] text-[#223a6c] rounded py-0.5 px-3">
              Click here for stock price
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex space-x-6 uppercase text-sm">
            {links.map((link) => (
              <li key={link.name}>
                <Link href={link.path} className={getLinkClass(link.path)}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Hamburger */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none text-2xl"
              aria-label="Toggle menu"
            >
              <LuMenu />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-In Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow p-6 flex flex-col justify-between z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col space-y-4 relative">
          <button
            className="absolute -top-3 -right-4 p-2 text-2xl"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <LuX />
          </button>

          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={getLinkClass(link.path)}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Footer Links */}
        <div>
          <p className="text-[10px] text-gray-500 text-center">
            &copy; All rights reserved to{" "}
            <span className="font-semibold">
              <Link href="/">Spice Lounge Food Works, Ltd.</Link>
            </span>{" "}
            @2019
          </p>
          <hr className="text-gray-500 my-2" />
          <div className="flex justify-evenly text-sm text-gray-700">
            <Link className="underline px-4" href="/disclaimer">
              Disclaimer
            </Link>
            <Link className="underline" href="/privacy">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
