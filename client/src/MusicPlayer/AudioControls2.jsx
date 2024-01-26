// Summary: This component is the audio controls for the music player. It is the same as AudioControls.jsx except it has a different styling.


// importing dependencies
import React from "react";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { BsPauseCircle, BsPlayCircleFill } from "react-icons/bs";
import { MdRepeat } from "react-icons/md";
import { TbArrowsShuffle } from "react-icons/tb";

// function to convert seconds to time
function secondsToTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  if(remainingSeconds < 10) {remainingSeconds = '0' + Math.round(remainingSeconds)}
  else{remainingSeconds = Math.round(remainingSeconds)}
  return minutes + ':' + remainingSeconds;
}

// AudioControls2 component
const AudioControls2 = ({
  isPlaying,                 // isPlaying: state to store whether the song is playing or not
  onPlayPauseClick,          // onPlayPauseClick: function to handle play/pause button click
  onPrevClick,               // onPrevClick: function to handle previous button click
  onNextClick,               // onNextClick: function to handle next button click
  onScrubEnd,                // onScrubEnd: function to handle scrub end
  onScrub,                   // onScrub: function to handle scrub
  trackProgress,             // trackProgress: state to store the track progress
  duration,                  // duration: state to store the duration
  title,                     // title: state to store the title
  stop,handleExit            // stop: function to handle stop
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
        > <BiSkipPrevious size={30} />
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
