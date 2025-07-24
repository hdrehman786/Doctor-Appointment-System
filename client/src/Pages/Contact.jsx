import React from 'react';
import doctorImg from "../assets/doctors.jpg"

const Contact = () => {
  return (
    <section className='px-4 py-12 md:py-16 bg-white text-gray-800'>
      <div className='text-center mb-12'>
        <h1 className='text-3xl md:text-4xl font-semibold'>
          CONTACT <span className='font-bold text-[#20B2AA]'>US</span>
        </h1>
      </div>

      <div className='flex flex-col md:flex-row items-start justify-center gap-12 max-w-6xl mx-auto'>
        {/* Image Section */}
        <div className='w-full md:w-1/2'>
          <img
            src={doctorImg}
            alt="Doctor"
            className='rounded-xl shadow-lg w-full h-full object-cover min-h-[350px]'
          />
        </div>

        {/* Info Section */}
        <div className='w-full md:w-1/2 flex flex-col gap-10 justify-between'>
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold text-[#20B2AA]'>Our Office</h2>
            <p className='text-gray-700'>
              Intelligence Colony, Sultanabad, Karachi
            </p>
            <p className='text-gray-700'>
              <strong>Phone:</strong> +92 303 2872912 <br />
              <strong>Email:</strong> danishrao299@gmail.com
            </p>
          </div>

          <div className='space-y-4'>
            <h2 className='text-2xl font-bold text-[#20B2AA]'>Careers at MyDoctor</h2>
            <p className='text-gray-700'>
              Learn more about job opportunities and grow with us.
            </p>
            <button className='bg-[#20B2AA] hover:bg-[#0c8680] text-white py-2 px-6 rounded-full transition duration-300'>
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;