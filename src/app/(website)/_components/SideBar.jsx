"use client";
import React, { useEffect, useState } from "react";

import {
  CalendarCheck,
  LineChart,
  IndianRupee,
  UserRound,
  Crown,
  UserCog,
  CalendarDays,
  ListChecks,
  FileStack,
  Tag,
  ChartNoAxesColumn,
  ClipboardCheck,
  FileText,
  FolderOpen,
} from "lucide-react";

import { usePathname } from "next/navigation";
const menuItems = [
  {
    title: "Corporate Information",
    href: "/investor-relation/corporate-information",
    icon: CalendarCheck,
  },

  {
    title: "Annual Reports",
    href: "/investor-relation/annual-reports",
    icon: LineChart,
  },
  {
    title: "Annual Returns",
    href: "/investor-relation/annual-returns",
    icon: LineChart,
  },

  {
    title: "Financial Results",
    href: "/investor-relation/financial-results",
    icon: IndianRupee,
  },

  {
    title: "Shareholding Pattern",
    href: "/investor-relation/shareholder",
    icon: UserRound,
  },
  {
    title: "Corporate Governance",
    href: "/investor-relation/corporate-governance",
    icon: Crown,
  },

  {
    title: "Disclosures under Regulation 46",
    href: "/investor-relation/disclosures",
    icon: UserCog,
  },

  {
    title: "Meetings",
    href: "/investor-relation/meetings",
    icon: CalendarDays,
  },
  //policies
  {
    title: "Policies",
    href: "/investor-relation/policies",
    icon: ListChecks,
  },
  //misc files- pending
  {
    title: "Stock Exchange Filings",
    href: "/investor-relation/stock-exchange",
    icon: FileStack,
  },
  //open offer - no data
  {
    title: "Open Offer 2024",
    href: "/investor-relation/openoffer",
    icon: Tag,
  },
  {
    title: "KYC Forms",
    href: "/investor-relation/kyc-forms",
    icon: FileText,
  },
  {
    title: "Scrutinizer Report",
    href: "/investor-relation/scrutinizer",
    icon: ClipboardCheck,
  },
  {
    title: "Others",
    href: "/investor-relation/others",
    icon: FolderOpen,
  },
  // live stock - pending
  {
    title: "Live Stock Info",
    href: "/investor-relation/livestock",
    icon: ChartNoAxesColumn,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        const yOffset = -80; // 👈 your desired offset
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div id="focus" className="bg-orange-50">
      <div className="w-full lg:w-96 bg-gray-100 text-gray-600 flex flex-col border-r-[1.5px] z-40">
        {/* <p className="text-2xl text-center font-bold px-3 py-3 border-b border-gray-200 text-[#223972]">
          Spice Lounge
        </p> */}

        <div className="bg-orange-50 rounded p-4 lg:col-span-1">
          <ul className="space-y-2">
            {menuItems.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.title}>
                  <a
                    href={`${tab.href}#focus`}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                      pathname.includes(tab.href.toLowerCase())
                        ? "bg-[#223972]/10 border-l-4 border-[#223972] text-[#223972] font-semibold"
                        : "hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{tab.title}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
