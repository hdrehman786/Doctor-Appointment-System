
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const backendUrl = "http://localhost:3000"

export const register = async (userdata) => {
  console.log("userdata", userdata);
  const res = await axios.post(`${backendUrl}/user/register`, userdata, {
    withCredentials: true
  });
  return res.data;
}


export const login = async (userdata) => {
  const res = await axios.post(`${backendUrl}/user/login`, userdata, {
    withCredentials: true
  });
  return res.data
}


export const logout = async () => {
  const res = await axios.post(`${backendUrl}/user/logout`, {}, {
    withCredentials: true
  });
  return res.data
}


export const getprofiles = async () => {
  const res = await axios.get(`${backendUrl}/user/getprofile`, {
    withCredentials: true,
  });
  return res.data;
};

export const useUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getprofiles,
    retry: false,
    refetchOnWindowFocus: false,
  });
};



export const editProfile = async (userdata) => {
  const res = await axios.put(`${backendUrl}/user/editprofile`, userdata, {
    withCredentials: true
  })
  return res.data
}


export const addDoctor = async (doctorData) => {
  const res = await axios.post(`${backendUrl}/doctor/add-doctor`, doctorData, {
    withCredentials: true
  });
  return res.data;
};

export const getAllDoctors = async (specialisation) => {
  const url = specialisation
    ? `${backendUrl}/doctor/get-alldoctors?specialisation=${specialisation}`
    : `${backendUrl}/doctor/get-alldoctors`;

  const res = await axios.get(url, {
    withCredentials: true
  });

  return res.data;
};



export const uploadImage = async (formData) => {
  const res = await axios.post(`${backendUrl}/image/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    withCredentials: true
  })
  return res.data;
}


export const getDoctorProfileById = async (id) => {
  const res = await axios.get(`${backendUrl}/doctor/get-doctor/${id}`, {
    withCredentials: true
  });
  return res.data;
}


export const bookAppointment = async (appointmentData) => {
  const res = await axios.post(`${backendUrl}/appointment/add-appointment`, appointmentData, {
    withCredentials: true
  });
  return res.data;
}


export const getAppointment = async () => {
  const res = await axios.get(`${backendUrl}/appointment/get-appointment`, {
    withCredentials: true
  });
  return res.data;
}

export const cancelAppointment = async (appointmentId) => {
  const res = await axios.delete(`${backendUrl}/appointment/cancel-appointment/${appointmentId}`, {
    withCredentials: true
  });
  return res.data;
};


export const getAppointmentsodoctor = async () => {
  const res = await axios.get(`${backendUrl}/doctor/get-doctor-appointments`, {
    withCredentials: true
  });
  return res.data;
}



export const approveAppointment = async (appointmentId) => {
  const res = await axios.put(`${backendUrl}/appointment/approve-appointment/${appointmentId}`, {}, {
    withCredentials: true
  });
  return res.data;
}


export const getAllAppointments = async () => {
  const res = await axios.get(`${backendUrl}/appointment/get-appointments`, {
    withCredentials: true
  });
  return res.data;
}


export const deleteAppointment = async (appointmentId) => {
  const res = await axios.delete(`${backendUrl}/appointment/delete-appointment/${appointmentId}`, {
    withCredentials: true
  });
  return res.data;
};