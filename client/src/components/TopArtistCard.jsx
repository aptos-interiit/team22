// Summary: This component is used to display the top artists in the home page.


// importing dependencies
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

// TopArtistsCard component
export default function TopArtistsCard({ artistFullInfo }) {

  // returning the TopArtistsCard component
  return (
    <Link to="/artistSongsSpace" state={{ data: artistFullInfo }} className=" w-[23vh] h-[90%] mr-5 mt-3 mb-3 hover:bg-black hover:shadow-md hover:shadow-black rounded-md hover:ease-in hover:scale-105">
      <div
        className="w-[100px] h-[100px] aspect-square mx-auto mt-3"
        style={{
          backgroundImage: `url(https://tan-mad-salamander-939.mypinata.cloud/ipfs/${artistFullInfo.profile_pic})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundPosition: "center center",
          borderRadius: "50%",
        }}
      >
      </div>
      <div className="text-md font-bold text-center my-3">{artistFullInfo.name}</div>
    </Link>
  );
}