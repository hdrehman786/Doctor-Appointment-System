import { FaRegCalendarCheck, FaRegUser } from "react-icons/fa";
import { LiaUserMdSolid } from "react-icons/lia";
import { FiXCircle } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import { cancelAppointment, getAllData } from "../../utils/usersystem";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MainDashboard = () => {
  const [statsData, setStatsData] = useState([]);
  const [latestAppointments, setLatestAppointments] = useState([]);

  // 🟢 First mutation for fetching dashboard data
  const fetchMutation = useMutation({
    mutationFn: getAllData,
    onSuccess: (res) => {
      const { appointments_count, doctors, patients, appointments } = res.data;

      // Stats section
      setStatsData([
        {
          id: 1,
          title: "All Appointments",
          value: appointments_count,
          icon: <FaRegCalendarCheck size={22} />,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          id: 2,
          title: "Doctors",
          value: doctors,
          icon: <LiaUserMdSolid size={24} />,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          id: 3,
          title: "Patients",
          value: patients,
          icon: <FaRegUser size={20} />,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
      ]);

      // Latest appointments (limit 3)
      const latest = appointments.slice(0, 3).map((apt) => ({
        id: apt._id,
        patientName: apt.patient.name,
        doctorName: apt.doctor, // Replace with doctor name if populated
        date: new Date(apt.date).toLocaleDateString() + " at " + apt.time,
        avatar: apt.patient.avatar,
      }));

      setLatestAppointments(latest);
    },
    onError: (error) => {
      console.log("Error fetching data:", error);
    },
  });

  // 🟢 Second mutation for cancelling appointment
  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      toast.success("Appointment cancelled");
      fetchMutation.mutate(); // refetch dashboard data after cancellation
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to cancel"),
  });

  // Cancel handler
  const onCancel = (id) => {
    cancelMutation.mutate(id);
  };

  // Fetch data on mount
  useEffect(() => {
    fetchMutation.mutate();
  }, []);

  return (
    <section>
      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statsData.map((stat) => (
          <div
            key={stat.id}
            className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bgColor} ${stat.color}`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Appointments List */}
      <div className="mt-8 rounded-lg bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Latest Appointments
        </h2>
        <div className="space-y-3">
          {latestAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex flex-col items-start justify-between gap-3 rounded-md p-3 hover:bg-gray-50 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4">
                <img
                  src={appointment.avatar}
                  alt={appointment.patientName}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {appointment.patientName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Booking on {appointment.date}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onCancel(appointment.id)}
                className="flex items-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <FiXCircle />
                <span>Cancel</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MainDashboard;
