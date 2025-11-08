import React from "react";
import SimpleChart from "../../_components/simple-charts";

const LiveStock = () => {
  
  return (
    <>
      <div className="flex flex-col space-y-6 p-5">
        <div className="rounded-md border overflow-hidden w-full">
          <div className="p-2 ">
            <h6 className="text-[#e23130] font-medium lg:text-[12px] xl:text-[18px] ">
              SPICELOUNG:{" "}
              <a
                href="https://www.bseindia.com/stock-share-price/shalimar-agencies-ltd/sagl/539895/"
                target="_blank"
                className="underline text-[#223972] animate-caret-blink"
              >
                {" "}
                Click here for real time Stock Price
              </a>
            </h6>
          </div>
        </div>
        <SimpleChart />
      </div>
    </>
  );
};

export default LiveStock;