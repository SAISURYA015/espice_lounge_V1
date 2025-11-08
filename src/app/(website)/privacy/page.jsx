// PrivacyPolicy.jsx
import NavBar from "@/components/shared/NavBar";
import React from "react";
import Footer from "../footer/page";

const sections = [
  {
    title: "Privacy Policy",
    content:
      "This website is owned and operated by Spice Lounge Food Works, Ltd. (“we”, “our”, or “us”). This Privacy Policy explains how we collect, use, share, and protect the information you provide when using our website and related services. Please read this Privacy Policy carefully before submitting any information to our site.",
  },
  {
    title: "Consent",
    content:
      "By accessing or using this website, you (“User”) agree to the terms outlined in this Privacy Policy. When you submit your information, you consent to its collection, usage, processing, and disclosure in accordance with this policy and applicable Indian laws.",
  },
  {
    title: "Use of Information",
    content:
      "We may use the information you provide to fulfill your requests, communicate with you, offer products/services, and publish submissions. We may disclose information when required by law or upon request by legal authorities.",
  },
  {
    title: "Sensitive Personal Information",
    content:
      "We collect and handle sensitive personal information responsibly and in compliance with Indian laws. This includes passwords, financial details, health data, and biometric information. Users can review, correct, or withdraw consent at any time.",
  },
  {
    title: "Fair Use Policy",
    content:
      "Users must not upload or share content that is illegal, offensive, infringes rights, or threatens national integrity. They must not bypass security, impersonate others, or introduce harmful code.",
  },
  {
    title: "Enforcement",
    content:
      "We reserve the right to terminate accounts or remove content for policy violations. We may disclose data to comply with legal obligations or to protect rights and prevent fraud.",
  },
  {
    title: "Cookies and Tracking",
    content:
      "We use cookies and web beacons to improve your experience. These tools help us understand user preferences and deliver better content and advertising.",
  },
  {
    title: "Data Security",
    content:
      "We apply physical and digital safeguards to protect your data from unauthorized access. Verification may be required to grant access or process corrections.",
  },
  {
    title: "Policy Updates",
    content:
      "This Privacy Policy may be updated without prior notice. All changes will be posted here. Please review this page regularly to stay informed.",
  },
  {
    title: "Contact",
    content:
      "For questions or concerns, please contact our designated Grievance Officer via the contact details provided on our website.",
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="bg-orange-50">
      <NavBar />
      <section className="mt-16 max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Privacy Policy
        </h1>
        <div className="space-y-7">
          {sections.map((sec, i) => (
            <div
              key={sec.title}
              className="bg-white p-5 rounded-md border border-gray-200 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-[#152768] mb-2 flex items-center">
                <span className="mr-2">►</span>
                {sec.title}
              </h2>
              <p className="text-gray-600 text-base">{sec.content}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
