"use client";

import React, { useEffect, useRef, useState } from "react";
import NavBar from "@/components/shared/NavBar";
import Footer from "../../footer/page";
import dynamic from "next/dynamic"; // ⬅️ add this
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import pb from "../../_lib/pb";

// Dynamically import Slider so it only runs on the client
const Slider = dynamic(() => import("react-slick"), { ssr: false });
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const GalleryImage = ({ imageId }) => {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 8; // adjust as needed

  const [imgFade, setImgFade] = useState(false);
  const [imgOpen, setImgOpen] = useState("");

  const [videoOpen, setVideoOpen] = useState("");
  const [videoFade, setVideoFade] = useState(false);
  const sliderRef = useRef(null);

  // Trigger fade when image modal opens
  useEffect(() => {
    if (imgOpen) {
      setImgFade(true);
    } else {
      setImgFade(false);
    }
  }, [imgOpen]);

  const [data, setData] = useState({
    banners: [],
    brands: [],
    images: [],
    videos: [],
  });

  const handlePrev = (e) => {
    e.stopPropagation();
    if (data.images.length === 0) return;

    const newIndex =
      currentIndex === 0 ? data.images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setImgOpen(
      `${pb.files.getURL(
        data.images[newIndex],
        data.images[newIndex].image
      )}?thumb=1024x0`
    );
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (data.images.length === 0) return;

    const newIndex =
      currentIndex === data.images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setImgOpen(
      `${pb.files.getURL(
        data.images[newIndex],
        data.images[newIndex].image
      )}?thumb=1024x0`
    );
  };

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

  // Auto-scroll to the image if imageId is present
  useEffect(() => {
    if (!loading && imageId && data.images.length > 0) {
      const el = document.getElementById(imageId);
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
  }, [loading, imageId, data.images]);

  const totalPages = Math.ceil(data.images.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentImages = data.images.slice(startIndex, endIndex);

  const handleGalleryNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleGalleryPrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const [object, setObject] = useState({});

  useEffect(() => {
    if (!data?.images || !imageId) return;

    const foundObj = data.images.find((img) => img.id === imageId);
    const index = data.images.findIndex((img) => img.id === imageId);

    if (foundObj) setObject(foundObj);
    if (index !== -1) setCurrentIndex(index);
  }, [data, imageId]);

  useEffect(() => {
    if (object?.image) {
      const imageUrl = `${pb.files.getURL(object, object.image)}?thumb=1024x0`;
      setImgOpen(imageUrl);
    }
  }, [object, imageId]);

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
          <a
            className={
              galactive == "vid"
                ? "bg-[#152768] text-white px-3 py-2 rounded cursor-pointer"
                : "hover:bg-[#152768] hover:text-white px-3 py-2 rounded border border-[#152768] cursor-pointer"
            }
            href="/gallery/videos"
          >
            Videos
          </a>
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
          // <>
          //   <div className="hidden lg:flex">
          //     {/* Prev Button */}
          //     <button onClick={handleGalleryPrev}>
          //       <ChevronLeft
          //         size={64}
          //         className={`text-black rounded-r-lg ${
          //           currentPage < 2 ? "opacity-50" : "cursor-pointer"
          //         }`}
          //       />
          //     </button>
          //     <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          //       {!data?.images || data.images.length === 0 ? (
          //         <p>Loading images...</p>
          //       ) : (
          //         <>
          //           {currentImages.map((image) => (
          //             <div
          //               key={image.id}
          //               id={image.id}
          //               className="flex items-center justify-center"
          //             >
          //               <img
          //                 src={pb.files.getURL(image, image.image)}
          //                 className={`object-cover w-64 h-64 hover:cursor-pointer ${
          //                   imageId === image.id ? "" : "hover:scale-102"
          //                 }`}
          //                 alt="preview"
          //                 onClick={(e) => {
          //                   e.stopPropagation();
          //                   setCurrentIndex(
          //                     data.images.findIndex(
          //                       (img) => img.id === image.id
          //                     )
          //                   );
          //                   setImgOpen(
          //                     `${pb.files.getURL(
          //                       image,
          //                       image.image
          //                     )}?thumb=1024x0`
          //                   );
          //                 }}
          //               />
          //             </div>
          //           ))}

          //           {/* Fill empty slots if fewer than 8 images */}
          //           {Array.from({ length: 8 - currentImages.length }).map(
          //             (_, i) => (
          //               <div
          //                 key={i}
          //                 className="flex items-center justify-center"
          //               >
          //                 <div className={`object-cover w-64 h-64`}></div>
          //               </div>
          //             )
          //           )}
          //         </>
          //       )}
          //     </div>
          //     {/* Next Button */}
          //     <button onClick={handleGalleryNext}>
          //       <ChevronRight
          //         size={64}
          //         className={`text-black rounded-r-lg ${
          //           currentPage >= totalPages ? "opacity-50" : "cursor-pointer"
          //         }`}
          //       />
          //     </button>
          //   </div>
          //   <div className="flex lg:hidden items-center justify-center w-full gap-2 mt-6">
          //     {/* Prev Button */}
          //     <button onClick={() => sliderRef?.current?.slickPrev()}>
          //       <ChevronLeft
          //         size={48}
          //         className="text-black hover:scale-110 transition-transform cursor-pointer"
          //       />
          //     </button>

          //     {/* Slider */}
          //     <div className="w-[90%]">
          //       {!data?.images || data.images.length === 0 ? (
          //         <p className="text-center">Loading images...</p>
          //       ) : (
          //         <Slider {...sliderSettings}>
          //           {data.images.map((image) => (
          //             <div
          //               key={image.id}
          //               id={image.id}
          //               className="flex items-center justify-center px-2"
          //             >
          //               <img
          //                 src={pb.files.getURL(image, image.image)}
          //                 alt="preview"
          //                 className={`object-cover w-64 h-64 rounded-xl transition-transform duration-300 ${
          //                   imageId === image.id
          //                     ? "scale-100"
          //                     : "hover:scale-105"
          //                 }`}
          //                 onClick={(e) => {
          //                   e.stopPropagation();
          //                   setCurrentIndex(
          //                     data.images.findIndex(
          //                       (img) => img.id === image.id
          //                     )
          //                   );
          //                   setImgOpen(
          //                     `${pb.files.getURL(
          //                       image,
          //                       image.image
          //                     )}?thumb=1024x0`
          //                   );
          //                 }}
          //               />
          //             </div>
          //           ))}
          //         </Slider>
          //       )}
          //     </div>

          //     {/* Next Button */}
          //     <button onClick={() => sliderRef?.current?.slickNext()}>
          //       <ChevronRight
          //         size={48}
          //         className="text-black hover:scale-110 transition-transform cursor-pointer"
          //       />
          //     </button>
          //   </div>
          // </>
          <div>
            {/* ✅ Desktop & Laptop View (Grid, visible from md and up) */}
            <div className="hidden lg:flex">
              {/* Prev Button */}
              <button onClick={handleGalleryPrev}>
                <ChevronLeft
                  size={64}
                  className={`text-black rounded-r-lg ${
                    currentPage < 2 ? "opacity-50" : "cursor-pointer"
                  }`}
                />
              </button>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {!data?.images || data.images.length === 0 ? (
                  <p>Loading images...</p>
                ) : (
                  <>
                    {currentImages.map((image) => (
                      <div
                        key={image.id}
                        id={image.id}
                        className="flex items-center justify-center"
                      >
                        <img
                          src={pb.files.getURL(image, image.image)}
                          className={`object-cover w-64 h-64 hover:cursor-pointer ${
                            imageId === image.id ? "" : "hover:scale-102"
                          }`}
                          alt="preview"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentIndex(
                              data.images.findIndex(
                                (img) => img.id === image.id
                              )
                            );
                            setImgOpen(
                              `${pb.files.getURL(
                                image,
                                image.image
                              )}?thumb=1024x0`
                            );
                          }}
                        />
                      </div>
                    ))}

                    {/* Fill empty slots if fewer than 8 images */}
                    {Array.from({ length: 8 - currentImages.length }).map(
                      (_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-center"
                        >
                          <div className="object-cover w-64 h-64"></div>
                        </div>
                      )
                    )}
                  </>
                )}
              </div>

              {/* Next Button */}
              <button onClick={handleGalleryNext}>
                <ChevronRight
                  size={64}
                  className={`text-black rounded-r-lg ${
                    currentPage >= totalPages ? "opacity-50" : "cursor-pointer"
                  }`}
                />
              </button>
            </div>

            {/* ✅ Mobile & Tablet View (Slider, visible below md) */}
            <div className="flex lg:hidden items-center justify-center mt-6">
              {/* Prev Button */}
              <button onClick={() => current?.slickPrev()}>
                <ChevronLeft
                  size={48}
                  className="text-black hover:scale-110 transition-transform cursor-pointer"
                />
              </button>

              {/* Slider */}
              <div className="w-[85%]">
                {!data?.images || data.images.length === 0 ? (
                  <p className="text-center">Loading images...</p>
                ) : (
                  <Slider {...sliderSettings}>
                    {data.images.map((image) => (
                      <div
                        key={image.id}
                        id={image.id}
                        className="flex items-center justify-center px-"
                      >
                        <img
                          src={pb.files.getURL(image, image.image)}
                          alt="preview"
                          className={`object-cover w-80 h-64 rounded-xl transition-transform duration-300 ${
                            imageId === image.id
                              ? "scale-100"
                              : "hover:scale-105"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentIndex(
                              data.images.findIndex(
                                (img) => img.id === image.id
                              )
                            );
                            setImgOpen(
                              `${pb.files.getURL(
                                image,
                                image.image
                              )}?thumb=1024x0`
                            );
                          }}
                        />
                      </div>
                    ))}
                  </Slider>
                )}
              </div>

              {/* Next Button */}
              <button onClick={() => sliderRef?.current?.slickNext()}>
                <ChevronRight
                  size={48}
                  className="text-black hover:scale-110 transition-transform cursor-pointer"
                />
              </button>
            </div>
          </div>
        ) : galactive == "vid" ? (
          <>
            <div className="mt-4 max-w-7xl">
              {data.videos && data.videos.length > 0 ? (
                <Slider {...sliderSettings}>
                  {data.videos.map((video) => (
                    <div key={video.id} className="px-2">
                      <video
                        className="w-full h-64 object-cover rounded-md"
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
            <h2 className="text-2xl text-center">Follow Our brands</h2>
            <p className="text-center">
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
                      className="bg-white border border-yellow-300 rounded-lg shadow-sm hover:shadow-md hover:border-[#e23130]  transition-shadow duration-200 p-6 flex flex-col items-center"
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
      {imgOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black transition-opacity duration-100 ${
            imgFade ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setImgOpen("")}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative flex items-center justify-center rounded w-[80dvw] md:w-[85dvw] md:h-[90dvh] transform transition-transform duration-100 ${
              imgFade ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
            }`}
          >
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-white px-3 py-2 rounded-r-lg cursor-pointer"
            >
              <ChevronLeft size={64} />
            </button>

            {/* Image */}
            <img
              src={imgOpen}
              alt="preview"
              className="w-full h-full object-contain"
            />

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white px-3 py-2 rounded-l-lg cursor-pointer"
            >
              <ChevronRight size={64} />
            </button>

            {/* Close Button */}
            <button
              onClick={() => setImgOpen("")}
              className="absolute top-0 right-8 p-1 rounded-bl-xl bg-red-600 text-white cursor-pointer"
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

export default GalleryImage;
