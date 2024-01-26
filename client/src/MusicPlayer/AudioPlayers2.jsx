// Summary: This file contains the code for the audio player that plays the songs from the radio.


// importing dependencies
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useContext } from "react";
import { dataContext } from "../Context/dataContext";
import Music from "./Music";
import { ToastContainer, toast } from 'react-toastify';

// server address
const server_address = process.env.REACT_APP_SERVER_ADDRESS

// AudioPlayer2 component
function AudioPlayer2() {

    // distrix: distribution
    // setDistri: set distribution
    // recName: recommended name
    // setRecName: set recommended name
    // setOpen: set open
    // account: account of the user
    // trackid: track id
    // recadd: recommended address
    // setRecAdd: set recommended address
    // transact: transaction state
    // setTransact: set transaction state
    // current: current state
    // setTrackid: set track id
    // setRadio: set radio
    // setPopup: set popup
    // provider: provider of the contract
    // useduptime: used up time
    // setCurrent: set current
    // user: user state
    // setUsedUpTime: set used up time
    // setDisable: set disable
    const { distrix, setDistri, recName, setRecName, setOpen, account, trackid, recadd, setRecAdd, transact, setTransact, current, setTrackid, setRadio, setPopup, provider, useduptime, setCurrent, user, setUsedUpTime, setDisable } = useContext(dataContext)

    // timearr: time array
    const [timearr, setTimearr] = useState([])

    // trackIndex: track index
    const [trackIndex, setTrackIndex] = useState(trackid);

    // trackProgress: track progress
    const [trackProgress, setTrackProgress] = useState(0);

    // isPlaying: is playing state
    const [isPlaying, setIsPlaying] = useState(true);

    // songsListened: songs listened
    const [songsListened, setSongsListened] = useState([]);

    // disable: disable state
    const [load, setLoad] = useState(0)

    // flag: flag state
    const [flag, setFlag] = useState(0)

    // recieverAddress: reciever address
    const recieverAddress = recadd

    // recieverName: reciever name
    const recieverName = recName

    // distriarr: distribution array
    const distriarr = distrix

    // audioRef: audio reference
    const audioRef = useRef(null);

    // coverIpfs: cover ipfs
    // ipfsHash: ipfs hash
    // title: title
    // owner: owner
    // owner_name: owner name
    // duration: duration
    // artists: artists
    // distri: distribution
    // id: id
    const { coverIpfs, ipfsHash, title, owner, owner_name, duration, artists, distri, id } = trackid < current.length ? current[trackid] : ["null", "null", "null"];


    // function to get file
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

    // intervalRef: interval reference
    const intervalRef = useRef();

    // function to add songs data
    const addSongsData = (timestamp, type, title, id) => {
        setSongsListened([...songsListened, { timestamp, type, title, id }]);
    };

    // function to handle get file
    useEffect(() => {
        localStorage.setItem("songsListened", JSON.stringify(songsListened));
    }, [songsListened.length]);

    // function to start timer
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

    // function to handle scrub
    const onScrub = (value) => {
        clearInterval(intervalRef.current);
        audioRef.current.currentTime = value;
        setTrackProgress(audioRef.current.currentTime);
    };

    // function to handle scrub end
    const onScrubEnd = () => {
        if (!isPlaying) {
            setIsPlaying(true);
        }
        startTimer();
    };

    // function to handle previous track
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

    // function to handle next track
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

    // function to calculate token from songs data
    const CalculateTokenFromSongsData = async (songsListenedx) => {
        let arr = songsListenedx
        let temp = {}
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i].type === 'start') {
                if (arr[i + 1].type === 'end') {
                    let duration = (arr[i + 1].timestamp - arr[i].timestamp) / 1000;
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
                    if (temp[arr[i].title]) {
                        temp[arr[i].title] += duration
                    }
                    else {
                        temp[arr[i].title] = duration
                    }
                }
            }
        }
        setTimearr(temp)
        if (!isNaN(temp[arr[0].title]) && temp[arr[0].title] > 5) {
            sendTransaction(parseInt(temp[arr[0].title] * 50), recieverName, recieverAddress, distriarr, temp[arr[0].title], arr[0].id)
        }
        setSongsListened([])
    }

    // function to send transaction
    const sendTransaction = (amount, artName, artAddr, distriArr, timelistened, songId) => {
        axios.post(server_address + "/user_to_artist", {
            userAddress: account.address,
            artistAddresses: artAddr,
            dist: distriArr,
            amount
        }).then(async (res) => {
            await provider.waitForTransaction(res.data.response);
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

    // function to update time listened
    const updateTimeListened = async (timelistened, songId) => {
        axios.post(server_address + "/update_timelistened", {
            songId: songId,
            time: parseInt(timelistened)
        }).then(async (res) => {
            await provider.waitForTransaction(res.data.response);
        }).catch((err) => {
            console.log(err)
        })
    }

    // function to stop radio
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

    // useEffect hook for songs listened
    useEffect(() => {
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

    // useEffect hook for track index
    useEffect(() => {
        (async () => {
            setDisable(1)
            await handleGetFile(ipfsHash)
            audioRef.current.currentTime = useduptime
            setUsedUpTime(0)
            setDisable(0)
        })()
    }, [])


    // useEffect hook for track index
    useEffect(() => {
        if (trackid < current.length) {
            setDisable(1)
            if (user.savings < 12000) {
                setTrackid(-1)
                setCurrent([])
                setOpen(true)
            }
            else {
                setRecAdd(artists)
                setRecName(owner_name)
                setDistri(distri)
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

    // useEffect hook for track index
    useEffect(() => {
        if (audioRef.current === null) return
        audioRef.current.pause();
        (async () => {
            await handleGetFile(ipfsHash)
            audioRef.current.currentTime = useduptime
            setUsedUpTime(0)
            if (user.savings < 12000) {
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

    // useEffect hook for track index
    useEffect(() => {
        const handleReload = async (e) => {
            e.preventDefault();
            if (audioRef.current !== null) {
                audioRef.current.pause();
                let date = new Date()
                let sec = date.getTime()
                addSongsData(sec, 'end', title, id)
                let songlistenedx = JSON.parse(localStorage.getItem("songsListened"));
                songlistenedx.push({ timestamp: sec, type: 'end', title: title, id: id });
                await CalculateTokenFromSongsData(songlistenedx);
            }
        }
        window.addEventListener('beforeunload', handleReload);
        return () => {
            window.removeEventListener('beforeunload', handleReload);
        }
    }, []);

    // returning the AudioPlayer2 component
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
