import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { addDoctor } from '../../utils/usersystem';
import { toast } from 'react-toastify';

const AddDoctor = () => {
  const [data, setData] = useState({
    email: '',
    specialisation: '',
    experience: '',
    fees: '',
    education: '',
    summary: ''
  });

  const specialisationOptions = [
    "Dermatologist",
    "Gastroenterologist",
    "General physician",
    "Gynecologist",
    "Neurologist",
    "Pediatrician"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const mutation = useMutation({
    mutationFn: addDoctor,
    onSuccess: (data) => {
      toast.success(data.message);
      setData({
        email: '',
        specialisation: '',
        experience: '',
        fees: '',
        education: '',
        summary: ''
      });
    },
    onError: (error) => {
      console.log(error);
    }
  })


  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(data);
  };

  const inputStyle = "w-full px-4 py-2 mt-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Add New Doctor</h1>
        <p className="text-gray-500 mb-6">Please fill in the details to add a new doctor.</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Doctor Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="doctor@example.com"
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label htmlFor="specialisation" className="block text-sm font-medium text-gray-700">Specialisation</label>
            <select
              id="specialisation"
              name="specialisation"
              value={data.specialisation}
              onChange={handleChange}
              className={inputStyle}
              required
            >
              <option value="" disabled>Select a specialisation</option>
              {
                specialisationOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))
              }
            </select>
          </div>

          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
            <select
              id="experience"
              name="experience"
              value={data.experience}
              onChange={handleChange}
              className={inputStyle}
              required
            >
              <option value="" disabled>Select experience</option>
              <option value="0-2 years">0-2 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="6-10 years">6-10 years</option>
              <option value="10+ years">10+ years</option>
            </select>
          </div>

          <div>
            <label htmlFor="fees" className="block text-sm font-medium text-gray-700">Consultation Fees ($)</label>
            <input
              type="number"
              id="fees"
              name="fees"
              value={data.fees}
              onChange={handleChange}
              placeholder='e.g., 150'
              min="0"
              className={inputStyle}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="education" className="block text-sm font-medium text-gray-700">Education</label>
            <input
              type='text'
              id="education"
              name="education"
              value={data.education}
              onChange={handleChange}
              placeholder='e.g., M.D. from Stanford University'
              className={inputStyle}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Professional Summary</label>
            <textarea
              name="summary"
              id="summary"
              value={data.summary}
              onChange={handleChange}
              placeholder='Brief professional summary...'
              rows="4"
              className={inputStyle}
              required
            ></textarea>
          </div>

          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-[#20B2AA] text-white font-semibold rounded-md hover:bg-[#569b97] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              Add Doctor
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default AddDoctor;