"use client";

import React, { useState } from "react";
import { FiX, FiUser, FiPhone, FiMapPin, FiUsers, FiCalendar } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editProfile } from "../utils/usersystem";
import { toast } from "react-toastify";

const EditProfile = ({ userData, onClose }) => {
  const [formData, setFormData] = useState({
    name: userData.name || "",
    email: userData.email || "",
    phone: userData.phone || "",
    address: userData.address || "",
    gender: userData.gender || "",
    birthdate: userData.birthdate || "",
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editProfile,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["me"]);
      onClose();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.msg || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Edit Profile</h2>
              <p className="text-blue-100 text-sm mt-1">Update your personal information</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:rotate-90"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          {/* Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FiUser className="w-4 h-4 text-blue-500" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all 
                         duration-200 hover:border-gray-300"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email (readonly) */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              📧 Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl 
                         cursor-not-allowed text-gray-500"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FiPhone className="w-4 h-4 text-green-500" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all 
                         duration-200 hover:border-gray-300"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FiMapPin className="w-4 h-4 text-red-500" />
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all 
                         duration-200 hover:border-gray-300"
              placeholder="Enter your address"
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FiUsers className="w-4 h-4 text-purple-500" />
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all 
                         duration-200 hover:border-gray-300 appearance-none cursor-pointer"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FiCalendar className="w-4 h-4 text-orange-500" />
              Date of Birth
            </label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all 
                         duration-200 hover:border-gray-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl 
                         hover:bg-gray-200 transition-all duration-200 font-semibold 
                         hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                         rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all 
                         duration-200 font-semibold hover:scale-105 shadow-lg hover:shadow-xl 
                         disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {mutation.isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
