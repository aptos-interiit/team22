import React, { useState, useContext, useEffect } from 'react'
import { GoChevronUp, GoChevronDown } from "react-icons/go";
import { dataContext } from '../Context/dataContext';
import img from "./assets/playBtn.png"
import pause from "./assets/Untitled_design__12_-removebg-preview.png"
import liveicon from "./assets/live.png"
import radioicon from "./assets/yourradio.png"
import playingRadioIcon from "./assets/gif2.gif"
import stopIcon from "./assets/stop2.png"
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import lightningIcon from "./assets/lightning.png"
import Marquee from "react-fast-marquee";

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



function secondsToTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  if (remainingSeconds < 9) {
    remainingSeconds = "0" + Math.round(remainingSeconds);
  } else {
    remainingSeconds = Math.round(remainingSeconds);
  }

  return minutes + ":" + remainingSeconds;
}


const Music = ({
  isPlaying,
  onPlayPauseClick,
  onPrevClick,
  onNextClick,
  onScrubEnd,
  onScrub,
  trackProgress,
  duration,
  owner,
  title,
  coverIpfs,
  stopRadio,
  owner_name
}) => {
  const [icon, setIcon] = useState(<GoChevronUp />)
  const [disp, setDisp] = useState('hidden')
  const { isRadio, radio, handleTurboTip } = useContext(dataContext);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [tip, setTip] = useState(0);

  const handleTurboTipWrapper = async (e) => {
    e.preventDefault();
    const condition = await handleTurboTip(tip * 1e8, radio.user_address);
    if (condition == "success") {
      handleClose();
    }
  }

  useEffect(() => {
    console.log(radio);
  }, [radio])

  return (
    <footer className="sticky bottom-0 bg-black">
      <div >
        <div className="w-full">
          <div id="player" className={`${disp} bg-[#23252e] none dark:bg-[#23252e]  p-4 pb-6 sm:p-4 sm:pb-4 lg:p-4 xl:p-4 xl:pb-4 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8  items-center`}>
            <div className="flex items-center space-x-4">
              <img src={`https://tan-mad-salamander-939.mypinata.cloud/ipfs/${coverIpfs}`} alt="" width="88" height="88" className="flex-none rounded-lg bg-slate-100" loading="lazy" />
              <div className="min-w-0 flex-auto space-y-1 font-semibold">
                <p className="text-white text-sm leading-6">
                  <abbr title="Track">Artist:</abbr> {owner_name}
                </p>
                <p className="text-white dark:text-white text-lg">
                  {title}
                </p>
              </div>
            </div>

          </div>
          <div className="bg-[#23252e] flex w-full justify-evenly items-center opacity-100">
            {isRadio ? (
              <></>
            ) : (
              <>
                <div className="text-cyan-500 dark:text-white pr-2 py-3">
                  {isNaN(trackProgress)
                    ? "00:00"
                    : secondsToTime(trackProgress)}
                </div>
                <div className="relative w-3/4 justify-center items-center">
                  {/* <div className="bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden"> */}
                  <input
                    type="range"
                    value={trackProgress}
                    step="1"
                    min="0"
                    max={duration ? duration : `${duration}`}
                    className="progress w-full "
                    onChange={(e) => onScrub(e.target.value)}
                    onMouseUp={onScrubEnd}
                    onKeyUp={onScrubEnd}
                  />
                </div>
                <div className="text-white dark:text-white pl-2">
                  {isNaN(duration) ? "00:00" : secondsToTime(duration)}
                </div>
              </>
            )}
          </div>
          <div className="flex justify-center opacity-100 bg-[#23252e] text-white-500 dark:bg-[#23252e] dark:text-white-200 items-center h-full overflow-hidden">            {isRadio ? (
            <>
              <div style={{ position: 'relative' }} className="flex gap-20 items-center text-white w-full px-4 justify-center h-20">
                <div className='flex items-center'>
                  <div className='mr-4'>
                    <img src={radioicon} alt="" className='w-[35px] h-[35px]' />
                  </div>
                  <p className='font-bold text-2xl'>{radio.title}</p>
                </div>
                <div className='flex items-center'>
                  <span className='mr-2 text-gray-500 opacity-70'>Current Song : </span>
                  <p className='text-2xl'>{title}</p>
                  <div className='ml-4'>
                    <img src={playingRadioIcon} alt="" className='w-[40px] h-[40px]' />
                  </div>
                </div>
                <div className='ml-4 hover:cursor-pointer' onClick={stopRadio} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                  <img src={stopIcon} alt="" className='w-[60px] h-[60px]' />
                </div>
                <div className="flex items-center ml-auto">
                  <button onClick={handleOpen} className='bg-[#2AAA8A] text-white mr-4 rounded-2xl border-2 border-[#07F810] p-2 flex items-center px-4'>
                    <img src={lightningIcon} alt="" className='w-[35px] h-[35px]' />
                    <span className='ml-2'>Turbo Tip</span>
                  </button>
                  <p className='text-xl'>{radio.songs.length} Songs</p>
                  <div className="flex items-center ml-4">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full mr-2"
                      style={{
                        backgroundImage: `url(${liveicon})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "100% 100%",
                        backgroundPosition: "center center",
                      }}
                    ></div>
                    <h1 className="text-[#da4149] font-bold">LIVE</h1>
                  </div>
                </div>
              </div>

            </>
          ) : (
            <>
              <div className="text-white flex-auto flex items-center justify-evenly">
                <div className='mr-3 flex ml-0'>
                <img src={`https://tan-mad-salamander-939.mypinata.cloud/ipfs/${coverIpfs}`} alt="" width="44" height="44" className="flex-none rounded-lg bg-slate-100" loading="lazy" />
                <div className='w-[200px] my-auto mx-4'><Marquee>{title} </Marquee>
                  
                  </div>
                </div>
                
                <button
                  type="button"
                  className="hidden sm:block lg:hidden xl:block"
                  aria-label="Previous"
                  onClick={onPrevClick}
                >
                  <svg width="24" height="24" fill="none">
                    <path
                      d="m10 12 8-6v12l-8-6Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 6v12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              {isPlaying ? (
                <button
                  type="button"
                  onClick={() => onPlayPauseClick(false)}
                  className="bg-white text-white dark:bg-slate-100 dark:text-white flex-none my-1 mx-auto w-10 h-10 rounded-full ring-1 ring-slate-900/5 shadow-md flex items-center justify-center"
                  aria-label="Pause"
                >
                  <img src={pause}>
                  </img>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onPlayPauseClick(true)}
                  className="bg-white text-white dark:bg-slate-100 dark:text-white flex-none my-1 mx-auto w-10 h-10 rounded-full ring-1 ring-slate-900/5 shadow-md flex items-center justify-center"
                  aria-label="Play"
                >
                  <img src={img}>
                  </img>
                </button>
              )}

              <div className="text-white flex-auto flex items-center justify-evenly">
                <button
                  type="button"
                  onClick={onNextClick}
                  className="hidden sm:block lg:hidden xl:block"
                  aria-label="Next"
                >
                  <svg width="24" height="24" fill="none">
                    <path
                      d="M14 12 6 6v12l8-6Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18 6v12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (disp === "hidden") {
                      setDisp("block");
                      setIcon(<GoChevronDown />);
                    } else {
                      setDisp("hidden");
                      setIcon(<GoChevronUp />);
                    }
                  }}
                >
                  {icon}
                </button>
              </div>
            </>
          )}

          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={style}>
          <section className="max-w-4xl p-6 mx-auto rounded-md shadow-md bg-[#2AAA8A] border-2 border-[#07F810]">
            <div className='flex items-center'>
              <img src={lightningIcon} alt="" className='w-[35px] h-[35px]' />
              <h1 className="text-xl font-bold text-white capitalize dark:text-white">Send Turbo Tip</h1>
            </div>

            <form >
              <div className="grid grid-cols-1 gap-6 mt-4 ">
                <div>
                  <label className="text-white" htmlFor="pname">Amount(in APT)</label>
                  <input step="any" onChange={(e) => setTip(e.target.value)} id="pname" type="number" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md bg-[#44b89b] dark:text-gray-300 dark:border-[#07F810] focus:border-[#07F810] dark:focus:border-[#07F810] focus:outline-none" />
                </div>
                {/* </div> */}

                <div class="flex justify-end mt-6">
                  <button onClick={handleClose} className="bg-[#2AAA8A] text-white mr-4 rounded-2xl border-2 border-[#07F810] p-2 flex items-center px-4">Cancel</button>
                  <button onClick={(e) => handleTurboTipWrapper(e)} className="bg-[#2AAA8A] text-white mr-4 rounded-2xl border-2 border-[#07F810] p-2 flex items-center px-4">Send</button>
                </div>
              </div>
            </form>
          </section>
        </Box>

      </Modal>
    </footer>
  )
}

export default Music