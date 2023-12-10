import React, { useContext, useEffect, useState } from "react";
import { dataContext } from "../Context/dataContext";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useNavigate } from "react-router";
import TrendingSongCard from "../components/TrendingSongCard";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import PlaylistCard from "../components/PlaylistCard";
import { IoIosAddCircleOutline } from "react-icons/io";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TopArtistsCard from "../components/TopArtistCard";
import {Link} from 'react-router-dom'
import play from '../MusicPlayer/assets/playBtn.png'
import backicon from '../MusicPlayer/assets/back.jpg'
import play2 from '../MusicPlayer/assets/play2.png'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};




function MainPage({ setTrackid }) {
  const { distrix, setDistri, setRadio, radio,setRecName, recName, recadd, songs, setCurrent, current, setRecAdd, provider, addre, latestSong,setUsedUpTime, trendingSong, user, myPlaylistName, myPlaylists, transact, setTransact, disable, setIsRadio, artistsAndTheirSongs } =
  useContext(dataContext);
  const { account, signAndSubmitTransaction } = useWallet();
  const [tstatus, setTransactionInProgress] = useState(0);
  
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [pname, setPname] = useState();
  const [radioz, setRadioz] = useState([])
  const [load, setLoad] = useState(1)
  const [ct ,setCt] = useState(5)

  const getIpfsObject = async (user_address, ids, title, description) => {
    const todoListResource = await provider.getAccountResource(
      `${addre}`,
      `${addre}::music_platform::All_songs`
    );        
    const tableHandle = todoListResource.data.content.handle;
    let songsx = [];

    console.log("songsx", songsx);
    for (let i = 0; i < ids.length; i++) {
      const tableItem = {
        key_type: "u64",
        value_type: `${addre}::music_platform::Song`,
        key: `${ids[i]}`,
      };
      try {
        const song = await provider.getTableItem(tableHandle, tableItem);            
        if (songsx.some((e) => e.IpfsHash !== song.IpfsHash)) {
          console.log("Already exists");
          continue;
        }
        songsx.push(song);
      } catch (err) {
        console.log(err);
      }
    }
    let radio = { user_address:user_address, title: title, songs: songsx, description: description };
    handleRadioCalculations(radio)
  };

  const handleRadioCalculations = async (radioz) => {
    if(radio.user_address && radioz.user_address == radio.user_address){
        return;
    }
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    const seconds = new Date().getSeconds();
    setRadio(radioz);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    let duration = [];
    let songs = [];
    radioz.songs.map((it, id) => {
      songs.push(it);
      duration.push(parseInt(it.duration));
    });
    console.log(duration);
    let prefix_array = [];
    prefix_array.push(duration[0]);
    for (let i = 1; i < duration.length; i++) {
      prefix_array.push(
        parseInt(prefix_array[prefix_array.length - 1]) + duration[i]
      );
    }
    console.log(prefix_array);
    const timestamp = totalSeconds % prefix_array[prefix_array.length - 1];
    console.log(totalSeconds % prefix_array[prefix_array.length - 1]);
    let usedUpTime;
    let index;
    for (let i = 0; i < prefix_array.length; i++) {
      if (prefix_array[i] >= timestamp) {
        if (i == 0) {
          usedUpTime = timestamp;
        } else {
          usedUpTime = timestamp - prefix_array[i - 1];
        }
        index = i;
        break;
      }
    }
    console.log(totalSeconds);
    console.log({ index, usedUpTime });
    console.log(songs);
    setTrackid(index);
    setCurrent(songs);
    setUsedUpTime(usedUpTime);
    setIsRadio(1);
    // s.log({hours, minutes, seconds})
    // console.log(scaleTimeToRange(hours, minutes, seconds, 24, 0.00000000005, prefix_array[prefix_array.length - 1]))
    console.log(radioz);
  };


  useEffect(() => {
    
    (async () => {      
      if (!account) return;          
      const todoListResource = await provider.getAccountResource(
        `${addre}`,
        `${addre}::music_platform::All_radios`
      );
      console.log(todoListResource);
      
      const tableHandle = todoListResource.data.content.handle;
      if(todoListResource.data.all_indexes.length === 0) return;
        const tableItem = {
          key_type: "u64",
          value_type: `${addre}::music_platform::Radio`,
          key: `${todoListResource.data.all_indexes[0]}`,
        };
        try {                      
            const radiox = await provider.getTableItem(tableHandle, tableItem);
            console.log(radiox);                          
            // let arr = radio.songs;
            // let object = await getIpfsObject(arr, radio.title, radio.description);                                    
            setRadioz(radiox)
        } catch (err) {
          console.log(err);
        }                
      setLoad(0);
    })();
  },[]);

  useEffect(() => {
    if (user == null) {
      navigate("/");
    }
  }, [user])

  const addNewPlaylist = async (e, PlaylistName) => {
    e.preventDefault();
    if (!account) return;

    if (PlaylistName === "") {
      alert("Playlist Name cannot be empty")
      return;
    }

    if (!user) {
      alert("User not logged in")
      return;
    }
    setTransactionInProgress(true);

    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${addre}::music_platform::create_playlist`,
        typeArguments: [],
        functionArguments: [PlaylistName],
      },
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      console.log("playlist created");
      await provider.waitForTransaction(response.hash);
      setTransact(transact + 1);
    } catch (err) {
      console.log(err);
    } finally {
      handleClose();
      setTransactionInProgress(false);
    }
  }
  


  
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

  const slideLeft = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft - 200;
  };

  const slideRight = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft + 200;
  };

  return (
    <>
      {user &&
        <div
          className={`bg-white min-h-screen text-white w-full`}
          style={{
            // width: "100%",
            backgroundImage: `url(${backicon})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
          }}
        // className="bg-black h-screen w-full text-white"
        >
          <div
            className="text-white  w-[100%] h-[30vh] sm:h-[45vh] mx-auto flex"            
          >
            <div className="w-[100%] sm:w-[50%] h-[40vh] pt-20  pl-20 flex flex-col">
              <p className="w-[100%] ml-auto mr-auto text-8xl text-justify">Trending Radio</p>
              <Link
                to="/allradios"
                type="button"                
                className="ml-2 mr-auto mt-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-2xl px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                All Radios
              </Link>
            </div>
            {
              load ? (<></>):(<>
                <div className="w-[100%] sm:w-[50%] h-[22vh] ml-80 rounded-lg mt-16 flex flex-col from-white">
                  {/* <p className="ml-auto mr-auto text-7xl mt-5">{radioz.title}</p> */}
                  <img 
                    onClick={() => getIpfsObject(radioz.user_address, radioz.songs, radioz.title, radioz.description)}               
                    src={play2}              
                    className="ml-auto mr-auto mr-auto h-[300px] w-[300px] hover:scale-110 hover:cursor-pointer transition-transform transform"                   
                  />                    
                </div>
              </>)
            }
          </div>
          <div className="bg-[#070707]  w-[95%] m-5 mx-auto grid  grid-cols-1 sm:grid-cols-3">
            <div className="col-span-2 order-last sm:order-none">
              <div className=" h-content m-3 sm:m-4 mt-4 bg-[#1d1d24] p-2 rounded-md">
                <div className="font-bold text-2xl sm:text-3xl sm:m-2 text-white">
                  Trending Songs
                </div>

                {/* //slider */}

                <div>
                  <div className="relative flex items-center  rounded m-3">
                    <MdChevronLeft
                      className="opacity-50 cursor-pointer hover:opacity-100 hidden"
                      onClick={slideLeft}
                      size={40}
                    />
                    <div
                      id="slider"
                      className="w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth overflow-hidden"
                    >
                      <div className="flex h-content">
                        {trendingSong.map((it, i) => {
                          return (
                            <TrendingSongCard key={i} bg={`https://tan-mad-salamander-939.mypinata.cloud/ipfs/${it.coverIpfs}`} owner={it.title} songs={trendingSong} id={i} setid={setid}  artists={it.artists} distri={it.distri} address={it.owner} artistName={it.owner_name} songID={it.id}/>
                          );
                        })}
                      </div>
                    </div>
                    <MdChevronRight
                      className="opacity-50 cursor-pointer hover:opacity-100 hidden"
                      onClick={slideRight}
                      size={40}
                    />
                  </div>
                </div>
              </div>
              <div className=" h-content m-3 sm:m-4 mt-4 bg-[#1d1d24] p-2 rounded-md">
                <div className="font-bold text-2xl sm:text-3xl sm:m-2">
                  Latest Songs
                </div>

                {/* //slider */}

                <div>
                  <div className="relative flex items-center  rounded m-3">
                    <MdChevronLeft
                      className="opacity-50 cursor-pointer hover:opacity-100 hidden"
                      onClick={slideLeft}
                      size={40}
                    />
                    <div
                      id="slider"
                      className=" w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide no-scrollbar "
                    >
                      <div className="flex">
                        {latestSong.map((it, i) => {
                          return (
                            <TrendingSongCard key={i} bg={`https://tan-mad-salamander-939.mypinata.cloud/ipfs/${it.coverIpfs}`} owner={it.title} songs={latestSong} id={i} setid={setid} artists={it.artists} distri={it.distri} artistName={it.owner_name} address={it.owner} songID={it.id}/>
                          );
                        })}
                      </div>
                    </div>
                    <MdChevronRight
                      className="opacity-50 cursor-pointer hover:opacity-100 hidden"
                      onClick={slideRight}
                      size={40}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-content sm:m-3 p-2 sm:mt-6 bg-[#1d1d24] rounded m-3 ">
              <div className="flex items-center justify-between font-bold text-2xl text-white sm:text-3xl sm:m-2">
                <div className="font-bold text-2xl text-white sm:text-3xl sm:m-2">
                  My Playlist
                </div>

                <IoIosAddCircleOutline className="cursor-pointer transition-transform transform hover:scale-110" onClick={handleOpen} />
              </div>
              <div>
                <div className="h-[100%] overflow-y-scroll w-content">
                  {myPlaylists.map((it, i) => {
                    // console.log(it);
                    return (
                      <PlaylistCard key={i} name={myPlaylistName[i]} playlist={it} len={it.length} id={i} />
                    );
                  })}
                </div>
              </div>
            </div>
         


          <div className=" h-content m-3 sm:m-4 mt-4 bg-[#1d1d24] p-2 rounded-md col-span-3">
                <div className="font-bold text-2xl sm:text-3xl sm:m-2">
                  Top Artisits
                </div>

                {/* //slider */}

                <div>
                  <div className="relative flex items-center  rounded m-3">
                    <MdChevronLeft
                      className="opacity-50 cursor-pointer hover:opacity-100 hidden"
                      onClick={slideLeft}
                      size={40}
                    />
                    <div
                      id="slider"
                      className=" w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide no-scrollbar "
                    >
                      <div className="flex">
                        {artistsAndTheirSongs && artistsAndTheirSongs.map((it, i) => {
                          console.log(it);
                          return (
                            <TopArtistsCard artistFullInfo={it} key={i}/>
                          );
                        })}
                      </div>
                    </div>
                    <MdChevronRight
                      className="opacity-50 cursor-pointer hover:opacity-100 hidden"
                      onClick={slideRight}
                      size={40}
                    />
                  </div>
                </div>
              </div>

          <div className=" h-content m-3 sm:m-4 mt-4 bg-[#1d1d24] p-2 rounded-md col-span-3">
                <div className="font-bold text-2xl sm:text-3xl sm:m-2">
                  All Songs
                </div>

                {/* //slider */}

                <div>
                  <div className="relative flex items-center rounded m-3">
                    <MdChevronLeft
                      className="opacity-50 cursor-pointer hover:opacity-100 hidden"
                      onClick={slideLeft}
                      size={40}
                    />
                    <div
                      id="slider"
                      className=" w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide no-scrollbar "
                    >
                      <div className="flex flex-wrap">
                        {songs.map((it, i) => {
                          if(i<ct){                          
                            return (                              
                                <TrendingSongCard key={i} bg={`https://tan-mad-salamander-939.mypinata.cloud/ipfs/${it.coverIpfs}`} owner={it.title} songs={songs} id={i} setid={setid} artists={it.artists} distri={it.distri} address={it.owner} artistName={it.owner_name} songID={it.id}/>                                                                                            
                            );
                          }
                        })}
                        {
                          ct < songs.length ?(<><p className="mt-auto mb-auto p-5 ml-5 bg-[#23252e] hover:bg-black transform hover:cursor-pointer rounded-lg" onClick={() => setCt(ct+5)}>Load More</p></>):(<></>)
                          
                        }
                      </div>
                    </div>
                    <MdChevronRight
                      className="opacity-50 cursor-pointer hover:opacity-100 hidden"
                      onClick={slideRight}
                      size={40}
                    />
                  </div>
                </div>
              </div>
              </div>

        </div>


      }

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={style}>
          <section class="max-w-4xl p-6 mx-auto bg-indigo-600 rounded-md shadow-md dark:bg-gray-800">
            <h1 class="text-xl font-bold text-white capitalize dark:text-white">Create Playlist</h1>
            <form >
              <div class="grid grid-cols-1 gap-6 mt-4 ">
                <div>
                  <label class="text-white dark:text-gray-200" for="pname">Playlist Name</label>
                  <input onChange={(e) => setPname(e.target.value)} id="pname" type="text" class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                </div>
                {/* </div> */}

                <div class="flex justify-end mt-6">
                  <button onClick={handleClose} class="px-6 py-2 mx-5 leading-5 text-white transition-colors duration-200 transform bg-[#4865f6] rounded-md focus:outline-none focus:bg-gray-600">Cancel</button>
                  <button onClick={(e) => addNewPlaylist(e, pname)} class="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-[#4865f6] rounded-md focus:outline-none focus:bg-gray-600">Create</button>
                </div>
              </div>
            </form>
          </section>
        </Box>

      </Modal>

      
    </>


  );
}

export default MainPage;
