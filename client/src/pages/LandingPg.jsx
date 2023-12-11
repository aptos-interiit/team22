import React,{ useState, useContext} from 'react'
import { FaLongArrowAltRight,FaAngleDoubleDown } from "react-icons/fa"
import AppPic from "../MusicPlayer/assets/AppPic.png"
import back2 from "../MusicPlayer/assets/backimg2.png"
import 'aos/dist/aos.css';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { FetchUser } from '../helpers/FetchUser';
import axios from 'axios';
import { dataContext } from '../Context/dataContext';
import { toast } from 'react-toastify';


const JWT = process.env.REACT_APP_JWT;

const LandingPg = () => {    

    
    const [showModal, setShowModal] = useState(false);
    const {addre, res_acc, provider, setUser, setUserSongs, setLoad} = useContext(dataContext);
    const [profilePic, setProfilePic] = useState(false);    
    const [transactionInProgress, setTransactionInProgress] = useState(0);
    const { account, signAndSubmitTransaction } = useWallet();
    const [username, setUsername] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [dis, setDis] = useState(0)
    
    const {setTransact, transact} = useContext(dataContext)

    const handleAdd = async (IpfsHash) => {
        if (!account) return;
    
        setTransactionInProgress(true);
        setDis(0)
        const payload = {
          sender: `${account.address}`,
          data: {
            function: `${addre}::music_platform::add_user`,
            typeArguments: [],
            functionArguments: [`${username}`, `${IpfsHash}`, `${location}`, `${description}`],
          },
        };
    
        try {
          const response = await signAndSubmitTransaction(payload);
          // console.log("user added");
          await provider.waitForTransaction(response.hash);
        //   handleInitialReg();
        window.location.href="/"
        } catch (err) {
          console.log(err);
        } finally {
          setTransactionInProgress(false);
        }
      };
    
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
          // console.log("registered too");
          setTransact(transact+1)
          window.location.href = "/dashboard"
          await provider.waitForTransaction(response.hash);
        } catch (err) {
          console.log(err);
        } finally {
          setTransactionInProgress(false);
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
          // console.log(res.data);
          const {IpfsHash} = res.data
          // console.log(IpfsHash)           
          handleAdd(IpfsHash)                
        } catch (error) {
          console.log(error);
        }    
      }

    

    const handleAddUser = async () => {
        // if(user === null) setShowModal(true);
        setShowModal(true);
        setUsername("");
        setLocation("")
        setDescription("")
        setProfilePic(false)
        // console.log(account)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDis(1)
        if(username === "" || location === "" || description === "" || profilePic === false){
            toast.error(`Fields cant be empty`, {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setDis(0)
            return;
        }
        if(username && location && description) {
            await pinimage(e);
            setShowModal(false);
            try {
                const usery = await FetchUser(account);
                // console.log(usery);
                setUser(usery);
                setUserSongs(usery.songs);
              } catch (error) {
                console.log(error);
              }
        } else {
            alert("Fill all the fields!!")
        }
    }

    const styles = {
        backgroundImage: `url(${back2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }
  return (
    <>
    <main className=" w-screen h-screen" style={styles}>
    {/* <NavbarLand /> */}
    <div className='h-screen backdrop-blur overflow-hidden'>
    <div className="flex flex-col-reverse lg:flex-row w-full mt-16 justify-between text-white mb-4 w-full xl:max-w-[1750px] mx-auto px-6" >
        <div className="flex flex-col items-center lg:items-start" >
            {/* <h3 className="text-[10vw] font-bold " style={{fontFamily:"Exo\\ 2"}}>APTUNES</h3> */}
            <img src={AppPic} alt="aptunes" className='w-2/3'/>
            <p className="text-[3.5vw]  font-light " >Move With Aptunes!</p><br />
            <div className='mt-20 flex flex-col'>
                <WalletSelector/>
                {
                    account ? (<><button className="px-8 py-2.5  bg-white font-bold rounded-lg text-[2vw] text-[#210535] mt-2" onClick={handleAddUser}>Register</button></>):(<></>)
                }
                
            </div>
            
            
            <div className='flex flex-row gap-4 mt-11 w-full justify-evenly'  >
                <div className='px-7 py-4 bg-transparent font-bold rounded-lg text-[1.5vw] text-white border border-white border-dashed'>
                    <a href="https://petra.app/">Join <span className='underline'>Petra</span> Wallet!</a>
                </div>
                <FaLongArrowAltRight className='mt-4 ' size={28}/>
                <div className='px-7 py-4 bg-transparent font-bold rounded-lg text-[1.5vw] text-white border border-white border-dashed'>Connect Wallet</div>
                <FaLongArrowAltRight className='mt-4 ' size={28}/>
                <div className='px-7 py-4 bg-transparent font-bold rounded-lg text-[1.5vw] text-white border border-white border-dashed'>Add User Info</div>
                <FaLongArrowAltRight className='mt-4 ' size={28}/>
                <div className='px-7 py-4 bg-transparent font-bold rounded-lg text-[1.5vw] text-white border border-white border-dashed'>Start Steaming!</div>
            </div>
            {showModal ? (
        <>
          <div
            className="transform justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-[100%] my-6 mx-auto max-w-4xl">
              {/*content*/}
              <div className="flex items-center justify-center border-0 rounded-lg shadow-lg relative flex-col w-full bg-[#1D1D23] outline-none focus:outline-none">
                {/*header*/}
                <div className="text-white w-[100%] flex items-center justify-center text-2xl mb-10 mt-5">Add User</div>
                <form className="w-[80%]">
                    <div className="mb-5">
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your display name</label>
                        <input type="username" id="username" onChange={(e) => setUsername(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Display Name" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your location</label>
                        <input type="location" id="location" onChange={(e) => setLocation(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Location" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your description</label>
                        <textarea type="description" id="description" onChange={(e) => setDescription(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Description" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload your profile picture</label>
                        <input type="file" accept="image/png, image/jpeg, image/webp" id="email" onChange={(e)=>setProfilePic(e.target.files[0])} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Profile Picture" required />
                    </div>
                    {
                        dis ? (<>
                        <button type="submit" className="mb-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" disable = {true} >Submitting</button>
                        </>):(<>
                    <button type="submit" className="mb-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" disable = {false} onClick={handleSubmit}>Submit</button>
                        </>)
                    }

                    <button className="ml-10 mb-10 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" onClick={() => setShowModal(false)}>Close</button>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
            {/* <div className='flex flex-row gap-4  w-full justify-evenly'>
            <button className='animate' onClick={()=> bottomRef.current?.scrollIntoView({behavior: 'smooth'})}><FaAngleDoubleDown size={50}/></button></div> */}
        </div>


        
    </div>
    {/* <div ref={bottomRef} ><AboutUs /></div> */}
    </div>
    </main>
    </>
  )
}

export default LandingPg