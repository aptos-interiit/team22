// Summary: This component is used to display the playlist card in the playlist page.


// importing libraries and dependencies
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React, { useContext, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { dataContext } from "../Context/dataContext";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { toast } from "react-toastify";

// Style for modal
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

// PlaylistCard component
export default function PlaylistCard({ name, len, id, playlist }) {

  // images: images array
  const images = ["image_1.jpg", "image_2.jpg", "image_3.jpg"];

  // randomImage: random image
  const randomImage = images[id % 3];

  // transactionInProgress: transaction state
  const [transactionInProgress, setTransactionInProgress] = useState(false);

  // account: account of the user
  const { account, signAndSubmitTransaction } = useWallet();

  // addre: address of the contract
  // provider: provider of the contract
  // transact: transaction state
  // setTransact: set transaction state
  const { addre, provider, transact, setTransact } = useContext(dataContext);

  // open: open state for modal
  const [open, setOpen] = useState(false);

  // function to handle open for modal
  const handleOpen = () => setOpen(true);

  // function to handle close for modal
  const handleClose = () => setOpen(false);

  // function to delete playlist
  const handleDeletePlaylist = async (name) => {
    if (!account) return;
    setTransactionInProgress(true);

    // delete playlist
    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${addre}::music_platform::delete_playlist`,
        typeArguments: [],
        functionArguments: [name],
      },
    };
    try {
      const response = await signAndSubmitTransaction(payload);
      setTransact(transact + 1);
      toast.success(`Playlist Deleted`, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      await provider.waitForTransaction(response.hash);
    } catch (err) {
      console.log(err);
    } finally {
      setTransactionInProgress(false);
    }
  };

  // returning the PlaylistCard component
  return (
    <div className="p-2 bg-[#23252e] w-[100%] rounded-lg flex  border-white mx-auto mt-4 sm:mt-8 cursor-pointer hover:opacity-60">
      <Link
        to="/playlistSpace"
        state={{ data: playlist, name: name, img: randomImage }}
        className="grid grid-cols-4 sm:grid-cols-6"
      >
        <div
          className="w-[60px] h-[60px] rounded-lg"
          style={{
            backgroundImage: `url(${require(`../MusicPlayer/assets/${randomImage}`)})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
          }}
        ></div>
        <div className="col-span-2 sm:col-span-4 mt-2 ml-4">
          <div className="font-bold text-lg">{name}</div>
          <div className="font-medium text-sm mt-[-5px] text-[#515251]">
            {playlist.length} songs
          </div>
        </div>
      </Link>
      {id === 0 ? (
        <></>
      ) : (
        <button
          className="mr-0"
          onClick={() => { handleOpen(); }}
        >
          <MdDelete size={30} />
        </button>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={style}>
          <section class="max-w-4xl p-6 mx-auto bg-indigo-600 rounded-md shadow-md dark:bg-gray-800">
            <h1 class="text-lg text-white capitalize">Are you Sure you want to delete your</h1>
            <h1 class="text-lg text-white capitalize">"{name}" playlist ?</h1>
            <form className="mt-5">
              <button className="px-6 py-2 mx-2 leading-5 text-white transition-colors duration-200 transform bg-[#4865f6] rounded-md focus:outline-none focus:bg-gray-600" onClick={() => {
                handleClose();
              }}>Cancel</button>
              <button className="px-6 py-2 mx-2 leading-5 text-white transition-colors duration-200 transform bg-red-500 rounded-md focus:outline-none focus:bg-gray-600" onClick={(e) => {
                e.preventDefault();
                handleDeletePlaylist(name);
                handleClose();
              }}>Confirm</button>
            </form>
          </section>
        </Box>
      </Modal>
    </div>
  );
}
