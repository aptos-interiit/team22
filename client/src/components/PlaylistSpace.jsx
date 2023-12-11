import React, { useContext, useEffect, useState } from "react";
import MusicCard from "./MusicCard";
import { useLocation } from "react-router";
import { dataContext } from "../Context/dataContext";
import play from "../MusicPlayer/assets/play2.png";
import pause from "../MusicPlayer/assets/pause2.png";

export default function PlaylistSpace(props) {


  const location = useLocation();
  const passedData = location.state;
  const { distrix, setDistri, user, setTrackid, setCurrent, setIsRadio, setRadio, setRecAdd, setRecName, disable, recadd, recName, setCurrPlaylist, currPlaylist } = useContext(dataContext)
  const [timeLength, setTimelength] = useState(0);

  const setid = (e, id, songtrack, name, addr, dist) => {
    e.preventDefault();
    if (!disable) {
      setTrackid(id);
      setCurrent(songtrack);
      setIsRadio(0);
      setRadio([]);
      if (recadd === null) {
        setRecAdd(addr);
      }
      if (recName === "") {
        setRecName(name);
      }
      if(distrix === null){
        setDistri(dist)
      }
      if(id != -1) setCurrPlaylist(passedData);
      else setCurrPlaylist(null);
    }
  };

  useEffect(() => {
    let timelength = 0;

    // console.log(passedData);
    passedData.data.map((it, i) => {
      // console.log(it);
      timelength += parseFloat(it.duration)
    })
    setTimelength(parseInt(timelength / 60))
  }, [passedData])

  return (
    <>
      <div
        className={`bg-[#010101] max-h-screen overflow-y-scroll text-white p-4`}
      // className="bg-black h-screen w-full text-white"
      >
        <div className="bg-[#000000] mx-auto flex w-full">
          <div className="flex flex-row  w-[100%] mx-auto">
            {/* <div className=" m-auto flex flex-row  border-4 border-white ml-0"> */}
            <div
              className="m-auto flex flex-row ml-0 w-[100px] h-[100px] sm:w-[260px] sm:h-[260px] rounded-full "
              style={{
                // width: "100%",
                backgroundImage: `url(${require(`../MusicPlayer/assets/${passedData.img}`)})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
                backgroundPosition: "center center",
              }}
            ></div>
            {/* </div> */}
            <div className=" my-auto m-4 w-[70%]">
              <div className="font-medium text-sm mb-[-5px] text-[#e8e8e8] sm:text-xl">{user.name}'s Playlist</div>
              <div className="font-bold text-3xl sm:text-7xl">{passedData.name}</div>
              <div className="font-medium text-sm mt-[-2px] text-[#515251] sm:text-xl">Total songs {passedData.data.length}</div>
              <div className="font-medium text-sm mt-[-5px] text-[#515251] sm:text-xl">Total time {timeLength} minutes</div>
            </div>
          </div>
        </div>
        <div className="w-[100%] mt-10 p-2">
        {currPlaylist !== passedData && passedData.data.length!==0 ? (<div
          className="m-auto w-[80px] h-[80px] rounded-full ml-0 cursor-pointer"
          style={{
            // width: "100%",
            backgroundImage: `url(${play})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
          }}
          onClick={(e) => setid(e, 0, passedData.data, passedData.data[0].owner_name, passedData.data[0].owner)}
        ></div>) : passedData.data.length!==0 ? (<div
          className="m-auto w-[80px] h-[80px] rounded-full ml-0 cursor-pointer"
          style={{
            // width: "100%",
            backgroundImage: `url(${pause})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
          }}
          onClick={(e) => setid(e, -1, passedData.data, "", null, null)}
        ></div>)
          : <div></div>}
        </div>
        

        <div>
          <div className=" mt-2  sm:h-[60vh] h-[60vh] overflow-y-scroll">
            {passedData.data && passedData.data.map((it, i) => (
              <MusicCard song={it} id={i} key={i} tracks={passedData.data} inPlaylist={true} playListName={passedData.name} />
            ))}
          </div>
        </div>
        </div>
    </>
  );
}
