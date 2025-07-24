import { Router } from "express";
import { addDoctor, addManyDoctors, getDoctorAppointments, getDoctorProfile, getDoctorProfileById } from "../Controller/DoctorController.js";
import { verifyToken } from "../Controller/userController.js";

const doctorRoute = Router();

doctorRoute.post("/add-doctor",verifyToken, addDoctor);
doctorRoute.get("/get-alldoctors",getDoctorProfile);
doctorRoute.post("/addmany-doctors",verifyToken,addManyDoctors);
doctorRoute.get("/get-doctor/:id", getDoctorProfileById);
doctorRoute.get("/get-doctor-appointments", verifyToken, getDoctorAppointments);

export default doctorRoute;
