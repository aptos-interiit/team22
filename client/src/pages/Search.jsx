// Purpose: Provide a search page for the user to search for songs.


// importing dependencies
import React, { useContext, useEffect, useState } from 'react'
import { dataContext } from "../Context/dataContext";
import TrendingSongCard from '../components/TrendingSongCard';


// Search component
const Search = () => {

  // distrix: distribution
  // setDistri: set distribution
  // setRadio: set radio
  // setIsRadio: set is radio
  // disable: disable state
  // recName: recommended name
  // setRecName: set recommended name
  // songs: songs
  // setCurrent: set current
  // recadd: recommended address
  // setRecAdd: set recommended address
  // searchsong: search song
  // setSearchsong: set search song
  // setTrackid: set track id
  const { distrix ,setDistri, setRadio, setIsRadio, disable, recName, setRecName, songs, setCurrent, recadd, setRecAdd, searchsong, setSearchsong, setTrackid } =
  useContext(dataContext);  

  // ct: count state
  const [ct, setCt] = useState(5);

  // useEffect hook for search song
  useEffect(() => {
    setSearchsong(songs)
  }, [])

  // function to set id
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
    }
  };


  // returning the Search component
  return (
    <div className='bg-black min-h-screen text-white w-full'>
      <div className="bg-[#070707] w-[95%] m-5 mx-auto grid grid-cols-3">
        <main className="bg-black col-span-3">
          <div className='h-content m-3 sm:m-4 mt-4 bg-[#1d1d24] p-2 rounded-md'>
            {searchsong.length ? (
              <h1 className="text-4xl p-2 sm:text-5xl md:text-7xl font-bold text-gray-200 mb-5 select-none">
                Search Songs
              </h1>
            ) : (
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-200 mb-5 select-none">
                no song found
              </h1>
            )}
            <div>
              <div className="relative flex items-center rounded m-3">
                <div id="slider" className="w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide no-scrollbar">
                  <div className="flex flex-wrap">
                    {searchsong.map((it, i) => {
                      if (i < ct) {
                        return (                          
                            <TrendingSongCard key={i} bg={`https://tan-mad-salamander-939.mypinata.cloud/ipfs/${it.coverIpfs}`} owner={it.title} songs={songs} id={i} setid={setid} artists={it.artists} distri={it.distri} address={it.owner} artistName={it.owner_name} songID={it.id} />                          
                        );
                      }
                    })}
                    {
                      ct < songs.length ? (<><p className="mt-auto mb-auto p-5 ml-5 bg-[#23252e] hover:bg-black transform hover:cursor-pointer rounded-lg" onClick={() => setCt(ct + 5)}>Load More</p></>) : (<></>)
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Search