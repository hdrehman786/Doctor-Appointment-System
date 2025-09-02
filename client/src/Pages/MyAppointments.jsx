import React, { useEffect, useState } from 'react';
import doctorImage from "../assets/doctors.jpg";
import { useMutation } from '@tanstack/react-query';
import { cancelAppointment, getAppointment } from '../utils/usersystem';
import { toast } from 'react-toastify';
import { FaSpinner } from "react-icons/fa"; // loader icon

const MyAppointments = () => {
    const [appointments, setappointments] = useState([]);
    const [loading, setLoading] = useState(true); // track loading state

    const mutaion = useMutation({
        mutationFn: getAppointment,
        onSuccess: (data) => {
            setappointments(data.data);
            setLoading(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Error fetching appointments");
            setLoading(false);
        }
    })

    useEffect(() => {
        mutaion.mutate();
    }, []);

    const cancelappointment = useMutation({
        mutationFn: cancelAppointment,
        onSuccess: (data) => {
            toast.success(data.message);
            mutaion.mutate();
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.response?.data?.message || "Error cancelling appointment");
        }
    })

    function formatAppointmentDate(dateString) {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Show loader while fetching
    if (loading) {
        return (
            <section className='p-6 flex flex-col items-center justify-center h-[60vh]'>
                <FaSpinner className="animate-spin text-5xl text-[#20B2AA]" />
                <p className='mt-4 text-gray-600 font-medium'>Loading your appointments...</p>
            </section>
        )
    }

    // No appointments
    if (!appointments || appointments.length === 0) {
        return (
            <section className='p-4 md:p-6'>
                <h1 className='text-2xl font-semibold font-sans mb-4'>My Appointments</h1>
                <div className='flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-10 bg-gray-50/50'>
                    <h2 className='text-xl font-medium text-gray-700'>
                        There are no appointments
                    </h2>
                    <p className='text-gray-500 mt-2 mb-6'>
                        Schedule a new appointment to see it here.
                    </p>
                    <button className='bg-[#20B2AA] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#1a8e88] transition-colors'>
                        Book an Appointment
                    </button>
                </div>
            </section>
        );
    }

    // Appointments UI
    return (
        <section className='p-4 md:p-6'>
            <h1 className='text-2xl font-semibold font-sans mb-4'>My Appointments</h1>
            <div className='border-y border-gray-200 divide-y divide-gray-200'>
                {appointments?.map((appointment) => (
                    <div key={appointment._id} className='flex flex-col md:flex-row items-start md:items-center justify-between py-4 gap-4'>
                        <div className='flex gap-4 w-full'>
                            <div>
                                <img className='h-36 w-28 md:h-40 md:w-32 object-cover rounded-md' src={appointment.doctor.doctor.avatar} alt={appointment.doctor.name} />
                            </div>
                            <div className='flex flex-col'>
                                <h1 className='text-lg font-semibold font-sans'>{appointment.doctor.doctor.name}</h1>
                                <p className='text-gray-600'>{appointment.doctor.specialisation}</p>
                                <h3 className='text-gray-600 mt-3 text-sm'>
                                    Address: <br />
                                    <span className='font-medium text-gray-800'>{appointment.doctor.doctor.address}</span>
                                </h3>
                                <p className='mt-2 text-sm font-medium text-gray-500'>{formatAppointmentDate(appointment.date)} {appointment.time}</p>
                            </div>
                        </div>

                        <div className='flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0'>
                            <p className={`flex-1 md:flex-none text-center justify-center rounded-md text-white font-semibold py-1 px-3 ${appointment.status === 'pending' ? 'bg-yellow-500' :
                                appointment.status === 'approved' ? 'bg-green-600' :
                                    appointment.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-400'
                                }`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </p>

                            {
                                appointment.status !== "cancelled" && (
                                    <button
                                        onClick={() => cancelappointment.mutate(appointment._id)}
                                        className='flex-1 md:flex-none border cursor-pointer py-2 px-6 rounded-md'>
                                        Cancel appointment
                                    </button>
                                )
                            }
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MyAppointments;
