// Purpose: Provide a page for users to add a song to the database.


// importing dependencies
import React from 'react';
import AddSong from '../components/AddSong';

// AddSongPage component
function AddSongPage() {
  return (
    <div className='bg-black max-h-screen overflow-y-scroll p-4'>
      <AddSong></AddSong>
    </div>
  );
}

export default AddSongPage;
