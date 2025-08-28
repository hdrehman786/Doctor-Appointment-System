import React, { useEffect, useState } from 'react'
import logo from "../assets/logo.avif"
import { FaAngleUp } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import Divider from './Divider';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { logout, useUser } from '../utils/usersystem';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();



  const options = [
    { label: 'Home', url: '/' },
    { label: 'All Doctors', url: '/alldoctors/All' },
    { label: 'About', url: '/about-us' },
    { label: 'Contact', url: '/contact-us' },
  ];

  useEffect(() => {
    const current = options.find(option => option.url === location.pathname);
    if (current) {
      setActive(current.label);
    }
  }, [location.pathname]);

  const [width, setWidth] = useState(window.innerWidth);
  const [isDecreasing, setIsDecreasing] = useState(false);
  const [isLogin, setisLogin] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    let prevWidth = window.innerWidth;

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      setIsDecreasing(currentWidth < prevWidth);
      prevWidth = currentWidth;
      setWidth(currentWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data, isLoading, isError } = useUser();

  useEffect(() => {
    if (!isLoading) {
      const isAuthenticated = !!data?._id || !!data?.data?._id;
      setisLogin(isAuthenticated);
      setUserData(data?.data || data);
    }
  }, [data, isLoading]);

  const userlogout = () => {
    mutation.mutate();
  }

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      toast.success(data.message);
      setisLogin(false);
      setShow(false);
      setUserData(null);
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })




  const userRole = data?.data?.role || data?.role || userData?.role;


  return (
    <div className=' relative'>
      <nav className=' "fixed top-0 left-0 w-full z-50 bg-white/70 border-b-1 border-b-gray-400 flex justify-between items-center '>

        <div onClick={() => navigate("/")} className=' flex items-center  cursor-pointer  gap-0 relative'>
          <img className='h-14 w-14 mix-blend-darken' src={logo} alt="" />
          <h1>DocSpot</h1>
          {userRole === "Admin" && (
            <p className='text-[10px] absolute z-50 top-0 right-0 border rounded-full'>Admin</p>
          )}
          {userRole === "Doctor" && (
            <p className='text-[10px] absolute z-50 top-0 right-0 border rounded-full'>Doctor</p>
          )}
        </div>

        {width >= 768 && (
          <div className="flex flex-wrap gap-4">
            {options.map((option) => (
              <button
                key={option.label}
                onClick={() => {
                  setActive(option.label);
                  navigate(option.url);
                }}
                className="relative pb-1 cursor-pointer font-medium transition-colors ease-in-out duration-300"
              >
                <span className="relative z-10">
                  {option.label.toUpperCase()}
                </span>
                <span
                  className={`absolute left-0 bottom-0 h-[3px] w-full rounded-full transition-transform duration-500 ease-in-out transform ${active === option.label
                    ? "scale-x-80 bg-[#20B2AA]"
                    : "scale-x-0 bg-[#20B2AA]"
                    }`}
                ></span>
              </button>
            ))}
          </div>
        )}

        {isLogin ? (
          <div className='flex items-center gap-3 cursor-pointer' onClick={() => setShow(!show)}>
            <img
              className='h-10 w-10 rounded-full border-2 border-gray-200 object-cover flex-shrink-0'
              src={userData.avatar}
              alt={`${userData.name}'s avatar`}
            />
            <button className=' cursor-pointer'>
              {show ? <FaAngleUp /> : <FaAngleDown size={16} />}
            </button>
          </div>
        ) : (
          <div>
            <Link to={"/register"} className='bg-[#20B2AA] hover:bg-[#0c8680]  lg:py-3 lg:px-5 py-2 px-3 rounded-full text-white'>
              Create Account
            </Link>
          </div>
        )}
      </nav>

      {show && (
        <div className='flex flex-col fixed right-0 top-16 z-50 w-full md:w-1/4 rounded-md lg:w-1/4 bg-[#fdfcf7] p-4 gap-3 shadow-md text-gray-800'>
          <Link
            to={"/my-profile"}
            className='py-2 px-4 text-center hover:bg-[#f0eee7] rounded-md font-medium transition duration-200'
            onClick={() => setShow(false)}
          >
            Profile
          </Link>

          {userRole === "Admin" && (
            <Link
              to={"/dashboard"}
              className='py-2 px-4 text-center hover:bg-[#f0eee7] rounded-md font-medium transition duration-200'
              onClick={() => setShow(false)}
            >
              Dashboard
            </Link>
          )}

          <hr className="border-t border-gray-300" />

          <Link
            to={userRole === "Doctor" ? "/doctor-appointments" : "/myappointments"}
            className='py-2 px-4 text-center hover:bg-[#f0eee7] rounded-md font-medium transition duration-200'
            onClick={() => setShow(false)}
          >
            My Appointments
          </Link>

          <hr className="border-t border-gray-300" />
          {
            userRole === "Doctor" && (
            <Link
              to={userRole === "Doctor" ? "/docotor-timeslots-manager" : "/"}
              className='py-2 px-4 text-center hover:bg-[#f0eee7] rounded-md font-medium transition duration-200'
              onClick={() => setShow(false)}
            >
              My Time Slots
            </Link>
            )
          }


          {width < 768 && (
            options.map((option) => (
              <button
                key={option.label}
                onClick={() => {
                  setActive(option.label);
                  navigate(option.url);
                  setShow(false);
                }}
                className='py-2 px-4 text-center hover:bg-[#f0eee7] rounded-md font-medium transition duration-200'
              >
                {option.label}
              </button>
            ))
          )}

          <hr className="border-t border-gray-300" />

          <button
            className='py-2 px-4 text-center hover:bg-[#ffecec] text-red-600 rounded-md font-semibold transition duration-200'
            onClick={() => userlogout()}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default Navbar;