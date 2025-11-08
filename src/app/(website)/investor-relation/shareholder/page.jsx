"use client";
import React, { useEffect, useState } from "react";
import pb from "../../_lib/pb";

const ShareHolding = ({ title, alignTitle = "text-center" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await pb.collection("share_holding").getFullList(200, {
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
    <div className="bg-orange-50">
      <div className="px-4 bg-orange-50">
        <h2
          className={`text-md lg:text-2xl text-[#223972] mt-3 font-semibold ${alignTitle} `}
        >
          {title ? title : "Shareholding Pattern"}
        </h2>
      </div>
      <div className="overflow-x-auto p-4">
        <table className="min-w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-center">
              <th className="w-1/5 px-4 py-2 font-medium border-4">Year</th>
              <th className="w-1/5 px-4 py-2 font-medium border-4">Q1</th>
              <th className="w-1/5 px-4 py-2 font-medium border-4">Q2</th>
              <th className="w-1/5 px-4 py-2 font-medium border-4">Q3</th>
              <th className="w-1/5 px-4 py-2 font-medium border-4">Q4</th>
            </tr>
          </thead>
          <tbody>
            {data.map((report) => (
              <tr className="text-slate-800" key={report.id}>
                <td className="px-4 py-2  font-semibold text-[#152768] text-center border-2">
                  {report.title}
                </td>
                <td className="px-4 py-2 text-center border-2">
                  <a
                    target="_blank"
                    onClick={() => {
                      setOpen(report.q1);
                    }}
                    className={`${
                      open === report.q1 ? "font-medium text-[#223972]" : "text-red-500"
                    }`}
                    href={pb.files.getURL(report, report.q1)}
                  >
                    {pb.files.getURL(report, report.q1)
                      ? `30.06.${report.title.split("-")[0]}`
                      : "-"}
                  </a>
                </td>
                <td className="px-4 py-2 text-center border-2">
                  <a
                    target="_blank"
                    onClick={() => {
                      setOpen(report.q2);
                    }}
                    className={`${
                      open === report.q2 ? "font-medium text-[#223972]" : "text-red-500"
                    }`}
                    href={pb.files.getURL(report, report.q2)}
                  >
                    {pb.files.getURL(report, report.q2)
                      ? `30.09.${report.title.split("-")[0]}`
                      : "-"}
                  </a>
                </td>
                <td className="px-4 py-2 text-center border-2">
                  <a
                    target="_blank"
                    onClick={() => {
                      setOpen(report.q3);
                    }}
                    className={`${
                      open === report.q3 ? "font-medium text-[#223972]" : "text-red-500"
                    }`}
                    href={pb.files.getURL(report, report.q3)}
                  >
                    {pb.files.getURL(report, report.q3)
                      ? `31.12.${report.title.split("-")[0]}`
                      : "-"}
                  </a>
                </td>
                <td className="px-4 py-2 text-center border-2">
                  <a
                    target="_blank"
                    onClick={() => {
                      setOpen(report.q4);
                    }}
                    className={`${
                      open === report.q4 ? "font-medium text-[#223972]" : "text-red-500"
                    }`}
                    href={pb.files.getURL(report, report.q4)}
                  >
                    {pb.files.getURL(report, report.q4)
                      ? `31.03.${Number(report.title.split("-")[0]) + 1}`
                      : "-"}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShareHolding;
