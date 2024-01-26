// Purpose: Provide the user with the ability to create their own radio station and add songs to it.



// importing dependencies
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React, { useState, useEffect, useContext, useRef } from "react";
import { dataContext } from "../Context/dataContext";
import { FaSearch } from "react-icons/fa";
import SearchPg from "./SearchPg";
import RadioCard from "../components/RadioCard";
import { toast } from "react-toastify";


// YourRadio component
function YourRadio() {

  // account: account of the user
  const { account, signAndSubmitTransaction } = useWallet();
  const {
    addre,          // addre: address of the contract
    provider,       // provider: provider of the contract                              
    songs,          // songs: songs array
    setRadio,       // setRadio: set radio
    setTrackid,     // setTrackid: set track id
    setCurrent,     // setCurrent: set current
    setUsedUpTime,  // setUsedUpTime: set used up time
    setIsRadio,     // setIsRadio: set is radio     
    radio,          // radio: radio
    recadd,         // recadd: recommended address
    setRecAdd,      // setRecAdd: set recommended address
    recName,        // recName: recommended name
    setRecName,     // setRecName: set recommended name
    setDistri,      // setDistri: set distribution
    distrix         // distrix: distribution
  } = useContext(dataContext);

  // userRadio: user radio
  const [userradio, setUserRadio] = useState(null);
  
  // showsongs: show songs
  const [showsongs, setShowSongs] = useState(songs);

  // load: load state
  const [load, setLoad] = useState(1);

  // show: show state
  const [show, setShow] = useState("hidden");

  // addsongs: add songs
  const [addsongs, setAddSongs] = useState([]);

  // transactionInProgress: transaction state
  const [tstatus, setTransactionInProgress] = useState(0);

  // flag: flag state
  const [flag, setFlag] = useState(0)

  // isRadio: is radio state
  const [radioid, setRadioId] = useState(0)

  // isRadio: is radio state
  const [radioName, setRadioName] = useState("")

  // isRadio: is radio state
  const [radioDesc, setRadioDesc] = useState("")    

  // bottomRef: bottom reference
  const bottomRef = useRef(null);

  // function to handle click
  const handleclick = (e, idx, song) => {
    e.preventDefault();
    setAddSongs([...addsongs, song]);              
  }; 

  // function to search
  const search = (e) => {
    e.preventDefault();    
    let value = e.target.value;
    if(value[value.length-1]>='A' && value[value.length-1] <= 'Z'){
      let search = SearchPg(songs, value)   
      setShowSongs(search)
    }
    else if(value[value.length-1]>='a' && value[value.length-1] <= 'z'){
      let search = SearchPg(songs, value)   
      setShowSongs(search)
    }
    else if(value === ""){
      let search = SearchPg(songs, value)   
      setShowSongs(search)
    }

  }

  // function to remove
  const remove = (e, idx, song) => {
    e.preventDefault();
    setAddSongs((current) =>
      current.filter((it, id) => {
        return id !== idx;
      })
    );    
    
  };  

  // function to toggle click
  const toggleClick = () => {
    if (show === "hidden") {
      setShow("block");
    } else {
      setShow("hidden");
    }    
  };

  // useEffect hook
  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  },[show])

  // function to add radio
  const addradio = async () => {
    if (!account) return;
    setTransactionInProgress(true);
    const arr = [];
    for (let i = 0; i < addsongs.length; i++) {
      arr.push(addsongs[i].id);
    }
    if(radioName === "" || radioDesc === ""){
      toast.error(`Fields cant be empty`, {
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
    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${addre}::music_platform::create_radio`,
        typeArguments: [],
        functionArguments: [`${radioName}`, `${radioDesc}`, true, arr],
      },
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
      setFlag(!flag)
      setShow("hidden")
    } catch (err) {
      console.log(err);
    } finally {
      setTransactionInProgress(false);
    }
  };

  // function to add songs to radio
  const addsongstoradio = async () => {
    if (!account) return;
    setTransactionInProgress(true);
    const arr = [];
    for (let i = 0; i < addsongs.length; i++) {
      arr.push(addsongs[i].id);
    }
    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${addre}::music_platform::add_songs_to_radio`,
        typeArguments: [],
        functionArguments: [radioid, arr],
      },
    };
    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
      setFlag(!flag)
      setShow("hidden")
    } catch (err) {
      console.log(err);
    } finally {
      setTransactionInProgress(false);
    }
  };

  // function to delete radio
  const handleDelete = async (e) => {
    e.preventDefault();
    if (!account) return;
    setTransactionInProgress(true);          
    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${addre}::music_platform::delete_radio`,
        typeArguments: [],
        functionArguments: [radioid],
      },
    };
    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
      setFlag(!flag)      
    } catch (err) {
      console.log(err);
    } finally {
      setTransactionInProgress(false);
    }
  };

  // function to disable radio
  const handleDisable = async (e, isActive) => {
    e.preventDefault();
    if (!account) return;
    setTransactionInProgress(true);          
    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${addre}::music_platform::change_radio_state`,
        typeArguments: [],
        functionArguments: [radioid, isActive],
      },
    };
    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
      setFlag(!flag)      
    } catch (err) {
      console.log(err);
    } finally {
      setTransactionInProgress(false);
    }
  }  


  // function to get ipfs object
  const getIpfsObject = async (ids, title, desc, user_address, is_active) => {
    const todoListResource = await provider.getAccountResource(
      `${addre}`,
      `${addre}::music_platform::All_songs`
    );
    const tableHandle = todoListResource.data.content.handle;
    let songsx = [];
    for (let i = 0; i < ids.length; i++) {
      const tableItem = {
        key_type: "u64",
        value_type: `${addre}::music_platform::Song`,
        key: `${ids[i]}`,
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
    let radio = { title: title, songs: songsx, desc:desc, user_address:user_address, isActive:is_active};
    return radio;
  };

  // function to handle radio calculations
  const handleRadioCalculations = async (radioz) => {
    if(radio.user_address && radio.user_address === radioz.user_address){
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
    let prefix_array = [];
    prefix_array.push(duration[0]);
    for (let i = 1; i < duration.length; i++) {
      prefix_array.push(
        parseInt(prefix_array[prefix_array.length - 1]) + duration[i]
      );
    }
    const timestamp = totalSeconds % prefix_array[prefix_array.length - 1];
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
    setTrackid(index);
    setCurrent(songs);
    setUsedUpTime(usedUpTime);
    setIsRadio(1);
    
    if(recadd === null){
      setRecAdd(songs[index].owner)
    }
    if(recName === ""){
      setRecName(songs[index].owner_name)
    }
    if(distrix === null){
      setDistri(songs[index].distri)
    }
  };

  useEffect(() => {
    (async () => {
      if (!account) return;
      setLoad(1)
      setUserRadio(null)
      setAddSongs([])
      setShowSongs(songs)
      const todoListResource = await provider.getAccountResource(
        `${addre}`,
        `${addre}::music_platform::All_radios`
      );
      const tableHandle = todoListResource.data.content.handle;
      for (let i = 0; i < todoListResource.data.all_indexes.length; i++) {
        const tableItem = {
          key_type: "u64",
          value_type: `${addre}::music_platform::Radio`,
          key: `${todoListResource.data.all_indexes[i]}`,
        };
        try {
          const radio = await provider.getTableItem(tableHandle, tableItem);
          
          if (radio.user_address === account.address) {
            setRadioId(todoListResource.data.all_indexes[i])
            let arr = radio.songs;
            let object = await getIpfsObject(arr, radio.title, radio.description, radio.user_address, radio.is_active);
            setUserRadio(object);             
          }
        } catch (err) {
          console.log(err);
        }
      }      
      setLoad(0);
    })();
  }, [flag]);

  

  return (
    <div>
      {load ? (
        <>
          <div className="loader"></div>
        </>
      ) : (
        <>
          <div>
            {userradio ? (
              <>
                <div className="flex flex-col mb-10">
                  <p className="text-4xl ml-auto mr-auto mt-5 mb-5 text-white">
                    Your Radio
                  </p>
                 
                  <div className="bg-[#282829] shadow-lg rounded  ml-auto mr-auto select-none w-2/3">
                    <div className="p-8 flex">
                      <div className="text-white">                        
                        <p className="text-2xl">{userradio.title}</p> 
                        <p>Description: {userradio.desc}</p> 
                      </div>
                      {
                        userradio.isActive ? (<>
                      <button
                        type="button"
                        onClick={() => handleRadioCalculations(userradio)}
                        className="ml-auto max-h-[80px] text-black bg-white hover:bg-white focus:ring-4 focus:ring-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-white dark:hover:bg-white focus:outline-none dark:focus:ring-white"
                      >
                        Play Radio
                      </button>
                        </>):(<><div className="ml-auto"></div></>)
                      }
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, radioid)}
                        className="text-white max-h-[80px] bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                      >
                        Delete Radio
                      </button>
                    </div>
                    <hr/>
                    <div className="flex p-8">
                      <div className="w-4/5">
                      <p className="text-3xl text-white">Songs:</p>
                      <br/>
                        {userradio.songs.map((it2, id2) => {
                          return (
                            <p className="text-white text-xl p-3 bg-gray-900 mt-3 rounded-lg" key={id2}>
                              {id2}. {it2.title} - {it2.owner_name}
                            </p>
                          );
                        })}
                      </div>
                      <div className="ml-auto flex flex-col">
                        {
                          userradio.isActive ? (<><button
                            type="button"
                            onClick={(e) => handleDisable(e, false)}
                            className="mt-auto text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-radio-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                          >
                            Disable Radio
                          </button></>):(<>
                            <button
                          type="button"
                          onClick={(e) => handleDisable(e, true)}
                          className="ml-auto max-h-[100px] text-black bg-white hover:bg-white focus:ring-4 focus:ring-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-white dark:hover:bg-white focus:outline-none dark:focus:ring-white"
                        >
                          Enable Radio
                        </button>
                          </>)
                        }
                      
                        <button
                          type="button"
                          onClick={toggleClick}
                          className="mt-auto max-h-[100px] text-black bg-white hover:bg-white focus:ring-4 focus:ring-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-white dark:hover:bg-white focus:outline-none dark:focus:ring-white"
                        >
                          Add Songs
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-white flex justify-around mb-20">                  
                <div className="w-2/5">
                <p className={`${show} text-4xl ml-auto mr-auto mb-10 text-white`}>Choose Songs</p>
                <div                
                    className={` flex flex-col ${show} rounded-lg h-[850px] border pt-5 pb-5`}
                  >
                    
                    <div className="flex flex-col h-full w-full justify-center gap-5 mb-5 content-center">
                      <div className="flex">
                        <FaSearch className="mt-auto mb-auto ml-auto mr-2" style={{ color: 'white', fontSize: '28px'}} />
                        <input
                            type="text"
                            className="w-5/6 p-2 text-black rounded-lg mr-auto"
                            placeholder="Search"    
                            onChange={(e) => search(e)}                            
                        />
                    </div>
                    <div className="flex flex-wrap justify-around  overflow-scroll">
                      {showsongs.map((it, i) => {
                        return (
                          <div
                            key={i}
                            id={`${i}`}    
                            className="hover:cursor-pointer mb-10"                        
                            onClick={(e) => handleclick(e, i, it)}
                          >
                            <RadioCard bg={`https://tan-mad-salamander-939.mypinata.cloud/ipfs/${it.coverIpfs}`} owner={it.title} artistName={it.owner_name}/>
                            {/* <div className="p-3">
                              <h3 className="text-white text-lg">{it.title}</h3>
                            </div> */}
                          </div>
                        );
                      })}
                      </div>
                      </div>
                    
                  </div>
                  </div>
                  <div className="w-2/5">
                  {
                    addsongs.length ? (<><p className={`text-4xl  ml-auto mr-auto mb-10  ${show}`}>
                   Songs To Add
                  </p>
                  <div
                    className={` flex flex-col ${show} rounded-lg  overflow-scroll h-[850px] border pt-5 pb-5`}
                  >
                    <div className={`flex flex-wrap justify-around`}>
                      {addsongs.map((it, i) => {
                        return (
                          <div
                            key={i}   
                            className="mb-10 hover:cursor-pointer"                         
                            onClick={(e) => remove(e, i, it)}
                          >
                            <RadioCard bg={`https://tan-mad-salamander-939.mypinata.cloud/ipfs/${it.coverIpfs}`} owner={`${i+1}. ${it.title}`} artistName={it.owner_name}/>
                          </div>
                        );
                      })}
                    </div>
                    </div>
                    <div className={`${show} flex mt-5`}>
                    <button
                      type="button"
                      onClick={addsongstoradio}
                      className="ml-auto mr-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      ADD
                    </button>
                  </div></>):(<></>)
                  }
                  </div>
                  </div>
              </>
            ) : (
              <>
                <div className="text-white flex flex-col">
                  <p className="text-4xl ml-auto mr-auto mt-20">
                    You Have Not Created Your Radio Yet!
                  </p>
                  <button
                    type="button"
                    onClick={toggleClick}
                    className="mt-7 ml-auto mb-7 mr-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    Create Your Radio
                  </button>
                  <label htmlFor="radioname" className={`${show} ml-20 mb-2`}>Radio Name:</label>
                <input type="text" name="radioname" placeholder="Enter Radio Name" className={`${show} text-black rounded p-3 ml-20 mr-20 mb-10`} required onChange={(e) => setRadioName(e.target.value)}/>
                <label htmlFor="radiodesc" className={`${show} ml-20 mb-2`}>Radio Description:</label>
                <input type="textarea" name="radiodesc" placeholder="Enter Radio Name" className={`${show} text-black rounded p-3 ml-20 mr-20 mb-10`} required onChange={(e) => setRadioDesc(e.target.value)}/>
                  <div className="flex justify-around mb-10">
                    <div className="w-2/5">
                  <p className={`${show} text-4xl ml-auto mr-auto mb-10`}>Choose Songs</p>
                  <div                
                    className={` flex flex-col ${show} rounded-lg h-[850px] border pt-5 pb-5`}
                  >
                    
                    <div className="flex flex-col h-full w-full justify-center gap-5 mb-5 content-center">
                      <div className="flex">
                        <FaSearch className="mt-auto mb-auto ml-auto mr-2" style={{ color: 'white', fontSize: '28px'}} />
                        <input
                            type="text"
                            className="w-5/6 p-2 text-black rounded-lg mr-auto"
                            placeholder="Search"    
                            onChange={(e) => search(e)}                            
                        />
                    </div>
                    <div className="flex flex-wrap justify-around  overflow-scroll">
                      {showsongs.map((it, i) => {
                        return (
                          <div
                            key={i}
                            id={`${i}`} 
                            className="hover:cursor-pointer mb-10"                           
                            onClick={(e) => handleclick(e, i, it)}
                          >
                            <RadioCard bg={`https://tan-mad-salamander-939.mypinata.cloud/ipfs/${it.coverIpfs}`} owner={`${it.title}`} artistName={it.owner_name}/>
                          </div>
                        );
                      })}
                      </div>
                      </div>
                    
                  </div>
                  </div>
                  <div className="w-2/5">
                  {
                    addsongs.length ? (<><p className={`text-4xl ml-auto mr-auto mb-10  ${show}`}>
                   Songs To Add
                  </p>
                  <div
                    className={` flex flex-col ${show} rounded-lg overflow-scroll h-[850px] border pt-5 pb-5`}
                  >
                    <div className={`flex flex-wrap justify-around`}>
                      {addsongs.map((it, i) => {
                        return (
                          <div
                            key={i}
                            className="mb-10 hover:cursor-pointer"
                            onClick={(e) => remove(e, i, it)}
                          >
                            <RadioCard bg={`https://tan-mad-salamander-939.mypinata.cloud/ipfs/${it.coverIpfs}`} owner={`${i+1}. ${it.title}`} artistName={it.owner_name}/>
                          </div>
                        );
                      })}
                    </div>
                    </div>
                    <div className={`${show} flex mt-5`}>
                    <button
                      type="button"
                      onClick={addradio}
                      className="ml-auto mr-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      ADD
                    </button>
                  </div></>):(<></>)
                  }
                  </div>                  
                </div>
                </div>
              </>
            )}
            <div ref={bottomRef}></div>
          </div>          
        </>
      )}
    </div>
    
  );
}

export default YourRadio;
