import { Router } from "express";
import { addAppointment, approveAppointment, cancelAppointment, deleteAppointment, getAppointmentById, getAppointments } from "../Controller/AppointmentController.js";
import { verifyToken } from "../Controller/userController.js";

const appointmentRoute = Router();


appointmentRoute.post("/add-appointment", verifyToken, addAppointment);
appointmentRoute.get("/get-appointments", verifyToken, getAppointments);
appointmentRoute.get("/get-appointment", verifyToken, getAppointmentById);
appointmentRoute.delete("/delete-appointment/:id", verifyToken, deleteAppointment);
appointmentRoute.put("/approve-appointment/:id",verifyToken, approveAppointment);
appointmentRoute.delete("/cancel-appointment/:id", verifyToken, cancelAppointment);


export default appointmentRoute;