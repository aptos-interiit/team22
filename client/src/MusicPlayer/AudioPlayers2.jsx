import React, { useEffect, useState, useRef } from "react";
import { Network, Provider } from "aptos";
import axios from "axios";
import { useContext } from "react";
import { dataContext } from "../Context/dataContext";
import Music from "./Music";
// import tracks from "../tracks";
import { ToastContainer, toast } from 'react-toastify';




function AudioPlayer2() {
    const { distrix, setDistri, recName, setRecName, setOpen, account, trackid, recadd, setRecAdd, transact, setTransact, current, setTrackid, setRadio, setPopup, provider, useduptime, setCurrent, user, setUsedUpTime, setDisable } = useContext(dataContext)

    const [timearr, setTimearr] = useState([])
    const [trackIndex, setTrackIndex] = useState(trackid);
    const [trackProgress, setTrackProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [songsListened, setSongsListened] = useState([]);
    const [load, setLoad] = useState(0)
    const [flag, setFlag] = useState(0)
    const recieverAddress = recadd
    const recieverName = recName
    const distriarr = distrix

    const audioRef = useRef(null);

    const { coverIpfs, ipfsHash, title, owner, owner_name, duration, artists, distri, id } = trackid < current.length ? current[trackid] : ["null", "null", "null"];


    const handleGetFile = async (ipfsHash) => {
        setLoad(0)
        try {
            await axios
                .get(
                    `https://tan-mad-salamander-939.mypinata.cloud/ipfs/${ipfsHash}`,
                    {
                        responseType: "blob",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                )
                .then(async (res) => {
                    console.log("SUCC");
                    console.log(new Audio(URL.createObjectURL(res.data)))
                    audioRef.current = new Audio(URL.createObjectURL(res.data))

                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.error("Error fetching file from Pinata:", error.response.data);
        }
        setLoad(1);
        setIsPlaying(1);
    };
    // console.log(tracks)



    // const [audioRef.current, setaudioRef.current]=useState(null)
    const intervalRef = useRef();
    const isReady = useRef(false);


    // const { duration } = audioRef.current


    const addSongsData = (timestamp, type, title, id) => {
        console.log(timestamp, type, title, id);
        setSongsListened([...songsListened, { timestamp, type, title, id }]);
    };

    useEffect(() => {
        localStorage.setItem("songsListened", JSON.stringify(songsListened));
    }, [songsListened.length]);
    const startTimer = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            if (audioRef.current.ended) {
                toNextTrack();
            } else {
                setTrackProgress(audioRef.current.currentTime);
            }
        }, [1000]);
    };

    const onScrub = (value) => {

        clearInterval(intervalRef.current);
        audioRef.current.currentTime = value;
        setTrackProgress(audioRef.current.currentTime);
    };

    const onScrubEnd = () => {

        if (!isPlaying) {
            setIsPlaying(true);
        }
        startTimer();
    };

    const toPrevTrack = () => {
        if (current.length > 1) {
            audioRef.current.currentTime = 0
            audioRef.current.pause()
            if (trackIndex - 1 < 0) {
                setTrackid(current.length - 1);
            } else {
                setTrackid(trackIndex - 1);
            }
        }
    };

    const toNextTrack = () => {
        if (current.length > 1) {
            audioRef.current.currentTime = 0
            audioRef.current.pause()
            if (trackIndex < current.length - 1) {
                setTrackid(trackIndex + 1);
            } else {
                setTrackid(0);
            }
        }
    };

    const CalculateTokenFromSongsData = async (songsListenedx) => {
        console.log("in function CalculateTokenFromSongsData")
        console.log(songsListenedx);
        let arr = songsListenedx
        let temp = {}
        console.log(arr[0]);
        console.log(arr[1]);
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i].type === 'start') {
                if (arr[i + 1].type === 'end') {
                    let duration = (arr[i + 1].timestamp - arr[i].timestamp) / 1000;
                    console.log(duration, ':', arr[i].title);
                    if (temp[arr[i].title]) {
                        temp[arr[i].title] += duration

                    }
                    else {
                        temp[arr[i].title] = duration

                    }
                }
            }
            if (arr[i].type === 'start') {
                if (arr[i + 1].type === 'change') {
                    let duration = (arr[i + 1].timestamp - arr[i].timestamp) / 1000;
                    console.log(duration, ':', arr[i].title);
                    if (temp[arr[i].title]) {
                        temp[arr[i].title] += duration

                    }
                    else {
                        temp[arr[i].title] = duration

                    }
                }
            }
            if (arr[i].type === 'change') {
                if (arr[i + 1].type === 'end') {
                    let duration = (arr[i + 1].timestamp - arr[i].timestamp) / 1000;
                    console.log(duration, ':', arr[i].title);
                    if (temp[arr[i].title]) {
                        temp[arr[i].title] += duration

                    }
                    else {
                        temp[arr[i].title] = duration

                    }
                }
            }
            if (arr[i].type === 'change') {
                if (arr[i + 1].type === 'change') {
                    let duration = (arr[i + 1].timestamp - arr[i].timestamp) / 1000;
                    console.log(duration, ':', arr[i].title);
                    if (temp[arr[i].title]) {
                        temp[arr[i].title] += duration

                    }
                    else {
                        temp[arr[i].title] = duration

                    }
                }
            }
        }
        // console.log(temp);

        setTimearr(temp)
        console.log("fbewjhlbhjlwbf hwjb fwjef cwje fcwhejbfhwe dwbejfh bwehjf bwjef whefcw")
        console.log(owner, temp[arr[0].title] * 1000)
        console.log(recieverAddress)
        console.log(distriarr)

        if (!isNaN(temp[arr[0].title]) && temp[arr[0].title] > 5) {
            console.log("sent")
            console.log(arr[0])
            console.log(`The song id is ${arr[0].id} and time listened is ${temp[arr[0].title]}`)
            sendTransaction(parseInt(temp[arr[0].title] * 50), recieverName, recieverAddress, distriarr, temp[arr[0].title], arr[0].id)
        }
        setSongsListened([])
    }

    const sendTransaction = (amount, artName, artAddr, distriArr, timelistened, songId) => {
        axios.post("https://server-81e3.onrender.com/user_to_artist", {
            userAddress: account.address,
            artistAddresses: artAddr,
            dist: distriArr,
            amount
        }).then(async (res) => {
            console.log(res)
            await provider.waitForTransaction(res.data.response);
            console.log(transact)
            toast.success(`${amount / 100000000} T22 Coins sent to ${artName}.`, {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setPopup({ amount: amount, artistName: artName });
            setTransact(transact + 1);
            await updateTimeListened(timelistened, songId);
        }).catch((err) => {
            console.log(err)
        })
    }

    const updateTimeListened = async (timelistened, songId) => {
        axios.post("https://server-81e3.onrender.com/update_timelistened", {
            songId: songId,
            time: parseInt(timelistened)
        }).then(async (res) => {
            console.log(res)
            await provider.waitForTransaction(res.data.response);
        }).catch((err) => {
            console.log(err)
        })
    }

    const stopRadio = async () => {
        await audioRef.current.pause();
        let date = new Date()
        let sec = date.getTime()
        addSongsData(sec, 'end', title, id)
        CalculateTokenFromSongsData([...songsListened, { timestamp: sec, type: 'end', title: title, id: id }]);
        setTrackid(-1)
        setCurrent([])
        setRadio([])
    }

    useEffect(() => {
        console.log(songsListened)
        if (audioRef.current !== null) {
            if (isPlaying) {
                audioRef.current.play();
                startTimer();
                let date = new Date()
                let sec = date.getTime()
                addSongsData(sec, 'start', title, id)
            } else {
                audioRef.current.pause();
                let date = new Date()
                let sec = date.getTime()
                addSongsData(sec, 'end', title, id)
            }
        }
    }, [isPlaying]);


    useEffect(() => {
        (async () => {
            setDisable(1)
            await handleGetFile(ipfsHash)
            audioRef.current.currentTime = useduptime
            setUsedUpTime(0)
            setDisable(0)
        })()
    }, [])

    useEffect(() => {
        if (trackid < current.length) {
            console.log(songsListened)
            setDisable(1)
            if (user.savings < 12000) {
                console.log("no balance")
                setTrackid(-1)
                setCurrent([])
                setOpen(true)
            }
            else {
                setRecAdd(artists)
                setRecName(owner_name)
                setDistri(distri)
                console.log("lkefrw")
                let date = new Date()
                let sec = date.getTime()
                addSongsData(sec, 'end', title, id)
                if (typeof (owner) !== "undefined") {
                    CalculateTokenFromSongsData([...songsListened, { timestamp: sec, type: 'end', title: title, id: id }]);
                }
                if (audioRef.current !== null) {
                    audioRef.current.currentTime = 0
                    audioRef.current.pause()
                }
                setTrackIndex(trackid)
                if (flag) {
                    setFlag(0)
                } else {
                    setFlag(1)
                }
            }
        }
    }, [trackid, current])

    useEffect(() => {
        if (audioRef.current === null) return

        audioRef.current.pause();
        (async () => {
            await handleGetFile(ipfsHash)
            audioRef.current.currentTime = useduptime
            setUsedUpTime(0)
            if (user.savings < 12000) {
                console.log("no balance")
                setTrackid(-1)
                setCurrent([])
            }
            else {
                await audioRef.current.play();
                let date = new Date()
                let sec = date.getTime()
                addSongsData(sec, 'start', title, id)
                setIsPlaying(true);
                setDisable(0)
            }
        })()

        setTrackProgress(audioRef.current.currentTime);



    }, [flag]);

    useEffect(() => {

        const handleReload = async (e) => {
            
            e.preventDefault();
            if (audioRef.current !== null) {
                console.log("reloading");
                audioRef.current.pause();
                let date = new Date()
                let sec = date.getTime()
                addSongsData(sec, 'end', title, id)
                let songlistenedx = JSON.parse(localStorage.getItem("songsListened"));
                console.log(songsListened);
                songlistenedx.push({ timestamp: sec, type: 'end', title: title, id: id });
                await CalculateTokenFromSongsData(songlistenedx);
            }
        }

        window.addEventListener('beforeunload', handleReload);

        return () => {
          // hit endpoint to end show
          window.removeEventListener('beforeunload', handleReload);
        }
    }, []);



    return <div>
        {audioRef.current !== null ? (<><Music
            isPlaying={isPlaying}
            onPrevClick={toPrevTrack}
            onNextClick={toNextTrack}
            onPlayPauseClick={setIsPlaying}
            onScrub={onScrub}
            onScrubEnd={onScrubEnd}
            trackProgress={trackProgress}
            duration={duration}
            title={title}
            owner={owner}
            coverIpfs={coverIpfs}
            stopRadio={stopRadio}
            owner_name={owner_name}
        /></>) : (<>Loading</>)}

    </div>;
}

export default AudioPlayer2;
