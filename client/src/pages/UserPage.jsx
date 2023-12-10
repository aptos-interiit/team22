import React, { useContext, useState } from "react";
import { dataContext } from "../Context/dataContext";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";
import { useEffect } from "react";

const addre =process.env.REACT_APP_MODULE_ADDRESS;
const res_acc = process.env.REACT_APP_RESOURCE_ACCOUNT;
export const provider = new Provider(Network.DEVNET);

function UserPage() {
  const { account, signAndSubmitTransaction } = useWallet();
  const { distrix, setDistri, recName, setRecName ,recadd, setRecAdd, disable, setTrackid, setCurrent, usersongs, addre, provider, songs, setUsedUpTime, setIsRadio ,setRadio} =
    useContext(dataContext);
  const [disp, setDisp] = useState("hidden");
  const [show, setShow] = useState("hidden")
  const [addsongs, setAddSongs] = useState([])
  const [radios, setRadios] = useState([])
  const [tstatus, setTransactionInProgress] = useState(0)
  const [hashArray, setHashArray] = useState([]);

  const getIpfsObject = async (ids, title) => {
    const todoListResource = await provider.getAccountResource(
      `${addre}`,
      `${addre}::music_platform::All_songs`
    );
    console.log(todoListResource);
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
        console.log(song);
        if (songsx.some((e) => e.IpfsHash !== song.IpfsHash)) {
          console.log("Already exists");
          continue;
        }
        songsx.push(song);
      } catch (err) {
        console.log(err);
      }
    }
    let radio = {"title": title, songs: songsx};
    return radio;
    setHashArray(songsx)
    console.log(hashArray)
    // return songsx;
  }
  
  useEffect(() => {
    (async () => {
        if (!account) return;

        const todoListResource = await provider.getAccountResource(
          `${addre}`,
          `${addre}::music_platform::All_radios`
        );
        console.log(todoListResource);
        const tableHandle = todoListResource.data.content.handle;
        let radiosx = [];
        
        for (let i = 0; i < todoListResource.data.all_indexes.length; i++) {
          const tableItem = {
            key_type: "u64",
            value_type: `${addre}::music_platform::Radio`,
            key: `${todoListResource.data.all_indexes[i]}`,
          };
          try {
            const radio = await provider.getTableItem(tableHandle, tableItem);
            console.log(radio);
            let arr = radio.songs;
            let object = await getIpfsObject(arr, radio.title);
            console.log(object)
            radiosx.push(object);
          } catch (err) {
            console.log(err);
          }
        }
        setRadios(radiosx)
        console.log(radiosx);
        console.log(hashArray)
      })();
      
    }, [account]);

  const handleDel = async (id) => {
    if (!account) return;

    console.log(id);
    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${addre}::music_platform::remove_song`,
        typeArguments: [],
        functionArguments: [id],
      },
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
    } catch (error) {
      console.log("error", error);
    } finally {
      window.location.href = "/";
    }
  };

  const toggleClick = () => {
    if (show === "hidden") {
      setShow("block");
    } else {
      setShow("hidden");
    }
    console.log(addsongs)
  }

  const addradio = async () => {
    if (!account) return;
    setTransactionInProgress(true);    

    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${addre}::music_platform::create_radio`,
        typeArguments: [],
        functionArguments: ["nameradio", "descradio", true, addsongs ],
      },
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      console.log("added");
      console.log(response)
      await provider.waitForTransaction(response.hash);
      
    } catch (err) {
      console.log(err);
    } finally {
      setTransactionInProgress(false);
    }    
  }

  const handleclick = (e, id, i) => {
    e.preventDefault();
    setAddSongs([...addsongs, id]);
    document.getElementById(i).style.display = "none"
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

  const HandleEdit = () => {
    if (disp === "hidden") {
      setDisp("block");
    } else {
      setDisp("hidden");
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    console.log(e.target.profile_name.value);
    console.log(e.target.profile_type.value);
    console.log(e.target.profile_location.value);
  };

  const handleRadioCalculations = async (radio) => {
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    const seconds = new Date().getSeconds();
    setRadio(radio)
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    let duration = [];
    let songs = [];
    radio.songs.map((it, id) => {
      songs.push(it);
      duration.push(parseInt(it.duration))
    })
    console.log(duration)
    let prefix_array = [];
    prefix_array.push(duration[0]);
    for(let i = 1; i < duration.length; i++) {
      prefix_array.push(parseInt(prefix_array[prefix_array.length - 1]) + duration[i]);
    }
    console.log(prefix_array)
    const timestamp = totalSeconds % prefix_array[prefix_array.length - 1];
    console.log(totalSeconds % prefix_array[prefix_array.length - 1]);
    let usedUpTime;
    let index;
    for(let i = 0; i < prefix_array.length; i++) {
      if(prefix_array[i] >= timestamp) {
        if(i == 0) {
          usedUpTime = timestamp;
        } else {
          usedUpTime = timestamp - prefix_array[i - 1];
        }
        index = i;
        break;
      } 
    }
    console.log({index, usedUpTime});
    console.log(songs)
    setTrackid(index);
    setCurrent(songs);
    setUsedUpTime(usedUpTime);
    setIsRadio(1)    
    // console.log({hours, minutes, seconds})
    // console.log(scaleTimeToRange(hours, minutes, seconds, 24, 0.00000000005, prefix_array[prefix_array.length - 1]))
    console.log(radio)
  }


  return (
    // <div className="group col-span-1 cursor-pointer rounded-md  bg-neutral-600 bg-opacity-10 p-3 transition-all duration-300 ease-in-out hover:bg-opacity-20 bg-gray-600">
    <>
      <div className="group relative w-full overflow-hidden rounded-xl shadow-lg shadow-neutral-900 transition-all duration-300 ease-in-out bg-gray-700 grid grid-cols-10 ">
        <div className="col-span-2">
          <img
            className="rounded-md  object-cover "
            src="https://tune.fm/public/images/default-music-listing.svg"
            alt={"User/Artist Image"}
          />
        </div>
        <div className="pl-2 col-span-8">
          <h1 className="mt-5 truncate text-lg font-bold text-white">
            Name of Artist/User
          </h1>
          <p className="mt-2 line-clamp-3 text-sm font-semibold text-gray-400">
            yaha par description aayega Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type
            specimen book. It has survived not only five centuries, but also the
            leap into electronic typesetting, remaining essentially unchanged.
            It was popularised in the 1960s with the release of Letraset sheets
            contai m Ipsum has been the industry's standard dummy text ever
            since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only
            five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
          <button
            onClick={HandleEdit}
            className="rounded-lg border-2 p-3 m-2 mt-5 bottom-5"
          >
            Edit Profile
          </button>
        </div>
      </div>
      <form className={disp} onSubmit={handleSave}>
        <label className="ml-2">Profile name</label>
        <div
          id="profname"
          className="group relative ml-2 w-1/2 overflow-hidden rounded-xl   shadow-neutral-900 transition-all duration-300 ease-in-out bg-gray-700"
        >
          <input
            type="text"
            className="w-full  shadow-neutral-900 text-white bg-gray-700 pl-3"
            placeholder="Profile name"
            id="profile_name"
            autoComplete="off"
          />
        </div>
        <label className="ml-2">Profile type</label>
        <div
          id="proftype"
          className="group relative ml-2 w-1/2 overflow-hidden rounded-xl   shadow-neutral-900 transition-all duration-300 ease-in-out bg-gray-700"
        >
          <select
            id="profile_type"
            className="w-full text-white shadow-neutral-900 bg-gray-700 pl-3"
            name="Profile type"
          >
            <option>Fan</option>
            <option>Artist</option>
          </select>
        </div>
        <label className="ml-2">location</label>
        <div
          id="loc"
          className="group relative ml-2 w-1/2 overflow-hidden rounded-xl   shadow-neutral-900 transition-all duration-300 ease-in-out bg-gray-700"
        >
          <input
            type="text"
            className="w-full  shadow-neutral-900 text-white bg-gray-700 pl-3"
            placeholder="Profile location"
            id="profile_location"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="group text-white relative w-1/6 overflow-hidden rounded-xl ml-2 shadow-neutral-900 transition-all duration-300 ease-in-out bg-gray-700 mt-1"
        >
          save
        </button>
      </form>
      <div className="w-full">
        <main className="grid place-items-center bg-slate-700 p-5 w-full">
          <div>
            <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* <!-- CARD 1 --> */}
              {usersongs.map((it, i) => {
                return (
                  <div
                    key={i}
                    className="bg-gray-900 shadow-lg rounded p-3 select-none"
                  >
                    <div className="group relative">
                      <img
                        className="w-full md:w-72 block rounded object-cover h-48"
                        src={`https://tan-mad-salamander-939.mypinata.cloud/ipfs/${it.coverIpfs}`}
                        alt=""
                      />
                      <div className="absolute bg-black rounded bg-opacity-0 group-hover:bg-opacity-60 w-full h-full top-0 flex items-center group-hover:opacity-100 transition justify-evenly">
                        <button
                          onClick={(e) => setid(e, i, usersongs, it.owner_name, it.artists, it.distri)}
                          className="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            fill="currentColor"
                            className="bi bi-play-circle-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-white text-lg">
                        {it.title} idx = {i}
                      </h3>
                      <p className="text-gray-400 truncate">{it.owner}</p>
                      <button onClick={() => handleDel(it.id)}>Delete</button>
                    </div>
                  </div>
                );
              })}

              {/* <!-- END OF CARD 1 --> */}
            </section>
          </div>
        </main>
      </div>

      <div className="group relative w-full overflow-hidden rounded-xl   shadow-neutral-900 transition-all duration-300 ease-in-out bg-gray-700">
        My Radios
        <div>
        <div>
        {radios && radios.map((it, i) => {
          // const arr = it.songs
          // console.log(it.songs) 
          // getIpfsArray(arr);
                return (
                  <div
                    key={i}                    
                    className="bg-gray-900 shadow-lg rounded p-3 select-none"
                  >                    
                    <div className="p-5">
                      <h3 className="text-white text-lg">
                        {radios[i].title}                         
                      </h3>
                      <button className="text-white text-lg" onClick={()=>handleRadioCalculations(radios[i])}>Play Radio</button>
                      {
                        radios[i].songs.map((it2, id2) => {
                          return(<p className="text-white" key={id2}>song:{it2.ipfsHash}</p>)
                        })
                      }
                    </div>
                  </div>
                );
              })}
        </div>
        <button type="button" onClick={toggleClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Start Radio</button>
        <div className={`${show}`}>
        {songs.map((it, i) => {
                return (
                  <div
                    key={i}
                    id={`${i}`}
                    className="bg-gray-900 shadow-lg rounded p-3 select-none hover:cursor-pointer mb-2"
                    onClick={(e) => handleclick(e, it.id, i)}
                  >                    
                    <div className="p-5">
                      <h3 className="text-white text-lg">
                        {it.title} idx = {i}
                      </h3>
                      <p className="text-gray-400 truncate">{it.owner}</p>                    
                    </div>
                  </div>
                );
              })}
              <button type="button" onClick={addradio} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">ADD</button>
        </div>
        </div>
      </div>
      <div className="group relative w-full overflow-hidden rounded-xl   shadow-neutral-900 transition-all duration-300 ease-in-out bg-gray-700">
        Location
      </div>
      </>
    // </div>
  );
}

export default UserPage;
