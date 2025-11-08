import { notFound } from "next/navigation";

import NavBar from "@/components/shared/NavBar";
import Footer from "../../footer/page";
import BrandsNav from "../../_components/BrandsNav";
import pb from "../../_lib/pb";
import BrandDescription from "../../_components/BrandDescription";

export default async function BrandDetail({ params }) {
  const { name } = params;

  try {
    const [brandsRes, brandRes] = await Promise.all([
      pb
        .collection("brands")
        .getFullList(200, { sort: "sno", requestKey: null }),
      pb
        .collection("brands")
        .getFirstListItem(`name="${name.replaceAll("-", " ")}"`),
    ]);

    return (
      <div>
        <NavBar />
        {/* Brands Nav (Client Component for scroll + highlight) */}
        <BrandsNav brands={brandsRes} activeName={name} />
        <div>
          {/* brand banner */}
          <section className="mx-auto py-4 mb-4">
            <img
              className="w-full"
              src={pb.files.getURL(brandRes, brandRes.banner1)}
              alt={brandRes.name}
            />
          </section>
          {/* brand about */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex gap-8 items-center">
            <div className="lg:w-1/3">
              <img
                src={pb.files.getURL(brandRes, brandRes.logo)}
                alt={brandRes.name}
              />
            </div>
            <div className="lg:w-2/3 text-justify">
              <div className="text-2xl font-bold mb-2">
                {brandRes.aboutTitle}
              </div>
              {brandRes.aboutDescription}

              {brandRes.name.toUpperCase() == "ETOUCH" ? (
                <a
                  target="_blank"
                  href="/brands/eTouch/etouch.pdf"
                  className="text-[#d13b2a]"
                >
                  {" "}
                  ...more
                </a>
              ) : (
                <></>
              )}
            </div>
          </section>

          {/* brand delight */}
          <section className="mx-auto pt-4 pb-2 mb-2">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {brandRes.title2}
              {/* <span className="text-[#d13b2a]">
                {active == "etouch"
                  ? "Connecting Customers with Their Favorite Restaurants."
                  : active == "teksoft"
                  ? "Connecting Clients with Exceptional Talent for Lasting Business Success "
                  : "Your destination for unforgettable Dining, Drinks & Dancing"}
              </span>{" "}
              Every time. */}
            </h2>
            <img
              className="w-full"
              src={pb.files.getURL(brandRes, brandRes.banner2)}
              alt={brandRes.name}
            />
          </section>
          {/* delight webslit link */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:gap-2 items-center justify-center border-y border-black">
            <p>For more information,</p>
            <a
              target="_blank"
              href={brandRes.websiteLink}
              className="text-center text-[#152768] font-bold"
            >
              click here
            </a>
            <p>to visit our website</p>
          </div>

          {/* what is brands */}
          <section className="mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-4">
            <div className="flex items-baseline justify-center">
              <h2 className="text-2xl font-bold mb-4 text-center">
                {brandRes.title3}
              </h2>
              {brandRes.name.toUpperCase() == "ETOUCH" ? (
                <a
                  target="_blank"
                  href="/brands/eTouch/etouch.pdf"
                  className="bg-amber-500 font-bold rounded p-1 text-sm ml-2"
                >
                  More Info
                </a>
              ) : (
                <></>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <BrandDescription
                image={pb.files.getURL(brandRes, brandRes.subImg1)}
                title={brandRes.subTitle1}
                description={brandRes.subDescription1}
              />
              <BrandDescription
                image={pb.files.getURL(brandRes, brandRes.subImg2)}
                title={brandRes.subTitle2}
                description={brandRes.subDescription2}
              />
              <BrandDescription
                image={pb.files.getURL(brandRes, brandRes.subImg3)}
                title={brandRes.subTitle3}
                description={brandRes.subDescription3}
              />
            </div>
          </section>
          {/* brand footer */}
          <section className="mx-auto pt-4">
            <img
              className="w-full"
              src={pb.files.getURL(brandRes, brandRes?.banner3)}
              alt={brandRes.name}
            />
          </section>
          {/* you can render brand details here */}
        </div>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    notFound();
  }
}
