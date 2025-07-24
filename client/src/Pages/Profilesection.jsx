import React, { useEffect, useState } from 'react';
import { FiUpload, FiEdit2 } from 'react-icons/fi';
import { uploadImage, useUser } from '../utils/usersystem';
import EditProfile from '../components/EditProfile';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const completeUserData = {
  imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '+1 234 567 890',
  address: '123 Main St, Anytown, USA',
  gender: 'Female',
  birthdate: 'January 1, 1990',
};

const incompleteUserData = {
  imageUrl: null,
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '',
  address: '',
  gender: 'Male',
  birthdate: '',
};

const ProfileSection = () => {
  const [user, setUser] = useState(incompleteUserData);
  const [show, setshow] = useState(false);
  const queryClient = useQueryClient();

  const mutaion = useMutation({
    mutationFn : uploadImage,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["me"]);
      toast.success(data.message);
    },
    onError: (error) => {
      console.error("Error uploading image:", error);
      toast.error("Image upload failed. Please try again.");
    }
  })

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("Please select an image to upload.");
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    mutaion.mutate(formData);
  }

  const { data, isLoading, isError } = useUser();

  useEffect(() => {
    if (!isLoading) {
      setUser({
        imageUrl: data.data.avatar,
        name: data.data.name,
        email: data.data.email,
        phone: data.data.phonenumber,
        address: data.data.address,
        gender: data.data.gender,
        birthdate : data.data.age
      })
    }
  }, [data, isLoading])

  const isProfileComplete =
    !!user.imageUrl &&
    !!user.phone &&
    !!user.address &&
    !!user.birthdate;

  const InfoRow = ({ label, value }) => (
    <div className="flex py-2">
      <p className="w-28 font-medium text-gray-500">{label}</p>
      <p className="flex-1 text-gray-800">{value || 'Not set'}</p>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8">
      <div className="flex flex-col items-center">
        <label
          htmlFor="imageUpload"
          className="relative h-32 w-32 rounded-full border-4 border-gray-200 cursor-pointer group"
        >
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="Profile"
              className="h-full w-full object-cover rounded-full"
            />
          ) : (
            <div className="h-full w-full bg-gray-100 rounded-full flex items-center justify-center">
              <FiUpload className="text-gray-400 h-10 w-10" />
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <FiEdit2 className="text-white h-8 w-8" />
          </div>
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          {user.name}
        </h1>
      </div>

      <div className="my-6 border-t border-gray-300"></div>

      <div>
        <h2 className="text-lg font-semibold text-gray-700 underline decoration-gray-300 underline-offset-4 mb-4">
          Contact Information
        </h2>
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Phone" value={user.phone} />
        <InfoRow label="Address" value={user.address} />
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-700 underline decoration-gray-300 underline-offset-4 mb-4">
          Basic Information
        </h2>
        <InfoRow label="Gender" value={user.gender} />
        <InfoRow label="Birthdate" value={user.birthdate} />
      </div>

      <div className="mt-8 flex justify-center">
        {isProfileComplete ? (
          <button onClick={() => setshow(true)} className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">
            Edit Profile
          </button>
        ) : (
          <button onClick={() => setshow(true)} className="bg-[#20B2AA] text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">
            Complete Profile
          </button>
        )}
      </div>
      {
        show && (
          <EditProfile
            userData={user}
            onClose={() => setshow(false)}
            onSave={()=>toast.success("done")}
          />
        )
      }
    </div>
  );
};

export default ProfileSection;