"use client";
import React, { useEffect, useState } from "react";
import pb from "../../_lib/pb";
import ShareHolding from "../shareholder/page";

const CorporateGov = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await pb
          .collection("corporate_governance")
          .getFullList(200, {
            requestKey: null,
          });
        setData(res);
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
      <div className="h-dvh flex justify-center items-center bg-orange-50">
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
    <div>
      <div className="px-4 bg-orange-50">
        <div className="text-lg lg:text-2xl text-[#223972] mt-3 font-semibold text-center">
          <span className="border-b-2 border-gray-300 pb-1">
            Corporate Governance
          </span>
        </div>
      </div>
      <div className="overflow-x-auto p-4">
        {/* Introduction Paragraph */}
        <p className="text-gray-800 mb-6">{data[0] && data[0].description1}</p>

        {/* Key Governance Principles */}
        <div className="mb-6">
          <h2 className="text-md lg:text-2xl font-semibold text-blue-900 mb-4">
            Key Governance Principles:
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {data[0] &&
              data[0].principles.map((principle, index) => (
                <li key={index}>{principle}</li>
              ))}
          </ul>
        </div>

        {/* Concluding Statement */}
        <p className="text-gray-800">{data[0] && data[0].description2}</p>
      </div>
      <ShareHolding title={"Corporate Governance"} alignTitle="text-left" />
    </div>
  );
};

export default CorporateGov;
