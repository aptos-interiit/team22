import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import React, {useContext, useState} from "react";
import { dataContext } from "../Context/dataContext";
import { Network, Provider } from "aptos";
import axios from "axios";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useNavigate } from "react-router";
import { FetchUser } from "../helpers/FetchUser";

export const provider = new Provider(Network.DEVNET);

const JWT = process.env.REACT_APP_JWT;

const addre =process.env.REACT_APP_MODULE_ADDRESS;
const res_acc = process.env.REACT_APP_RESOURCE_ACCOUNT;

function LandingPage() {
    const [showModal, setShowModal] = useState(false);
    const {account, setUser, setUserSongs, setLoad} = useContext(dataContext);
    const [profilePic, setProfilePic] = useState(false);
    const [coverHash, setCoverHash] = useState();
    const [transactionInProgress, setTransactionInProgress] = useState(0);
    const { signAndSubmitTransaction } = useWallet();
    const [username, setUsername] = useState();
    const [location, setLocation] = useState();
    const [description, setDescription] = useState();
    const navigate = useNavigate();
    const {setTransact, transact} = useContext(dataContext)

    const handleAdd = async (IpfsHash) => {
        if (!account) return;
    
        setTransactionInProgress(true);
    
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
          console.log("user added");
          await provider.waitForTransaction(response.hash);
          handleInitialReg();
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
          console.log("registered too");
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
          console.log(res.data);
          const {IpfsHash} = res.data
          console.log(IpfsHash) 
          setCoverHash(IpfsHash)
          handleAdd(IpfsHash)                
        } catch (error) {
          console.log(error);
        }    
      }

    

    const handleAddUser = async () => {
        // if(user === null) setShowModal(true);
        setShowModal(true);
        console.log(account)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(username && location && description) {
            await pinimage(e);
            setShowModal(false);
            try {
                const usery = await FetchUser(account);
                console.log(usery);
                setUser(usery);
                setUserSongs(usery.songs);
              } catch (error) {
                console.log(error);
              }
        } else {
            alert("Fill all the fields!!")
        }
    }


    return (
    <>
    <WalletSelector></WalletSelector>
    <>
      <button
        className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={handleAddUser}
      >
        Add User
      </button>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-[100%] my-6 mx-auto max-w-4xl">
              {/*content*/}
              <div className="flex items-center justify-center border-0 rounded-lg shadow-lg relative flex-col w-full bg-[#1D1D23] outline-none focus:outline-none">
                {/*header*/}
                <div className="text-white w-[100%] flex items-center justify-center text-2xl mb-10 mt-5">Add User</div>
                <form className="w-[80%]">
                    <div className="mb-5">
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your display name</label>
                        <input type="username" id="username" onChange={(e) => setUsername(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="granturismopro" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your location</label>
                        <input type="location" id="location" onChange={(e) => setLocation(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="granturismopro" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your description</label>
                        <textarea type="description" id="description" onChange={(e) => setDescription(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="granturismopro" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload your profile picture</label>
                        <input type="file" id="email" onChange={(e)=>setProfilePic(e.target.files[0])} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="granturismopro" required />
                    </div>
                    <button type="submit" className="mb-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleSubmit}>Submit</button>

                    <button className="ml-10 mb-10 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" onClick={() => setShowModal(false)}>Close</button>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
    </>
    )
}

export default LandingPage;