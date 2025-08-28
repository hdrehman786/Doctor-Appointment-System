import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../utils/usersystem';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaStethoscope } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setFormData({
        name:'',
        email : '',
        password : ''
      })
      toast.success(data.msg);
      navigate("/login")
    },
    onError: (error) => {
      toast.error(error.response.data.msg);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-lg p-10 bg-white rounded-2xl shadow-xl">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-[#20B2AA] rounded-full shadow-md">
            <FaStethoscope className="text-white w-6 h-6" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">
            Register account to book appointment
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full pl-10 pr-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full pl-10 pr-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full pl-10 pr-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-[#20B2AA] rounded-lg hover:bg-[#0c8680] transition-all duration-300 shadow-md"
          >
            {mutation.isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#20B2AA] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
