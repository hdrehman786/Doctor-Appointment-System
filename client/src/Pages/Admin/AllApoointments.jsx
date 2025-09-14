import React, { useState } from 'react';
import { FiTrash2, FiXCircle } from "react-icons/fi";
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAllAppointments, cancelAppointment, deleteAppointment } from '../../utils/usersystem';
import { toast } from 'react-toastify';
import { FaSpinner } from "react-icons/fa"; 

// ✅ Confirmation Modal
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
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
                        Confirm Deletion
                    </button>
                </div>
            </div>
        </div>
    );
};

// ✅ Appointment Card
const AppointmentCard = ({ appointment, onCancel, onDelete }) => {
    const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });

    const getStatusClasses = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200/80">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Patient Info */}
                <div className="flex-1 p-3 border-r-0 md:border-r border-gray-200">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Patient</p>
                    <div className="flex items-center gap-3">
                        <img className="h-12 w-12 rounded-full object-cover" src={appointment.patient.avatar} alt={appointment.patient.name} />
                        <div>
                            <p className="font-semibold text-gray-900">{appointment.patient.name}</p>
                            <p className="text-sm text-gray-600">{appointment.patient.phonenumber}</p>
                        </div>
                    </div>
                </div>

                {/* Doctor Info */}
                <div className="flex-1 p-3">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Doctor</p>
                    <div className="flex items-center gap-3">
                        <img className="h-12 w-12 rounded-full object-cover" src={appointment.doctor.doctor.avatar} alt={appointment.doctor.doctor.name} />
                        <div>
                            <p className="font-semibold text-gray-900">{appointment.doctor.doctor.name}</p>
                            <p className="text-sm text-gray-600">{appointment.doctor.specialisation}</p>
                        </div>
                    </div>
                </div>
                
                {/* Actions */}
                <div className="flex md:flex-col items-center md:items-end justify-between p-3 md:border-l border-t md:border-t-0 border-gray-200 gap-3">
                    <button 
                        onClick={() => onCancel(appointment._id)} 
                        className="flex items-center gap-2 text-sm text-yellow-600 hover:text-yellow-800 font-medium">
                        <FiXCircle/> Cancel
                    </button>
                    <button 
                        onClick={() => onDelete(appointment._id)} 
                        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-medium">
                        <FiTrash2/> Delete
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                 <div className="text-sm text-gray-700">
                    <p className="font-semibold">{formattedDate} at {appointment.time}</p>
                    <p>Fees: <span className="font-bold text-gray-900">Rs. {appointment.fees}</span></p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${getStatusClasses(appointment.status)}`}>
                    {appointment.status}
                </span>
            </div>
        </div>
    );
};

// ✅ Main Component
const AllAppointments = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    // ✅ Fetch appointments with useQuery
    const { data: appointments = [], isLoading, refetch } = useQuery({
        queryKey: ['appointments'],
        queryFn: getAllAppointments
    });

    // ✅ Cancel Appointment
    const cancelMutation = useMutation({
        mutationFn: cancelAppointment,
        onSuccess: () => {
            toast.success("Appointment cancelled");
            refetch();
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to cancel")
    });

    // ✅ Delete Appointment
    const deleteMutation = useMutation({
        mutationFn: deleteAppointment,
        onSuccess: () => {
            toast.success("Appointment deleted successfully");
            refetch();
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to delete")
    });
    
    const handleOpenDeleteModal = (id) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };
    
    const handleConfirmDelete = () => {
        if (selectedId) {
            deleteMutation.mutate(selectedId);
        }
        setIsModalOpen(false);
        setSelectedId(null);
    };

    // ✅ Loader
    if (isLoading) {
        return (
            <section className='p-6 flex flex-col items-center justify-center h-[60vh]'>
                <FaSpinner className="animate-spin text-5xl text-[#20B2AA]" />
                <p className='mt-4 text-gray-600 font-medium'>Loading all appointments...</p>
            </section>
        )
    }

    return (
        <section className="p-4 md:p-6">
            <h1 className='text-2xl font-bold text-gray-800 mb-4'>All Appointments</h1>
            <div className="space-y-4">
                {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                        <AppointmentCard 
                            key={appointment._id} 
                            appointment={appointment} 
                            onCancel={(id) => cancelMutation.mutate(id)}
                            onDelete={handleOpenDeleteModal}
                        />
                    ))
                ) : (
                    <div className="text-center p-10 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No appointments found.</p>
                    </div>
                )}
            </div>
            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Appointment"
                message="Are you sure you want to permanently delete this appointment? This action cannot be undone."
            />
        </section>
    );
};

export default AllAppointments;
