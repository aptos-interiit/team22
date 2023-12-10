import React from "react";

function OptionCard({ playlistName }) {
    return (
        <div class="bg-[#23252d] rounded-lg p-4 text-white transition duration-300 hover:bg-gray-800 hover:cursor-pointer">
            {playlistName}
        </div>
    )
}

export default OptionCard;