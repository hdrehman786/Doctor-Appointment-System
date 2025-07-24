import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getAllDoctors } from '../utils/usersystem';
import { Link, useParams } from 'react-router-dom';

const AllDoctors = () => {
    const [selectedSpecialization, setSelectedSpecialization] = useState('All');
    const [doctors, setDoctors] = useState([]);
    const params = useParams();

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
        setSelectedSpecialization(params.id || 'All');
    }, []);

    // Extract unique specialisations
    const specializations = ['All', ...new Set(doctors.map(doc => doc.specialisation))];

    // Apply filter on frontend
    const filteredDoctors = selectedSpecialization === 'All'
        ? doctors
        : doctors.filter(doc => doc.specialisation === selectedSpecialization);

    return (
        <section className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
                Browse Doctors By Specialization
            </h1>

            <div className="flex flex-row gap-4 md:gap-8">
                <aside className="w-1/3 md:w-1/4 lg:w-1/5 flex-shrink-0">
                    <div className="space-y-2">
                        {specializations.map((spec) => (
                            <div
                                key={spec}
                                onClick={() => setSelectedSpecialization(spec)}
                                className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-colors duration-200 text-sm sm:text-base ${selectedSpecialization === spec
                                        ? 'bg-gray-200 font-semibold text-gray-800'
                                        : 'bg-white hover:bg-gray-100 text-gray-600'
                                    }`}
                            >
                                {spec}
                            </div>
                        ))}
                    </div>
                </aside>

                <main className="w-2/3 md:w-3/4 lg:w-4/5">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
                        {selectedSpecialization === 'All' ? 'All Doctors' : `${selectedSpecialization}s`}
                    </h2>

                    {filteredDoctors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredDoctors.map((doc) => (
                                <Link
                                    to={`/doctordetails/${doc._id}`}
                                    key={doc._id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    <div className="h-48 sm:h-60 overflow-hidden">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={doc.doctor.avatar}
                                            alt={`${doc.doctor.name}, ${doc.specialisation}`}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-4 sm:p-5 flex flex-col justify-center">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                                            {doc.doctor.name}
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-600">
                                            {doc.specialisation}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">
                                No doctors found for this specialization.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </section>
    );
};

export default AllDoctors;
