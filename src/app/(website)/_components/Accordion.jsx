"use client";
import React, { useState } from "react";
import pb from "../_lib/pb";

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {items.map((item, index) => (
        <div key={index} className="border-b">
          <button
            className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none flex justify-between items-center"
            onClick={() => toggleAccordion(index)}
          >
            <span className="font-semibold text-gray-700">{item.title}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transform transition-transform duration-300 ${
                openIndex === index ? "rotate-180" : "rotate-0"
              }`}
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 8L10 12L14 8"
              />
            </svg>
          </button>
          {openIndex === index && (
            <div className="p-4 bg-gray-50">
              {item.file ? (
                <a
                  href={pb.files.getURL(item, item.file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View File
                </a>
              ) : (
                <p className="text-red-500">No file available</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
