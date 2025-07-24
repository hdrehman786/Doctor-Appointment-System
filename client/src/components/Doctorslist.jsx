import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getAllDoctors, useUser } from '../utils/usersystem';
import { Link } from 'react-router-dom';


const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const { data, error, isLoading } = useUser();

    const { mutate } = useMutation({
        mutationFn: getAllDoctors,
        onSuccess: (data) => {
            setDoctors(data?.data?.slice(0, 10) || []); // Only take first 10 doctors
        },
        onError: (error) => {
            console.error("Error fetching doctors:", error);
        }
    });

    useEffect(() => {
        mutate();
    }, [mutate]);

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Top Doctors To Book
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Simply browse through our extensive list of trusted doctors
                </p>
            </div>

            {/* Doctors Grid */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {doctors.map((doctor) => (
                        <Link
                            to={`/doctordetails/${doctor._id}`}
                            key={doctor._id}
                            className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                        >
                            {/* Image Section (75% height) */}
                            <div className="h-60 overflow-hidden">
                                <img
                                    className="w-full h-full object-cover"
                                    src={doctor.doctor.avatar}
                                    alt={`${doctor.doctor.name}, ${doctor.specialisation}`}
                                    loading="lazy"
                                />
                            </div>

                            {/* Content Section (25% height) */}
                            <div className="p-5 h-40 flex flex-col justify-center">
                                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold mb-2">
                                    Available
                                </span>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {doctor.doctor.name}
                                </h3>
                                <p className="text-gray-600">
                                    {doctor.specialisation}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* More Button */}
            <div className="flex justify-center mt-10">
                <Link to={"/alldoctors/All"} className="px-8 py-4 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
                    More
                </Link>
            </div>

            <div>
                <div className="flex mt-8 flex-col-reverse overflow-hidden rounded-lg bg-[#20B2AA] md:flex-row">
                    <div className="flex w-full flex-col justify-center p-8 text-center md:w-1/2 md:p-12 md:text-left">
                        <h1 className="text-2xl font-bold text-white sm:text-2xl space-y-6 lg:text-3xl">
                            Book Appointment <br /> <span className=' mt-6'>With 100+ Trusted Doctors</span>
                        </h1>
                        {
                            data.success ? (
                                <Link to={"/alldoctors/All"} className="mt-6 self-center rounded-full bg-white px-6 py-2 text-black transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#20B2AA] md:self-start">
                                    Book Appointment
                                </Link>
                            ) : (
                                <Link to={"/register"} className="mt-6 self-center rounded-full bg-white px-6 py-2 text-black transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#20B2AA] md:self-start">
                                    Create Account
                                </Link>
                            )
                        }
                    </div>

                    <div className="w-full md:h-auto md:w-1/2">
                        <img
                            className="h-72 w-full object-contain object-bottom"
                            src="https://thumbs.wbm.im/pw/medium/8aeabf339054d9ea57b17f9ca0a9e5d6.png"
                            alt="Doctor Profile"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorsList;