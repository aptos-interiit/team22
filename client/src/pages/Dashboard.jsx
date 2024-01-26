// Purpose: Provide the main dashboard page for the user to interact with the application.

// importing dependencies
import React from 'react';
import SideSlider from "./SideSlider";
import MainPage from "./MainPage";
import Navbar from './Navbar';


// Dashboard component
function Dashboard({ load, user, handleAdd, handleDeposit, setDeposit, setTrackid }) {
  return (
    <div className="flex bg-black">
      <div className="border-e">
        <SideSlider />
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
          <></>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
