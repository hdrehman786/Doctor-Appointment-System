import { useMutation } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { editDoctorProfile } from '../../utils/usersystem';
import { toast } from 'react-toastify';

const EditDoctor = ({ doctor, onClose, fetchDoctors }) => {
    const [formData, setFormData] = useState({
        email: '',
        specialisation: '',
        experience: '',
        fees: '',
        education: '',
        summary: '',
    });

    useEffect(() => {
        if (doctor) {
            setFormData({
                email: doctor.doctor.email || '',
                specialisation: doctor.specialisation || '',
                experience: doctor.experience || '',
                fees: doctor.fees || '',
                education: doctor.education || '',
                summary: doctor.summary || '',
            });
        }
    }, [doctor]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const mutation = useMutation({
        mutationFn : editDoctorProfile,
        onSuccess: (data) => {
            console.log(data);
            toast.success(data.message);
            onClose();
        },
        onError: (error) => {
            console.log(error);
        },
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({doctorId:doctor._id, doctorData:formData});
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 sm:p-8 relative">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Edit Doctor Details
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="sm:col-span-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Specialisation */}
                    <div>
                        <label htmlFor="specialisation" className="block text-sm font-medium text-gray-700 mb-1">Specialisation</label>
                        <input
                            type="text"
                            name="specialisation"
                            id="specialisation"
                            value={formData.specialisation}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Experience */}
                    <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                        <input
                            type="text"
                            name="experience"
                            id="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Fees */}
                    <div>
                        <label htmlFor="fees" className="block text-sm font-medium text-gray-700 mb-1">Consultation Fees</label>
                        <input
                            type="number"
                            name="fees"
                            id="fees"
                            value={formData.fees}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Education */}
                    <div>
                        <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                        <input
                            type="text"
                            name="education"
                            id="education"
                            value={formData.education}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Summary */}
                    <div className="sm:col-span-2">
                        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                        <textarea
                            id="summary"
                            name="summary"
                            rows="4"
                            value={formData.summary}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="sm:col-span-2 flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDoctor;
