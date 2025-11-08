"use client";
import React, { useEffect, useState } from "react";
import pb from "../../_lib/pb";
import { FileText } from "lucide-react";

const Annual = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await pb.collection("annual_reports").getFullList(200, {
          sort: "sno",
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
    <div className="flex flex-col items-center px-4">
      {/* Title */}
      <div className="text-md lg:text-2xl text-[#223972] mt-3 font-semibold text-center">
        <span className="border-b-2 border-gray-300 pb-1">Annual Reports</span>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6 w-full max-w-5xl">
        {data.map((report) => (
          <a
            key={report.id}
            href={pb.files.getURL(report, report.file)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={()=>{setOpen(report.id)}}
            className={`flex items-center gap-3 bg-white shadow-sm border rounded-xl p-4 transition ${
                open === report.id
                  ? "border-red-500 hover:shadow-md"
                  : "border-[#223972] hover:border-[#223972] hover:shadow-md"
              }`}
          >
            <FileText className="w-6 h-6 text-[#223972]" />
            <span className="text-gray-700 font-medium text-[15px]">
              {report.title}
            </span>
          </a>
        ))}
      </div>

      {/* View More Button */}
      <a
        href="#"
        className="mt-8 inline-block px-6 py-2 bg-[#223972] text-white rounded-full hover:bg-[#1a2a63] transition"
      >
        View More
      </a>
    </div>
  );
};

export default Annual;
