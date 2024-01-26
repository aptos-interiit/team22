// Purpose: Provide a page for users to view all radios.


// importing dependencies
import React, { useContext, useState, useEffect } from 'react'
import { dataContext } from '../Context/dataContext';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import img from '../MusicPlayer/assets/wireless-icon.svg'
import playingRadio from '../MusicPlayer/assets/gif2.gif'


// AllRadios component
function AllRadios() {

  // addre: address of the contract
  // provider: provider of the contract
  // setIsRadio: set is radio
  // setUsedUpTime: set used up time
  // setRadio: set radio
  // setCurrent: set current
  // setTrackid: set track id
  // addre: address of the contract
  // radio: radio state
  // recadd: recommended address
  // setRecAdd: set recommended address
  // recName: recommended name
  // setRecName: set recommended name
  // distrix: distribution
  // setDistri: set distribution
  const { provider, setIsRadio, setUsedUpTime, setRadio, setCurrent, setTrackid, addre, radio, recadd, setRecAdd, recName, setRecName, distrix, setDistri } = useContext(dataContext)

  // account: account of the user
  const { account, signAndSubmitTransaction } = useWallet()

  // radios: radios state
  const [radios, setRadios] = useState([])

  // load: load state
  const [load, setLoad] = useState(1)

  // radioIds: radio ids state
  const [radioIds, setRadiosIds] = useState([])

  // function to get ipfs object
  const getIpfsObject = async (user_address, ids, title, description) => {
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
    let radio = { user_address: user_address, title: title, songs: songsx, description: description };
    handleRadioCalculations(radio)
  };

  // function to handle radio calculations
  const handleRadioCalculations = async (radioz) => {
    if (radio.user_address && radioz.user_address == radio.user_address) {
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

  // useEffect hook
  useEffect(() => {
    (async () => {
      if (!account) return;
      const todoListResource = await provider.getAccountResource(
        `${addre}`,
        `${addre}::music_platform::All_radios`
      );
      let allradiosx = [];
      let radioidsx = []
      const tableHandle = todoListResource.data.content.handle;
      for (let i = 0; i < todoListResource.data.all_indexes.length; i++) {
        const tableItem = {
          key_type: "u64",
          value_type: `${addre}::music_platform::Radio`,
          key: `${todoListResource.data.all_indexes[i]}`,
        };
        try {
          const radiox = await provider.getTableItem(tableHandle, tableItem);
          if(!radiox.is_active) continue;                      
          radioidsx.push(todoListResource.data.all_indexes[i])
          allradiosx.push(radiox)
        } catch (err) {
          console.log(err);
        }
      }
      setRadios(allradiosx)
      setRadiosIds(radioidsx)
      setLoad(0);
    })();
  }, []);

  // returning the AllRadios component
  return (
    <>
      {
        load ? (<><div className='loader'></div></>) : (<>
          <div className='flex flex-col content-center gap-5 mt-10 max-h-screen overflow-y-scroll'>
            <p className='text-white text-5xl ml-auto mr-auto'>All Radios</p>
            {
              radios.map((radioz, i) => {

                return (
                  <div key={i} className='text-white rounded-lg ml-10 mr-10 p-4 bg-[#282829] flex'>
                    <img src={img} alt="" className='w-10 h-10 mr-10' style={{ filter: "invert(1)" }} />
                    <div className='mt-auto mb-auto flex flex-col'>
                      <p className='text-2xl font-bold'>{radioz.title}</p>
                      <p className='text-sm opacity-80'>{radioz.description}</p>
                    </div>
                    <div className='ml-auto flex items-center'>
                      <p className='mr-4'>{radioz.songs.length} Songs</p>
                      {
                      radioz.user_address === radio.user_address ? (<>
                        <div
                          onClick={() => getIpfsObject(radioz.user_address, radioz.songs, radioz.title, radioz.description)}
                          style={{
                            backgroundImage: `url(${playingRadio})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "100% 100%",
                            backgroundPosition: "center center",
                          }}
                          className="h-[40px] w-[45px] mt-auto mb-auto ml-auto text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm focus:outline-none"
                        >
                        </div>
                      </>) : (<>
                        <button
                          type="button"
                          onClick={() => getIpfsObject(radioz.user_address, radioz.songs, radioz.title, radioz.description)}
                          className="mt-auto mb-auto ml-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                          Play Radio
                        </button>
                      </>)
                    }
                    </div>

                  </div>
                )
              })
            }
          </div>
        </>)
      }
    </>
  )
}

export default AllRadios