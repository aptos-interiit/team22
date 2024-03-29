// Purpose: Renders the sidebar for the application.


// importing dependencies
import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom';
import homeicon from '../MusicPlayer/assets/home2.png'
import searchicon from '../MusicPlayer/assets/search.png'
import addsongicon from '../MusicPlayer/assets/addsong.png'
import yourradioicon from '../MusicPlayer/assets/yourradio.png'
import allradiosicon from '../MusicPlayer/assets/allradios.png'
import docicon from '../MusicPlayer/assets/icons8-document.svg'


// SideSlider component
function SideSlider() {

  // isSidebarOpen: sidebar state
  const [isSidebarOpen, setSidebarOpen] = useState(true)

  // location: location
  const location = useLocation();

  // minwidth: minimum width
  // maxwidth: maximum width
  // defaultwidth: default width
  const [minWidth, maxWidth, defaultWidth] = [0, 500, 350];

  // width: width
  const [width, setWidth] = useState(
    parseInt(localStorage.getItem("sidebarWidth")) || defaultWidth
  );
  const isResized = useRef(false);

  // useEffect to toggle sidebar
  useEffect(() => {
    window.addEventListener("mousemove", (e) => {
      if (!isResized.current) {
        return;
      }
      setWidth((previousWidth) => {
        const newWidth = previousWidth + e.movementX / 2;
        const isWidthInRange = newWidth >= minWidth && newWidth <= maxWidth;
        return isWidthInRange ? newWidth : previousWidth;
      });
    });
    window.addEventListener("mouseup", () => {
      isResized.current = false;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarWidth", width);
  }, [width]);

  return (
    <div className="flex">
      <div
        style={{ width: `18rem` }}
        className={`bg-black text-white w-64 transition-transform flex h-screen flex-col justify-between`}
      >
        <div className="px-4 py-6">
          <ul className="mt-6 space-y-1">
            <div className='bg-[#121212] m-4 mb-0 rounded-lg'>
              <Link to="/">
                <li className={`flex items-center hover:text-white pl-2`}>
                  <div className='mt-auto mb-auto pl-2'>
                    <img src={homeicon} alt="" className='w-[35px] h-[35px]'/>
                  </div>
                  <p className={`hover:text-white block rounded-lg ml-2 px-4 py-2 text-xl font-medium ${location.pathname === '/' ? 'text-white' : 'text-gray-500'}`}>
                    Home
                  </p>
                </li>
              </Link>
            </div>
            <div className='bg-[#121212] m-4 rounded-lg'>
              <Link to="/search_bar">
                <li className={`flex items-center hover:text-white pl-2`}>
                <div className='mt-auto mb-auto pl-2'>
                    <img src={searchicon} alt="" className='w-[35px] h-[35px]'/>
                  </div>
                  <p className={`hover:text-white block  rounded-lg ml-2 px-4 py-2 text-xl font-medium ${location.pathname === '/search_bar' ? 'text-white' : 'text-gray-500'}`}>
                    Search
                  </p>
                </li>
              </Link>
            </div>
            <div className='bg-[#121212] m-4 rounded-lg'>
              <Link to="/addsong">
                <li className={`flex items-center hover:text-white pl-2`}>
                <div className='mt-auto mb-auto pl-2'>
                    <img src={addsongicon} alt="" className='w-[35px] h-[35px]'/>
                  </div>
                  <p
                    className={`hover:text-white block  rounded-lg ml-2 px-4 py-2 text-xl font-medium ${location.pathname === '/addsong' ? 'text-white' : 'text-gray-500'}`}
                  >
                    Add Song
                  </p>
                </li>
              </Link>
            </div>
            <div className='bg-[#121212] m-4 rounded-lg'>
              <Link to="/yourradio">
                <li className={`flex items-center hover:text-white pl-2`}>
                <div className='mt-auto mb-auto pl-2'>
                    <img src={yourradioicon} alt="" className='w-[35px] h-[35px]'/>
                  </div>
                  <p className={`hover:text-white block  rounded-lg ml-2 px-4 py-2 text-xl font-medium ${location.pathname === '/yourradio' ? 'text-white' : 'text-gray-500'}`}>
                    Your Radio
                  </p>
                </li>
              </Link>
            </div>

            <div className='bg-[#121212] m-4 rounded-lg'>
              <Link to="/allradios">
                <li className={`flex items-center hover:text-white pl-2`}>
                <div className='mt-auto mb-auto pl-2'>
                    <img src={allradiosicon} alt="" className='w-[35px] h-[35px]'/>
                  </div>
                  <p
                    className={`hover:text-white block  rounded-lg ml-2 px-4 py-2 text-xl font-medium ${location.pathname === '/allradios' ? 'text-white' : 'text-gray-500'}`}
                  >
                    All Radios
                  </p>
                </li>
              </Link>
            </div>
            <div className='bg-[#121212] m-4 rounded-lg'>
              <Link to="/dao">
                <li className={`flex items-center hover:text-white pl-2`}>
                <div className='mt-auto mb-auto pl-2'>
                    <img src={docicon} alt="" className='w-[35px] h-[35px]'/>
                  </div>
                  <p
                    className={`hover:text-white block  rounded-lg ml-2 px-4 py-2 text-xl font-medium ${location.pathname === '/dao' ? 'text-white' : 'text-gray-500'}`}
                  >
                    DAO
                  </p>
                </li>
              </Link>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideSlider;
