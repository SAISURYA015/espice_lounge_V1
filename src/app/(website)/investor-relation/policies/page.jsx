"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import pb from "../../_lib/pb";

const Policies = () => {
  const [loading, setLoading] = useState(true);
  const [policiesInfo, setPoliciesInfo] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const policiesInfoRes = await pb
          .collection("meetings_policies_stock_exchange_open_offer")
          .getFullList(200, {
            sort: "sno",
            filter: 'page = "policies"',
            requestKey: null,
          });

        setPoliciesInfo(policiesInfoRes);
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

  const isActive = pathname === "/investor-relation/policies";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {isActive && policiesInfo.length > 0 && (
        <>
          <header className="mb-8 text-center">
            <h2 className="text-md lg:text-2xl font-bold text-[#223972] border-b-2 border-gray-300 pb-2 inline-block">
              Policies
            </h2>
          </header>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <tbody>
                {policiesInfo.map((info) => {
                  const fileUrl = pb.files.getURL(info, info.file);
                  return (
                    <tr key={info.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3 border font-semibold text-[#223972]">
                        {info.title}
                      </td>
                      <td className="py-2 px-3 border text-center ">
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-red-600 hover:text-red-800"
                        >
                          Click Here
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};

export default Policies;
