import React, { useContext, useState } from 'react';
import { MdAccountCircle } from "react-icons/md";
import { Link } from 'react-router-dom';
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { dataContext } from '../Context/dataContext';
import { Network, Provider } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import logo from '../MusicPlayer/assets/logo.png'
import {toast} from 'react-toastify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const addre = process.env.REACT_APP_MODULE_ADDRESS;
const res_acc = process.env.REACT_APP_RESOURCE_ACCOUNT;
export const provider = new Provider(Network.DEVNET);


const Navbar = ({ savings, handleSubmit }) => {
  const { signAndSubmitTransaction } = useWallet();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openEarn, setOpenEarn] = useState(false);
  const handleOpenEarn = () => setOpenEarn(true);
  const handleCloseEarn = () => setOpenEarn(false);
  const { deposit, setDeposit, account, transact, setTransact, user } = useContext(dataContext);
  const [transactionInProgress, setTransactionInProgress] = useState(0);
  const [earnings, setEarnings] = useState(0);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!account) return;

    if (deposit < 0.05) {
      alert("Minimum deposit should be 0.05 Aptos");
      return;
    }
    setTransactionInProgress(true);

    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${addre}::music_platform::add_deposit`,
        typeArguments: [],
        functionArguments: [deposit * 1e8],
      },
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
      setTransact(transact + 1)
      setDeposit(0)
      handleClose();
    } catch (err) {
      console.log(err);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const handleWithdrawSavings = async (e) => {  
    e.preventDefault();
    if (!account) return;

    setTransactionInProgress(true);

    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${addre}::music_platform::withdraw_savings_toAptos`,
        typeArguments: [],
        functionArguments: [],
      },
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
      setTransact(transact + 1)
    } catch (err) {
      console.log(err);
    } finally {
      setTransactionInProgress(false);
    }
  }

  const handleWithdrawEarnings = async (e) => {  
    e.preventDefault();
    if (!account) return;

    if(earnings <= 0) {
      toast.error(`Amount of T22 should be greater than zero!!!`, {
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

    setTransactionInProgress(true);

    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${addre}::music_platform::withdraw_earnings_toAptos`,
        typeArguments: [],
        functionArguments: [earnings * 1e8],
      },
    };

    try {
      const response = await signAndSubmitTransaction(payload);
      await provider.waitForTransaction(response.hash);
      setTransact(transact + 1);
      handleCloseEarn();
    } catch (err) {
      console.log(err);
    } finally {
      setTransactionInProgress(false);
    }
  }

  const isSearchBarPath = window.location.pathname === '/search_bar';
  const isProfilePath = window.location.pathname === '/profile';

  return (
    <nav className="bg-black p-4 h-20">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo or brand */}
        <div className="text-white text-lg font-bold" style={{ display: !isSearchBarPath ? 'block' : 'none' }}>
          <img src={logo} alt="logo" className='h-[8vh] ml-10'/>
        </div>
        <form style={{ display: isSearchBarPath ? 'block' : 'none' }}>
          <input className="px-4 py-2 rounded-full w-64 bg-[#242424] text-white focus:border-[#ffffff] hover:bg-[#2a2a2a]" onChange={(e) => handleSubmit(e)} id='value' type="text" placeholder='Search' />
          {/* <button type="submit"> submit</button> */}
        </form>

        {/* Navigation links */}
        <ul className="flex space-x-4 items-center h-full">
          <li>
            <div className="z-[-999] grid h-10 w-32 place-content-center rounded-sm text-xs text-gray-600 mr-4">
              <WalletSelector />
            </div>
          </li>
          <li>
            <div className="rounded-md bg-white text-black px-4 py-2 hover:bg-gray-300">{savings / 100000000} T22 Coin</div>
          </li>
          <li style={{ display: isProfilePath ? 'block' : 'none' }}>
            <div onClick={handleOpenEarn} className={`hover:cursor-pointer rounded-md bg-white text-black px-4 py-2 hover:bg-gray-300`}>
              Withdraw Earnings
            </div>
          </li>
          <li style={{ display: isProfilePath ? 'block' : 'none' }}>
            <div onClick={(e) => handleWithdrawSavings(e)} className="hover:cursor-pointer rounded-md bg-white text-black px-4 py-2 hover:bg-gray-300">
              Withdraw Savings
            </div>
          </li>
          <li>
            <div onClick={handleOpen} className="hover:cursor-pointer rounded-md bg-white text-black px-4 py-2 hover:bg-gray-300">
              Add Deposit
            </div>
          </li>
          <li>
            <Link to="/profile" className="text-white hover:text-gray-300 rounded-full">
             <div className='w-[50px] h-[50px] mx-auto rounded-full'
             style={{
              // width: "100%",
              
              backgroundImage: `${user ? `url(https://tan-mad-salamander-939.mypinata.cloud/ipfs/${user.profile_pic})` : ""}`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
              backgroundPosition: "center center",
              
            }}
             >
              
              </div> 
            </Link>
          </li>
        </ul>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={style}>
          <section className="max-w-4xl p-6 mx-auto bg-indigo-600 rounded-md shadow-md dark:bg-gray-800">
            <h1 className="text-xl font-bold text-white capitalize dark:text-white">Add Deposit(in Aptos)</h1>
            <form >
              <div className="grid grid-cols-1 gap-6 mt-4 ">
                <div>
                  <label className="text-white dark:text-gray-200" htmlFor="pname">Amount in APT</label>
                  <input min="0.05" onChange={(e) => setDeposit(e.target.value)} id="pname" type="number" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                </div>
                {/* </div> */}

                <div className="flex justify-end mt-6">
                  <button onClick={handleClose} className="px-6 py-2 mx-5 leading-5 text-white transition-colors duration-200 transform bg-[#4865f6] rounded-md focus:outline-none focus:bg-gray-600">Cancel</button>
                  <button onClick={(e) => handleDeposit(e)} className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-[#4865f6] rounded-md focus:outline-none focus:bg-gray-600">Add</button>
                </div>
              </div>
            </form>
          </section>
        </Box>

      </Modal>

      <Modal
        open={openEarn}
        onClose={handleCloseEarn}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={style}>
          <section className="max-w-4xl p-6 mx-auto bg-indigo-600 rounded-md shadow-md dark:bg-gray-800">
            <h1 className="text-xl font-bold text-white capitalize dark:text-white">Input Amount of T22 Coins</h1>
            <form >
              <div className="grid grid-cols-1 gap-6 mt-4 ">
                <div>
                  <label className="text-white dark:text-gray-200" htmlFor="pname">Amount in T22</label>
                  <input step="any" onChange={(e) => setEarnings(e.target.value)} id="pname" type="number" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                </div>
                {/* </div> */}

                <div className="flex justify-end mt-6">
                  <button onClick={handleCloseEarn} className="px-6 py-2 mx-5 leading-5 text-white transition-colors duration-200 transform bg-[#4865f6] rounded-md focus:outline-none focus:bg-gray-600">Cancel</button>
                  <button onClick={(e) => handleWithdrawEarnings(e)} className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-[#4865f6] rounded-md focus:outline-none focus:bg-gray-600">Add</button>
                </div>
              </div>
            </form>
          </section>
        </Box>

      </Modal>

    </nav>
  );
};

export default Navbar;
