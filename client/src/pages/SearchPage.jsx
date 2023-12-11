// MainContent.jsx

import React, {useEffect, useState, useContext} from 'react';
import SideSlider from "./SideSlider";
import MainPage from "./MainPage";
import Navbar from './Navbar';
import SideBar from './SideBar';
import Search from './Search';
import SearchPg from './SearchPg';
import { dataContext } from "../Context/dataContext";

function SearchPage({ load, user}) {
    const {songs, setSearchsong, setTrackid} =
    useContext(dataContext);
    const [count, setCount] = useState(0)
    const handleSubmit = async (e) => {
        e.preventDefault()
        let value = e.target.value
        let search = await SearchPg(songs, value)
        // console.log(search);
        setSearchsong(search)
        setCount(search.length)
        // window.location.href="/search"
      }
  return (
    <div className="flex w-[100%] mx-auto max-w-full">
      <div className="border-e">
        <SideSlider />
        {/* <SideBar></SideBar> */}
      </div>
      
      <div className='bg-black m-0 w-full'>
        {load ? (
          <>
            <div className='max-h-screen overflow-y-auto mx-auto w-full'>
            <Navbar savings={user ? user.savings : 0} handleSubmit={handleSubmit}/>
              <Search />
            </div>
          </>
        ) : (
          <>{/* <div className="loader"></div> */}</>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
