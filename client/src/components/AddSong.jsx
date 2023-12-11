import React, { useState, useContext, useRef } from 'react'
import AddCollaborators from './AddColaborators'
import { dataContext } from '../Context/dataContext';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import axios from "axios"
import DndPic from './DndPic';
import DndSong from './DndSong';
import { toast } from 'react-toastify';

const JWT = process.env.REACT_APP_JWT

const AddSong = () => {
    const [artname, setArtName] = useState('');
    const [sname, setSname] = useState('');
    const [photo, setPhoto] = useState(null);
    const [song, setSong] = useState(null);
    const [load, setLoad] = useState(1);
    const [transactionInProgress, setTransactionInProgress] = useState(false);  
    const { addre, provider } = useContext(dataContext)
    const { account, signAndSubmitTransaction } = useWallet();
    const [remainingSplit, setRemainingSplit] = useState(100)

    const [formFields, setFormFields] = useState([
        { ArtistAddr: `${account.address}`, Split: remainingSplit },
    ])

    const check_and_submit = (e) => {
        e.preventDefault();
        let sum = 0;
        let id = 0;
        formFields.forEach((element) => {
            if (id !== 0) {
                sum += parseInt(element.Split);
            }
            id += 1;
        });
        if (sum < 100) {
            let x = [...formFields];
            x[0].Split = 100 - sum;
            setFormFields(x);
            setRemainingSplit(100 - sum);
            // console.log(formFields);
        } else {
            alert("Split should sum up to 100%");
        }
    };

    const pinimage = async (e) => {
        e.preventDefault();
        if(sname === "" || artname === "" || photo === null || song === null){
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
        check_and_submit(e);
        setLoad(0)
        const formData = new FormData();
        formData.append('file', photo)

        const pinataMetadata = JSON.stringify({
            name: photo.name,
            keyvalues: {
                artistaddress: 'somevalue'
            }
        });
        formData.append('pinataMetadata', pinataMetadata);
        try {
            const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                maxBodyLength: "Infinity",
                headers: {
                    'Content-Type': `multipart/form-data`,
                    'Authorization': `Bearer ${JWT}`
                }
            });
            // console.log(res.data);
            const { IpfsHash } = res.data
            // console.log(IpfsHash)
            await pinFileToIPFS(IpfsHash)
        } catch (error) {
            console.log(error);
        }
    }


    const pinFileToIPFS = async (imghash) => {
        const formData = new FormData();

        formData.append("file", song);

        const pinataMetadata = JSON.stringify({
            name: `${song.name}`,
            keyvalues: {
                artistaddress: "somevalue",
                cover: imghash
            },
        });
        formData.append("pinataMetadata", pinataMetadata);
        try {
            const res = await axios.post(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                formData,
                {
                    maxBodyLength: "Infinity",
                    headers: {
                        "Content-Type": `multipart/form-data`,
                        Authorization: `Bearer ${JWT}`,
                    },
                }
            );
            // console.log(res.data);
            const { IpfsHash } = res.data;
            // console.log(sname + " " + artname + " " + imghash + " " + IpfsHash)
            handleAddSong(IpfsHash, imghash);
            
        } catch (error) {
            console.log(error);
        }
    };

    const audioRef = useRef(null);
    let val = 0
    const click = async (e) => {
        e.preventDefault()
        // console.log(song)

        val = parseInt(audioRef.current.duration)
        // console.log(val)
    }

    const songup = (e) => {
        // console.log(e)
        // console.log('song done')
        setSong(e)
        audioRef.current = new Audio(URL.createObjectURL(e))
        // console.log(audioRef)
    }

    const handleAddSong = async (songHash, imghash) => {
        if (!account) return;
        setTransactionInProgress(true);
        // console.log(songHash);
        let date = new Date()
        let sec = date.getTime()
        let artist = []
        let split = []
        for (let i = 0; i < formFields.length; i++) {
            artist.push(formFields[i].ArtistAddr)
            split.push(formFields[i].Split)
        }
        // console.log(audioRef)
        let x = parseInt(audioRef.current.duration)
        // console.log(artist + split)
        const payload = {
            sender: `${account.address}`,
            data: {
                function: `${addre}::music_platform::add_song`,
                typeArguments: [],
                functionArguments: [sname, songHash, imghash, sec, artist, split, x, artname],
            },
        };
        try {
            const response = await signAndSubmitTransaction(payload);
            // console.log("song added");
            // console.log(response)
            toast.success(`Song Uploaded`, {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setLoad(1);
            await provider.waitForTransaction(response.hash);
        } catch (err) {
            console.log(err);
        } finally {
            setTransactionInProgress(false);
        }
        window.location.href = "/"
    };

    const handlePhoto = (e) => {
        // e.preventDefault();
        // console.log("done Photo");
        // console.log(e)
        setPhoto(e);
    }


    return (
        <>
            <section className="max-w-4xl p-6 mx-auto bg-indigo-600 rounded-md shadow-md dark:bg-gray-800">
                <h1 className="text-xl font-bold text-white capitalize dark:text-white">Add Song</h1>
                <form >
                    <div className="grid grid-cols-1 gap-6 mt-4 ">
                        <div>
                            <label className="text-white dark:text-gray-200" htmlFor="username">Artist Name</label>
                            <input onChange={(e) => setArtName(e.target.value)} id="artistname" type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                        </div>
                        <div>
                            <label className="text-white dark:text-gray-200" htmlFor="password">Song Name</label>
                            <input onChange={(e) => setSname(e.target.value)} id="songName" type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                        </div>
                        <div>
                            <label htmlFor='Pic-Upload' className="text-gray-200">
                                Song profile picture
                            

                            <div className="flex items-center mt-2 justify-center w-full">
                                
                                <DndPic handlePC={handlePhoto} id='Pic-Upload'/>
                                
                            </div>
                            
                            </label>
                        </div>
                        <div>
                            <label htmlFor='song-upload' className="text-gray-200">
                                Song upload
                            

                            <div className="flex items-center mt-2 justify-center w-full">
                                <DndSong id='song-upload' handleSn={songup}/>
                                
                            </div>
                            
                                </label>
                        </div>                        
                        <div>
                            <label className="text-white dark:text-gray-200" htmlFor="password">Add Collaborators</label>
                            <AddCollaborators formFields={formFields} setFormFields={setFormFields} remainingSplit={remainingSplit} setRemainingSplit={setRemainingSplit} account={account} />
                        </div>

                        {/* </div> */}

                        <div className="flex justify-end mt-6">                            
                        {load ? (<><button onClick={(e) => pinimage(e)} className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-[#4865f6] rounded-md focus:outline-none ">Upload</button></>):(<><button disabled={true} className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-[#4865f6] rounded-md focus:outline-none focus:bg-gray-600">Uploading</button></>)}
                            
                        </div>

                    </div>

                </form>

            </section>


        </>
    )
}

export default AddSong