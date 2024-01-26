// Summary: This component is a card that displays the name of a playlist. 
// It is used in the PlaylistOptions component.


// importing dependencies
import React from "react";

// OptionCard component
function OptionCard({ playlistName }) {

    // returning the OptionCard component
    return (
        <div className="bg-[#23252d] rounded-lg p-4 text-white transition duration-300 hover:bg-gray-800 hover:cursor-pointer">
            {playlistName}
        </div>
    )
}

export default OptionCard;