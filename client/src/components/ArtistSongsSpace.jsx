import React, { useContext, useEffect } from "react";
import MusicCard from "./MusicCard";
import { useLocation } from "react-router";
import { dataContext } from "../Context/dataContext";

export default function ArtistSongsSpace(props) {
  

  const location = useLocation();
  const passedData = location.state;
  const{user}=useContext(dataContext)

  useEffect(() => {
    
    // console.log(passedData.data);
  }, [])

  return (
    <>
      <div
        className={`bg-[#010101] max-h-screen overflow-y-scroll text-white`}
        // className="bg-black h-screen w-full text-white"
      >
        <div className="bg-[#000000] mx-auto flex w-full">
        <div className="flex flex-row  sm:w-[80%]  mx-auto h-[35vh] sm:h-[55vh] ">
          {/* <div className="col-span-2 sm:col-span-1 m-auto "> */}
            <div
              className="m-auto flex flex-row ml-0 w-[100px] h-[100px] sm:w-[260px] sm:h-[260px] rounded-full"
              style={{
                // width: "100%",
                backgroundImage: `url(https://tan-mad-salamander-939.mypinata.cloud/ipfs/${passedData.data.profile_pic})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
                backgroundPosition: "center center",
              }}
            ></div>
          {/* </div> */}
          <div className=" my-auto m-10 w-[70%]">
            <div className="font-bold text-3xl sm:text-7xl mb-3">{passedData.data.name}</div>
            <div className="font-medium text-sm mt-[-2px] text-[#515251] sm:text-xl mb-3">Total Songs {passedData.data.songs.length}</div>
            <div className="font-medium text-sm mt-[-5px] text-[#515251] sm:text-xl">{passedData.data.location}</div>
          </div>
        </div>
        </div>
        <div>
            <div className="grid grid-cols-4  w-[250px] sm:w-[85%] sm:grid-cols-6 border-white mx-auto mt-4 sm:mt-8 sm:mx-16 text-[#515251] italic mb-2">
              <div className="col-span-1 mt-2 ml-2"></div>
            
            </div>
            <div className=" mt-2  sm:h-[60vh] h-[60vh] overflow-y-scroll">
              {passedData.data && passedData.data.songs.map((it, i) => (
                
                  <MusicCard key={i} song={it} id={i} tracks={passedData.data.songs} inPlaylist={false} playListName={""}/>
                
              ))}
            </div>
          </div>
      </div>
    </>
  );
}
