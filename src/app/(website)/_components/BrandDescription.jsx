"use client";

import { useState } from "react";
import pb from "../_lib/pb";

export default function BrandDescription({ image, title, description }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCard = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-2">
      <img className="h-96 object-cover rounded-none" src={image} alt={title} />

      <h2 className="font-bold text-xl">{title}</h2>

      <p className="">
        {isExpanded ? description : description?.slice(0, 120)}
        {description?.length > 200 && (
          <span
            onClick={toggleCard}
            className="text-[#152768] cursor-pointer ml-1 font-semibold inline-block mt-1"
          >
            {isExpanded ? "less" : "...more"}
          </span>
        )}
      </p>
    </div>
  );
}