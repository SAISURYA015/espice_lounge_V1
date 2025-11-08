"use client";
import React, { useEffect, useState } from "react";
import pb from "../../_lib/pb";

const Corporate = () => {
  const [data, setData] = useState({
    address: [],
    leaders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [addressRes, leadersRes] = await Promise.all([
          pb
            .collection("corporate_info")
            .getFullList(200, { sort: "sno", requestKey: null }),
          pb.collection("leaders").getFullList(200, {
            sort: "sno",
            filter: 'page = "investor"',
            requestKey: null,
          }),
        ]);

        setData({
          address: addressRes,
          leaders: leadersRes,
        });
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
      <div className="text-2xl text-[#223972] mt-3 font-semibold text-center">
        <span className="border-b-2 border-gray-300 pb-1">
          Corporate Information
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 p-4 gap-8">
        {data.address.length > 0 ? (
          data.address.map((item) => (
            <div
              key={item.id}
              className="border border-gray-500 rounded-2xl p-5 shadow hover:shadow-md hover:border-red-500 transition-all bg-white"
            >
              <div className="font-semibold underline text-[#223972] mb-2 text-xl">
                {item.title}
              </div>
              <p>
                {item.subTitle && (
                  <strong className="text-[#152768] text-lg">
                    {item.subTitle}
                  </strong>
                )}
                {item.subTitle &&
                  (item.address || item.phone || item.email) && <br />}

                {item.address && (
                  <>
                    {item.address} <br />
                  </>
                )}
                {item.phone && (
                  <>
                    Mobile No: {item.phone} <br />
                  </>
                )}
                {item.email && (
                  <>
                    Email:{" "}
                    <a href={`mailto:${item.email}`} className="text-blue-600">
                      {item.email}
                    </a>
                  </>
                )}
              </p>
            </div>
          ))
        ) : (
          <div>No corporate information available.</div>
        )}
      </div>
      <div className="flex justify-center items-center">
        <div className="border border-gray-500 rounded-2xl p-5 shadow hover:shadow-md hover:border-red-500 transition-all bg-white">
          <h3 className="font-semibold underline text-[#223972] mb-2 text-xl">
            Key Managerial Personnel
          </h3>
          <ul>
            {data.leaders.length > 0 ? (
              data.leaders.map((leader) => (
                <li key={leader.id}>
                  {leader.name}- {leader.role}
                </li>
              ))
            ) : (
              <li>No leaders available.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Corporate;
