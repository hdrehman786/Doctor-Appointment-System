import { useMutation } from '@tanstack/react-query';
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { bookAppointment, getAllDoctors, getDoctorProfileById, useUser } from '../utils/usersystem';
import { toast } from 'react-toastify';

// A simple, attractive loader component
const SimpleLoader = ({ text }) => (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-teal-500"></div>
        <p className="mt-4 text-lg text-gray-600">{text}</p>
    </div>
);

const DoctorDetails = () => {
    const params = useParams();
    const [doctorData, setDoctorData] = useState(null);
    const [doctorsData, setDoctorsData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('08:00 AM');
    const navigate = useNavigate();

    const { data, isLoading, isError } = useUser();

    const isComplete = (user) => {
        if (!user) return false;
        const requiredFields = ["name", "email", "phonenumber", "address", "age", "gender", "avatar", "role"];
        return requiredFields.every(
            field => user[field] && user[field].toString().trim() !== ''
        );
    };

    useEffect(() => {
        if (!isLoading && data?.data) {
            const complete = isComplete(data.data);
            if (!complete) {
                toast.error("Please complete your profile before booking an appointment.");
                navigate("/my-profile");
            }
        }
    }, [data, isLoading]);





    const upcomingDates = useMemo(() => {
        return Array.from({ length: 3 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            return {
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                dateNum: date.getDate(),
                fullDate: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
            };
        });
    }, []);

    useEffect(() => {
        if (upcomingDates.length > 0) {
            setSelectedDate(upcomingDates[0].fullDate);
        }
    }, [upcomingDates]);

    const { mutate: fetchDoctorProfile, isPending: isProfileLoading } = useMutation({
        mutationFn: getDoctorProfileById,
        onSuccess: (data) => {
            setDoctorData(data.data);
        },
        onError: (error) => {
            console.error("Error fetching doctor details:", error);
        }
    });

    const { mutate: fetchRelatedDoctors, isPending: isRelatedLoading } = useMutation({
        mutationFn: getAllDoctors,
        onSuccess: (data) => {
            const filteredDoctors = data.data.filter(doc => doc._id !== params.id).slice(0, 4);
            setDoctorsData(filteredDoctors);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    useEffect(() => {
        if (params.id) {
            setDoctorData(null);
            fetchDoctorProfile(params.id);
            fetchRelatedDoctors();
        }
    }, [params.id, fetchDoctorProfile, fetchRelatedDoctors]);

    const timeSlots = ['08:00 AM', '09:30 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:30 PM'];

    const mutation = useMutation({
        mutationFn: bookAppointment,
        onSuccess: (data) => {
            toast.success(data.message);
            navigate("/myappointments");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Error booking appointment");
        }
    })

    const handleBookAppointment = () => {
        if (!selectedDate || !selectedTime || !params.id) {
            alert('Please select a valid date and time.');
            return;
        }
        const appointmentData = {
            doctor: params.id,
            date: selectedDate,
            time: selectedTime,
            fees: doctorData.fees,
        };


        mutation.mutate(appointmentData);
    };

    if (isProfileLoading) {
        return <SimpleLoader text="Loading Doctor's Profile..." />;
    }

    if (!doctorData) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl text-gray-700">Could not find doctor information.</h1>
            </div>
        );
    }

    return (
        <section className="bg-gray-50 font-sans mt-6 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-start gap-6 lg:gap-8">
                    {/* Left Column: Image and NEW Contact Box */}
                    <div className="w-full md:w-[30%] lg:w-[25%] flex-shrink-0">
                        <div className="rounded-xl shadow-lg flex items-end justify-center h-80 overflow-hidden">
                            <img className="h-full w-full max-w-none object-cover" src={doctorData.doctor.avatar} alt={doctorData.doctor.name} />
                        </div>
                        {/* Requirement 1: Contact Box */}
                        <div className="bg-white border rounded-xl shadow-sm p-4 mt-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                                <span className="text-gray-700 text-sm">{doctorData.doctor.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                                <span className="text-gray-700 text-sm">{doctorData.doctor.phonenumber || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                <span className="text-gray-700 text-sm">{doctorData.doctor.address || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details and Booking */}
                    <div className="w-full md:w-[70%] lg:w-[75%]">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-80 flex flex-col">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{doctorData.doctor.name}</h1>
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                                <p className="text-md text-gray-600">{doctorData.specialisation}</p>
                                <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-3 py-1 rounded-full">{doctorData.experience}</span>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mt-6">About</h4>
                            <p className="text-gray-600 mt-2 leading-relaxed text-sm sm:text-base flex-grow overflow-y-auto pr-2">
                                {doctorData.summary || "No summary available."}
                            </p>
                            <div className="mt-auto pt-2">
                                <span className="text-gray-700 font-medium">Appointment Fee: </span>
                                <span className="text-teal-600 font-bold text-lg">${doctorData.fees}</span>
                            </div>
                        </div>

                        <div className="mt-6 bg-white border rounded-xl shadow-sm p-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-4">Booking Slots</h1>
                            {/* Requirement 2: Real Dates */}
                            <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1">
                                {upcomingDates.map((item) => (
                                    <button key={item.fullDate} onClick={() => setSelectedDate(item.fullDate)} className={`flex flex-col gap-1 p-3 h-20 w-16 rounded-lg justify-center items-center transition-all duration-200 flex-shrink-0 ${selectedDate === item.fullDate ? 'bg-[#20B2AA] text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                        <p className="font-bold text-xl">{item.dateNum}</p>
                                        <p className="text-xs uppercase font-semibold">{item.day}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="my-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                {timeSlots.map((time) => (
                                    <button key={time} onClick={() => setSelectedTime(time)} className={`px-2 py-2 rounded-lg border text-sm font-medium transition-colors duration-200 ${selectedTime === time ? 'bg-[#20B2AA] text-white border-[#20B2AA]' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
                                        {time}
                                    </button>
                                ))}
                            </div>
                            {/* Requirement 3: Collect Data on Click */}
                            <button onClick={handleBookAppointment} className="w-full sm:w-auto mt-2 py-3 px-8 bg-[#20B2AA] text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                Book an Appointment
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Doctors Section */}
                <div className="mt-16 sm:mt-24 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Related Doctors</h1>
                    <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">Simply browse through our extensive list of trusted doctors.</p>
                    <div className="max-w-7xl mx-auto mt-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {isRelatedLoading ? (
                                <p className="col-span-full text-gray-500">Loading related doctors...</p>
                            ) : doctorsData.length === 0 ? (
                                <p className="col-span-full text-gray-500">No related doctors found.</p>
                            ) : (
                                doctorsData.map((doctor) => (
                                    <Link to={`/doctordetails/${doctor._id}`} key={doctor._id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg flex flex-col text-left">
                                        <div className="h-60 overflow-hidden">
                                            <img className="w-full h-full object-cover" src={doctor.doctor.avatar} alt={`${doctor.doctor.name}, ${doctor.specialisation}`} loading="lazy" />
                                        </div>
                                        <div className="p-5 flex-grow flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.doctor.name}</h3>
                                                <p className="text-gray-600">{doctor.specialisation}</p>
                                            </div>
                                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold mt-4 self-start">Available</span>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DoctorDetails;