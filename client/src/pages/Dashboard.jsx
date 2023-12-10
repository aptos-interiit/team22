// MainContent.jsx

import React, {useEffect} from 'react';
import SideSlider from "./SideSlider";
import MainPage from "./MainPage";
import Navbar from './Navbar';
import SideBar from './SideBar';

function Dashboard({ load, user, handleAdd, handleDeposit, setDeposit, setTrackid }) {
  return (
    <div className="flex bg-black">
      <div className="border-e">
        <SideSlider />
        {/* <SideBar></SideBar> */}
      </div>
      
      <div className='bg-black w-full'>
        {load ? (
          <>
            <div className='max-h-screen overflow-y-auto'>
            <Navbar savings={user ? user.savings:0} handleDeposit={handleDeposit}/>
              <MainPage setTrackid={setTrackid} />
            </div>
          </>
        ) : (
          <>{/* <div className="loader"></div> */}</>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
