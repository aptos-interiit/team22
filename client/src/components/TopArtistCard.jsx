import React, { useContext, useEffect } from "react";
import { dataContext } from "../Context/dataContext";
import { Link } from "react-router-dom";
import play_icon from "../MusicPlayer/assets/playBtn.png"

export default function TopArtistsCard({artistFullInfo}) {
    const {artistAndTheirSongs}=useContext(dataContext)
    useEffect(()=>{
        // console.log(artistFullInfo);
    }, [artistAndTheirSongs])
  return (
   <Link to="/artistSongsSpace" state={{ data: artistFullInfo }} className=" w-[23vh] h-[90%] mr-5 mt-3 mb-3 hover:bg-black hover:shadow-md hover:shadow-black rounded-md hover:ease-in hover:scale-105">
        <div
        className="w-[100px] h-[100px] aspect-square mx-auto mt-3"
        style={{
            // width: "100%",
            backgroundImage: `url(https://tan-mad-salamander-939.mypinata.cloud/ipfs/${artistFullInfo.profile_pic})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
            borderRadius:"50%",
          }}
        >
          
        </div>
        <div className="text-md font-bold text-center my-3">{artistFullInfo.name}</div>
   </Link>
  );
}