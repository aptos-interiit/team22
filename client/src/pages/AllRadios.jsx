import React, { useContext, useState, useEffect } from 'react'
import { dataContext } from '../Context/dataContext';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import img from '../MusicPlayer/assets/wireless-icon.svg'
import playingRadio from '../MusicPlayer/assets/gif2.gif'

function AllRadios() {
  const { provider, setIsRadio, setUsedUpTime, setRadio, setCurrent, setTrackid, addre, radio, recadd, setRecAdd, recName, setRecName, distrix, setDistri } = useContext(dataContext)
  const { account, signAndSubmitTransaction } = useWallet()
  const [radios, setRadios] = useState([])
  const [load, setLoad] = useState(1)
  const [radioIds, setRadiosIds] = useState([])

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
    let radio = { user_address: user_address, title: title, songs: songsx, description: description };
    handleRadioCalculations(radio)
  };

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
    if(recadd === null){
      setRecAdd(songs[index].owner)
    }
    if(recName === ""){
      setRecName(songs[index].owner_name)
    }
    if(distrix === null){
      setDistri(songs[index].distri)
    }
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
          console.log(radiox);
          // let arr = radio.songs;
          // let object = await getIpfsObject(arr, radio.title, radio.description);                        
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
                            // width: "100%",
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