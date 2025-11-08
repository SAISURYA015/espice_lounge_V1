"use client";

import NavBar from "@/components/shared/NavBar";
import Footer from "../../footer/page";
import { useEffect, useState } from "react";
import pb from "@/app/(admin)/_lib/pb";

const StockExchange = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await pb.collection("fin_subsidiary").getFullList(200, {
          requestKey: null,
        });

        // ✅ Expand each file into its own entry
        const mapped = res.flatMap((item) => {
          return (item.files || []).map((fileName) => {
            const fileUrl = pb.files.getUrl(item, fileName);

            // ✅ Clean filename: remove underscores + extension
            const cleanName = fileName
              .replace(/_/g, " ")
              .replace(/\.[^/.]+$/, ""); // remove extension

            return {
              year: item.title, // year from admin
              label: cleanName, // filename shown
              link: fileUrl,
            };
          });
        });

        // ✅ sort by year latest → oldest
        const sorted = mapped.sort((a, b) =>
          b.year.localeCompare(a.year, undefined, { numeric: true })
        );

        setData(sorted);

        // ✅ set latest year default
        if (sorted.length > 0) {
          setActiveYear(sorted[0].year);
        }
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
      <div className="h-full w-full flex justify-center items-center">
        <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-[#152768] rounded-full animate-spin"></div>
      </div>
    );

  // ✅ Get unique years dynamically
  const years = [...new Set(data.map((item) => item.year))];
  const filteredReports = data.filter((r) => r.year === activeYear);

  return (
    <div className="w-full">
      <NavBar />

      <div className="max-w-5xl mx-auto py-30 px-4">
        <h2 className="text-xl sm:text-xl p-2 text-white font-semibold mb-6 text-left bg-blue-600">
          Financials of Subsidiary Companies
        </h2>

        {/* 🔹 Tabs */}
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex space-x-6 overflow-x-auto">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`pb-2 text-sm sm:text-base font-medium border-b-2 transition ${
                  activeYear === year
                    ? "border-green-600 text-green-700"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* 🔹 Reports */}
        <div className="mt-6 space-y-4">
          {filteredReports.length ? (
            filteredReports.map((report, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-3"
              >
                {/* File Name */}
                <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                  {report.label}
                </p>

                {/* PDF Link */}
                <div className="flex items-center space-x-3">
                  <a
                    href={report.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No reports available for this year.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StockExchange;
