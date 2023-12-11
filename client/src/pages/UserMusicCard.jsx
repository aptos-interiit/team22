import React, { useContext, useEffect, useState } from "react";
import { dataContext } from "../Context/dataContext";
// import bg from "../../src/pages/img/cover.jpg";
// import play from "../../src/pages/img/play-icon-removebg-preview.png";
import play_icon from "../MusicPlayer/assets/playBtn.png";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import remove from "../MusicPlayer/assets/icons8-remove-50.png";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

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

function UserMusicCard({ song, id, tracks, handleDel }) {
  const {
    disable,
    recName,
    setRecName,
    setCurrent,
    setTrackid,
    setIsRadio,
    setRadio,
    recadd,
    setRecAdd,
  } = useContext(dataContext);
  const setid = (e, id, songtrack, name, addr) => {
    e.preventDefault();
    if (!disable) {
      setTrackid(id);
      setCurrent(songtrack);
      setIsRadio(0);
      setRadio([]);
      if (recadd === "") {
        setRecAdd(addr);
      }
      if (recName === "") {
        setRecName(name);
      }
    }
  };
  const [liked, setLiked] = useState(false);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const { account, signAndSubmitTransaction } = useWallet();
  const { addre, provider, transact, setTransact, user } =
    useContext(dataContext);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

  useEffect(() => {
    if (user) {
      let likeSongs = user.playlists[0].songs;
      let flag = false;
      for (let i = 0; i < likeSongs.length; i++) {
        if (likeSongs[i] === song.id) {
          setLiked(true);
          flag = true;
        }
      }
      if (flag === false) {
        setLiked(false);
      }
    }
  }, []);

  const handleLikeSongs = async (songID) => {
    if (!account) return;
    if (!user) {
      alert("User not logged in");
      return;
    }

    let likeSongs = user.playlists[0].songs;
    // console.log(likeSongs);
    let flag = false;
    for (let i = 0; i < likeSongs.length; i++) {
      if (likeSongs[i] === songID) {
        flag = true;
      }
    }

    if (flag === true) {
      setTransactionInProgress(true);

      const payload = {
        sender: `${account.address}`,
        data: {
          function: `${addre}::music_platform::remove_song_from_playlist`,
          typeArguments: [],
          functionArguments: [songID, "Liked Songs"],
        },
      };

      try {
        const response = await signAndSubmitTransaction(payload);
        // console.log("song removed from Liked Song Playlist");
        await provider.waitForTransaction(response.hash);
        setLiked(false);
        setTransact(transact + 1);
      } catch (err) {
        console.log(err);
      } finally {
        setTransactionInProgress(false);
      }
    } else {
      setTransactionInProgress(true);

      const payload = {
        sender: `${account.address}`,
        data: {
          function: `${addre}::music_platform::add_song_to_playlist`,
          typeArguments: [],
          functionArguments: [songID, "Liked Songs"],
        },
      };

      try {
        const response = await signAndSubmitTransaction(payload);
        // console.log("song liked and added to Liked Song Playlist");
        await provider.waitForTransaction(response.hash);
        setLiked(true);
        setTransact(transact + 1);
      } catch (err) {
        console.log(err);
      } finally {
        setTransactionInProgress(false);
      }
    }
  };


  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date(parseInt(song.timestamp));
  // console.log(date);
  return (
    <>
    <div className="group w-[250px] sm:w-[85%] sm:mx-16 grid items-center grid-cols-6 sm:grid-cols-6 border-white mx-auto mt-6 sm:mt-8 hover:opacity-80 bg-[#282829] rounded-md py-5">
      <div
        className="w-[60px] h-[60px] sm:mx-auto col-span-1"
        style={{
          // width: "100%",
          backgroundImage: `url(https://tan-mad-salamander-939.mypinata.cloud/ipfs/${song.coverIpfs})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundPosition: "center center",
        }}
      >
        <button
          className="w-[100%] h-[100%] mx-auto opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 ease-in-out"
          onClick={(e) => setid(e, id, tracks, song.owner_name, song.owner)}
          style={{
            // width: "100%",
            backgroundImage: `url(${play_icon})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "50% 50%",
            backgroundPosition: "center center",
          }}
        ></button>
      </div>
      <div className="col-span-2 sm:col-span-2 ml-2 sm:ml-0">
        <div className="font-bold text-lg">{song.title}</div>
        <div className="font-medium text-sm mt-[-5px] text-[#515251]">
          {song.owner_name}
        </div>
      </div>
      <div className="col-span-2 sm:col-span-2 ml-2 sm:ml-0 items-center grid">
        <div>
          <span>{date.getDate() + " "}</span>
          <span>{months[date.getMonth()] + " "}</span>
          <span>{date.getFullYear()}</span>
        </div>
      </div>

      <div className="mx-auto my-auto text-sm sm:mx-auto flex">
        {/* only user can delete its own songs wala logic */}
        <button className="px-auto mt-1">
          {String(parseInt(song.duration / 60)).padStart(2, "0")}:
          {String(
            (song.duration - parseInt(song.duration / 60) * 60).toFixed(0)
          ).padStart(2, "0")}
        </button>
        {liked ? (
          <FaHeart
            className="cursor:pointer ml-6  "
            style={{ color: "#4865F6", fontSize: "28px" }}
            onClick={(e) => {
              e.preventDefault();
              handleLikeSongs(song.id);
            }}
          />
        ) : (
          <CiHeart
            className="cursor:pointer ml-6  "
            style={{ color: "none", fontSize: "28px" }}
            onClick={(e) => {
              e.preventDefault();
              handleLikeSongs(song.id);
            }}
          />
        )}
        <button className='opacity-30 col-span-1 row-start-2 hover:opacity-100 ml-4' onClick={(e) => {
            e.preventDefault();
            handleOpen();
        }}><MdDelete size={30} /></button>
      </div>
    </div>
    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box style={style}>
      <section class="max-w-4xl p-6 mx-auto bg-indigo-600 rounded-md shadow-md dark:bg-gray-800">
        <h1 class="text-lg text-white capitalize">Are you Sure you want to delete "{song.title}" ?</h1>
        <form className="mt-5">
          <button className="px-6 py-2 mx-5 leading-5 text-white transition-colors duration-200 transform bg-red-500 rounded-md focus:outline-none focus:bg-gray-600" onClick={(e)=>{
            e.preventDefault();
            handleDel(e, song.id);
            handleClose();
          }}>Confirm</button>
          <button className="px-6 py-2 mx-5 leading-5 text-white transition-colors duration-200 transform bg-[#4865f6] rounded-md focus:outline-none focus:bg-gray-600" onClick={()=>{
            handleClose();
          }}>Cancel</button>
        </form>
      </section>
    </Box>

  </Modal>
  </>
  );
}

export default UserMusicCard;
