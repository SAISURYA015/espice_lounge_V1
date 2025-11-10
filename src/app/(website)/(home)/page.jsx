"use client";

import NavBar from "@/components/shared/NavBar";
import Carousel from "@/components/shared/Carousel";
import Footer from "../footer/page";
import { ArrowRight, ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import pb from "../_lib/pb";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

const Home = () => {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    banners: [],
    brands: [],
    images: [],
    videos: [],
  });

  // const sliderSettings = {
  //   autoplay: true,
  //   dots: false,
  //   infinite: true,
  //   autoplaySpeed: 2500,
  //   speed: 1000,
  //   // slidesToShow: 1, // Default for desktop
  //   slidesToScroll: 1,
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: { slidesToShow: 2 },
  //     },
  //     {
  //       breakpoint: 768,
  //       settings: { slidesToShow: 1 },
  //     },
  //   ],
  // };

   const sliderSettings = {
     autoplay: true,
     dots: false,
     infinite: true,
     autoplaySpeed: 2500,
     speed: 1000,
     // slidesToShow: 5, // Large Desktop
     slidesToScroll: 1,
     responsive: [
       {
         breakpoint: 992, // Tablet landscape
         settings: {
           slidesToShow: 2,
         },
       },
       {
         breakpoint: 768, // Tablet portrait
         settings: {
           slidesToShow: 2,
         },
       },
       {
         breakpoint: 576, // Large mobile
         settings: {
           slidesToShow: 1,
         }, 
       },
       {
         breakpoint: 425, // Small mobile
         settings: {
           slidesToShow: 1,
         },
       },
     ],
   };

  const [galactive, setGalactive] = useState("img");
   const sliderRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, brandsRes, imagesRes, videosRes] = await Promise.all(
          [
            pb.collection("banners").getFullList(200, {
              sort: "sno",
              filter: 'page = "home"',
              requestKey: null,
            }),
            pb
              .collection("brands")
              .getFullList(200, { sort: "sno", requestKey: null }),
            pb.collection("gallery").getFullList(200, {
              sort: "sno",
              filter: 'type = "image"',
              requestKey: null,
            }),
            pb.collection("gallery").getFullList(200, {
              sort: "sno",
              filter: 'type = "video"',
              requestKey: null,
            }),
          ]
        );

        setData({
          banners: bannersRes.map((item) => pb.files.getURL(item, item.image)),
          brands: brandsRes,
          images: imagesRes,
          videos: videosRes,
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
      <Carousel slideImages={data.banners} slideInterval={3000} />

      {/* brands logos */}
      <div className="max-w-7xl mx-auto text-center">
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 items-center py-4 gap-2">
          {data.brands.length > 0 ? (
            data.brands.map((brand, index) => (
              <div
                className="flex items-center justify-center border border-gray-300 rounded-2xl"
                key={index}
              >
                <img
                  className="h-24 lg:h-20 object-contain p-3"
                  src={pb.files.getURL(brand, brand.logo)}
                  alt={brand.name || "Brand"}
                />
              </div>
            ))
          ) : (
            <p>Loading brands...</p>
          )}
        </div>
      </div>

      {/* our vision & Mission */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-orange-200/50">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 tracking-wide text-center uppercase">
          <span className="text-[#d13b2a]">Our </span>
          <span className="text-[#152768]">Mission & </span>
          <br className="md:hidden" />
          <span className="text-[#152768]">Vision</span>
        </h2>
        <p className="text-justify">
          At
          <span className="text-[#d13b2a] font-semibold"> Spice </span>
          <span className="text-[#152768] font-semibold">Lounge</span>, we bring
          together global dining and lifestyle experiences under one banner.
          From U.S. brands like Buffalo Wild Wings and Wing Zone, to Middle
          Eastern flavors with Blaze Kebabs, and premium pubs and nightlife
          concepts like Xora, Salud, and Sunburn Union we deliver taste and
          entertainment at scale. Our vision is to build a multi category food
          and beverage powerhouse driven by culinary innovation, vibrant pub
          culture, and technology platforms like eTouch and TekSoft. With 8
          powerful brands, we are redefining hospitality and empowering
          entrepreneurs through sustainable, scalable franchise models.
        </p>
      </div>

      {/* Announcements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
        <h2 className="text-xl lg:text-2xl font-bold text-[#d13b2a] mb-4  tracking-wide">
          ANNOUNCEMENTS
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full mx-auto">
          <a href="/investor-relation/financial-results#focus">
            <div className="rounded-xl p-6 pb-2 text-white text-left shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer ease-in-out transform hover:scale-[1.02] bg-[#d13b2a]">
              <h3 className="text-[16px] font-semibold leading-snug mb-2">
                Latest Stock Summary
              </h3>
              <div className="flex justify-between gap-2 items-end">
                <p className="text-sm font-semibold text-gray-200">
                  Highlights from our latest quarterly performance
                </p>
              </div>
              <div className="flex justify-end">
                <MoveRight />
              </div>
            </div>
          </a>

          <a href="/investor-relation/meetings#focus">
            <div className="rounded-xl p-6 pb-2 text-white text-left shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer ease-in-out transform hover:scale-[1.02] bg-[#d13b2a]/70">
              <h3 className="text-[16px] font-semibold leading-snug mb-2">
                Business Expansion Report
              </h3>
              <div className="flex justify-between gap-2 items-end">
                <p className="text-sm font-semibold text-gray-200">
                  Insights on platform growth and development
                </p>
              </div>
              <div className="flex justify-end">
                <MoveRight />
              </div>
            </div>
          </a>

          <a href="/investor-relation/shareholder#focus">
            <div className="rounded-xl p-6 pb-2 text-white text-left shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer ease-in-out transform hover:scale-[1.02] bg-[#152768]">
              <h3 className="text-[16px] font-semibold leading-snug mb-2">
                PAN India Market Entry
              </h3>
              <div className="flex justify-between gap-2 items-end">
                <p className="text-sm font-semibold text-gray-200">
                  Post-acquisition impact and expansion strategy
                </p>
              </div>
              <div className="flex justify-end">
                <MoveRight />
              </div>
            </div>
          </a>

          <a href="/investor-relation/livestock#focus">
            <div className="rounded-xl p-6 pb-2 text-white text-left shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer ease-in-out transform hover:scale-[1.02] bg-[#152768]/80">
              <h3 className="text-[16px] font-semibold leading-snug mb-2">
                Strategic Investor Brief
              </h3>
              <div className="flex justify-between gap-2 items-end">
                <p className="text-sm font-semibold text-gray-200">
                  Key updates for Live Stock and Stakeholders
                </p>
              </div>
              <div className="flex justify-end">
                <MoveRight />
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* our brands */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 tracking-wide">
          <span className="text-[#d13b2a]">OUR </span>
          <span className="text-[#152768]">BRANDS</span>
        </h2>
        <p className="text-justify">
          At Spice Lounge, we unite a diverse portfolio of bold and iconic food,
          pub, and lifestyle brands each with its own identity, yet all driven
          by our shared passion for taste, quality, and innovation. Supported by
          our technology platforms, we deliver scalable solutions that power
          growth and unforgettable customer experiences.
        </p>
        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.brands.length > 0 ? (
              data.brands.map((brand, index) => {
                return (
                  <div
                    key={index}
                    className="border border-orange-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group ease-in-out transform hover:scale-[1.02] p-4"
                  >
                    <div className="flex items-center justify-center">
                      <img
                        className="h-32 w-32 object-contain"
                        src={pb.files.getURL(brand, brand.logo)}
                        alt=""
                      />
                    </div>
                    <p className="text-sm">
                      {brand?.aboutDescription.slice(0, 90)}
                      <a href={`/brands/${brand.name.replaceAll(" ", "-")}`}>
                        <span className="text-[#d13b2a]">...view</span>
                      </a>
                    </p>
                  </div>
                );
              })
            ) : (
              <p>No brands</p>
            )}
          </div>
        </div>
      </section>
      {/* business strength */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-4 tracking-wide text-center uppercase">
          <span className="text-[#d13b2a]">SPICE </span>
          <span className="text-[#152768]">LOUNGE </span>
          <br className="md:hidden" />
          Business Strengths
        </h2>
        <p className="font-normal lg:text-lg text-justify">
          {/* &nbsp;&nbsp;&nbsp;&nbsp; */}
          Backed by a strong business model, streamlined supply chain, trusted
          partner network, and nationwide presence, Spice Lounge is
          strategically positioned to seize new growth opportunities.
        </p>

        <div className="pt-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            <div className="border border-gray-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group ease-in-out transform hover:scale-[1.02] p-4">
              <div className="flex items-center justify-center">
                <img
                  className="w-12 h-12 object-contain"
                  src="/home/bs/buildings.png"
                  alt="buildings"
                />
              </div>
              <p className="text-lg font-semibold">
                World-Class Infrastructure
              </p>
              <p className="text-sm">
                Expanding Restaurants in India and Overseas
              </p>
            </div>

            <div className="border border-gray-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group ease-in-out transform hover:scale-[1.02] p-4">
              <div className="flex items-center justify-center">
                <img
                  className="w-12 h-12 object-contain"
                  src="/home/bs/cpu.png"
                  alt="cpu"
                />
              </div>
              <p className="text-lg font-semibold">
                Driven by Technology &amp; Innovation
              </p>
              <p className="text-sm">Driving Operational Excellence via Tech</p>
            </div>

            <div className="border border-gray-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group ease-in-out transform hover:scale-[1.02] p-4">
              <div className="flex items-center justify-center">
                <img
                  className="w-12 h-12 object-contain"
                  src="/home/bs/worldglobe.png"
                  alt="worldglobe"
                />
              </div>

              <p className="text-lg font-semibold">
                Presence Across the Nation
              </p>
              <p className="text-sm">A Strong Footprint Across India</p>
            </div>

            <div className="border border-gray-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group ease-in-out transform hover:scale-[1.02] p-4">
              <div className="flex items-center justify-center">
                <img
                  className="w-12 h-12 object-contain"
                  src="/home/bs/profit.png"
                  alt="profit"
                />
              </div>
              <p className="text-lg font-semibold">Visionary Leadership</p>
              <p className="text-sm">Seasoned Leadership at Strategic Levels</p>
            </div>

            <div className="border border-gray-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group ease-in-out transform hover:scale-[1.02] p-4">
              <div className="flex items-center justify-center">
                <img
                  className="w-12 h-12 object-contain"
                  src="/home/bs/team.png"
                  alt="team"
                />
              </div>
              <p className="text-lg font-semibold">Passionate Team</p>
              <p className="text-sm">
                Empowered by 600+ Committed Professionals
              </p>
            </div>

            <div className="border border-gray-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group ease-in-out transform hover:scale-[1.02] p-4">
              <div className="flex items-center justify-center">
                <img
                  className="w-12 h-12 object-contain"
                  src="/home/bs/award.png"
                  alt="award"
                />
              </div>
              <p className="text-lg font-semibold">Certified Partners</p>
              <p className="text-sm">
                Partners in Compliance with FSSAI Standards
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <h2 className="text-[#152768] text-2xl font-bold text-center">
          GALLERY
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
          <div
            className={
              galactive == "img"
                ? "bg-[#152768] text-white px-3 py-2 rounded cursor-pointer"
                : "hover:bg-[#152768] hover:text-white px-3 py-2 rounded border border-[#152768] cursor-pointer"
            }
            onClick={() => {
              setGalactive("img");
            }}
          >
            Images
          </div>
          <div
            className={
              galactive == "vid"
                ? "bg-[#152768] text-white px-3 py-2 rounded cursor-pointer"
                : "hover:bg-[#152768] hover:text-white px-3 py-2 rounded border border-[#152768] cursor-pointer"
            }
            onClick={() => {
              setGalactive("vid");
            }}
          >
            Videos
          </div>
          <div
            className={
              galactive == "soc"
                ? "bg-[#152768] text-white px-3 py-2 rounded cursor-pointer"
                : "hover:bg-[#152768] hover:text-white px-3 py-2 rounded border border-[#152768] cursor-pointer"
            }
            onClick={() => {
              setGalactive("soc");
            }}
          >
            Social Media
          </div>
          <div
            className={
              galactive == "del"
                ? "bg-[#152768] text-white px-3 py-2 rounded cursor-pointer"
                : "hover:bg-[#152768] hover:text-white px-3 py-2 rounded border border-[#152768] cursor-pointer"
            }
            onClick={() => {
              setGalactive("del");
            }}
          >
            Delivery Platforms
          </div>
        </div>

        {galactive == "img" ? (
          <>
            {/* <div className="flex gap-4">
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.images && data.images.length > 0 ? (
                  data.images.slice(0, 8).map((image) => (
                    <div key={image.id}>
                      <a href={`/gallery/images?imageId=${image.id}`}>
                        <div className="flex items-center justify-center border border-gray-300 rounded-2xl">
                          <img
                            className="object-cover w-full h-64 hover:scale-105"
                            src={pb.files.getURL(image, image.image)}
                            alt={image.name || "Brand"}
                          />
                        </div>
                      </a>
                    </div>
                  ))
                ) : (
                  <p>Loading images...</p>
                )}
              </div>
              <div className="flex items-center">
                <a href="/gallery/images">
                  <div className="bg-[#152768] text-white mt-2 p-2 rounded-full">
                    <ArrowRight />
                  </div>
                </a>
              </div>
            </div> */}
            {/* ✅ Desktop & Laptop View (Static Grid) */}
            <div className="hidden lg:flex gap-6 items-center justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                {data.images && data.images.length > 0 ? (
                  data.images.slice(0, 8).map((image) => (
                    <div key={image.id}>
                      <a href={`/gallery/images?imageId=${image.id}`}>
                        <div className="flex items-center justify-center border border-gray-300 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                          <img
                            className="object-cover w-64 h-64 hover:scale-105 transition-transform duration-300"
                            src={pb.files.getURL(image, image.image)}
                            alt={image.name || "Brand"}
                          />
                        </div>
                      </a>
                    </div>
                  ))
                ) : (
                  <p>Loading images...</p>
                )}
              </div>

              <div className="flex items-center justify-center">
                <a href="/gallery/images">
                  <div className="bg-[#152768] hover:bg-[#1c358a] text-white mt-2 p-3 rounded-full shadow-md hover:scale-110 transition-transform duration-300">
                    <ArrowRight size={28} />
                  </div>
                </a>
              </div>
            </div>

            {/* ✅ Mobile & Tablet View (Slider) */}
            <div className="flex lg:hidden items-center justify-center mt-6">
              {/* Prev Button */}
              <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="p-1 hover:scale-110 transition-transform"
              >
                <ChevronLeft size={36} className="text-black" />
              </button>

              {/* Slider */}
              <div className="w-[85%]">
                {!data?.images || data.images.length === 0 ? (
                  <p className="text-center">Loading images...</p>
                ) : (
                  <Slider ref={sliderRef} {...sliderSettings}>
                    {data.images.slice(0, 8).map((image) => (
                      <div
                        key={image.id}
                        id={image.id}
                        className="flex items-center justify-center"
                      >
                        <a href={`/gallery/images?imageId=${image.id}`}>
                          <div className="flex items-center justify-center border border-gray-300 rounded-2xl overflow-hidden">
                            <img
                              src={pb.files.getURL(image, image.image)}
                              alt="preview"
                              className="object-cover w-80 h-64 rounded-xl hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </a>
                      </div>
                    ))}
                  </Slider>
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() => sliderRef.current?.slickNext()}
                className="p-1 hover:scale-110 transition-transform"
              >
                <ChevronRight size={36} className="text-black" />
              </button>
            </div>
          </>
        ) : galactive == "vid" ? (
          <>
            <div className="max-w-7xl mt-4">
              {data.videos && data.videos.length > 0 ? (
                <Slider {...sliderSettings}>
                  {data.videos.map((video) => (
                    <Link
                      href={`/gallery/videos?videoId=${video.id}`}
                      key={video.id}
                    >
                      <div key={video.id} className="px-2">
                        <video
                          className="w-full h-64 object-cover rounded-md hover:scale-105"
                          crossOrigin="anonymous"
                        >
                          <source
                            src={pb.files.getURL(video, video.video)}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </Link>
                  ))}
                </Slider>
              ) : (
                <p>Loading videos...</p>
              )}
            </div>

            <div className="flex justify-end">
              <a href="/gallery/videos">
                <div className="bg-[#152768] text-white p-2 rounded-full">
                  <ArrowRight />
                </div>
              </a>
            </div>
          </>
        ) : galactive == "soc" ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h2 className="text-2xl text-center">Follow Our brands</h2>
            <p className="text-center mb-4">
              Explore All of Our Unique Brands Across your Favourite Platform
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
              {data.brands.map((brand) => (
                <div
                  key={brand.id}
                  className="bg-white border border-yellow-300 rounded-lg shadow-sm hover:shadow-md hover:border-[#e23130] transition-shadow duration-200 p-6 flex flex-col items-center"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                    {brand.name}
                  </h2>
                  <div className="flex space-x-4 text-2xl text-gray-600">
                    {brand.facebook ? (
                      <a href={brand?.facebook} target="_blank">
                        <img
                          className="h-6 w-6 rounded object-cover hover:scale-110"
                          src="/home/so/facebook.png"
                          alt="Facebook"
                        />
                      </a>
                    ) : (
                      <img
                        className="h-6 w-6 rounded object-cover hover:scale-110"
                        src="/home/so/facebook.png"
                        alt="Facebook"
                      />
                    )}

                    {brand.instagram ? (
                      <a href={brand?.instagram} target="_blank">
                        <img
                          className="h-6 w-6 rounded object-cover hover:scale-110"
                          src="/home/so/instagram.png"
                          alt="Instagram"
                        />
                      </a>
                    ) : (
                      <img
                        className="h-6 w-6 rounded object-cover hover:scale-110"
                        src="/home/so/instagram.png"
                        alt="Instagram"
                      />
                    )}

                    {brand.google ? (
                      <a href={brand?.google} target="_blank">
                        <img
                          className="h-6 w-6 rounded object-cover hover:scale-110"
                          src="/home/so/google-logo.png"
                          alt="Google"
                        />
                      </a>
                    ) : (
                      <img
                        className="h-6 w-6 rounded object-cover hover:scale-110"
                        src="/home/so/google-logo.png"
                        alt="Google"
                      />
                    )}

                    {brand.youtube ? (
                      <a href={brand?.youtube} target="_blank">
                        <img
                          className="h-6 w-6 rounded object-cover hover:scale-110"
                          src="/home/so/youtube.png"
                          alt="YouTube"
                        />
                      </a>
                    ) : (
                      <img
                        className="h-6 w-6 rounded object-cover hover:scale-110"
                        src="/home/so/youtube.png"
                        alt="YouTube"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : galactive == "del" ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h2 className="text-2xl text-center">Order Your Favourite Food</h2>
            <p className="text-center">
              Order from Our Unique Brands on Your Favorite Delivery Apps
            </p>
            <div className="mt-4 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full">
              {data.brands.map((brand) => {
                if (
                  brand.name.toUpperCase() === "ETOUCH" ||
                  brand.name.toUpperCase() === "TEKSOFT"
                ) {
                  return null; // Skip rendering this brand
                } else {
                  return (
                    <div
                      key={brand.id}
                      className="bg-white border border-yellow-300 rounded-lg shadow-sm hover:shadow-md hover:border-[#e23130] transition-shadow duration-200 p-6 flex flex-col items-center"
                    >
                      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center capitalize">
                        {brand.name}
                      </h2>
                      <div className="flex space-x-4 text-2xl text-gray-600">
                        {brand.own_delivery_icon ? (
                          brand.own_delivery ? (
                            <a href={brand?.own_delivery}>
                              <img
                                className="h-8 w-8 rounded object-cover"
                                src={pb.files.getURL(
                                  brand,
                                  brand.own_delivery_icon
                                )}
                                alt="swiggy"
                              />
                            </a>
                          ) : (
                            <img
                              className="h-8 w-8 rounded object-cover"
                              src={pb.files.getURL(
                                brand,
                                brand.own_delivery_icon
                              )}
                              alt="swiggy"
                            />
                          )
                        ) : (
                          <></>
                        )}

                        {brand.swiggy ? (
                          <a href={brand?.swiggy} target="_blank">
                            <img
                              className="h-8 w-8 rounded object-cover"
                              src="/home/dp/swiggy.jpg"
                              alt="swiggy"
                            />
                          </a>
                        ) : (
                          <img
                            className="h-8 w-8 rounded object-cover"
                            src="/home/dp/swiggy.jpg"
                            alt="swiggy"
                          />
                        )}

                        {brand.zomato ? (
                          <a href={brand?.zomato} target="_blank">
                            <img
                              className="h-8 w-8 rounded object-cover"
                              src="/home/dp/zomato.jpg"
                              alt="zomato"
                            />
                          </a>
                        ) : (
                          <img
                            className="h-8 w-8 rounded object-cover"
                            src="/home/dp/zomato.jpg"
                            alt="zomato"
                          />
                        )}

                        {brand.dunzo ? (
                          <a href={brand?.dunzo} target="_blank">
                            <img
                              className="h-8 w-8 rounded object-cover"
                              src="/home/dp/dunzo.jpg"
                              alt="dunzo"
                            />
                          </a>
                        ) : (
                          <img
                            className="h-8 w-8 rounded object-cover"
                            src="/home/dp/dunzo.jpg"
                            alt="dunzo"
                          />
                        )}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
