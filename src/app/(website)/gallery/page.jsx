"use client";
import NavBar from "@/components/shared/NavBar";
import React, { useEffect, useState } from "react";
import Footer from "../footer/page";
import pb from "../_lib/pb";
import { ArrowRight } from "lucide-react";

const Gallery = () => {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    banners: [],
    brands: [],
    images: [],
    videos: [],
  });

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

  const [galactive, setGalactive] = useState("img");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, brandsRes, imagesRes, videosRes] = await Promise.all(
          [
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
        <div className="h-dvh w-dvw flex justify-center items-center bg-white">
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
    <>
      <NavBar />
      <div className="mt-16 max-w-7xl mx-auto">
        <img src={data.banners[0]} alt="" />
      </div>
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
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.images && data.images.length > 0 ? (
                data.images.map((image) => (
                  <a href="/gallery/images" key={image.id}>
                    <div className="flex items-center justify-center border border-gray-300 rounded-2xl">
                      <img
                        className="object-cover w-full h-64"
                        src={pb.files.getURL(image, image.image)}
                        alt={image.name || "Brand"}
                      />
                    </div>
                  </a>
                ))
              ) : (
                <p>Loading images...</p>
              )}
            </div>
          </>
        ) : galactive == "vid" ? (
          <>
            <div className="max-w-7xl mt-4">
              {data.videos && data.videos.length > 0 ? (
                <Slider {...sliderSettings}>
                  {data.videos.map((video) => (
                    <a href="/gallery/videos" key={video.id}>
                      <div key={video.id} className="px-2">
                        <video
                          className="w-full h-64 object-cover rounded-md"
                          crossOrigin="anonymous"
                        >
                          <source
                            src={pb.files.getURL(video, video.video)}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </a>
                  ))}
                </Slider>
              ) : (
                <p>Loading videos...</p>
              )}
            </div>
          </>
        ) : galactive == "soc" ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h2 className="text-2xl text-center">Follow Our brands</h2>
            <p className="text-center my-4">
              Explore all of our unique brands across your favourite platform
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
            <div className="mt-8 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full">
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
      <Footer />
    </>
  );
};

export default Gallery;
