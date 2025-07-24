import React from 'react'
import logo from "../assets/logo.avif"
import Divider from './Divider'

const Footer = () => {
    return (
        <footer className='mb-12'>
            <div className='w-full flex flex-col lg:flex-row items-center p-4 justify-between'>
                <div className='lg:w-1/2 w-full h-full'>
                    <div className='flex items-center'>
                        <img className='h-14 w-14 mix-blend-darken' src={logo} alt="" />
                        <h1 className='font-bold text-xl text-[#20B2AA]'>DocSpot</h1>
                    </div>
                    <p className='text-sm text-gray-600 mt-2'>
                        MyDoctor is a trusted healthcare platform dedicated to connecting patients with experienced and certified doctors.
                        Our mission is to make healthcare accessible, reliable, and efficient for everyone.
                        We work with licensed professionals and verified medical organizations.
                        Your health is our priority always in safe and caring hands.
                    </p>
                </div>

                <div className='lg:w-1/2 w-full p-4 flex justify-around lg:mt-0 mt-3 h-full'>
                    <div>
                        <h1 className='text-xl font-bold text-gray-700'>Company</h1>
                        <h4 className='mt-3 text-md'>Home</h4>
                        <h4 className='text-md'>Doctors</h4>
                        <h4 className='text-md'>About us</h4>
                        <h4 className='text-md'>Contact us</h4>
                    </div>
                    <div>
                        <h1 className='text-xl font-bold'>Get In Touch</h1>
                        <h4 className='mt-3 text-md'>+92303-2872912</h4>
                        <h4 className='text-md'>danishrao@gmail.com</h4>
                    </div>
                </div>
            </div>
            
            {/* Perfect divider */}
            <div className="w-full border-t border-gray-300 my-4"></div>
            
            {/* Centered copyright text in gray */}
            <div className="text-center text-gray-500 text-sm mt-2">
                © {new Date().getFullYear()} MydoctoApp. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer