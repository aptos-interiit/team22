// Summary: Backdrop component for the music player. Changes color based on the active track's color.


// importing dependencies
import React, { useEffect } from "react";

// Backdrop component
const Backdrop = ({ activeColor, trackIndex, isPlaying }) => {
  useEffect(() => {
    document.documentElement.style.setProperty("--active-color", activeColor);
  }, [trackIndex, activeColor]);
  return <div className={`color-backdrop ${isPlaying ? "playing" : "idle"}`} />;
};

export default Backdrop;
