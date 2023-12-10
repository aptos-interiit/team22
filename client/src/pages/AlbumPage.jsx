import React from "react";
// import {HeartIcon} from "@heroicons/react/outline";
import { AiOutlineHeart, AiOutlineMenu } from "react-icons/ai";
function AlbumPage() {
  return (
    <>
    <div className="group col-span-1 cursor-pointer rounded-md bg-neutral-600 bg-opacity-10 p-3 transition-all duration-300 ease-in-out hover:bg-opacity-20 bg-gray-600 select-none">
			<div className="flex w-full flex-col gap-2 bg-gray-500">
				<div className="group relative w-full overflow-hidden rounded-xl shadow-lg shadow-neutral-900 transition-all duration-300 ease-in-out bg-gray-700 flex columns-2">
					
                    <img
                        className="rounded-md w-[200px] h-[200px] object-cover"
                        src="https://tune.fm/public/images/default-music-listing.svg"
                        alt={"Playlist Image"}/>
                        <div className="pl-2">
					<div className="absolute bottom-3 right-3 hidden flex-row items-center gap-2 group-hover:flex">
						
<AiOutlineHeart />
					</div>

                    <h1 className="mt-5 truncate text-lg font-bold text-white">Name of Song</h1>
				<p className="mt-2 line-clamp-3 text-sm font-semibold text-gray-400">yaha par description aayega  e 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop puLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essenti</p>
                </div>
				</div>
				
					
			</div>
		</div>
        <div>
        <div className="group col-span-1 cursor-pointer rounded-md bg-neutral-600 bg-opacity-10 p-3 transition-all duration-300 ease-in-out hover:bg-opacity-20 bg-gray-600 select-none">
			<div className="flex w-full flex-col gap-2 bg-gray-500">
                
				<div className="group relative w-full overflow-hidden rounded-xl shadow-lg shadow-neutral-900 transition-all duration-300 ease-in-out bg-gray-700 grid grid-cols-10 gap-2">
					
                    <img
                        className="rounded-md w-[80px] h-[80px] object-cover col-span-1"
                        src="https://tune.fm/public/images/default-music-listing.svg"
                        alt={"Playlist Image"}/>
                    
                    <div className="pl-2 col-span-5">

                    <h1 className="mt-2 truncate text-lg font-bold text-white ">Name of Song</h1>
				<p className="mt-2 line-clamp-1 text-sm font-semibold text-gray-400 ">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including version Lorem Ipbeen the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specim </p>
                </div>
                <div className="col-span-3">
                <h1 className="mt-2 truncate text-lg font-bold text-white ">Name of album</h1>
                </div>
                <div className="absolute bottom-3 right-3 items-center gap-2 ">				
<h1>like button</h1>
					</div>
				</div>
				
					
			</div>
		</div>
        </div>

        </>

  );
}

export default AlbumPage;