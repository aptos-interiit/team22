import React, { useState, useEffect, useRef } from "react";
import AudioPlayer2 from "./MusicPlayer/AudioPlayers2";
import { Network, Provider } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { dataContext } from "./Context/dataContext";
import "./pages/Style.css";
import SideSlider from "./pages/SideSlider";
import AlbumPage from "./pages/AlbumPage";
import UserPage from "./pages/UserPage";
import LandingPage from "./pages/LandingPage";
import { FetchUser } from "./helpers/FetchUser.js";
import Dashboard from "./pages/Dashboard.jsx";
import AddSongPage from "./pages/AddSongPage.jsx";
import PlaylistSpace from "./components/PlaylistSpace.jsx";
import ProfilePg from "./pages/ProfilePg";
import { FetchUserFromAddress } from "./helpers/FetchUserFromAddress.js";
import ArtistSongsSpace from "./components/ArtistSongsSpace.jsx";
import YourRadio from "./pages/YourRadio.jsx";
import AllRadios from "./pages/AllRadios.jsx";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SearchPage from "./pages/SearchPage.jsx";
import LandingPg from "./pages/LandingPg";
import Navbar from "./pages/Navbar.jsx";
import { ToastContainer, toast } from 'react-toastify';
import AboutUs from "./pages/AboutUs";
import DaoFrontend from "./pages/DaoFrontend.jsx";



const addre = process.env.REACT_APP_MODULE_ADDRESS;
const res_acc = process.env.REACT_APP_RESOURCE_ACCOUNT;
export const provider = new Provider(Network.TESTNET);

function App() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [songs, setSongs] = useState([]);
  const [user, setUser] = useState(null);
  const [transactionInProgress, setTransactionInProgress] = useState(0);
  const [load, setLoad] = useState(0);
  const [trackid, setTrackid] = useState(-1);
  const [transact, setTransact] = useState(0);
  const [current, setCurrent] = useState([]);
  const [deposit, setDeposit] = useState(0);
  const [usersongs, setUserSongs] = useState([]);
  const [latestSong, setLatestSong] = useState([]);
  const [trendingSong, setTrendingSong] = useState([]);
  const [artistsAndTheirSongs, setArtistsAndTheirSongs] = useState([]);
  const [searchsong, setSearchsong] = useState([]);
  const [useduptime, setUsedUpTime] = useState(0);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [myPlaylistName, setMyPlaylistsName] = useState([]);
  const [disable, setDisable] = useState(0);
  const [radio, setRadio] = useState([]);
  const [isRadio, setIsRadio] = useState(0);
  const [open, setOpen] = useState(false)
  const [popup, setPopup] = useState(null)
  const [recadd, setRecAdd] = useState(null)
  const [recName, setRecName] = useState("")
  const [distrix, setDistri] = useState(null)
  const [currPlaylist, setCurrPlaylist] = useState(null)


  

  useEffect(() => {
    if (popup !== null) {
      setTimeout(() => {
        setPopup(null)
      }, 3000)
    }
  }, [popup])

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

  const handleClose = () => setOpen(false);

  const handleAdd = async () => {
    if (!account) return;

    setTransactionInProgress(true);

    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${addre}::music_platform::add_user`,
        typeArguments: [],
        functionArguments: ["name", "hash", "loc", "desc"],
      },
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      // console.log("user added");
      await provider.waitForTransaction(response.hash);
      handleInitialReg();
    } catch (err) {
      console.log(err);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const handleTurboTip = async (amount, to_address) => {
    if (!account) return;

    if (amount === 0) {
      toast.error(`Amount of APT should be greater than zero!!!`, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    setTransactionInProgress(true);

    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${addre}::music_platform::donate`,
        typeArguments: [],
        functionArguments: [to_address, amount],
      },
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      // console.log("Paise sent");
      await provider.waitForTransaction(response.hash);

      toast.success(`Thank you for contributing!!!`, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      return "success";

    } catch (err) {
      console.log(err);
      return "error";
    } finally {
      setTransactionInProgress(false);
    }
  }

  const handleInitialReg = async () => {
    if (!account) return;

    setTransactionInProgress(true);

    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${res_acc}::simple_defi::initial_registration`,
        typeArguments: [],
        functionArguments: [],
      },
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      // console.log("registered too");
      setTransact(transact + 1)
      await provider.waitForTransaction(response.hash);
    } catch (err) {
      console.log(err);
    } finally {
      setTransactionInProgress(false);

    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!account) return;

    if (deposit < 0.05) {
      alert("Minimum deposit should be 0.05 Aptos");
      return;
    }
    setTransactionInProgress(true);

    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${addre}::music_platform::add_deposit`,
        typeArguments: [],
        functionArguments: [deposit * 1e8],
      },
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
      setTransact(transact + 1)
      setDeposit(0)
      handleClose();
    } catch (err) {
      console.log(err);
    } finally {
      setTransactionInProgress(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!account) return;

      const todoListResource = await provider.getAccountResource(
        `${addre}`,
        `${addre}::music_platform::All_songs`
      );
      // console.log(todoListResource);
      const tableHandle = todoListResource.data.content.handle;
      let songsx = songs;
      // console.log("songsx", songsx);
      // console.log("songsx", songsx);
      let len = todoListResource.data.all_indexes.length

      for (let i = 0; i < len; i++) {
        const tableItem = {
          key_type: "u64",
          value_type: `${addre}::music_platform::Song`,
          key: `${todoListResource.data.all_indexes[i]}`,
        };
        try {
          const song = await provider.getTableItem(tableHandle, tableItem);
          if (songsx.some((e) => e.IpfsHash !== song.IpfsHash)) {
            // console.log("Already exists");
            continue;
          }
          songsx.push(song);
        } catch (err) {
          console.log(err);
        }
      }
      // console.log("all songs", songs);
      let x = songs.toSorted((b, a) => parseInt(a.timestamp - b.timestamp));
      let y = songs.toSorted((b, a) => parseInt(a.timeListened - b.timeListened));

      // console.log("trending songs", y);
      // console.log("latest songs", x);
      setLatestSong(x.slice(0, 5));
      setTrendingSong(y.slice(0, 5));
      setSongs(x);
      setLoad(1);
    })();
  }, [account]);

  useEffect(() => {
    (async () => {
      if (!account) return;
      try {
        const usery = await FetchUser(account);
        // console.log(usery);
        setUser(usery);
        setUserSongs(usery.songs);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [account, transact]);

  useEffect(() => {
    if (!account) return;
    if (!songs) return;
    if (load === 0) return;
    if (!user) return;

    // console.log("updating playlist");
    let temp2 = [];
    let temp3 = [];
    // console.log(user.playlists);
    user &&
      user.playlists.map((e) => {
        let temp = [];
        temp3.push(e.name);
        // console.log("name of playlist", e.name);
        // console.log("songs in playlist", e.songs);
        e.songs.map((x) => {
          // console.log("id of song", x);
          songs.map((f) => {
            // console.log("songs", f);
            if (x === f.id) {
              // console.log("pushing", f);
              temp.push(f);
            }
          });
        });
        // console.log("pushed songs", temp);
        temp2.push(temp);
      });
    setMyPlaylists(temp2);
    setMyPlaylistsName(temp3);
  }, [load, user]);

  useEffect(() => {
    // console.log("myplaylist from App.jsx", myPlaylists);
    // console.log("myplaylistname from App.jsx", myPlaylistName);
  }, [myPlaylists]);

  useEffect(() => {
    //artists songs bifergation
    if (!account) return;
    if (!songs) return;
    if (load === 0) return;
    if (!user) return;

    let temp = {};
    let artistInfo = [];
    for (let i = 0; i < songs.length; i++) {
      let song = songs[i];
      for (let j = 0; j < song.artists.length; j++) {
        if (!temp[song.artists[j]]) {
          temp[song.artists[j]] = [];
        }

        temp[song.artists[j]].push(song);
      }
    }


    (async () => {
      for (let i = 0; i < Object.keys(temp).length; i++) {
        let info = await FetchUserFromAddress(Object.keys(temp)[i]);
        artistInfo.push(info);
      }
      // console.log("artist info", artistInfo);
      setArtistsAndTheirSongs(artistInfo);
    })();


  }, [load, user]);

  useEffect(() => {
    // console.log("artists and their songs", artistsAndTheirSongs);
  }, [artistsAndTheirSongs])

  return (
    <dataContext.Provider
      value={{
        handleTurboTip,
        currPlaylist, setCurrPlaylist,
        deposit, setDeposit,
        setLoad,
        setUser,
        setUserSongs,
        user,
        songs,
        trackid,
        setTrackid,
        account,
        transact,
        setTransact,
        setCurrent,
        current,
        usersongs,
        provider,
        addre,
        res_acc,
        latestSong,
        trendingSong,
        searchsong,
        setSearchsong,
        useduptime,
        setUsedUpTime,
        myPlaylistName,
        myPlaylists,
        disable,
        setDisable,
        isRadio,
        setIsRadio,
        radio,
        setRadio,
        artistsAndTheirSongs,
        setOpen,
        setPopup,
        recadd,
        setRecAdd,
        recName,
        setRecName,
        handleDeposit,
        distrix,
        setDistri,
      }}
    >
      {/* {
        popup === null ? (<></>):(<>
          <div className={`p-5 absolute flex w-[250px] h-[150px] content-center justify-center bg-gray-900 right-12 rounded-xl top-12 text-white flex-col`}>
            <p className="ml-auto mr-auto">Transaction Sent!</p>
            <p className="ml-auto mr-auto">{popup.amount}</p>
            <p className="ml-auto mr-auto">{popup.artistName}</p>
          </div>
        </>)
      } */}      
      {/* Same as */}
      <ToastContainer />

      <Router>
        <Routes>
          <Route
            path="/"
            element={
              !user ? (
                <div className="bg-black flex max-h-screen overflow-y-scroll">

                  <LandingPg />
                </div>
              ) : (
                <Dashboard
                  load={load}
                  user={user}
                  handleAdd={handleAdd}
                  handleDeposit={handleDeposit}
                  setDeposit={setDeposit}
                  setTrackid={setTrackid}
                />
              )
            }
          ></Route>
          <Route
            path="/dashboard"
            element={
              <Dashboard
                load={load}
                user={user}
                handleAdd={handleAdd}
                handleDeposit={handleDeposit}
                setDeposit={setDeposit}
                setTrackid={setTrackid}
              />
            }
          ></Route>
          <Route path="/land" element={<LandingPg/>}> </Route>
          <Route
            path="/dao"
            element={
              <>
                <div className="bg-black flex">
                  <div className="border-e">
                    <SideSlider />
                  </div>
                  <div className="w-full">
                    {load ? (
                      <>
                        <div className=" max-h-screen overflow-y-scroll">
                          <Navbar savings={user ? user.savings : 0} handleDeposit={handleDeposit}></Navbar>
                          <DaoFrontend />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="loader"></div>
                      </>
                    )}
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <div className="bg-black flex max-h-screen overflow-y-scroll">
                <div className="border-e">
                    <SideSlider />
                  </div>
                  <div className="w-full">
                    {load ? (
                      <>
                        <div className="">
                          <ProfilePg />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="loader"></div>
                      </>
                    )}
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="/my-account"
            element={
              <>
                <div className="bg-black flex">
                <div className="border-e">
                    <SideSlider />
                  </div>
                  <div className="w-full">
                    {load ? (
                      <>
                        <div className="">
                          <UserPage />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="loader"></div>
                      </>
                    )}
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="/my-account/editProfile"
            element={
              <>
                <div className="bg-black flex">
                <div className="border-e">
                    <SideSlider />
                  </div>
                  <div className="w-full">
                    {load ? (
                      <>
                        <div className="">
                          <UserPage />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="loader"></div>
                      </>
                    )}
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="/addsong"
            element={
              <>
                <div className="bg-black flex">
                <div className="border-e">
                    <SideSlider />
                  </div>
                  <div className="w-full">
                    {load ? (
                      <>
                        <Navbar savings={user ? user.savings : 0} handleDeposit={handleDeposit}></Navbar>
                        <div className="max-h-[100%] overflow-y-scroll">
                          <AddSongPage />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="loader"></div>
                      </>
                    )}
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="/search_bar"
            element={
              <SearchPage
                load={load}
                user={user}
                handleAdd={handleAdd}
                handleDeposit={handleDeposit}
                setDeposit={setDeposit}
                setTrackid={setTrackid}
              />
            }
          />
          <Route
            path="/yourradio"
            element={
              <>
                <div className="bg-black flex ">
                  <div className="border-e">
                    <SideSlider />
                  </div>
                  <div className="w-full max-h-screen overflow-y-scroll">
                    {load ? (
                      <>
                        <Navbar savings={user ? user.savings : 0} handleDeposit={handleDeposit}></Navbar>
                        <div className="">
                          <YourRadio />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="loader"></div>
                      </>
                    )}
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="/allradios"
            element={
              <>
                <div className="bg-black flex">
                <div className="border-e">
                    <SideSlider />
                  </div>
                  <div className="w-full">
                    {load ? (
                      <>
                        <Navbar savings={user ? user.savings : 0} handleDeposit={handleDeposit}></Navbar>
                        <div className="">
                          <AllRadios />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="loader"></div>
                      </>
                    )}
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="/playlistSpace"
            element={
              <>
                <div className="bg-black flex">
                <div className="border-e">
                    <SideSlider />
                  </div>
                  <div className="w-full">
                    {load ? (
                      <>
                        <div className="">
                          <PlaylistSpace />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="loader"></div>
                      </>
                    )}
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="/artistSongsSpace"
            element={
              <>
                <div className="bg-black flex">
                <div className="border-e">
                    <SideSlider />
                  </div>
                  <div className="w-full">
                    {load ? (
                      <>
                        <div className="">
                          <ArtistSongsSpace />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="loader"></div>
                      </>
                    )}
                  </div>
                </div>
              </>
            }
          />
        </Routes>
      </Router>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={style}>
          <section className="max-w-4xl p-6 mx-auto bg-indigo-600 rounded-md shadow-md dark:bg-gray-800">
            <h1 className="text-xl font-bold text-white capitalize dark:text-white">Add Deposit(in Aptos)</h1>
            <form >
              <div className="grid grid-cols-1 gap-6 mt-4 ">
                <div>
                  <label className="text-white dark:text-gray-200" htmlFor="pname">Amount in APT</label>
                  <input step="any" onChange={(e) => setDeposit(e.target.value)} id="pname" type="number" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                </div>
                {/* </div> */}

                <div className="flex justify-end mt-6">
                  <button onClick={handleClose} className="px-6 py-2 mx-5 leading-5 text-white transition-colors duration-200 transform bg-[#4865f6] rounded-md focus:outline-none focus:bg-gray-600">Cancel</button>
                  <button onClick={(e) => handleDeposit(e)} className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-[#4865f6] rounded-md focus:outline-none focus:bg-gray-600">Add</button>
                </div>
              </div>
            </form>
          </section>
        </Box>

      </Modal>

      {load && trackid !== -1 ? (
        <div className="sticky bottom-0">
          <AudioPlayer2 />
        </div>
      ) : (
        <></>
      )}
    </dataContext.Provider>
  );
}

export default App;
