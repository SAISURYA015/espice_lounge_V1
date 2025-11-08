"use client";

import React, { useEffect, useState } from "react";
import NavBar from "@/components/shared/NavBar";
import Footer from "../../footer/page";
import dynamic from "next/dynamic"; // ⬅️ add this
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import pb from "../../_lib/pb";

// Dynamically import Slider so it only runs on the client
const Slider = dynamic(() => import("react-slick"), { ssr: false });
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const VideosImage = ({ videoId }) => {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(null);

  const [videoOpen, setVideoOpen] = useState("");
  const [videoFade, setVideoFade] = useState(false);

  useEffect(() => setVideoFade(!!videoOpen), [videoOpen]);

  // Trigger fade when image modal opens
  useEffect(() => {
    if (videoOpen) {
      setVideoFade(true);
    } else {
      setVideoFade(false);
    }
  }, [videoOpen]);

  const [data, setData] = useState({
    banners: [],
    brands: [],
    videos: [],
  });

  const handlePrev = (e) => {
    e.stopPropagation();
    if (data.videos.length === 0) return;

    const newIndex =
      currentIndex === 0 ? data.videos.length - 1 : currentIndex - 1;

    setCurrentIndex(newIndex);
    setVideoOpen(
      pb.files.getURL(data.videos[newIndex], data.videos[newIndex].video)
    );
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (data.videos.length === 0) return;

    const newIndex =
      currentIndex === data.videos.length - 1 ? 0 : currentIndex + 1;

    setCurrentIndex(newIndex);
    setVideoOpen(
      pb.files.getURL(data.videos[newIndex], data.videos[newIndex].video)
    );
  };

  const sliderSettings = {
    autoplay: true,
    dots: false,
    infinite: true,
    autoplaySpeed: 2500,
    speed: 1000,
    slidesToShow: 5, // Default for desktop
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const [galactive, setGalactive] = useState("vid");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, brandsRes, videosRes] = await Promise.all([
          pb.collection("banners").getFullList(200, {
            sort: "sno",
            filter: 'page = "gallery"',
            requestKey: null,
          }),
          pb
            .collection("brands")
            .getFullList(200, { sort: "sno", requestKey: null }),
          pb.collection("gallery").getFullList(200, {
            sort: "sno",
            filter: 'type = "video"',
            requestKey: null,
          }),
        ]);

        setData({
          banners: bannersRes.map((item) => pb.files.getURL(item, item.image)),
          brands: brandsRes,
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

  // Auto-scroll to the image if imageId is present
  useEffect(() => {
    if (!loading && videoId && data.videos.length > 0) {
      const el = document.getElementById(videoId);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        // Optional: briefly highlight the image for visual cue
        el.classList.add("ring-4", "ring-[#d13b2a]", "ring-offset-2");
        // setTimeout(() => {
        //   el.classList.remove("ring-4", "ring-[#d13b2a]", "ring-offset-2");
        // }, 2000);
      }
    }
  }, [loading, videoId, data.videos]);

   const [object, setObject] = useState({});

   useEffect(() => {
     if (!data?.videos || !videoId) return;

     const foundObj = data.videos.find((img) => img.id === videoId);
     const index = data.videos.findIndex((img) => img.id === videoId);

     if (foundObj) setObject(foundObj);
     if (index !== -1) setCurrentIndex(index);
   }, [data, videoId]);

   useEffect(() => {
     if (object?.video) {
       const videoUrl = `${pb.files.getURL(object, object.video)}?thumb=1024x0`;
       setVideoOpen(videoUrl);
     }
   }, [object, videoId]);


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
      {/* <div className="mt-16 max-w-7xl mx-auto mb-4">
        <img className="w-full" src={data.banners[0]} alt={data.banners.page} />
      </div> */}
      {/* Gallery */}
      <div className="mt-16 pt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <h2 className="text-[#152768] text-2xl font-bold text-center">
          GALLERY
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
          <a
            className={
              galactive == "img"
                ? "bg-[#152768] text-white px-3 py-2 rounded cursor-pointer"
                : "hover:bg-[#152768] hover:text-white px-3 py-2 rounded border border-[#152768] cursor-pointer"
            }
            href="/gallery/images"
          >
            Images
          </a>
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
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.images && data.images.length > 0 ? (
                data.images.map((image) => (
                  <div
                    key={image.id}
                    className="flex items-center justify-center border border-gray-300 rounded-2xl"
                  >
                    <img
                      src={pb.files.getURL(image, image.image)}
                      className="object-cover w-full h-64"
                      alt="preview"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(
                          data.images.findIndex((img) => img.id === image.id)
                        );
                        setImgOpen(
                          `${pb.files.getURL(image, image.image)}?thumb=1024x0`
                        );
                      }}
                    />
                  </div>
                ))
              ) : (
                <p>Loading images...</p>
              )}
            </div>
          </>
        ) : galactive == "vid" ? (
          <>
            <div className="mt-6 max-w-7xl">
              {data.videos && data.videos.length > 0 ? (
                <Slider {...sliderSettings}>
                  {data.videos.map((video) => (
                    <div key={video.id} id={video.id}>
                      <video
                        className="w-full h-64 object-cover rounded-md hover:scale-102 hover:cursor-pointer"
                        crossOrigin="anonymous"
                        onClick={(e) => {
                          e.stopPropagation();
                          setVideoOpen(pb.files.getURL(video, video.video));
                        }}
                      >
                        <source
                          src={pb.files.getURL(video, video.video)}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
                </Slider>
              ) : (
                <p>Loading videos...</p>
              )}
            </div>
          </>
        ) : galactive == "soc" ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h2 className="text-2xl text-center">Follow Our Brands</h2>
            <p className="text-center mb-4">
              Explore All of Our Unique Brands Across your Favourite Platform
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
              {data.brands.map((brand) => (
                <div
                  key={brand.id}
                  className="bg-white border border-yellow-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 flex flex-col items-center"
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
                      className="bg-white border border-yellow-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 flex flex-col items-center"
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

      {/* Preview */}
      {videoOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black transition-opacity duration-100 ${
            videoFade ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setVideoOpen("")}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative flex items-center justify-center rounded w-[80dvw] md:w-[85dvw] md:h-[90dvh] transform transition-transform duration-100 ${
              videoFade
                ? "translate-y-0 opacity-100"
                : "-translate-y-5 opacity-0"
            }`}
            // className={`relative rounded w-[80dvw] md:w-auto md:h-[70dvh] transform transition-transform duration-100 ${
            //   videoFade
            //     ? "translate-y-0 opacity-100"
            //     : "-translate-y-5 opacity-0"
            // }`}
          >
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-white px-3 py-2 rounded-r-lg cursor-pointer"
            >
              <ChevronLeft size={64} />
            </button>

            <video
              src={videoOpen}
              controls
              className="w-full h-full object-contain"
            />

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white px-3 py-2 rounded-l-lg cursor-pointer"
            >
              <ChevronRight size={64} />
            </button>

            <button
              onClick={() => setVideoOpen("")}
              className="absolute top-0 right-8 p-1 rounded-bl-xl bg-red-600 text-white"
            >
              <X />
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default VideosImage;
