// Summary: RadioCard component for displaying radio station information


// importing dependencies
import React from "react";
import { Tooltip } from "@material-tailwind/react";

// RadioCard component
export default function RadioCard({ bg, owner, artistName }) {
  return (
    <div className="bg-[#23252e] text-white w-[25vh] h-[100%] mx-3 mt-3 mb-3 p-3 rounded-lg hover:shadow-md hover:shadow-black hover:bg-black hover:ease-in hover:scale-105 border border-black">
      <div
        className="w-[150px]  h-[150px] aspect-square items-center justify-center flex mx-auto rounded-md shadow-black shadow-md"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundPosition: "center center",
        }}
      >
      </div>
      <div className="text-md font-bold mt-2 truncate">
        <Tooltip content={owner}>{owner}</Tooltip>
      </div>
      <div className="text-sm mb-2 text-[#606269] truncate">{artistName}</div>
    </div>
  );
}
