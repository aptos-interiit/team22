import React from "react";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { BsPauseCircle, BsPlayCircleFill } from "react-icons/bs";
import { MdRepeat } from "react-icons/md";
import { TbArrowsShuffle } from "react-icons/tb";


function secondsToTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  if(remainingSeconds < 10) {remainingSeconds = '0' + Math.round(remainingSeconds)}
  else{remainingSeconds = Math.round(remainingSeconds)}

  return minutes + ':' + remainingSeconds;
}

const AudioControls2 = ({
  isPlaying,
  onPlayPauseClick,
  onPrevClick,
  onNextClick,
  onScrubEnd,
  onScrub,
  trackProgress,
  duration,
  title,
  stop,handleExit
}) => (
  <footer className="bg-[#1137f5] fixed bottom-0 w-full text-white">
    
    <div className="flex justify-center md:justify-between items-center h-16">

      <div className="img md:flex items-center md:visible hidden pl-20">
        {title}
      </div>

      <div className="flex items-center">
        <TbArrowsShuffle className="text-gray-400 mr-5" />
        <button
          type="button"
          className="prev"
          aria-label="Previous"
          onClick={onPrevClick}
        >
          <BiSkipPrevious size={30} />
        </button>


        {isPlaying ? (
          <button
            type="button"
            className="pause"
            onClick={() => onPlayPauseClick(false)}
            aria-label="Pause"
          >
            <BsPauseCircle size={40} className="text-primary mx-5" />
          </button>
        ) : (
          <button
            type="button"
            className="play"
            onClick={() => onPlayPauseClick(true)}
            aria-label="Play"
          >
            <BsPlayCircleFill size={40} className="text-primary mx-5" />
          </button>
        )}
        <button
        type="button"
        className="stop"
        aria-label="stop"
        onClick={stop}
        >
          stop
        </button>
        <button
        type="button"
        className="exit"
        aria-label="exit"
        onClick={handleExit}
        >
          exit
        </button>
        <button
          type="button"
          className="next"
          aria-label="Next"
          onClick={onNextClick}
        >
          <BiSkipNext size={30} />
        </button>

        
        <MdRepeat className="text-gray-400 ml-5" />
      </div>
      <div className="md:flex items-center mx-5 md:visible hidden pr-20">
        <p className="text-white text-sm">{isNaN(trackProgress)? "00:00" : (secondsToTime(trackProgress))} / {(isNaN(duration) ? "00:00" :secondsToTime(duration))}</p>
        {/* <HiVolumeUp className="mx-8" />
        <AiOutlineMenu /> */}
      </div>      
    </div>
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
  </footer>
);

export default AudioControls2;
