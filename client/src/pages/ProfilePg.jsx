import React,{useState, useContext} from 'react'
import { MdDelete,MdEdit,MdOutlinePlaylistAdd } from "react-icons/md";
import { FaPlayCircle,FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { AiFillLike } from "react-icons/ai";
import { dataContext } from '../Context/dataContext';
import play_icon from "../MusicPlayer/assets/playBtn.png";
import edit from "../MusicPlayer/assets/icons8-edit-48.png";
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import Navbar from './Navbar';
import UserMusicCard from './UserMusicCard';
import axios from 'axios';

const JWT = process.env.REACT_APP_JWT;

const ProfilePg = () => {
    const {distrix ,setDistri, addre, setCurrent, setTrackid, setIsRadio, setRecName, recName, disable, user, provider,recadd, setRecAdd, setRadio, handleDeposit} = useContext(dataContext)
    const {account, signAndSubmitTransaction} = useWallet()
    const {setLoad}=useContext(dataContext)
    const [disp, setDisp] = useState("hidden");
    const [tstatus, setTransactionInProgress] = useState(0)
    const [profileName, setProfileName] = useState(user ? user.name:"");
    const [location, setLocation] = useState(user ? user.location:"");
    const [description, setDescription] = useState(user.description);
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicHash, setProfilePicHash] = useState(user.profile_pic);

    
    const handleDel = async (e, id) => {
      if (!account) return;
      setTransactionInProgress(true);
  
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
        setTransactionInProgress(false);
        window.location.href = "/";
      }
    };

    const HandleEdit = (e) => {
      e.preventDefault()
        if (disp === "hidden") {
          setDisp("block");
        } else {
          setDisp("hidden");
        }
      };

    


    const pinimage = async (e) => {
      e.preventDefault();
      setLoad(0)
      const formData = new FormData();        
      formData.append('file', profilePic)
      
      const pinataMetadata = JSON.stringify({
        name: profilePic.name,
        keyvalues:{
          artistaddress:'somevalue'
        }
      });
      formData.append('pinataMetadata', pinataMetadata);    
      try{
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
          maxBodyLength: "Infinity",
          headers: {
            'Content-Type': `multipart/form-data`,
            'Authorization': `Bearer ${JWT}`
          }
        });
        console.log(res.data);
        const {IpfsHash} = res.data
        console.log(IpfsHash) 
        setProfilePicHash(IpfsHash)  
        handleEditAndTransaction(IpfsHash)          
      } catch (error) {
        console.log(error);
      }    
    }

    const handleEditAndTransaction = async (IpfsHash) => {
      if (!account) return;
  
      setTransactionInProgress(true);
  
      const payload = {
        sender: `${account.address}`,
        data: {
          function: `${addre}::music_platform::change_user_data`,
          typeArguments: [],
          functionArguments: [`${profileName}`, `${IpfsHash}`, `${description}`, `${location}`],
        },
      };
  
      try {
        const response = await signAndSubmitTransaction(payload);
        console.log("user updated");
        window.location.href = "/";
        await provider.waitForTransaction(response.hash);
      } catch (err) {
        console.log(err);
      } finally {
        setTransactionInProgress(false);
      }
    };

    const handleEdit= async (e)=>{
      if(!account) return;
      e.preventDefault()
      if(profilePic===null)
      {
        setProfilePicHash(user.profile_pic)
        handleEditAndTransaction(profilePicHash)
      }
      else{
        await pinimage(e)
        
      }
      
    }
        
  return (
    <div className='max-h-screen overflow-y-scroll'>
      <Navbar savings={user ? user.savings : 0} handleDeposit={handleDeposit}/>
    <div className="bg-transparent max-h-screen overflow-y-scroll text-white shadow-md rounded px-20 pt-20 pb-10 mb-4">
      <div className="flex gap-10">
        <div className='col-span-1'>
          {
            user ? (<>
              <img
          className="rounded-lg w-[200px] h-[200px]"
          src={`https://tan-mad-salamander-939.mypinata.cloud/ipfs/${user.profile_pic}`}/>
          alt={user.name}
            </>):(<></>)
          }        
            {/* ) : (
              <span>
              
              <img
          className="rounded-lg w-[200px] h-[200px]"
          src={`https://tan-mad-salamander-939.mypinata.cloud/ipfs/${user.profile_pic}`}
          alt={user.name}/>
              
        <div className='mx-auto my-auto text-2xl font-bold flex justify-center '> 
        <input type="file" className="" label="edit" onChange={(e) => {
          setProfilePic(e.target.files[0]);
        }}/>
        </div>
        </span>
            )
          } */}
        
        </div>
        <div className='mt-8 col-span-4'>
          {
            user ? (<>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <h3 className="text-2xl ">{user.location}</h3>
          <p className="text-gray-300 line-clamp-3">{user.description}</p>
            </>):(<></>)
          }
        </div>
      </div>
    <div className="mt-8 mx-auto">
    <button className="text-xl ml-10 rounded-lg p-3 font-semibold mb-4 border border-white" onClick={HandleEdit}>Edit Profile</button>
    </div>
    <div className={`${disp} mt-8`}>
        <form >
            <div className='mb-2 grid grid-cols-4'>
            <label className="ml-2 col-span-1 my-auto">Profile name: </label>
        <input type="text" className='border col-span-2 border-white ml-2 p-1 rounded-xl bg-transparent' onChange={(e)=>{
          setProfileName(e.target.value)
        }}/><br />
            </div>
       
            <div className='mb-2 grid grid-cols-4'>
            <label className="ml-2 col-span-1 my-auto">Location: </label>
        <input type="text" className='border border-white col-span-2 ml-2 p-1 rounded-xl  bg-transparent' onChange={(e)=>{
          setLocation(e.target.value)
        }}/><br />
            </div>
            <div className='mb-2 grid grid-cols-4'>
            <label className="ml-2 col-span-1 my-auto">Description: </label>
        <input type="text" className='border border-white ml-2 p-1 col-span-2 rounded-xl  bg-transparent' onChange={(e)=>{
          setDescription(e.target.value)
        }}/><br />
            </div>
            <div className='mb-2 grid grid-cols-4'>        
        <label className="ml-2 col-span-1 my-auto" htmlFor="file_input">Change Photo:</label>
        <input className="border border-white ml-2 p-1 col-span-2 rounded-xl  bg-transparent" id="file_input" type="file" onChange={(e) => {
          setProfilePic(e.target.files[0]);
        }}/>

            </div>
            
          <button className="text-xl rounded-lg p-3 font-semibold mb-4 border border-white mt-5 mr-5" type='submit' onClick={(e) =>  {
            e.preventDefault()
            handleEdit(e)
          }} >Save</button>
          <button className="text-xl rounded-lg p-3 font-semibold mb-4 border border-white" onClick={HandleEdit}> Cancel</button>
        </form>
    </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Uploaded Songs</h2>
        <div className="grid grid-cols-1  gap-4">
          {user.songs.map((song,index) => (
            <UserMusicCard key={index} song={song} id={index} tracks={user.songs} handleDel={handleDel}/>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}

export default ProfilePg