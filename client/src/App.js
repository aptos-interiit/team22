// Summary: The main app component which is the parent component of all the other components.


// importing the react library
import React, { useState, useEffect, useRef } from "react";
import AudioPlayer2 from "./MusicPlayer/AudioPlayers2";
import { Network, Provider } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { dataContext } from "./Context/dataContext";
import "./pages/Style.css";
import { FetchUser } from "./helpers/FetchUser.js";
import Dashboard from "./pages/Dashboard.jsx";
import { FetchUserFromAddress } from "./helpers/FetchUserFromAddress.js";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SearchPage from "./pages/SearchPage.jsx";
import LandingPg from "./pages/LandingPg";
import { ToastContainer, toast } from 'react-toastify';
import DynamicComponent from "./components/DynamicComponent.jsx";

// addre: the address of the module
const addre = process.env.REACT_APP_MODULE_ADDRESS;

// res_acc: the address of the resource account
const res_acc = process.env.REACT_APP_RESOURCE_ACCOUNT;

// provider: the provider of the blockchain
export const provider = new Provider(Network.TESTNET);

function App() {

  // account: the account of the user
  const { account, signAndSubmitTransaction } = useWallet();

  // songs: the list of all songs
  const [songs, setSongs] = useState([]);

  // user: the user data
  const [user, setUser] = useState(null);

  // transactionInProgress: the transaction in progress
  const [transactionInProgress, setTransactionInProgress] = useState(0);

  // load: the load of the page
  const [load, setLoad] = useState(0);

  // trackid: the id of the track
  const [trackid, setTrackid] = useState(-1);

  // transact: the transaction
  const [transact, setTransact] = useState(0);

  // current: the current song
  const [current, setCurrent] = useState([]);

  // deposit: the deposit of the user
  const [deposit, setDeposit] = useState(0);

  // usersongs: the songs of the user
  const [usersongs, setUserSongs] = useState([]);

  // latestSong: the latest song
  const [latestSong, setLatestSong] = useState([]);

  // trendingSong: the trending song
  const [trendingSong, setTrendingSong] = useState([]);

  // artistsAndTheirSongs: the artists and their songs
  const [artistsAndTheirSongs, setArtistsAndTheirSongs] = useState([]);

  // searchsong: the search song
  const [searchsong, setSearchsong] = useState([]);

  // useduptime: the used up time
  const [useduptime, setUsedUpTime] = useState(0);

  // myPlaylists: the playlists of the user
  const [myPlaylists, setMyPlaylists] = useState([]);

  // myPlaylistName: the name of the playlists of the user
  const [myPlaylistName, setMyPlaylistsName] = useState([]);

  // disable: the disable
  const [disable, setDisable] = useState(0);

  // radio: the radio
  const [radio, setRadio] = useState([]);

  // isRadio: the is radio
  const [isRadio, setIsRadio] = useState(0);

  // open: the open
  const [open, setOpen] = useState(false)

  // popup: the popup
  const [popup, setPopup] = useState(null)

  // recadd: the rec add
  const [recadd, setRecAdd] = useState(null)

  // recName: the rec name
  const [recName, setRecName] = useState("")

  // distrix: the distribution
  const [distrix, setDistri] = useState(null)

  // currPlaylist: the current playlist
  const [currPlaylist, setCurrPlaylist] = useState(null)

  // useEffect hook
  useEffect(() => {
    if (popup !== null) {
      setTimeout(() => {
        setPopup(null)
      }, 3000)
    }
  }, [popup])

  // modal style
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

  // function to close the modal
  const handleClose = () => setOpen(false);

  // function to add user
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
      await provider.waitForTransaction(response.hash);
      handleInitialReg();
    } catch (err) {
      console.log(err);
    } finally {
      setTransactionInProgress(false);
    }
  };

  // function to handle turbo tip
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

    // transaction
    try {
      const response = await signAndSubmitTransaction(payload);
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

  // function to handle initial registration
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
      setTransact(transact + 1)
      await provider.waitForTransaction(response.hash);
    } catch (err) {
      console.log(err);
    } finally {
      setTransactionInProgress(false);
    }
  };

  // function to handle deposit
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

  // useEffect hook
  useEffect(() => {
    (async () => {
      if (!account) return;
      // fetching all songs
      const todoListResource = await provider.getAccountResource(
        `${addre}`,
        `${addre}::music_platform::All_songs`
      );
      const tableHandle = todoListResource.data.content.handle;
      let songsx = songs;
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
            continue;
          }
          songsx.push(song);
        } catch (err) {
          console.log(err);
        }
      }
      let x = songs.toSorted((b, a) => parseInt(a.timestamp - b.timestamp));
      let y = songs.toSorted((b, a) => parseInt(a.timeListened - b.timeListened));
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
    let temp2 = [];
    let temp3 = []
    user &&
      user.playlists.map((e) => {
        let temp = [];
        temp3.push(e.name);
        e.songs.map((x) => {
          songs.map((f) => {
            if (x === f.id) {
              temp.push(f);
            }
          });
        });
        temp2.push(temp);
      });
    setMyPlaylists(temp2);
    setMyPlaylistsName(temp3);
  }, [load, user]);

  useEffect(() => {
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
      setArtistsAndTheirSongs(artistInfo);
    })();
  }, [load, user]);


  return (
    <dataContext.Provider value={{ handleTurboTip, currPlaylist, setCurrPlaylist, deposit, setDeposit, setLoad, setUser, setUserSongs, user, songs, trackid, setTrackid, account, transact, setTransact, setCurrent, current, usersongs, provider, addre, res_acc, latestSong, trendingSong, searchsong, setSearchsong, useduptime, setUsedUpTime, myPlaylistName, myPlaylists, disable, setDisable, isRadio, setIsRadio, radio, setRadio, artistsAndTheirSongs, setOpen, setPopup, recadd, setRecAdd, recName, setRecName, handleDeposit, distrix, setDistri }}>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={!user ? (<div className="bg-black flex max-h-screen overflow-y-scroll"><LandingPg /></div>) : (<Dashboard load={load} user={user} handleAdd={handleAdd} handleDeposit={handleDeposit} setDeposit={setDeposit} setTrackid={setTrackid}/>)}></Route>
          <Route path="/dashboard" element={<Dashboard load={load} user={user} handleAdd={handleAdd} handleDeposit={handleDeposit} setDeposit={setDeposit} setTrackid={setTrackid}/>}></Route>
          <Route path="/land" element={<LandingPg/>}> </Route>
          <Route path="/dao" element={<DynamicComponent component="daoFrontend" user={user} load={load} handleDeposit={handleDeposit} />}/>
          <Route path="/profile" element={<DynamicComponent component="profile" user={user} load={load} handleDeposit={handleDeposit} />}/>
          <Route path="/my-account" element={<DynamicComponent component="userPage" user={user} load={load} handleDeposit={handleDeposit} />} />
          <Route path="/my-account/editProfile" element={<DynamicComponent component="userPage" user={user} load={load} handleDeposit={handleDeposit} />} />
          <Route path="/addsong" element={<DynamicComponent component="addSong" user={user} load={load} handleDeposit={handleDeposit} />}/>
          <Route path="/search_bar" element={<SearchPage load={load} user={user} handleAdd={handleAdd} handleDeposit={handleDeposit} setDeposit={setDeposit} setTrackid={setTrackid}/>}/>
          <Route path="/yourradio" element={<DynamicComponent component="yourRadio" user={user} load={load} handleDeposit={handleDeposit} />}/>
          <Route path="/allradios" element={<DynamicComponent component="allRadios" user={user} load={load} handleDeposit={handleDeposit} />}/>
          <Route path="/playlistSpace" element={<DynamicComponent component="playlistSpace" user={user} load={load} handleDeposit={handleDeposit} />}/>
          <Route path="/artistSongsSpace" element={<DynamicComponent component="artistSongsSpace" user={user} load={load} handleDeposit={handleDeposit} />}
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
