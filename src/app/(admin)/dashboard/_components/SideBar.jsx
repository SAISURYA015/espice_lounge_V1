"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, LogOut } from "lucide-react";
import * as Icons from "lucide-react";
import pb from "../../_lib/pb";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState({});
  const [menuItems, setMenuItems] = useState(null); // null initially

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Compute menu items based on role AFTER component mounts
  useEffect(() => {
    const role = pb.authStore.record?.name;
    if (!role) return;

    const adminMenu = [
      { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
      {
        title: "Home",
        children: [{ title: "Home Banners", href: "/dashboard/home/banners" }],
        icon: "House",
      },
      {
        title: "About",
        children: [
          { title: "About Banners", href: "/dashboard/about/banners" },
          { title: "Leaders", href: "/dashboard/about/leaders" },
        ],
        icon: "CircleQuestionMark",
      },
      {
        title: "Brands",
        children: [
          { title: "Brand Logo", href: "/dashboard/brands/logo" },
          { title: "Brand Banners", href: "/dashboard/brands/banners" },
          { title: "Brand Section", href: "/dashboard/brands/section" },
          { title: "Brand Consumer", href: "/dashboard/brands/consumer" },
        ],
        icon: "Hexagon",
      },
      {
        title: "Franchise",
        children: [
          { title: "Franchise Banners", href: "/dashboard/franchise/banners" },
          { title: "Franchise Form", href: "/dashboard/franchise/form" },
        ],
        icon: "Store",
      },
      {
        title: "Gallery",
        children: [
          { title: "Image Upload", href: "/dashboard/gallery/image" },
          { title: "Video Upload", href: "/dashboard/gallery/video" },
          {
            title: "Social Media Links",
            href: "/dashboard/gallery/social-media",
          },
          {
            title: "Delivery Platform Links",
            href: "/dashboard/gallery/delivery-platform",
          },
        ],
        icon: "Image",
      },
      {
        title: "Investor-Relation",
        children: [
          {
            title: "Investor Banners",
            href: "/dashboard/investor-relation/banners",
          },
          {
            title: "Corporate Information",
            href: "/dashboard/investor-relation/corporate-info",
          },
          {
            title: "Key Managerial Personnel",
            href: "/dashboard/investor-relation/key-managerial-personnel",
          },
          {
            title: "Annual Report",
            href: "/dashboard/investor-relation/annual-report",
          },
          {
            title: "Annual Returns",
            href: "/dashboard/investor-relation/annual-returns",
          },
          {
            title: "Financial Report",
            href: "/dashboard/investor-relation/financial-report",
          },
          {
            title: "Shareholder Report",
            href: "/dashboard/investor-relation/shareholder-report",
          },
          {
            title: "Corporate Governance",
            href: "/dashboard/investor-relation/governance",
          },
          {
            title: "Disclosure 46",
            href: "/dashboard/investor-relation/disclosure",
          },
          {
            title: "Disclosure - FSC",
            href: "/dashboard/disclosure-files/financials-subsidiary-companies",
          },
          {
            title: "Disclosure - SCR",
            href: "/dashboard/disclosure-files/secretarial-compliance-report",
          },
          {
            title: "Disclosure - R30",
            href: "/dashboard/disclosure-files/disclosure-r30",
          },
          {
            title: "Disclosure - Paper Advt",
            href: "/dashboard/disclosure-files/paper-adv",
          },
          { title: "Meetings", href: "/dashboard/investor-relation/meetings" },
          { title: "Policies", href: "/dashboard/investor-relation/policies" },
          {
            title: "Stock Exchange Filings",
            href: "/dashboard/investor-relation/stock-exchange",
          },
          {
            title: "Open Offer",
            href: "/dashboard/investor-relation/open-offer",
          },
          {
            title: "KYC Forms",
            href: "/dashboard/investor-relation/kyc-forms",
          },
          {
            title: "Scrutinizer Report",
            href: "/dashboard/investor-relation/scrutinizer",
          },
          {
            title: "Others",
            href: "/dashboard/investor-relation/others",
          },
          {
            title: "Live Stock Info",
            href: "/dashboard/investor-relation/live-stock",
          },
        ],
        icon: "Handshake",
      },
      // {
      //   title: "Disclosure-Files",
      //   children: [
      //     {
      //       title: "financials-subsidiary-companies",
      //       href: "/dashboard/disclosure-files/financials-subsidiary-companies",
      //     },
      //     {
      //       title: "secretarial-compliance-report",
      //       href: "/dashboard/disclosure-files/secretarial-compliance-report",
      //     },
      //   ],
      //   icon: "Files",
      // },
      {
        title: "Contact",
        children: [
          { title: "Contact Banners", href: "/dashboard/contact/banners" },
          { title: "Contact Form", href: "/dashboard/contact/form" },
        ],
        icon: "Mail",
      },
    ];

    const investorMenu = [
      { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
      {
        title: "Investor-Relation",
        children: [
          {
            title: "Investor Banners",
            href: "/dashboard/investor-relation/banners",
          },
          {
            title: "Corporate Information",
            href: "/dashboard/investor-relation/corporate-info",
          },
          {
            title: "Key Managerial Personnel",
            href: "/dashboard/investor-relation/key-managerial-personnel",
          },
          {
            title: "Annual Report",
            href: "/dashboard/investor-relation/annual-report",
          },
          {
            title: "Annual Returns",
            href: "/dashboard/investor-relation/annual-returns",
          },
          {
            title: "Financial Report",
            href: "/dashboard/investor-relation/financial-report",
          },
          {
            title: "Shareholder Report",
            href: "/dashboard/investor-relation/shareholder-report",
          },
          {
            title: "Corporate Governance",
            href: "/dashboard/investor-relation/governance",
          },
          {
            title: "Disclosure 46",
            href: "/dashboard/investor-relation/disclosure",
          },
          {
            title: "Disclosure - FSC",
            href: "/dashboard/disclosure-files/financials-subsidiary-companies",
          },
          {
            title: "Disclosure - SCR",
            href: "/dashboard/disclosure-files/secretarial-compliance-report",
          },
          {
            title: "Disclosure - R30",
            href: "/dashboard/disclosure-files/disclosure-r30",
          },
          {
            title: "Disclosure - Paper Advt",
            href: "/dashboard/disclosure-files/paper-adv",
          },
          { title: "Meetings", href: "/dashboard/investor-relation/meetings" },
          { title: "Policies", href: "/dashboard/investor-relation/policies" },
          {
            title: "Stock Exchange Filings",
            href: "/dashboard/investor-relation/stock-exchange",
          },
          {
            title: "Open Offer",
            href: "/dashboard/investor-relation/open-offer",
          },
          {
            title: "KYC Forms",
            href: "/dashboard/investor-relation/kyc-forms",
          },
          {
            title: "Scrutinizer Report",
            href: "/dashboard/investor-relation/scrutinizer",
          },
          {
            title: "Others",
            href: "/dashboard/investor-relation/others",
          },
          {
            title: "Live Stock Info",
            href: "/dashboard/investor-relation/live-stock",
          },
        ],
        icon: "Handshake",
      },
      // {
      //   title: "Disclosure-Files",
      //   children: [
      //     {
      //       title: "financials-subsidiary-companies",
      //       href: "/dashboard/disclosure-files/financials-subsidiary-companies",
      //     },
      //     {
      //       title: "secretarial-compliance-report",
      //       href: "/dashboard/disclosure-files/secretarial-compliance-report",
      //     },
      //   ],
      //   icon: "Files",
      // },
    ];

    const defaultMenu = [
      { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
      {
        title: "Home",
        children: [{ title: "Home Banners", href: "/dashboard/home/banners" }],
        icon: "House",
      },
      {
        title: "About",
        children: [
          { title: "About Banners", href: "/dashboard/about/banners" },
          { title: "Leaders", href: "/dashboard/about/leaders" },
        ],
        icon: "CircleQuestionMark",
      },
      {
        title: "Brands",
        children: [
          { title: "Brand Logo", href: "/dashboard/brands/logo" },
          { title: "Brand Banners", href: "/dashboard/brands/banners" },
          { title: "Brand Section", href: "/dashboard/brands/section" },
          { title: "Brand Consumer", href: "/dashboard/brands/consumer" },
        ],
        icon: "Hexagon",
      },
      {
        title: "Franchise",
        children: [
          { title: "Franchise Banners", href: "/dashboard/franchise/banners" },
          { title: "Franchise Form", href: "/dashboard/franchise/form" },
        ],
        icon: "Store",
      },
      {
        title: "Gallery",
        children: [
          { title: "Image Upload", href: "/dashboard/gallery/image" },
          { title: "Video Upload", href: "/dashboard/gallery/video" },
          {
            title: "Social Media Links",
            href: "/dashboard/gallery/social-media",
          },
          {
            title: "Delivery Platform Links",
            href: "/dashboard/gallery/delivery-platform",
          },
        ],
        icon: "Image",
      },
      {
        title: "Contact",
        children: [
          { title: "Contact Banners", href: "/dashboard/contact/banners" },
          { title: "Contact Form", href: "/dashboard/contact/form" },
        ],
        icon: "Mail",
      },
    ];

    if (role === "Admin") setMenuItems(adminMenu);
    else if (role === "Investor") setMenuItems(investorMenu);
    else setMenuItems(defaultMenu);
  }, [pb.authStore.record?.name]);

  // Prevent rendering before menuItems are ready
  if (!menuItems) return null;

  return (
    <div className="w-64 min-h-screen bg-gray-100 text-gray-600 flex flex-col fixed inset-0 border-r-[1.5px] z-50">
      <p className="text-2xl text-center font-bold px-3 py-3 border-b border-gray-300 text-black">
        Spice Lounge
      </p>

      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item, i) => {
          const Icon =
            item.icon && Icons[item.icon] ? Icons[item.icon] : Icons.File;

          return (
            <div key={i}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={`w-full flex justify-between items-center px-3 py-2 rounded transition-colors ${
                      item.children.some((child) => pathname === child.href)
                        ? "bg-gray-200 font-semibold"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={18} />
                      {item.title}
                    </span>
                    <ChevronRight
                      size={20}
                      className={`transform transition-transform ${
                        openMenus[item.title] ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openMenus[item.title] ? "h-auto" : "h-0"
                    }`}
                  >
                    <ul className="ml-5 pl-1 mt-1 space-y-1 border-l-[1.5px] text-sm">
                      {item.children.map((child, j) => (
                        <li key={j}>
                          <Link
                            href={child.href}
                            className={`block px-3 py-1 rounded transition-colors ${
                              pathname === child.href
                                ? "bg-gray-200 font-semibold"
                                : "hover:bg-gray-200"
                            }`}
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`block px-3 py-2 rounded transition-colors ${
                    pathname === item.href
                      ? "bg-gray-200 font-semibold"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon size={18} />
                    {item.title}
                  </span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-2 py-2 border-t border-gray-300">
        <button
          onClick={() => {
            pb.authStore.clear();
            router.replace("/login");
          }}
          className="w-full px-3 py-2 rounded border border-gray-500 hover:bg-gray-800 hover:text-white transition-colors flex gap-2 items-center"
        >
          <LogOut size={20} /> <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
