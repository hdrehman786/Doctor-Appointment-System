"use client"

import { useEffect, useState } from "react"
import { FiPlus, FiEdit2, FiTrash2, FiClock, FiCalendar, FiSave } from "react-icons/fi"
import { Button } from "../components/ui/Button"
import { addTimeSlots, getTimeSlots, useUser } from "../utils/usersystem"
import { useMutation } from "@tanstack/react-query"

export default function DoctorTimeSlotManager() {
  const [appointments, setAppointments] = useState([])
  const [showAddDay, setShowAddDay] = useState(false)
  const [editingSlot, setEditingSlot] = useState(null)
  const [newDay, setNewDay] = useState({ day: "", date: "" })
  const [newSlot, setNewSlot] = useState({ startTime: "", endTime: "" })

      const { data, isLoading, isError } = useUser();
      const mutation = useMutation({
        mutationFn : addTimeSlots,
        onSuccess : (data)=>{
          console.log("data from mine",data);
        },
        onError : (err)=>{
          console.log("error from mine",err);
        }
      });

      console.log(appointments);

      const mutationTimeSlots = useMutation({
        mutationFn : getTimeSlots,
        onSuccess : (data)=>{
          setAppointments(data.data.appointment_date)
        },
        onError : (err)=>{
          console.log("The error",err)
        }
      })

      const getTimeslts = ()=>{
        mutationTimeSlots.mutate();
      }


  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const addNewDay = () => {
    if (newDay.day && newDay.date) {
      setAppointments([...appointments, { ...newDay, slots: [] }])
      setNewDay({ day: "", date: "" })
      setShowAddDay(false)
    }
  }


  const addSlot = (dayIndex) => {
    if (newSlot.startTime && newSlot.endTime) {
      const updatedAppointments = [...appointments]
      updatedAppointments[dayIndex].slots.push({
        ...newSlot,
        isBooked: false,
      })
      setAppointments(updatedAppointments)
      setNewSlot({ startTime: "", endTime: "" })
    }
  }

  const editSlot = (dayIndex, slotIndex, updatedSlot) => {
    const updatedAppointments = [...appointments]
    updatedAppointments[dayIndex].slots[slotIndex] = { ...updatedSlot, isBooked: false }
    setAppointments(updatedAppointments)
    setEditingSlot(null)
  }

  const deleteSlot = (dayIndex, slotIndex) => {
    const updatedAppointments = [...appointments]
    updatedAppointments[dayIndex].slots.splice(slotIndex, 1)
    setAppointments(updatedAppointments)
  }

  const deleteDay = (dayIndex) => {
    const updatedAppointments = appointments.filter((_, index) => index !== dayIndex)
    setAppointments(updatedAppointments)
  }

  const handleSave = () => {
    mutation.mutate({
      id : data.data._id,
      doctorData: appointments
    })
  }

  useEffect(()=>{
    getTimeslts();
  },[])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Time Slot Manager</h1>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <FiSave className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      {/* Add New Day Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowAddDay(true)} variant="outline" className="flex items-center gap-2">
          <FiPlus className="w-4 h-4" />
          Add New Day
        </Button>
      </div>

      {/* Add New Day Form */}
      {showAddDay && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Add New Day</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Day</label>
                <select
                  value={newDay.day}
                  onChange={(e) => setNewDay({ ...newDay, day: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Day</option>
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={newDay.date}
                  onChange={(e) => setNewDay({ ...newDay, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={addNewDay}>Add Day</Button>
                <Button variant="outline" onClick={() => setShowAddDay(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Days */}
      {appointments.map((appointment, dayIndex) => (
        <div key={dayIndex} className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiCalendar className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{appointment.day}</h3>
                  <p className="text-gray-600">{appointment.date}</p>
                </div>
              </div>
              <Button variant="destructive" size="sm" onClick={() => deleteDay(dayIndex)}>
                <FiTrash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="p-6">
            {/* Add New Slot Form */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Add New Time Slot</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={() => addSlot(dayIndex)} className="w-full">
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Slot
                  </Button>
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              {appointment.slots.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No time slots added yet</p>
              ) : (
                appointment.slots.map((slot, slotIndex) => (
                  <div key={slotIndex} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                    {editingSlot?.dayIndex === dayIndex && editingSlot?.slotIndex === slotIndex ? (
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="time"
                          defaultValue={slot.startTime}
                          onChange={(e) => setEditingSlot({ ...editingSlot, startTime: e.target.value })}
                          className="p-1 border border-gray-300 rounded"
                        />
                        <span>to</span>
                        <input
                          type="time"
                          defaultValue={slot.endTime}
                          onChange={(e) => setEditingSlot({ ...editingSlot, endTime: e.target.value })}
                          className="p-1 border border-gray-300 rounded"
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            editSlot(dayIndex, slotIndex, {
                              startTime: editingSlot.startTime || slot.startTime,
                              endTime: editingSlot.endTime || slot.endTime,
                            })
                          }
                        >
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingSlot(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <FiClock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">
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
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingSlot({ dayIndex, slotIndex })}>
                            <FiEdit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deleteSlot(dayIndex, slotIndex)}>
                            <FiTrash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ))}

      {appointments.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-12 text-center">
            <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointment days added</h3>
            <p className="text-gray-600 mb-4">Start by adding your first available day</p>
            <Button onClick={() => setShowAddDay(true)}>
              <FiPlus className="w-4 h-4 mr-2" />
              Add Your First Day
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
