"use client"

import { useState } from "react"
import { FiPlus, FiTrash2, FiX, FiSave } from "react-icons/fi"
import { Button } from "./ui/Button"
import { editTimeSlot } from "../utils/usersystem"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"

export default function UpdateDayComponent({ appointment, onClose, onSuccess, userId, appointments }) {
  const [updatedDay, setUpdatedDay] = useState({
    day: appointment.day,
    date: appointment.date,
    slots: [...appointment.slots],
  });

  console.log(
    appointment,userId,appointments
  )
  const [newSlot, setNewSlot] = useState({ startTime: "", endTime: "" })

  const editDaySlots = useMutation({
    mutationFn: editTimeSlot,
    onSuccess: (data) => {
        console.log(data);
      toast.success(data.data.message)
      onSuccess()
    },
    onError: (err) => {
      console.log("error from editTimeSlot", err)
      toast.error(err.message || "Internal server error please try again later")
    },
  })

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
    return appointments.some((apt) => apt.date === dateString && apt._id !== appointment._id)
  }

  const addSlotToDay = () => {
    if (newSlot.startTime && newSlot.endTime) {
      setUpdatedDay({
        ...updatedDay,
        slots: [...updatedDay.slots, { ...newSlot, isBooked: false }],
      })
      setNewSlot({ startTime: "", endTime: "" })
    }
  }

  const removeSlotFromDay = (index) => {
    const updatedSlots = updatedDay.slots.filter((_, i) => i !== index)
    setUpdatedDay({ ...updatedDay, slots: updatedSlots })
  }

  const handleDateChange = (selectedDate) => {
    const dayName = getDayNameFromDate(selectedDate)
    setUpdatedDay({ ...updatedDay, day: dayName, date: selectedDate })
  }

  const handleUpdate = () => {
    if (updatedDay.date && updatedDay.slots.length > 0) {
      const slotData = {
        appointmentId: appointment._id,
        date: updatedDay.date,
        day: updatedDay.day,
        slots: updatedDay.slots,
      }
      editDaySlots.mutate({ slotData, id: userId })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Update Day and Slots</h3>
          <Button variant="outline" size="sm" onClick={onClose} className="p-1 bg-transparent">
            <FiX className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={updatedDay.date}
              min={getTodayDate()}
              max={getMaxDate()}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can only select dates for the next 4 days (including today)
            </p>
            {updatedDay.date && isDateAlreadySelected(updatedDay.date) && (
              <p className="text-xs text-red-500 mt-1">
                This date is already selected. Please choose a different date.
              </p>
            )}
          </div>

          {updatedDay.date && (
            <div>
              <label className="block text-sm font-medium mb-2">Selected Day</label>
              <div className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                {getDayNameFromDate(updatedDay.date)}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Add New Time Slot</h4>
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
                onClick={addSlotToDay}
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

          {updatedDay.slots.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3">Current Slots ({updatedDay.slots.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {updatedDay.slots.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSlotFromDay(index)}
                      className="p-1 h-6 w-6"
                      disabled={slot.isBooked}
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
              onClick={handleUpdate}
              className="flex-1"
              disabled={
                !updatedDay.date ||
                updatedDay.slots.length === 0 ||
                isDateAlreadySelected(updatedDay.date) ||
                editDaySlots.isLoading
              }
            >
              <FiSave className="w-4 h-4 mr-1" />
              {editDaySlots.isLoading ? "Updating..." : "Update Day"}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
