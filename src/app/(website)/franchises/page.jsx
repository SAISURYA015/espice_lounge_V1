"use client";
import NavBar from "@/components/shared/NavBar";
import React, { useEffect, useState } from "react";
import Footer from "../footer/page";
import pb from "../_lib/pb";
import { X } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";

const Franchise = () => {
  const [loading, setLoading] = useState(true);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaLoading, setCaptchaLoading] = useState(false);

  const [data, setData] = useState({
    banners: [],
    brands: [],
  });

  // Modal state
  const [open, setOpen] = useState(false);
  const [fade, setFade] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [applyLogo, setApplyLogo] = useState("");
  const [applyFor, setApplyFor] = useState(""); // <-- New attribute
  const [error, setError] = useState("");

  // Trigger fade effect
  useEffect(() => {
    setFade(open);
  }, [open]);

  // Fetch banners + brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, brandsRes] = await Promise.all([
          pb.collection("banners").getFullList(200, {
            sort: "sno",
            filter: 'page = "franchise"',
            requestKey: null,
          }),
          pb.collection("brands").getFullList(200, {
            sort: "sno",
            requestKey: null,
          }),
        ]);

        setData({
          banners: bannersRes.map((item) => pb.files.getURL(item, item.image)),
          brands: brandsRes,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      alert("⚠️ Please verify you are not a robot.");
      return;
    }

    if (!isValidPhoneNumber(phone || "")) {
      setError("Invalid phone number");
      return;
    }

    setCaptchaLoading(true);

    try {
      // Verify captcha with backend API
      const res = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: captchaValue }),
      });

      const captchaRes = await res.json();

      if (captchaRes.success) {
        // Save to PocketBase
        await pb.collection("franchise_form").create({
          name,
          email,
          phone,
          message,
          brandLogo: applyLogo, // optional
          applyFor, // <-- Send the brand name
        });

        alert("✅ Application submitted successfully!");
        setOpen(false);

        // Reset form
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setApplyLogo("");
        setApplyFor("");
        setError("");
        setCaptchaValue(null);
      } else {
        alert("❌ Captcha verification failed, try again.");
      }
    } catch (err) {
      console.error("Captcha / Submission error:", err);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setCaptchaLoading(false);
    }
  };

  if (loading)
    return (
      <div className="h-dvh w-dvw flex justify-center items-center bg-orange-50">
        <div className="relative w-32 h-32 flex justify-center items-center">
          {/* Spinning border */}
          <div className="absolute w-full h-full border-4 border-gray-300 border-t-[#152768] rounded-full animate-spin"></div>

          {/* Logo inside */}
          <img
            src="/images/logo.png"
            alt="Spice Lounge Logo"
            className="w-20 h-20 object-contain"
          />
        </div>
      </div>
    );

  return (
    <div className="bg-orange-50">
      <NavBar />

      <div className="mt-16 max-w-7xl mx-auto mb-4">
        <img className="w-full" src={data.banners[0]} alt="" />
      </div>

      {/* Brand Cards */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.brands.length > 0 ? (
            data.brands.map((brand) => (
              <div
                key={brand.id}
                className="border border-orange-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer ease-in-out transform hover:scale-[1.02] p-4"
              >
                <div className="flex items-center justify-center">
                  <img
                    className="h-32 w-32 object-contain"
                    src={pb.files.getURL(brand, brand.logo)}
                    alt={brand.name || "brand logo"}
                  />
                </div>
                <p className="text-sm text-center">
                  {brand?.aboutDescription.slice(0, 90)}
                  <span
                    className="text-[#d13b2a] font-semibold cursor-pointer"
                    onClick={() => {
                      setOpen(true);
                      setApplyLogo(pb.files.getURL(brand, brand.logo));
                      setApplyFor(brand.name); // <-- Automatically set brand name
                    }}
                  >
                    ...apply
                  </span>
                </p>
              </div>
            ))
          ) : (
            <p>No brands...</p>
          )}
        </div>
      </div>

      <Footer />

      {/* Application Modal */}
      {open && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black/40 transition-opacity duration-200 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        >
          <div
            className={`relative bg-white rounded-lg p-6 w-[95%] max-w-lg shadow transform transition-transform duration-200 ${
              fade ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 p-1 rounded-full text-gray-700 cursor-pointer"
            >
              <X size={24} />
            </button>

            {applyLogo && (
              <img
                className="h-16 object-contain mx-auto"
                src={applyLogo}
                alt="brandlogo"
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <PhoneInput
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={setPhone}
                  defaultCountry="IN"
                  international
                  className="w-full border p-2 rounded"
                />
                {error && <p className="text-red-600">{error}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="w-full border px-3 py-2 rounded"
                ></textarea>
              </div>

              <ReCAPTCHA
                sitekey="6Le0arsrAAAAAC5JQIbZSX7BHy2iggHfIAC0NTXS"
                onChange={(value) => setCaptchaValue(value)}
              />

              <button
                type="submit"
                disabled={captchaLoading}
                className="w-full py-2 bg-[#d13b2a] text-white font-semibold rounded hover:bg-[#b03022] transition disabled:opacity-50"
              >
                {captchaLoading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Franchise;
