"use client";
import React, { useEffect, useState } from "react";
import pb from "../../_lib/pb";

const Disclosures = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await pb.collection("disclosures").getFullList(200, {
          sort: "sno",
        });
        setData(res);
      } catch (err) {
        console.error(err);
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
    <div className="lg:p-4">
      {/* <div className="text-md lg:text-2xl font-semibold text-center text-[#223972] mb-4">
        <span className="border-b-2 border-gray-300 pb-1">
          Disclosures under Regulation 46
        </span>
      </div> */}

      <div className="text-sm md:text-md">
        <table className="min-w-full border border-gray-300 table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">S.No</th>
              <th className="px-4 py-2 border text-lg">
                Disclosures under Regulation 46
              </th>
              <th className="px-8 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((disclosure) => {
              if (disclosure.items?.length > 0) {
                return (
                  <React.Fragment key={disclosure.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="py-1 px-3 border font-normal">
                        {disclosure.sno}.
                      </td>
                      <td className="py-1 px-3 border font-normal">
                        {disclosure.title}
                      </td>
                      <td className="py-1 px-3 border font-normal"></td>
                    </tr>
                    {disclosure.items.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="py-1 px-3 border"></td>
                        <td className="py-1 px-3 border pl-6">
                          <li>{item.title}</li>
                        </td>

                        <td className="py-1 px-3 border">
                          {item.type && (
                            <a
                              href={
                                item.type === "link"
                                  ? item.link
                                  : item.type === "pdf"
                                  ? pb.files.getURL(item, item.pdf)
                                  : item.type === "na"
                                  ? "/not-applicable"
                                  : "#"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block bg-[#152768] text-white text-sm text-center px-2 py-2 rounded"
                            >
                              Click Here
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              }
              return (
                <tr key={disclosure.id} className="hover:bg-gray-50">
                  <td className="py-1 px-3 border font-normal">
                    {disclosure.sno}.
                  </td>
                  <td className="py-1 px-3 border font-normal">
                    {disclosure.title}
                  </td>
                  <td className="py-1 px-3 border font-normal">
                    {disclosure.type && (
                      <a
                        href={
                          disclosure.type === "link"
                            ? disclosure.link
                            : disclosure.type === "pdf"
                            ? pb.files.getURL(disclosure, disclosure.pdf)
                            : disclosure.type === "na"
                            ? "/not-applicable"
                            : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-[#152768] text-white text-sm text-center px-2 py-2 rounded"
                      >
                        {disclosure.type === "link" || disclosure.type === "pdf"
                          ? "Click Here"
                          : "N/A"}
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Disclosures;
