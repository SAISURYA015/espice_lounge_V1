"use client";
import React, { useEffect, useState } from "react";
import pb from "../_lib/pb";

const BrandDetail = ({ brand_name }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes] = await Promise.all([
          pb.collection("brands").getFirstListItem(`name=${brand_name}`),
        ]);

        setData({
          brandsRes,
        });

        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return <div>{data.brand}</div>;
};

export default BrandDetail;
