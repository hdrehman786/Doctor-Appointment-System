import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { IoHomeOutline, IoBagAddOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";


const Dashboard = () => {
    const location = useLocation();

    const dashboardOptions = [
        { id: 1, name: 'Dashboard', path: '/dashboard', icon: <IoHomeOutline size={22} /> },
        { id: 2, name: 'My Appointments', path: '/dashboard/allmyappointments', icon: <FaRegCalendarAlt size={22} /> },
        { id: 3, name: 'Add Doctor', path: '/dashboard/adddoctor', icon: <IoBagAddOutline size={22} /> },
        { id: 4, name: 'Doctor List', path: '/dashboard/alldoctors', icon: <LuUsers size={22} /> },
    ];

    return (
        <section className='flex min-h-[85vh]'>


            <div className='flex-shrink-0 flex-col gap-2 border-r border-gray-200 bg-white p-2 md:p-4 w-20 md:w-64 transition-all duration-300 ease-in-out'>
                {dashboardOptions.map((option) => (
                    <Link
                        key={option.id}
                        to={option.path}
                        className={`flex items-center rounded-lg p-3 gap-3 text-sm font-medium transition-colors justify-center md:justify-start ${location.pathname === option.path
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >

                        <span>{option.icon}</span>


                        <h3 className='hidden md:inline'>{option.name}</h3>
                    </Link>
                ))}
            </div>


            <div className='flex-1 p-4 md:p-6 bg-gray-50/50 overflow-y-auto'>
                <Outlet />
            </div>
        </section>
    );
};

export default Dashboard;