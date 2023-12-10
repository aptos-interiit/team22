import React from 'react';
import back2 from "../MusicPlayer/assets/backimg2.png"
import NavbarLand from '../components/NavbarLand';

const AboutUs = () => {

    // const styles = {
    //     backgroundImage: `url(${back2})`,
    //     backgroundSize: 'cover',
    //     backgroundPosition: 'center',
    //     backgroundRepeat: 'no-repeat',
    //     backgroundAttachment: 'fixed'
    //   }
  return (
    <section className=" h-screen w-screen bg-transparent " >
       
        <div className='grid grid-cols-2 w-screen'>
      <div className="max-w-4xl mx-5 my-5 px-4 text-white text-left ">
        <h2 className="text-[5vw] font-bold   mb-6 drop-shadow-2xl">About Us</h2>
        <p className="text-lg  leading-relaxed mb-8 drop-shadow-2xl">
        Team-22 is excited to be a part of Inter-IIT-12.0, embarking on a journey fueled by innovation and collaboration. Our team has enthusiastically taken up the challenge posed by Aptos Blockchain, diving deep into their intriguing Problem Statement. Leveraging our collective expertise and boundless creativity, we've engineered an On-chain Radio solution that transcends conventional boundaries. 
        </p>
        <p className="text-lg  leading-relaxed mb-8 drop-shadow-2xl">
        Our aim is to redefine the landscape of possibilities within the blockchain realm, offering a seamless fusion of technology and creativity that resonates with the world. Join us as we pave the way for groundbreaking solutions at this prestigious event.
        </p>        
      </div>
      </div>
    </section>
  );
};

export default AboutUs;
