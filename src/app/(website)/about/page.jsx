"use client";
import NavBar from "@/components/shared/NavBar";
import React, { useEffect, useState } from "react";
import Footer from "../footer/page";
import pb from "../_lib/pb";

const About = () => {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    banners: [],
    brands: [],
    leaders: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, brandsRes, leadersRes] = await Promise.all([
          pb.collection("banners").getFullList(200, {
            sort: "sno",
            filter: 'page = "about"',
            requestKey: null,
          }),
          pb
            .collection("brands")
            .getFullList(200, { sort: "sno", requestKey: null }),
          pb.collection("leaders").getFullList(200, {
            sort: "sno",
            filter: 'page = "about"',
            requestKey: null,
          }),
        ]);

        setData({
          banners: bannersRes.map((item) => pb.files.getURL(item, item.image)),
          brands: brandsRes,
          leaders: leadersRes,
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
      <>
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
      </>
    );

  return (
    <div className="bg-orange-50">
      <NavBar />

      <div className="mt-16 max-w-7xl mx-auto mb-4">
        <img className="w-full" src={data.banners[0]} alt="" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-orange-200/50">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 tracking-wide text-center uppercase">
          <span className="text-[#d13b2a]">Our </span>
          <span className="text-[#152768]">Mission & </span>
          <br className="md:hidden" />
          <span className="text-[#152768]">Vision</span>
        </h2>
        <p className="text-justify">
          At
          <span className="text-[#d13b2a]"> Spice </span>
          <span className="text-[#152768]">Lounge</span>, we bring together
          global dining and lifestyle experiences under one banner. From U.S.
          brands like Buffalo Wild Wings and Wing Zone, to Middle Eastern
          flavors with Blaze Kebabs, and premium pubs and nightlife concepts
          like Xora, Salud, and Sunburn Union we deliver taste and entertainment
          at scale. Our vision is to build a multi category food and beverage
          power house driven by culinary innovation, vibrant pub culture, and
          technology platforms like eTouch and TekSoft. With 8 powerful brands,
          we are redefining hospitality and empowering entrepreneurs through
          sustainable, scalable franchise models.
        </p>
      </div>

      {/* OWNED / REPRESENTED BY SPICE LOUNGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 tracking-wide">
          <span>OWNED / REPRESENTED BY</span>
          <span className="text-[#d13b2a]"> SPICE </span>
          <span className="text-[#152768]">LOUNGE</span>
        </h2>
        <p className="text-justify">
          A family of bold and diverse brands, spanning food, pubs, nightlife,
          and technology, united by flavor and fueled by innovation. Each
          reflects our passion for quality, scalability, and unforgettable
          experiences.
        </p>

        <div className="pt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 items-center gap-2">
          {data.brands.length > 0 ? (
            data.brands.map((brand, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-center border border-gray-300 rounded-2xl p-2"
                >
                  <img
                    className="h-28 w-28 lg:h-20 object-contain"
                    src={pb.files.getURL(brand, brand.logo)}
                    alt=""
                  />
                </div>
              );
            })
          ) : (
            <p>Loading brands...</p>
          )}
        </div>
      </section>

      {/* our visionary leadership */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 tracking-wide text-center uppercase">
          <span className="text-[#d13b2a]">OUR </span>
          <span className="text-[#d13b2a]">VISIONARY </span>
          <br className="md:hidden" />
          <span className="text-[#152768]">LEADERSHIP </span>
        </h2>
        <p className="text-justify">
          At <span className="font-semibold text-[#d13b2a]">SPICE</span>
          <span className="font-semibold text-[#152768]"> LOUNGE</span>, our
          leadership team brings together decades of experience in hospitality,
          culinary innovation, and global food service management. Each member
          of our leadership team shares a common goal: to elevate the Spice
          Lounge brand through strategic growth, quality excellence, and
          customer-first thinking.
        </p>
        {data.leaders.length > 0 ? (
          data.leaders.map((leader) => {
            return (
              <div key={leader.id} className="mt-8 lg:flex gap-12">
                <div className="lg:max-w-60 border rounded-3xl hover:shadow-xl transition-all duration-300 group cursor-pointer ease-in-out transform hover:scale-[1.02]">
                  <img
                    className="h-auto w-full object-contain rounded-3xl"
                    src={pb.files.getURL(leader, leader.image)}
                    alt={leader.name}
                  />
                </div>
                <p className="lg:w-3/4 text-justify">
                  <span className="text-[#152768] font-bold">
                    {leader?.name}
                  </span>
                  {" - "} {leader?.role}
                  <br /> <br />
                  {leader?.description}
                </p>
              </div>
            );
          })
        ) : (
          <p>Loading leader members...</p>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 tracking-wide text-center uppercase">
          <span className="text-[#d13b2a]">OUR CORE </span>
          <span className="text-[#152768]">VALUES </span>
        </h2>
        <p className="text-justify">
          We stand for innovation, integrity, customer delight, operational
          excellence, and sustainable growth—driving every decision we make
          across all our brands.
        </p>

        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            <div className="border border-gray-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group ease-in-out transform hover:scale-[1.02] p-4">
              <div className="flex items-center justify-center">
                <img
                  className="w-12 h-12 object-contain"
                  src="/images/about/core/idea.png"
                  alt="idea"
                />
              </div>
              <p className="text-lg font-semibold">Innovation in every bite</p>
            </div>

            <div className="border border-gray-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group ease-in-out transform hover:scale-[1.02] p-4">
              <div className="flex items-center justify-center">
                <img
                  className="w-12 h-12 object-contain"
                  src="/images/about/core/settings.png"
                  alt="settings"
                />
              </div>
              <p className="text-lg font-semibold">Operational excellence</p>
            </div>

            <div className="border border-gray-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group ease-in-out transform hover:scale-[1.02] p-4">
              <div className="flex items-center justify-center">
                <img
                  className="w-12 h-12 object-contain"
                  src="/images/about/core/customer.png"
                  alt="customer"
                />
              </div>
              <p className="text-lg font-semibold">Customer-first mindset</p>
            </div>

            <div className="border border-gray-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group ease-in-out transform hover:scale-[1.02] p-4">
              <div className="flex items-center justify-center">
                <img
                  className="w-12 h-12 object-contain"
                  src="/images/about/core/collaborate.png"
                  alt="collabrate"
                />
              </div>
              <p className="text-lg font-semibold">
                Integrity and transparency
              </p>
            </div>

            <div className="border border-gray-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group ease-in-out transform hover:scale-[1.02] p-4">
              <div className="flex items-center justify-center">
                <img
                  className="w-12 h-12 object-contain"
                  src="/images/about/core/handshake.png"
                  alt="handshake"
                />
              </div>
              <p className="text-lg font-semibold">
                Growth through collaboration
              </p>
            </div>
            <div className="border border-gray-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group ease-in-out transform hover:scale-[1.02] p-4">
              <div className="flex items-center justify-center">
                <img
                  className="w-12 h-12 object-contain"
                  src="/images/about/core/building.png"
                  alt="building"
                />
              </div>
              <p className="text-lg font-semibold">
                Infrastructural Excellence
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
