//Summary: This component is used to display the music card in the music page.


// importing libraries and dependencies
import React, { useContext, useEffect, useState } from "react";
import { dataContext } from "../Context/dataContext";
import play_icon from "../MusicPlayer/assets/playBtn.png";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import 'react-toastify/dist/ReactToastify.css';
import remove from "../MusicPlayer/assets/icons8-remove-50.png";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";

// MusicCard component
export default function MusicCard({ song, id, tracks, inPlaylist, playListName }) {
  const {
    disable,     // disable: disable state
    recName,     // recName: recommended name
    setRecName,  // setRecName: set recommended name
    setCurrent,  // setCurrent: set current
    setTrackid,  // setTrackid: set track id
    setIsRadio,  // setIsRadio: set is radio
    setRadio,    // setRadio: set radio
    recadd,      // recadd: recommended address
    setRecAdd,   // setRecAdd: set recommended address
    distrix,     // distrix: distribution
    setDistri    // setDistri: set distribution
  } = useContext(dataContext);

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
      if (distrix === null) {
        setDistri(dist)
      }
    }
  };

  // liked: liked state
  const [liked, setLiked] = useState(false);

  // transactionInProgress: transaction state
  const [transactionInProgress, setTransactionInProgress] = useState(false);

  // account: account of the user
  const { account, signAndSubmitTransaction } = useWallet();

  // addre: address of the contract
  // provider: provider of the contract
  // transact: transaction state
  // setTransact: set transaction state
  // user: user state
  const { addre, provider, transact, setTransact, user } = useContext(dataContext);

  // useEffect hook
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
  }, [])

  // function to handle like songs
  const handleLikeSongs = async (songID) => {
    if (!account) return;
    if (!user) {
      alert("User not logged in");
      return;
    }
    let likeSongs = user.playlists[0].songs;
    let flag = false;
    for (let i = 0; i < likeSongs.length; i++) {
      if (likeSongs[i] === songID) {
        flag = true;
      }
    }
    if (flag === true) {
      setTransactionInProgress(true);

      // remove song from playlist
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

      // add song to playlist
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

  // function to handle remove song from playlist
  const handleRemoveSongFromPlaylist = async (name, songID) => {
    if (!account) return;
    setTransactionInProgress(true);

    // remove song from playlist
    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${addre}::music_platform::remove_song_from_playlist`,
        typeArguments: [],
        functionArguments: [songID, name],
      },
    };
    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
      setTransact(transact + 1);
    } catch (err) {
      console.log(err);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",];

  const date = new Date(parseInt(song.timestamp));

  // returning the MusicCard component
  return (
    <div className="group w-[250px] sm:w-[85%] sm:mx-16 grid items-center grid-cols-10 sm:grid-cols-10 border-white mx-auto mt-6 sm:mt-8 hover:opacity-80 bg-[#282829] rounded-md py-2">
      <div
        className="w-[60px] h-[60px] sm:mx-auto col-span-1"
        style={{
          backgroundImage: `url(https://tan-mad-salamander-939.mypinata.cloud/ipfs/${song.coverIpfs})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundPosition: "center center",
        }}
      >
        <button
          className="w-[100%] h-[100%] mx-auto opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 ease-in-out"
          onClick={(e) => setid(e, id, tracks, song.owner_name, song.artists, song.distri)}
          style={{
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
      <div className="col-span-2 sm:col-span-2 ml-2 sm:ml-0 items-center grid text-center">
        <div>
          <span>{date.getDate() + " "}</span>
          <span>{months[date.getMonth()] + " "}</span>
          <span>{date.getFullYear()}</span>
        </div>
      </div>

      <div className="col-span-2 sm:col-span-2 ml-2 sm:ml-0 items-center grid px-auto text-center">
        {song.streams}
      </div>

      <div className="col-span-2 sm:col-span-2 ml-2 sm:ml-0 items-center grid">
        {/* only user can delete its own songs' logic*/}
        <button className="px-auto mt-1">
          {String(parseInt(song.duration / 60)).padStart(2, "0")}:
          {String(
            (song.duration - parseInt(song.duration / 60) * 60).toFixed(0)
          ).padStart(2, "0")}
        </button>
      </div>

      <div className="flex">
        {liked ? (
          <FaHeart
            className="cursor:pointer ml-3 mr-2  "
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
        )
        }
        { inPlaylist ? (
            <button className="mr-6" onClick={(e) => {
              e.preventDefault();
              handleRemoveSongFromPlaylist(playListName, song.id)
            }}
            > <img src={remove} alt="remove" className="h-5 w-5 ml-3" />
            </button>
          ) : (
            <></>
          )
        }
      </div>
    </div>
  );
}
