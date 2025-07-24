import React, { useEffect, useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { getAllDoctors } from '../../utils/usersystem';
import { useMutation } from '@tanstack/react-query';

const DoctorCard = ({ doctor }) => (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg group">
        <div className="absolute top-3 left-3 z-10">
            <button className="p-2 bg-white/70 backdrop-blur-sm rounded-full text-red-600 hover:bg-red-100 transition-colors">
                <FiTrash2 size={18} />
            </button>
        </div>
        <div className="absolute top-3 right-3 z-10">
            <button className="p-2 bg-white/70 backdrop-blur-sm rounded-full text-blue-600 hover:bg-blue-100 transition-colors">
                <FiEdit size={18} />
            </button>
        </div>

        <div className="h-48 sm:h-60 overflow-hidden">
            <img
                className="w-full h-full object-cover"
                src={doctor.doctor.avatar}
                alt={`${doctor.doctor.name}, ${doctor.specialisation}`}
                loading="lazy"
            />
        </div>
        <div className="p-4 sm:p-5">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                {doctor.doctor.name}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
                {doctor.specialisation}
            </p>
        </div>
    </div>
);

const AllListedDoctors = () => {
    const [doctorsData, setDoctors] = useState([]);

    const mutation = useMutation({
        mutationFn: getAllDoctors,
        onSuccess: (data) => {
            setDoctors(data?.data || []);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    useEffect(() => {
        mutation.mutate();
    }, []);

    return (
        <section className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Manage Doctors</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {doctorsData.map((doctor) => (
                    <DoctorCard key={doctor._id} doctor={doctor} />
                ))}
            </div>
        </section>
    );
};

export default AllListedDoctors;