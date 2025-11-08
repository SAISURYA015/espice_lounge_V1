// "use client";

// import NavBar from "@/components/shared/NavBar";
// import Footer from "../../footer/page";

// const annualReturns = [
//   {
//     label: "SAGL RESULTS 31032025",
//     link: "/docs/code-of-conduct-board.pdf",
//   },
//   {
//     label: "Notice of Extra Ordinary General Meeting 2024-25",
//     link: "/docs/insider-trading-2015.pdf",
//   },
//   {
//     label: "Notice of Extra Ordinary General Meeting 2023-24",
//     link: "/docs/related-party-policy.pdf",
//   },
//   {
//     label: "2020-21 (Q1) Compliance Certificate Reg24A",
//     link: "/docs/whistle-blower-policy.pdf",
//   },
// ];

// const SecretarialCompliance = () => {
//   return (
//     <div className="w-full">
//       <NavBar />
//       {/* 🔹 Reports Section (Table Format) */}
//       <div className="max-w-7xl mx-auto py-30 px-4">
//         <h2 className="text-xl sm:text-xl p-2 text-white font-semibold mb-6 text-left bg-blue-600">
//           Secretarial Compliance Report
//         </h2>

//         <div className="overflow-x-auto shadow-md rounded-lg">
//           <table className="w-full border-collapse">
//             <tbody>
//               {annualReturns.map((report, index) => (
//                 <tr key={index} className="hover:bg-gray-50 transition">
//                   {/* <td className="py-3 px-4 border-b text-sm text-gray-600">
//                     {index + 1}
//                   </td> */}
//                   <td className="py-3 px-4 border-b text-sm text-gray-800">
//                     {report.label}
//                   </td>
//                   <td className="py-3 px-4 border-b text-center">
//                     <a
//                       href={report.link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-block text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md transition"
//                     >
//                       Download
//                     </a>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default SecretarialCompliance;

"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import pb from "../../_lib/pb";

const SecretarialCompliance = () => {
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
            filter: 'page = "secretarial"',
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
      <div className="h-screen w-full flex justify-center items-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-4 border-t-blue-700 rounded-full animate-spin"></div>
      </div>
    );

  const isActive =
    pathname === "/disclosure-files/secretarial-compliance-report";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isActive && policiesInfo.length > 0 && (
        <>
          <header className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#223972] border-b-2 border-gray-300 pb-2 inline-block">
              Secretarial Compliance Report
            </h2>
          </header>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {policiesInfo.map((info) => {
              const fileUrl = pb.files.getURL(info, info.file);
              return (
                <div key={info.id} className="text-red-600 font-medium">
                  {info.title} –{" "}
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-red-800"
                  >
                    Click Here
                  </a>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};

export default SecretarialCompliance;
