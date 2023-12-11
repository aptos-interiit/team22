import React, { useContext, useEffect, useState } from "react";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { dataContext } from "../Context/dataContext";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import play_icon from "../MusicPlayer/assets/playBtn.png";
import OptionCard from "./OptionCard";
import { Tooltip, Button} from "@material-tailwind/react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  zIndex: 999,
};

export default function TrendingSongCard({
  bg,
  owner,
  songs,
  id,
  setid,
  address,
  songID,
  artistName,
  artists,
  distri
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { myPlaylistName, addre, user, provider, transact, setTransact } = useContext(dataContext);
  const { account, signAndSubmitTransaction } = useWallet();
  const [currPlaylist, setCurrPlaylist] = useState();
  const [tstatus, setTransactionInProgress] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user) {
      let likeSongs = user.playlists[0].songs;
      let flag = false;
      for (let i = 0; i < likeSongs.length; i++) {
        if (likeSongs[i] === songID) {
          setLiked(true);
          flag = true;
        }
      }
      if (flag === false) {
        setLiked(false);
      }
    }
  }, [])

  const handleAddSongToPlaylist = async (PlaylistName, songid) => {
    if (!account) return;

    if (PlaylistName === "") {
      alert("Playlist Name cannot be empty");
      return;
    }

    if (!user) {
      alert("User not logged in");
      return;
    }

    setTransactionInProgress(true);

    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${addre}::music_platform::add_song_to_playlist`,
        typeArguments: [],
        functionArguments: [songid, PlaylistName],
      },
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      // console.log("song added to playlist");
      await provider.waitForTransaction(response.hash);
      setTransact(transact+1)
    } catch (err) {
      console.log(err);
    } finally {
      handleClose();
      setTransactionInProgress(false);
    }
  };

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
        setTransact(transact+1);
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
        setTransact(transact+1);
      } catch (err) {
        console.log(err);
      } finally {
        setTransactionInProgress(false);
      }
    }
  };

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
        <button
          className="w-[100%] h-[100%] mx-auto opacity-0 hover:opacity-100 translate-y-2 hover:translate-y-0 transition-all duration-500 ease-in-out"
          onClick={(e) => setid(e, id, songs, artistName, artists, distri)}
          style={{
            // width: "100%",
            backgroundImage: `url(${play_icon})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "40% 40%",
            backgroundPosition: "center center",
          }}
        ></button>
      </div>
<div className="w-[150px] mx-auto">

      <div className="text-md font-bold mt-2 truncate w-[150px]">
      <Tooltip content={owner}>{owner}</Tooltip>

        </div>
      <div className="text-sm mb-2 text-[#606269] truncate w-[150px]">{artistName}</div>
      <div
      className="w-[150px]"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {
          liked ? (
            <FaHeart
              style={{ color: "#4865F6", fontSize: "28px" }}
              onClick={(e) => {
                e.preventDefault();
                handleLikeSongs(songID);
              }}
            />
          ) : (
            <CiHeart
              style={{ color: "none", fontSize: "28px" }}
              onClick={(e) => {
                e.preventDefault();
                handleLikeSongs(songID);
              }}
            />
          )
        }

        <MdOutlinePlaylistAdd
          onClick={handleOpen}
          style={{ marginLeft: "auto", color: "none", fontSize: "28px" }}
        />
      </div>
</div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={style} className="bg-[#1d1d23] rounded-lg p-4 overflow-y-auto">
          <div className="flex justify-center">
            <div className="text-white text-2xl mb-2">All Playlists</div>
          </div>
          <div className="max-h-[75%] overflow-y-auto mb-2">
            {myPlaylistName.map((it, i) => {
              return <div key={i} onClick={() => setCurrPlaylist(it)} className={`mb-2 ${currPlaylist === it ? 'border-[1px] rounded-lg' : ''}`}><OptionCard playlistName={it} /></div>
            })}
          </div>
          <div className="flex">
          <button
            className="px-6 py-2 ml-auto leading-5 text-white transition-colors duration-200 transform bg-[#4865f6] rounded-md focus:outline-none focus:bg-gray-600"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            className="px-6 py-2 leading-5 ml-5 text-white transition-colors duration-200 transform bg-[#4865f6] rounded-md focus:outline-none focus:bg-gray-600"
            onClick={(e) => {
              handleAddSongToPlaylist(currPlaylist, songID);
            }}
          >
            Add
          </button>
          </div>
          
        </Box>
      </Modal>
      {/* <div className="text-sm mt-[-5px] text-center overflow-hidden">{address}</div> */}
    </div>
  );
}
