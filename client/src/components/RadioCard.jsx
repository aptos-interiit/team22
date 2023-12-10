import React from "react";
import { Tooltip } from "@material-tailwind/react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 400,
  bgcolor: "#070707",
  border: "2px solid white",
  boxShadow: 24,
  p: 4,
  zIndex: 999,
};

export default function RadioCard({
  bg,
  owner,  
  artistName,  
}) {
  

  

  
 

  return (
    <div className="bg-[#23252e] text-white w-[25vh] h-[100%] mx-3 mt-3 mb-3 p-3 rounded-lg hover:shadow-md hover:shadow-black hover:bg-black hover:ease-in hover:scale-105 border border-black">
      <div
        className="w-[150px]  h-[150px] aspect-square items-center justify-center flex mx-auto rounded-md shadow-black shadow-md"
        style={{
          // width: "100%",
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
