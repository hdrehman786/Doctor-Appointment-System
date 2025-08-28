"use client"

import { useEffect, useState } from "react"
import { FiUpload, FiEdit2, FiMail, FiPhone, FiMapPin, FiUser, FiCalendar } from "react-icons/fi"
import { uploadImage, useUser } from "../utils/usersystem"
import EditProfile from "../components/EditProfile"
import { toast } from "react-toastify"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const completeUserData = {
  imageUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+1 234 567 890",
  address: "123 Main St, Anytown, USA",
  gender: "Female",
  birthdate: "January 1, 1990",
}

const incompleteUserData = {
  imageUrl: null,
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "",
  address: "",
  gender: "Male",
  birthdate: "",
}

const ProfileSection = () => {
  const [user, setUser] = useState(incompleteUserData)
  const [show, setshow] = useState(false)
  const queryClient = useQueryClient()

  const mutaion = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["me"])
      toast.success(data.message)
    },
    onError: (error) => {
      console.error("Error uploading image:", error)
      toast.error("Image upload failed. Please try again.")
    },
  })

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) {
      toast.error("Please select an image to upload.")
      return
    }
    const formData = new FormData()
    formData.append("image", file)
    mutaion.mutate(formData)
  }

  const { data, isLoading, isError } = useUser()

  useEffect(() => {
    if (!isLoading) {
      setUser({
        imageUrl: data.data.avatar,
        name: data.data.name,
        email: data.data.email,
        phone: data.data.phonenumber,
        address: data.data.address,
        gender: data.data.gender,
        birthdate: data.data.age,
      })
    }
  }, [data, isLoading])

  const isProfileComplete = !!user.imageUrl && !!user.phone && !!user.address && !!user.birthdate

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-base text-gray-900 font-medium truncate">{value || "Not provided"}</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <label
              htmlFor="imageUpload"
              className="relative block w-32 h-32 rounded-full border-4 border-white shadow-lg cursor-pointer group overflow-hidden"
            >
              {user.imageUrl ? (
                <img src={user.imageUrl || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FiUpload className="text-gray-400 w-8 h-8" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FiEdit2 className="text-white w-6 h-6" />
              </div>
            </label>
            <input type="file" id="imageUpload" accept="image/*" className="hidden" onChange={handleImageUpload} />
            {!isProfileComplete && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            )}
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{user.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-100">
              <FiMail className="w-4 h-4" />
              <span className="text-lg">{user.email}</span>
            </div>
            <div className="mt-4">
              {isProfileComplete ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  Profile Complete
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Profile Incomplete
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              Contact Information
            </h2>
            <div className="space-y-4">
              <InfoRow icon={FiMail} label="Email Address" value={user.email} />
              <InfoRow icon={FiPhone} label="Phone Number" value={user.phone} />
              <InfoRow icon={FiMapPin} label="Address" value={user.address} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
              Personal Information
            </h2>
            <div className="space-y-4">
              <InfoRow icon={FiUser} label="Gender" value={user.gender} />
              <InfoRow icon={FiCalendar} label="Date of Birth" value={user.birthdate} />
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          {isProfileComplete ? (
            <button
              onClick={() => setshow(true)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiEdit2 className="w-5 h-5" />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setshow(true)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiUser className="w-5 h-5" />
              Complete Profile
            </button>
          )}
        </div>
      </div>

      {show && <EditProfile userData={user} onClose={() => setshow(false)} onSave={() => toast.success("done")} />}
    </div>
  )
}

export default ProfileSection
