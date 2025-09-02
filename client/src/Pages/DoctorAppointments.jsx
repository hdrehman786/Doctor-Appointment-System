import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getAppointmentsodoctor, cancelAppointment, approveAppointment, completeAppointment } from '../utils/usersystem';
import { toast } from 'react-toastify';
import { FaSpinner } from "react-icons/fa"; // Loader icon

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4 transform transition-all">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <p className="mt-2 text-gray-600">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium">
                        Go Back
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    const { mutate: fetchAppointments, isLoading } = useMutation({
        mutationFn: getAppointmentsodoctor,
        onSuccess: (data) => setAppointments(data.data),
        onError: (error) => toast.error(error.response?.data?.message || "Error fetching appointments"),
    });

    const { mutate: approveAppointmentMutation } = useMutation({
        mutationFn: approveAppointment,
        onSuccess: (data) => {
            toast.success(data.message || "Appointment approved!");
            fetchAppointments();
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to approve"),
    });

    const { mutate: cancelAppointmentMutation } = useMutation({
        mutationFn: cancelAppointment,
        onSuccess: (data) => {
            toast.success(data.message || "Appointment cancelled");
            fetchAppointments();
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to cancel"),
    });

    const { mutate: completeAppointmentMutation } = useMutation({
        mutationFn: completeAppointment,
        onSuccess: (data) => {
            toast.success(data.message || "Appointment marked as completed");
            fetchAppointments();
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to complete"),
    });

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleOpenCancelModal = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAppointmentId(null);
    };

    const handleConfirmCancel = () => {
        if (selectedAppointmentId) {
            cancelAppointmentMutation(selectedAppointmentId);
        }
        handleCloseModal();
    };

    const formatAppointmentDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // 🔹 Loader screen
    if (isLoading) {
        return (
            <section className='p-6 flex flex-col items-center justify-center h-[60vh]'>
                <FaSpinner className="animate-spin text-5xl text-[#20B2AA]" />
                <p className='mt-4 text-gray-600 font-medium'>Loading patient appointments...</p>
            </section>
        );
    }

    if (appointments.length === 0) {
        return (
            <section className='p-4 md:p-6'>
                <h1 className='text-2xl font-semibold font-sans mb-4'>Patient Appointments</h1>
                <div className='flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-10 bg-gray-50/50'>
                    <h2 className='text-xl font-medium text-gray-700'>No Appointments Found</h2>
                    <p className='text-gray-500 mt-2'>New appointments scheduled by patients will appear here.</p>
                </div>
            </section>
        );
    }

    return (
        <section className='p-4 md:p-6'>
            <h1 className='text-2xl font-semibold font-sans mb-4'>Patient Appointments</h1>
            <div className='border-y border-gray-200 divide-y divide-gray-200'>
                {appointments.map((appointment) => (
                    <div key={appointment._id} className='flex flex-col md:flex-row items-start md:items-center justify-between py-4 gap-4'>
                        <div className='flex gap-4 w-full'>
                            <img className='h-36 w-28 md:h-40 md:w-32 object-cover rounded-md shrink-0' src={appointment.patient.avatar} alt={appointment.patient.name} />
                            <div className='flex flex-col'>
                                <h1 className='text-lg font-semibold font-sans'>{appointment.patient.name}</h1>
                                <p className='text-gray-600'>{appointment.patient.gender}, Age: {appointment.patient.age}</p>
                                <p className='text-gray-600'>{appointment.patient.phonenumber}</p>
                                <h3 className='text-gray-600 mt-3 text-sm'>
                                    Patient Address: <br />
                                    <span className='font-medium text-gray-800'>{appointment.patient.address}</span>
                                </h3>
                                <p className='mt-2 text-sm font-medium text-gray-500'>{formatAppointmentDate(appointment.date)} at {appointment.time}</p>
                            </div>
                        </div>

                        <div className='flex flex-col gap-3 w-full md:w-auto shrink-0'>
                            {appointment.status === 'pending' ? (
                                <button
                                    onClick={() => approveAppointmentMutation(appointment._id)}
                                    className='w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition-colors md:py-2.5 md:px-8 md:text-base'>
                                    Approve
                                </button>
                            ) : (
                                <p className={`text-center rounded-md text-white font-semibold py-2 px-3 capitalize ${
                                    appointment.status === 'confirmed' ? 'bg-green-600' :
                                    appointment.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-400'
                                }`}>
                                    {appointment.status}
                                </p>
                            )}

                            {appointment.status !== 'cancelled'  && appointment.status !== "completed" && (
                                <button
                                    onClick={() => handleOpenCancelModal(appointment._id)}
                                    className='w-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer py-2 px-4 rounded-md font-medium md:py-2.5 md:px-8 md:text-base'>
                                    Cancel
                                </button>
                            )}
                            {
                                appointment.status === 'approved' && (
                                    <button
                                        onClick={() => completeAppointmentMutation(appointment._id)}
                                        className='w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors md:py-2.5 md:px-8 md:text-base'>
                                        Mark as Completed
                                    </button>
                                )
                            }
                        </div>
                    </div>
                ))}
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmCancel}
                title="Confirm Cancellation"
                message="Are you sure you want to cancel this appointment? This action cannot be undone."
            />
        </section>
    );
};

export default DoctorAppointments;
