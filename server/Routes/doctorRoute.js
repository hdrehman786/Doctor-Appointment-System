import { Router } from "express";
import { addAppointmentDate, addDoctor, addManyDoctors, deleteAppointmentDate, deleteDoctor, editAppointmentDate, editDoctorProfile, getDoctorAppointments, getDoctorProfile, getDoctorProfileById, getTimeSlots } from "../Controller/DoctorController.js";
import { verifyToken } from "../Controller/userController.js";

const doctorRoute = Router();

doctorRoute.post("/add-doctor",verifyToken, addDoctor);
doctorRoute.get("/get-alldoctors",getDoctorProfile);
doctorRoute.post("/addmany-doctors",verifyToken,addManyDoctors);
doctorRoute.get("/get-doctor/:id", getDoctorProfileById);
doctorRoute.get("/get-doctor-appointments", verifyToken, getDoctorAppointments);
doctorRoute.delete("/delete-doctor/:id", verifyToken, deleteDoctor);
doctorRoute.put("/edit-doctor/:id", verifyToken, editDoctorProfile);


// appointments routes
doctorRoute.put("/add-appointment-date/:id",addAppointmentDate);
doctorRoute.get("/get-timeslots",verifyToken,getTimeSlots);
doctorRoute.put("/edit-timeslots/:id",editAppointmentDate);
doctorRoute.put("/delete-timeslot/:id",deleteAppointmentDate)
export default doctorRoute;
