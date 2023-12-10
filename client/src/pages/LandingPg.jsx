import React,{useEffect} from 'react'

import { FaLongArrowAltRight } from "react-icons/fa"
import NavbarLand from '../components/NavbarLand'
import AppPic from "../MusicPlayer/assets/AppPic.png"
import back2 from "../MusicPlayer/assets/backimg.jpeg"

import AOS from 'aos';
import 'aos/dist/aos.css';

const LandingPg = () => {
    useEffect(() => {
        AOS.init();
      }, [])
    const styles = {
        backgroundImage: `url(${back2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }
  return (
    <>
    <main className=" h-screen w-screen " style={styles}>
    <NavbarLand />
    <div className="flex flex-col-reverse items-center lg:flex-row w-full justify-between text-white mb-4 w-full xl:max-w-[1250px] mx-auto px-6 " >
        <div className="flex flex-col mt-10 items-center lg:items-start" >
            {/* <h3 className="text-[10vw] font-bold " style={{fontFamily:"Exo\\ 2"}}>APTUNES</h3> */}
            <img src={AppPic} alt="aptunes" className='w-1/2'/>
            <p className="text-[3.5vw]  font-light " >Move With Aptunes!</p><br />
            <button className="px-8 py-2.5  bg-white font-bold rounded-3xl text-[2vw] text-[#210535] " >Get Started</button>
            
            <div className='flex flex-row gap-4 mt-11 w-full justify-evenly'  >
                <div className='px-7 py-4 bg-transparent font-bold rounded-lg text-[1.5vw] text-[#e9d5ff] border border-white border-dashed'>
                    <a href="https://petra.app/">Join <span className='underline'>Petra</span> Wallet!</a>
                </div>
                <FaLongArrowAltRight className='mt-4 ' size={28}/>
                <div className='px-7 py-4 bg-transparent font-bold rounded-lg text-[1.5vw] text-[#e9d5ff] border border-white border-dashed'>Connect Wallet</div>
                <FaLongArrowAltRight className='mt-4 ' size={28}/>
                <div className='px-7 py-4 bg-transparent font-bold rounded-lg text-[1.5vw] text-[#e9d5ff] border border-white border-dashed'>Add User Info</div>
                <FaLongArrowAltRight className='mt-4 ' size={28}/>
                <div className='px-7 py-4 bg-transparent font-bold rounded-lg text-[1.5vw] text-[#e9d5ff] border border-white border-dashed'>Start Steaming!</div>
            </div>
            
            
        </div>


        
    </div>
    </main>
    </>
  )
}

export default LandingPg