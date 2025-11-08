// LegalDisclaimer.jsx
"use client";

import React from "react";
import Footer from "../footer/page";
import NavBar from "@/components/shared/NavBar";
import { ChevronRight } from "lucide-react";

const sections = [
  {
    id: "general-disclaimer",
    title: "General Disclaimer",
    content:
      "Spice Lounge Food Works Ltd. ('Company') strives to ensure that all information on this website is accurate and reliable. However, occasional errors may occur. To the fullest extent allowed by law, the Company disclaims all warranties—express or implied—related to the content, reliability, and suitability of this site.\n\nThe Company is not responsible for damages, viruses, or losses resulting from the use of this website. Visitors use it at their own risk. The Company may update content or services at any time without notice. It is not liable for indirect or consequential damages from using this site.\n\nUsers accessing this site from outside India are responsible for complying with their local laws.",
  },
  {
    id: "trademarks",
    title: "Trademarks",
    content:
      "This website may include valuable trademarks owned by Spice Lounge Food Works, Ltd., its affiliates, or licensors. These marks help distinguish our services globally.\n\nAll Trademarks—including names, logos, product identifiers, and designs—are protected under intellectual property laws. Unauthorized use, reproduction, or modification is strictly prohibited. Third-party brand names are used only for identification purposes and may belong to their respective owners.",
  },
  {
    id: "copyright",
    title: "Copyright",
    content:
      "You are permitted to view and print pages from this website for personal, non-commercial use only. All rights remain with the Company.\n\nReproduction, distribution, transmission, or modification of any content without prior written permission is prohibited. The layout, design, trademarks, and media are protected by copyright laws and international agreements.",
  },
  {
    id: "external-links",
    title: "External Links Disclaimer",
    content:
      "This website may contain links to third-party websites. The Company is not responsible for the accuracy, content, or availability of those sites. Your interactions with such websites are entirely at your own risk.",
  },
  {
    id: "settings",
    title: "Settings & Suggestions",
    content:
      "Any recommendations or feature settings provided on this site are for suggestion purposes only. Final decisions and outcomes are the responsibility of the user. The Company disclaims any liability from the use of such guidance.",
  },
  {
    id: "services",
    title: "Use of Services",
    content:
      'Use of this website and services is at your own risk. Content is provided "as is" without warranties of any kind. The Company and its affiliates disclaim all implied warranties including fitness, accuracy, and non-infringement.\n\nThe Company is not liable for data loss, technical failures, or consequences of using content from this site. No advice given—oral or written—creates any warranty unless explicitly stated.',
  },
  {
    id: "privacy",
    title: "Privacy & Contact",
    content:
      "Contact details shared via this site may be used to reach out to you for service-related or promotional communication. The Company does not share your data with third parties except those operating on its behalf under strict confidentiality.",
  },
  {
    id: "cookies",
    title: "Cookies",
    content:
      "This website uses cookies to enhance user experience, remember preferences, and improve site performance. Cookies do not store personal data unless provided voluntarily. Continued use of this site implies consent to our cookie policy.",
  },
  {
    id: "acknowledgement",
    title: "Final Acknowledgement",
    content:
      "By using this website, you agree to all terms, disclaimers, and policies stated herein. If you do not agree, you should discontinue use of the site immediately.",
  },
];

export default function LegalDisclaimer() {
  return (
    <div className="bg-orange-50">
      <NavBar />
      <main className="mt-16 max-w-7xl mx-auto px-4 py-10 flex gap-8">
        {/* Content */}
        <section className="flex-1">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Legal Disclaimer & Terms
          </h1>
          <div className="space-y-7">
            {sections.map((sec) => (
              <article
                key={sec.id}
                id={sec.id}
                className="bg-white p-5 rounded-md border border-gray-200 shadow-sm scroll-mt-24"
              >
                <h2 className="text-lg font-semibold text-[#152768] mb-2 flex items-center">
                  <ChevronRight className="w-5 h-5 mr-2 text-[#d13b2a]" />
                  {sec.title}
                </h2>
                <p className="text-gray-600 text-base whitespace-pre-line">
                  {sec.content}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}