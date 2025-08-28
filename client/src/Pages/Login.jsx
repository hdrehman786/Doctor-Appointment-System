import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { login } from '../utils/usersystem';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate('/');
    },
    onError: (error) => {
      console.log(error.response?.data?.msg);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100  p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-2 text-gray-600">
            Log in to access your account and book appointments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20B2AA] focus:border-[#20B2AA] transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20B2AA] focus:border-[#20B2AA] transition-all"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-[#20B2AA] to-[#178d85] hover:from-[#178d85] hover:to-[#106f6a] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#20B2AA]"
          >
            {mutation.isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-700">
          Don’t have an account?{" "}
          <Link to="/register" className="font-semibold text-[#20B2AA] hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
