"use client"

import { useEffect, useState } from "react"
import { FiPlus, FiTrash2, FiClock, FiCalendar, FiX } from "react-icons/fi"

import { addTimeSlots, deleteTimeSlot, getTimeSlots, useUser } from "../utils/usersystem"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import UpdateDayComponent from "../components/UpdateDayComponent"
import { Button } from "../components/ui/Button"


export default function DoctorTimeSlotManager() {
  const [appointments, setAppointments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [newDay, setNewDay] = useState({ day: "", date: "", slots: [] })
  const [newSlot, setNewSlot] = useState({ startTime: "", endTime: "" })

  const { data, isLoading, isError } = useUser()

  const mutation = useMutation({
    mutationFn: addTimeSlots,
    onSuccess: (data) => {
      toast.success(data.message)
      getTimeslts()
    },
    onError: (err) => {
      console.log("error from mine", err)
    },
  })

  const mutationTimeSlots = useMutation({
    mutationFn: getTimeSlots,
    onSuccess: (data) => {
      setAppointments(data.data.appointment_date)
    },
    onError: (err) => {
      console.log("The error", err)
    },
  })

  const delMutaion = useMutation({
    mutationFn : deleteTimeSlot,
    onSuccess : (data)=>{
      console.log(data);
      toast.success(data.data.message);
      getTimeslts();
    },
    onError : (error)=>{
      console.log(error);
    }
  })

  const getTimeslts = () => {
    mutationTimeSlots.mutate()
  }

  const openAddDayModal = () => {
    setShowModal(true)
  }

  const openUpdateModal = (appointment) => {
    setSelectedAppointment(appointment)
    setShowUpdateModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setNewDay({ day: "", date: "", slots: [] })
    setNewSlot({ startTime: "", endTime: "" })
  }

  const closeUpdateModal = () => {
    setShowUpdateModal(false)
    setSelectedAppointment(null)
  }

  const addSlotToNewDay = () => {
    if (newSlot.startTime && newSlot.endTime) {
      setNewDay({
        ...newDay,
        slots: [...newDay.slots, { ...newSlot, isBooked: false }],
      })
      setNewSlot({ startTime: "", endTime: "" })
    }
  }

  const removeSlotFromNewDay = (index) => {
    const updatedSlots = newDay.slots.filter((_, i) => i !== index)
    setNewDay({ ...newDay, slots: updatedSlots })
  }

  const addNewDay = () => {
    if (newDay.date && newDay.slots.length > 0 && !isDateAlreadySelected(newDay.date)) {
      const dayName = getDayNameFromDate(newDay.date)
      const updatedAppointments = [...appointments, { day: dayName, date: newDay.date, slots: newDay.slots }]
      setAppointments(updatedAppointments)

      mutation.mutate({
        id: data.data._id,
        doctorData: updatedAppointments,
      })

      closeModal()
    }
  }

  const deleteDay = (dayIndex) => {
    delMutaion.mutate({
      id : data.data._id,
      appointmentId : dayIndex
    });
    // const updatedAppointments = appointments.filter((_, index) => index !== dayIndex)
    // setAppointments(updatedAppointments)
  }

  const handleUpdateSuccess = () => {
    getTimeslts()
    closeUpdateModal()
  }

  useEffect(() => {
    getTimeslts()
  }, [])

  const getDayNameFromDate = (dateString) => {
    const date = new Date(dateString)
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[date.getDay()]
  }

  const getMaxDate = () => {
    const today = new Date()
    const maxDate = new Date(today)
    maxDate.setDate(today.getDate() + 3)
    return maxDate.toISOString().split("T")[0]
  }

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0]
  }

  const isDateAlreadySelected = (dateString) => {
    return appointments.some((appointment) => appointment.date === dateString)
  }

  const simplifyDate = (appointmentdate) => {
    const date = new Date(appointmentdate)
    return date.toISOString().split("T")[0]
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Time Slot Manager</h1>
        <Button onClick={openAddDayModal} variant="outline" className="flex items-center gap-2 bg-transparent">
          <FiPlus className="w-4 h-4" />
          Add New Day
        </Button>
      </div>

      {appointments.map((appointment, dayIndex) => (
        <div key={dayIndex} className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiCalendar className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{appointment.day}</h3>
                  <p className="text-gray-600">{simplifyDate(appointment.date)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => openUpdateModal(appointment)} variant="outline" size="sm">
                  Edit Day
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteDay(appointment._id)}>
                  <FiTrash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {appointment.slots.length === 0 ? (
              <div className="text-center py-8">
                <FiClock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No time slots added yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {appointment.slots.map((slot, slotIndex) => (
                  <div
                    key={slotIndex}
                    className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-sm">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          slot.isBooked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {slot.isBooked ? "Booked" : "Available"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {appointments.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-12 text-center">
            <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointment days added</h3>
            <p className="text-gray-600 mb-4">Start by adding your first available day</p>
            <Button onClick={openAddDayModal}>
              <FiPlus className="w-4 h-4 mr-2" />
              Add Your First Day
            </Button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Add New Day with Slots</h3>
              <Button variant="outline" size="sm" onClick={closeModal} className="p-1 bg-transparent">
                <FiX className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={newDay.date}
                  min={getTodayDate()}
                  max={getMaxDate()}
                  onChange={(e) => {
                    const selectedDate = e.target.value
                    const dayName = getDayNameFromDate(selectedDate)
                    setNewDay({ ...newDay, day: dayName, date: selectedDate })
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can only select dates for the next 4 days (including today)
                </p>
                {newDay.date && isDateAlreadySelected(newDay.date) && (
                  <p className="text-xs text-red-500 mt-1">
                    This date is already selected. Please choose a different date.
                  </p>
                )}
              </div>

              {newDay.date && (
                <div>
                  <label className="block text-sm font-medium mb-2">Selected Day</label>
                  <div className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                    {getDayNameFromDate(newDay.date)}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Add Time Slots</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Start Time</label>
                      <input
                        type="time"
                        value={newSlot.startTime}
                        onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">End Time</label>
                      <input
                        type="time"
                        value={newSlot.endTime}
                        onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={addSlotToNewDay}
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    disabled={!newSlot.startTime || !newSlot.endTime}
                  >
                    <FiPlus className="w-3 h-3 mr-1" />
                    Add Slot
                  </Button>
                </div>
              </div>

              {newDay.slots.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Added Slots ({newDay.slots.length})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {newDay.slots.map((slot, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <span className="text-sm">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeSlotFromNewDay(index)}
                          className="p-1 h-6 w-6"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={addNewDay}
                  className="flex-1"
                  disabled={!newDay.date || newDay.slots.length === 0 || isDateAlreadySelected(newDay.date)}
                >
                  Add Day with Slots
                </Button>
                <Button variant="outline" onClick={closeModal} className="flex-1 bg-transparent">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && selectedAppointment && (
        <UpdateDayComponent
          appointment={selectedAppointment}
          onClose={closeUpdateModal}
          onSuccess={handleUpdateSuccess}
          userId={data?.data?._id}
          appointments={appointments}
        />
      )}
    </div>
  )
}
