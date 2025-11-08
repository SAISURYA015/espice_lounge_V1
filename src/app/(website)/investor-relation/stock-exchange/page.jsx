"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import pb from "../../_lib/pb";
import { ChevronDown, ChevronUp } from "lucide-react";

const StockExchange = () => {
  const [loading, setLoading] = useState(true);
  const [meetingsInfo, setMeetingsInfo] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meetingsInfoRes = await pb
          .collection("stock_exchange")
          .getFullList(200, {
            sort: "sno",
            requestKey: null,
          });
        setMeetingsInfo(meetingsInfoRes);
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
      <div className="h-screen w-full flex justify-center items-center bg-orange-50">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-4 border-t-blue-700 rounded-full animate-spin"></div>
      </div>
    );

  const isActive = pathname === "/investor-relation/stock-exchange";

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const formatFileName = (file, sno) => {
    // remove leading serial number if it's in filename itself
    let name = file.replace(/^\d+_/, "");

    // remove hash like _4zou3xyxej.2024.pdf → keep only .2024.pdf
    name = name.replace(/_[a-z0-9]{6,}\.(\d{4})\.pdf$/i, ".$1.pdf");

    // remove .pdf
    name = name.replace(/\.pdf$/i, "");

    // replace underscores with spaces
    name = name.replace(/_/g, " ");

    // Title Case
    name = name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

    // convert "dated 3 5 2024" → "dated 3.5.2024"
    name = name.replace(/dated (\d+)\s+(\d+)\s+(\d{4})/i, "dated $1.$2.$3");

    // prepend sno if available
    if (sno) {
      name = `${sno}. ${name}`;
    }

    return name.trim();
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {isActive && meetingsInfo.length > 0 && (
        <>
          <header className="mb-8 text-center">
            <h2 className="text-md lg:text-2xl font-bold text-[#223972] border-b-2 border-gray-300 pb-2 inline-block">
              Stock Exchange Files
            </h2>
          </header>

          <div className="space-y-4">
            {meetingsInfo.map((info, index) => (
              <div
                key={info.id}
                className="border rounded-lg shadow-sm overflow-hidden"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-lg bg-white hover:bg-gray-50"
                >
                  <span>{info.title}</span>
                  {openIndex === index ? (
                    <ChevronUp className="text-gray-600" />
                  ) : (
                    <ChevronDown className="text-gray-600" />
                  )}
                </button>

                {/* Accordion Content */}
                {openIndex === index && (
                  <div className="bg-gray-50 px-4 py-3 space-y-2">
                    {Array.isArray(info.files) && info.files.length > 0 ? (
                      info.files.map((file, idx) => {
                        const fileUrl = pb.files.getURL(info, file);
                        const displayName = formatFileName(file);

                        return (
                          <div
                            key={idx}
                            className="flex justify-between items-center bg-white p-2 rounded-md border"
                          >
                            <p className="text-gray-800 text-sm sm:text-base">
                              {displayName}
                            </p>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 font-medium hover:text-red-800"
                            >
                              Download
                            </a>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No files available
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default StockExchange;
