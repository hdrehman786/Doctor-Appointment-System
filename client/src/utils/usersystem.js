
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const backendUrl = "https://doctor-appointment-system-server-delta.vercel.app"
// export const backendUrl = "http://localhost:3000"

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


export const deleteDoctor = async (doctorId) => {
  const res = await axios.delete(`${backendUrl}/doctor/delete-doctor/${doctorId}`, {
    withCredentials: true
  });
  return res.data;
}


export const editDoctorProfile = async ({doctorId, doctorData}) => {
  const res = await axios.put(`${backendUrl}/doctor/edit-doctor/${doctorId}`, doctorData, {
    withCredentials: true
  });
  return res.data;
}


export const completeAppointment = async (appointmentId) => {
  const res = await axios.put(`${backendUrl}/appointment/complete-appointment/${appointmentId}`, {}, {
    withCredentials: true
  });
  return res.data;
};

export const setExpiredAppointments = async () => {
  try {
   const res = await axios.put(`${backendUrl}/appointment/expire-appointments`, {}, {
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    console.error("Error setting expired appointments:", error);
  }
}


export const addTimeSlots = async ({id,doctorData})=>{
   const index = doctorData.length - 1;
   console.log("index of ",doctorData[0]);
  try {
    const res = await axios.put(`${backendUrl}/doctor/add-appointment-date/${id}`,doctorData[index],{
      withCredentials : true
    });
    return res.data
  } catch (error) {
    console.log("The main Server error", error);
    return error
  }
};


export const getTimeSlots = async ()=>{
  try {
    const res = await axios.get(`${backendUrl}/doctor/get-timeslots`,{
      withCredentials : true
    });
     return res.data
  } catch (error) {
    console.log("the error of something",error);
    return error
  }
}


export const editTimeSlot = async ({id,slotData})=>{
  try {
    const res = await axios.put(`${backendUrl}/doctor/edit-timeslots/${id}`,slotData,{
      withCredentials : true
    });
    return res
  } catch (error) {
    console.log("error from edit slots",error);
    return error
  }
}

export const deleteTimeSlot = async({ id,appointmentId})=>{
  try {
    
    const res = await axios.put(`${backendUrl}/doctor/delete-timeslot/${id}`,{appointmentId},{
      withCredentials : true
    })
    return res;
  } catch (error) {
    console.log("the errorroor",error);
    return
  }
}