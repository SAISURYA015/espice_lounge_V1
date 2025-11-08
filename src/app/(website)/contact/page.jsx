"use client";
import React, { useEffect, useState } from "react";
import Footer from "../footer/page";
import NavBar from "@/components/shared/NavBar";
import { Mail, MapPin, Phone } from "lucide-react";
import pb from "../_lib/pb";
import ReCAPTCHA from "react-google-recaptcha";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";

const Contact = () => {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    banners: [],
    brands: [],
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaLoading, setCaptchaLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      alert("⚠️ Please verify you are not a robot.");
      return;
    }

    if (!isValidPhoneNumber(formData.phone || "")) {
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
        // Save form submission to PocketBase
        await pb.collection("contact_form").create({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        });

        alert("✅ Message sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
        setCaptchaValue(null);
        setError("");
      } else {
        alert("❌ Captcha verification failed, try again.");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setCaptchaLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes] = await Promise.all([
          pb.collection("banners").getFullList(200, {
            sort: "sno",
            filter: 'page = "contact"',
            requestKey: null,
          }),
        ]);

        setData({
          banners: bannersRes.map((item) => pb.files.getURL(item, item.image)),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <div className="mt-16 w-full max-w-7xl mx-auto">
        <img src={data.banners[0]} alt="" />
      </div>

      <div className="flex items-center justify-center py-10 px-4 bg-orange-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full">
          {/* Left Info Card */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-full flex justify-center">
              <img
                src="/images/shared/logos/logo.png"
                alt="Logo"
                className="w-70 h-auto mb-4"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Corporate:
              </h2>

              <div className="flex items-start gap-2 text-gray-700 mb-2">
                <MapPin size={48} />
                <p>
                  Western Dallas Centre, 5th Floor, Survey No.83/1, Knowledge
                  City, Raidurg, Gachibowli, Hyderabad, Telangana - 500032.
                </p>
              </div>
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Phone /> <p>+91 63626 72263</p>
              </div>
              <div className="flex items-center gap-2 text-gray-700 mb-4">
                <Mail />
                <a
                  href="mailto:info@espicelounge.com"
                  className="text-blue-500 hover:underline"
                >
                  info@espicelounge.com
                </a>
              </div>

              <div className="w-full flex justify-end">
                <button className="px-4 py-2 bg-blue-900 text-white rounded-lg shadow hover:bg-blue-800 transition">
                  Get in Touch
                </button>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-white p-8 rounded-lg shadow-md flex justify-center">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center md:text-left">
                GET IN TOUCH
              </h2>
              <p className="text-gray-600 mb-6 text-center md:text-left">
                Our friendly team would love to hear from you.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  required
                />

                {/* Phone Input with validation */}
                <PhoneInput
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(value) =>
                    setFormData({ ...formData, phone: value })
                  }
                  defaultCountry="IN"
                  international
                  className="w-full border p-2 rounded"
                />
                {error && <p className="text-red-600">{error}</p>}

                <textarea
                  name="message"
                  rows="4"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>

                <ReCAPTCHA
                  sitekey="6Le0arsrAAAAAC5JQIbZSX7BHy2iggHfIAC0NTXS"
                  onChange={(value) => setCaptchaValue(value)}
                />

                <button
                  type="submit"
                  disabled={captchaLoading}
                  className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50"
                >
                  {captchaLoading ? "Submitting..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
