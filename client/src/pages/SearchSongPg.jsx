import React, { useContext, useState } from "react";
import { dataContext } from "../Context/dataContext";
import { useWallet } from "@aptos-labs/wallet-adapter-react";



function SearchSongPg() {
  const { distrix, setDistri, disable, setCurrent,recName, setRecName, recadd, setRecAdd, setIsRadio, setRadio, provider, addre,searchsong,setSearchsong,setTrackid} =
    useContext(dataContext);
  const { account, signAndSubmitTransaction } = useWallet();
  const [tstatus, setTransactionInProgress] = useState(0);
  const [word,setWord]=useState("")


  const handleDel = async (id) => {
    if (!account) return;
    setTransactionInProgress(true);
    
    // console.log(id);
    
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
      setTransactionInProgress(false);
      window.location.href = "/";
    }
  };

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

  return (
    <div className="w-full">
      <main className="grid place-items-center min-h-screen bg-slate-700 p-5 w-full">
        <div>
            {searchsong.length ?(
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-200 mb-5 select-none">
                Search Songs
                
              </h1>
            ):(
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-200 mb-5 select-none">
            no song found 
          </h1>
            )}
          
          
          <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* <!-- CARD 1 --> */}
            {searchsong.map((it, i) => {
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
                        onClick={(e) => setid(e, i, searchsong, it.owner_name, it.artists, it.distri)}
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
  );
}

export default SearchSongPg;
