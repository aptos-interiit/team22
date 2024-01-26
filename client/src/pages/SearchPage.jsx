// Purpose: To display the search page


// importing dependencies
import React, { useEffect, useState, useContext } from 'react';
import SideSlider from "./SideSlider";
import Navbar from './Navbar';
import Search from './Search';
import SearchPg from './SearchPg';
import { dataContext } from "../Context/dataContext";

// SearchPage component
function SearchPage({ load, user }) {

  // songs: songs
  const { songs, setSearchsong } =
    useContext(dataContext);

  // count: count state
  const [count, setCount] = useState(0)

  // function to handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    let value = e.target.value
    let search = await SearchPg(songs, value)
    setSearchsong(search)
    setCount(search.length)
  }

  // returning the SearchPage component
  return (
    <div className="flex w-[100%] mx-auto max-w-full">
      <div className="border-e">
        <SideSlider />
      </div>
      <div className='bg-black m-0 w-full'>
        {load ? (
          <>
            <div className='max-h-screen overflow-y-auto mx-auto w-full'>
              <Navbar savings={user ? user.savings : 0} handleSubmit={handleSubmit} />
              <Search />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
