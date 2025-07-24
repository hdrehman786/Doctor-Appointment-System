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
    mutationFn : login,
    onSuccess : (data)=>{
      toast.success(data.message);
      navigate("/")
    },
    onError : (error)=>{
      console.log(error.response.data.msg)
    }
  })




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
          <p className="mt-2 text-gray-600">
            Log in to access your account and book appointments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
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
              className="w-full px-4 py-2 mt-2 text-gray-800 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
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
              className="w-full px-4 py-2 mt-2 text-gray-800 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#20B2AA]"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white transition-colors duration-300 bg-[#20B2AA] rounded-md hover:bg-[#0c8680] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0c8680]"
            >
              Sign In
            </button>
          </div>
        </form>
        <span>Create a new account <Link to={"/register"} className=' text-[#20B2AA] '>Sign up</Link> </span>
      </div>
    </div>
  );
};

export default Login;